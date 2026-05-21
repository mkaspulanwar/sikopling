import {
	createAnnouncementRow,
	deleteAnnouncementRow,
	isAnnouncementType,
	listAnnouncementIds
} from '$lib/server/admin-announcements'
import type { AnnouncementType } from '$lib/server/admin-announcements'
import { requireAdminSupabase } from '$lib/server/admin-route'
import { isAdminRole, resolveUserRole } from '$lib/server/supabase-auth'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

type DeletePayload =
	| { mode: 'ids'; type: AnnouncementType; ids: string[] }
	| {
			mode: 'allFiltered'
			type: AnnouncementType
			keyword?: string
			sortBy?: string
			sortOrder?: string
			excludedIds?: string[]
	  }

const IDS_FETCH_PAGE_SIZE = 1000
const BULK_DELETE_BATCH_SIZE = 25
const isIsoDate = (value: string | undefined) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)

const extractErrorMessage = (error: unknown, fallback: string) =>
	error instanceof Error ? error.message : fallback

const ensureAdmin = async (locals: App.Locals) => {
	const auth = await requireAdminSupabase(locals)
	if (auth.state === 'unavailable') {
		return { error: json({ message: 'Supabase belum dikonfigurasi' }, { status: 503 }) }
	}
	if (auth.state === 'unauthorized') {
		return { error: json({ message: 'Perlu login Supabase Auth dengan role admin atau super admin' }, { status: 401 }) }
	}
	return { supabase: auth.supabase }
}

const parseDeletePayload = (body: unknown): DeletePayload | null => {
	if (!body || typeof body !== 'object') return null
	const payload = body as Record<string, unknown>
	if (typeof payload.type !== 'string' || !isAnnouncementType(payload.type)) return null

	if (payload.mode === 'ids') {
		const ids = Array.isArray(payload.ids)
			? Array.from(new Set(payload.ids.filter((value): value is string => typeof value === 'string' && value.trim() !== '')))
			: []
		return { mode: 'ids', type: payload.type, ids }
	}

	if (payload.mode === 'allFiltered') {
		return {
			mode: 'allFiltered',
			type: payload.type,
			keyword: typeof payload.keyword === 'string' ? payload.keyword : undefined,
			sortBy: typeof payload.sortBy === 'string' ? payload.sortBy : undefined,
			sortOrder: payload.sortOrder === 'asc' || payload.sortOrder === 'desc' ? payload.sortOrder : undefined,
			excludedIds: Array.isArray(payload.excludedIds)
				? Array.from(new Set(payload.excludedIds.filter((value): value is string => typeof value === 'string' && value.trim() !== '')))
				: []
		}
	}

	return null
}

export const POST: RequestHandler = async ({ locals, request }) => {
	const auth = await ensureAdmin(locals)
	if (auth.error) return auth.error

	const body = await request.json()
	const type = typeof body?.type === 'string' ? body.type : ''
	const tanggal = typeof body?.tanggal === 'string' ? body.tanggal.trim() : undefined

	if (!isAnnouncementType(type)) {
		return json({ message: 'Jenis penerbitan tidak valid' }, { status: 400 })
	}
	if (!isIsoDate(tanggal)) {
		return json({ message: 'Format tanggal harus YYYY-MM-DD' }, { status: 400 })
	}

	try {
		const created = await createAnnouncementRow(auth.supabase, {
			type,
			instansi: typeof body?.instansi === 'string' ? body.instansi : null,
			kegiatan: typeof body?.kegiatan === 'string' ? body.kegiatan : null,
			noSk: typeof body?.no_sk === 'string' ? body.no_sk : null,
			tanggal
		})
		return json({ data: created }, { status: 201 })
	} catch (error) {
		return json({ message: extractErrorMessage(error, 'Gagal menambahkan data penerbitan') }, { status: 400 })
	}
}

export const DELETE: RequestHandler = async ({ locals, request }) => {
	const auth = await ensureAdmin(locals)
	if (auth.error) return auth.error

	const { user } = await locals.safeGetSession()
	if (!isAdminRole(resolveUserRole(user))) {
		return json({ message: 'Hapus data hanya dapat dilakukan oleh admin atau super admin' }, { status: 403 })
	}

	let body: unknown
	try {
		body = await request.json()
	} catch {
		return json({ message: 'Payload hapus tidak valid' }, { status: 400 })
	}

	const payload = parseDeletePayload(body)
	if (!payload) return json({ message: 'Payload hapus tidak valid' }, { status: 400 })

	let targetIds: string[] = []
	if (payload.mode === 'ids') {
		targetIds = payload.ids
	} else {
		const excluded = new Set(payload.excludedIds ?? [])
		let page = 1
		let totalPages = 1
		const ids: string[] = []
		while (page <= totalPages) {
			const result = await listAnnouncementIds(auth.supabase, {
				type: payload.type,
				page,
				pageSize: IDS_FETCH_PAGE_SIZE,
				keyword: payload.keyword,
				sortBy: payload.sortBy,
				sortOrder: payload.sortOrder
			})
			totalPages = result.totalPages
			for (const row of result.data) {
				if (!excluded.has(row.id)) ids.push(row.id)
			}
			page += 1
		}
		targetIds = ids
	}

	if (targetIds.length === 0) {
		return json({ message: 'Tidak ada data terpilih untuk dihapus.' }, { status: 400 })
	}

	let successCount = 0
	const failedMessages: string[] = []
	for (let index = 0; index < targetIds.length; index += BULK_DELETE_BATCH_SIZE) {
		const batch = targetIds.slice(index, index + BULK_DELETE_BATCH_SIZE)
		const results = await Promise.all(
			batch.map(async (id) => {
				try {
					await deleteAnnouncementRow(auth.supabase, { type: payload.type, id })
					return { ok: true as const }
				} catch (error) {
					return { ok: false as const, message: extractErrorMessage(error, 'Gagal menghapus data') }
				}
			})
		)
		for (const result of results) {
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
