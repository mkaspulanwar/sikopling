import { LAYANAN_VALUES, STATUS_VALUES, type StatusPengajuan } from '$lib/supabase/constants'
import {
	createAntrianPengajuan,
	deleteAntrianPengajuan,
	listAntrianPengajuanIds,
	listAntrianPengajuan,
	updateStatusAntrianPengajuan
} from '$lib/server/antrian-pengajuan'
import { requireAdminSupabase } from '$lib/server/admin-route'
import { resolveUserRole } from '$lib/server/supabase-auth'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

type SortBy =
	| 'no_registrasi'
	| 'tanggal_masuk'
	| 'instansi'
	| 'kegiatan'
	| 'jenis_dokumen'
	| 'posisi'
	| 'status'
	| 'tanggal_update'
	| 'created_at'
	| 'updated_at'

type BulkDeletePayload =
	| {
			mode: 'ids'
			ids: string[]
	  }
	| {
			mode: 'allFiltered'
			layanan: 'dokling' | 'pertek'
			keyword?: string
			status?: StatusPengajuan
			sortBy?: SortBy
			sortOrder?: 'asc' | 'desc'
			excludedIds?: string[]
	  }

const IDS_FETCH_PAGE_SIZE = 1000
const BULK_DELETE_BATCH_SIZE = 25

const parseNumber = (value: string | null, fallback: number) => {
	if (!value) return fallback
	const parsed = Number(value)
	return Number.isFinite(parsed) ? parsed : fallback
}

const isIsoDate = (value: string | undefined) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)
const extractErrorMessage = (error: unknown, fallback: string) => {
	if (error instanceof Error) return error.message
	if (typeof error === 'object' && error) {
		const maybeError = error as {
			message?: unknown
			details?: unknown
			hint?: unknown
			code?: unknown
		}
		const message = typeof maybeError.message === 'string' ? maybeError.message : ''
		const details = typeof maybeError.details === 'string' ? maybeError.details : ''
		const hint = typeof maybeError.hint === 'string' ? maybeError.hint : ''
		const code = typeof maybeError.code === 'string' ? maybeError.code : ''
		const chunks = [message, details, hint, code ? `code=${code}` : ''].filter(Boolean)
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

const normalizeDeleteErrorMessage = (message: string) => {
	if (message === 'PENGAJUAN_NOT_FOUND') {
		return 'Data pengajuan tidak ditemukan'
	}
	if (message === 'DELETE_BLOCKED_BY_POLICY') {
		return 'Hapus data belum diizinkan oleh policy database untuk role ini'
	}
	return message
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
		const layanan =
			typeof payload.layanan === 'string' && LAYANAN_VALUES.includes(payload.layanan as 'dokling' | 'pertek')
				? (payload.layanan as 'dokling' | 'pertek')
				: null
		if (!layanan) return null

		const keyword = typeof payload.keyword === 'string' ? payload.keyword : undefined
		const status =
			typeof payload.status === 'string' && STATUS_VALUES.includes(payload.status as StatusPengajuan)
				? (payload.status as StatusPengajuan)
				: undefined
		const sortBy = typeof payload.sortBy === 'string' ? (payload.sortBy as SortBy) : undefined
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

		return {
			mode: 'allFiltered',
			layanan,
			keyword,
			status,
			sortBy,
			sortOrder,
			excludedIds
		}
	}

	return null
}

export const GET: RequestHandler = async ({ locals, url }) => {
	const auth = await ensureAdminSession(locals)
	if (auth.error) return auth.error

	const query = url.searchParams
	const commonParams = {
		page: parseNumber(query.get('page'), 1),
		pageSize: parseNumber(query.get('pageSize'), 20),
		layanan: query.get('layanan') as 'dokling' | 'pertek' | undefined,
		status: query.get('status') as StatusPengajuan | undefined,
		instansi: query.get('instansi') ?? undefined,
		jenisDokumen: query.get('jenisDokumen') ?? undefined,
		tanggalMulai: query.get('tanggalMulai') ?? undefined,
		tanggalSelesai: query.get('tanggalSelesai') ?? undefined,
		keyword: query.get('keyword') ?? undefined,
		sortBy: query.get('sortBy') as SortBy | undefined,
		sortOrder: (query.get('sortOrder') as 'asc' | 'desc' | undefined) ?? 'desc'
	}

	if (query.get('selectMode') === 'ids') {
		const idsResult = await listAntrianPengajuanIds(auth.supabase, commonParams)
		return json(idsResult)
	}

	const result = await listAntrianPengajuan(auth.supabase, commonParams)

	return json(result)
}

export const DELETE: RequestHandler = async ({ locals, request }) => {
	const auth = await ensureAdminSession(locals)
	if (auth.error) return auth.error

	const { user } = await locals.safeGetSession()
	const role = resolveUserRole(user)
	if (role !== 'super_admin') {
		return json({ message: 'Hapus data hanya dapat dilakukan oleh super admin' }, { status: 403 })
	}

	let body: unknown
	try {
		body = await request.json()
	} catch {
		return json({ message: 'Payload hapus massal tidak valid' }, { status: 400 })
	}

	const payload = parseBulkDeletePayload(body)
	if (!payload) {
		return json({ message: 'Payload hapus massal tidak valid' }, { status: 400 })
	}

	let targetIds: string[] = []

	if (payload.mode === 'ids') {
		targetIds = payload.ids
	} else {
		const excludedIdSet = new Set(payload.excludedIds ?? [])
		let page = 1
		let totalPages = 1
		const collectedIds: string[] = []

		while (page <= totalPages) {
			const idsResult = await listAntrianPengajuanIds(auth.supabase, {
				page,
				pageSize: IDS_FETCH_PAGE_SIZE,
				layanan: payload.layanan,
				keyword: payload.keyword,
				status: payload.status,
				sortBy: payload.sortBy,
				sortOrder: payload.sortOrder
			})

			totalPages = Math.max(idsResult.totalPages, 1)
			for (const row of idsResult.data) {
				if (!excludedIdSet.has(row.id)) {
					collectedIds.push(row.id)
				}
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
					await deleteAntrianPengajuan(auth.supabase, { id })
					return { ok: true as const }
				} catch (error) {
					const message = extractErrorMessage(error, 'Gagal menghapus data pengajuan')
					return { ok: false as const, message: normalizeDeleteErrorMessage(message) }
				}
			})
		)

		for (const result of batchResults) {
			if (result.ok) {
				successCount += 1
			} else {
				failedMessages.push(result.message)
			}
		}
	}

	return json({
		totalRequested: targetIds.length,
		successCount,
		failedCount: failedMessages.length,
		firstErrorMessage: failedMessages[0] ?? null
	})
}

export const POST: RequestHandler = async ({ locals, request }) => {
	const auth = await ensureAdminSession(locals)
	if (auth.error) return auth.error

	const body = await request.json()
	const layanan = typeof body?.layanan === 'string' ? body.layanan : ''
	const noRegistrasi = typeof body?.no_registrasi === 'string' ? body.no_registrasi : null
	const tanggalMasuk = typeof body?.tanggal_masuk === 'string' ? body.tanggal_masuk : undefined
	const tanggalUpdate = typeof body?.tanggal_update === 'string' ? body.tanggal_update : undefined
	const instansi = typeof body?.instansi === 'string' ? body.instansi : undefined
	const kegiatan = typeof body?.kegiatan === 'string' ? body.kegiatan : undefined
	const jenisDokumen = typeof body?.jenis_dokumen === 'string' ? body.jenis_dokumen : undefined
	const posisi = typeof body?.posisi === 'string' ? body.posisi : undefined
	const status = body?.status as StatusPengajuan | undefined

	if (!LAYANAN_VALUES.includes(layanan as 'dokling' | 'pertek')) {
		return json({ message: 'Layanan wajib dipilih' }, { status: 400 })
	}

	if (!isIsoDate(tanggalMasuk)) {
		return json({ message: 'Format tanggal masuk harus YYYY-MM-DD' }, { status: 400 })
	}

	if (!isIsoDate(tanggalUpdate)) {
		return json({ message: 'Format tanggal update harus YYYY-MM-DD' }, { status: 400 })
	}

	if (status && !STATUS_VALUES.includes(status)) {
		return json({ message: 'Status tidak valid' }, { status: 400 })
	}

	try {
		const created = await createAntrianPengajuan(auth.supabase, {
			layanan: layanan as 'dokling' | 'pertek',
			noRegistrasi,
			tanggalMasuk,
			tanggalUpdate,
			instansi,
			kegiatan,
			jenisDokumen,
			posisi,
			status
		})
		return json({ data: created }, { status: 201 })
	} catch (error) {
		const message = extractErrorMessage(error, 'Gagal menambahkan data pengajuan')
		const normalized = message.toLowerCase()
		if (
			normalized.includes('jwt') ||
			normalized.includes('not authenticated') ||
			normalized.includes('auth session missing') ||
			normalized.includes('permission denied')
		) {
			return json({ message: 'Perlu login Supabase Auth dengan role admin' }, { status: 401 })
		}
		if (message.toLowerCase().includes('duplicate key')) {
			return json({ message: 'No registrasi sudah digunakan' }, { status: 409 })
		}
		return json({ message }, { status: 400 })
	}
}

export const PATCH: RequestHandler = async ({ locals, request }) => {
	const auth = await ensureAdminSession(locals)
	if (auth.error) return auth.error

	const body = await request.json()

	if (!body?.id || typeof body.id !== 'string') {
		return json({ message: 'id wajib diisi' }, { status: 400 })
	}

	if (!body?.status || !STATUS_VALUES.includes(body.status)) {
		return json({ message: 'status tidak valid' }, { status: 400 })
	}

	const updated = await updateStatusAntrianPengajuan(auth.supabase, {
		id: body.id,
		status: body.status,
		posisi: typeof body.posisi === 'string' ? body.posisi : null,
		note: typeof body.note === 'string' ? body.note : null
	})

	return json({ data: updated })
}
