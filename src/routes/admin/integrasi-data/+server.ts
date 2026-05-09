import { requireAdminSupabase } from '$lib/server/admin-route'
import {
	createMonitoringIntegrasi,
	deleteMonitoringIntegrasi,
	listMonitoringIntegrasiIds
} from '$lib/server/monitoring-integrasi'
import { resolveUserRole } from '$lib/server/supabase-auth'
import { INTEGRASI_STATUS_VALUES, type IntegrasiStatus } from '$lib/supabase/constants'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

type BulkDeletePayload =
	| {
			mode: 'ids'
			ids: string[]
	  }
	| {
			mode: 'allFiltered'
			keyword?: string
			status?: IntegrasiStatus
			sortBy?: string
			sortOrder?: 'asc' | 'desc'
			excludedIds?: string[]
	  }

const IDS_FETCH_PAGE_SIZE = 1000
const BULK_DELETE_BATCH_SIZE = 25

const isIsoDate = (value: string | undefined) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)

const extractErrorMessage = (error: unknown, fallback: string) => {
	if (error instanceof Error) return error.message
	if (typeof error === 'object' && error) {
		const maybeError = error as { message?: unknown; details?: unknown; hint?: unknown; code?: unknown }
		const chunks = [
			typeof maybeError.message === 'string' ? maybeError.message : '',
			typeof maybeError.details === 'string' ? maybeError.details : '',
			typeof maybeError.hint === 'string' ? maybeError.hint : '',
			typeof maybeError.code === 'string' ? `code=${maybeError.code}` : ''
		].filter(Boolean)
		if (chunks.length > 0) return chunks.join(' | ')
	}
	return fallback
}

const ensureAdminSession = async (locals: App.Locals) => {
	const auth = await requireAdminSupabase(locals)

	if (auth.state === 'unavailable') {
		return {
			error: json({ message: 'Supabase belum dikonfigurasi di environment deployment' }, { status: 503 })
		}
	}

	if (auth.state === 'unauthorized') {
		return {
			error: json({ message: 'Perlu login Supabase Auth dengan role admin' }, { status: 401 })
		}
	}

	return { supabase: auth.supabase }
}

const parseBulkDeletePayload = (body: unknown): BulkDeletePayload | null => {
	if (typeof body !== 'object' || body === null) return null
	const payload = body as Record<string, unknown>

	if (payload.mode === 'ids') {
		if (!Array.isArray(payload.ids)) return null
		const ids = payload.ids.filter((value): value is string => typeof value === 'string' && value.trim() !== '')
		return { mode: 'ids', ids: Array.from(new Set(ids)) }
	}

	if (payload.mode === 'allFiltered') {
		const keyword = typeof payload.keyword === 'string' ? payload.keyword : undefined
		const status =
			typeof payload.status === 'string' && INTEGRASI_STATUS_VALUES.includes(payload.status as IntegrasiStatus)
				? (payload.status as IntegrasiStatus)
				: undefined
		const sortBy = typeof payload.sortBy === 'string' ? payload.sortBy : undefined
		const sortOrder =
			payload.sortOrder === 'asc' || payload.sortOrder === 'desc' ? payload.sortOrder : undefined
		const excludedIds = Array.isArray(payload.excludedIds)
			? Array.from(
					new Set(
						payload.excludedIds.filter(
							(value): value is string => typeof value === 'string' && value.trim() !== ''
						)
					)
				)
			: []

		return { mode: 'allFiltered', keyword, status, sortBy, sortOrder, excludedIds }
	}

	return null
}

const normalizeDeleteErrorMessage = (message: string) => {
	if (message === 'INTEGRASI_NOT_FOUND') return 'Data integrasi tidak ditemukan'
	if (message === 'DELETE_BLOCKED_BY_POLICY') return 'Hapus data belum diizinkan oleh policy database untuk role ini'
	return message
}

export const POST: RequestHandler = async ({ locals, request }) => {
	const auth = await ensureAdminSession(locals)
	if (auth.error) return auth.error

	const body = await request.json()
	const tanggalUpdate = typeof body?.tanggal_update === 'string' ? body.tanggal_update.trim() : undefined
	const status = typeof body?.status === 'string' ? (body.status as IntegrasiStatus) : undefined

	if (!isIsoDate(tanggalUpdate)) {
		return json({ message: 'Format tanggal update harus YYYY-MM-DD' }, { status: 400 })
	}

	if (status && !INTEGRASI_STATUS_VALUES.includes(status)) {
		return json({ message: 'Status tidak valid' }, { status: 400 })
	}

	try {
		const created = await createMonitoringIntegrasi(auth.supabase, {
			instansi: typeof body?.instansi === 'string' ? body.instansi : undefined,
			kegiatan: typeof body?.kegiatan === 'string' ? body.kegiatan : undefined,
			jenisIntegrasi: typeof body?.jenis_integrasi === 'string' ? body.jenis_integrasi : undefined,
			posisi: typeof body?.posisi === 'string' ? body.posisi : undefined,
			status,
			tanggalUpdate,
			keterangan: typeof body?.keterangan === 'string' ? body.keterangan : undefined
		})
		return json({ data: created }, { status: 201 })
	} catch (error) {
		return json({ message: extractErrorMessage(error, 'Gagal menambahkan data integrasi') }, { status: 400 })
	}
}

export const DELETE: RequestHandler = async ({ locals, request }) => {
	const auth = await ensureAdminSession(locals)
	if (auth.error) return auth.error

	const { user } = await locals.safeGetSession()
	const role = resolveUserRole(user)
	if (role !== 'admin') {
		return json({ message: 'Hapus data hanya dapat dilakukan oleh admin' }, { status: 403 })
	}

	let body: unknown
	try {
		body = await request.json()
	} catch {
		return json({ message: 'Payload hapus massal tidak valid' }, { status: 400 })
	}

	const payload = parseBulkDeletePayload(body)
	if (!payload) return json({ message: 'Payload hapus massal tidak valid' }, { status: 400 })

	let targetIds: string[] = []
	if (payload.mode === 'ids') {
		targetIds = payload.ids
	} else {
		const excludedIdSet = new Set(payload.excludedIds ?? [])
		let page = 1
		let totalPages = 1
		const collectedIds: string[] = []

		while (page <= totalPages) {
			const idsResult = await listMonitoringIntegrasiIds(auth.supabase, {
				page,
				pageSize: IDS_FETCH_PAGE_SIZE,
				keyword: payload.keyword,
				status: payload.status,
				sortBy: payload.sortBy as never,
				sortOrder: payload.sortOrder
			})

			totalPages = Math.max(idsResult.totalPages, 1)
			for (const row of idsResult.data) {
				if (!excludedIdSet.has(row.id)) collectedIds.push(row.id)
			}
			page += 1
		}

		targetIds = collectedIds
	}

	if (targetIds.length === 0) {
		return json({ message: 'Tidak ada data terpilih untuk dihapus.' }, { status: 400 })
	}

	let successCount = 0
	const failedMessages: string[] = []

	for (let index = 0; index < targetIds.length; index += BULK_DELETE_BATCH_SIZE) {
		const idBatch = targetIds.slice(index, index + BULK_DELETE_BATCH_SIZE)
		const batchResults = await Promise.all(
			idBatch.map(async (id) => {
				try {
					await deleteMonitoringIntegrasi(auth.supabase, { id })
					return { ok: true as const }
				} catch (error) {
					const message = extractErrorMessage(error, 'Gagal menghapus data integrasi')
					return { ok: false as const, message: normalizeDeleteErrorMessage(message) }
				}
			})
		)

		for (const result of batchResults) {
			if (result.ok) successCount += 1
			else failedMessages.push(result.message)
		}
	}

	return json({
		totalRequested: targetIds.length,
		successCount,
		failedCount: failedMessages.length,
		firstErrorMessage: failedMessages[0] ?? null
	})
}
