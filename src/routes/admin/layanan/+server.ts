import { requireAdminSupabase } from '$lib/server/admin-route'
import {
	createMonitoringIntegrasi,
	deleteMonitoringIntegrasi,
	listMonitoringIntegrasi,
	listMonitoringIntegrasiIds
} from '$lib/server/monitoring-integrasi'
import {
	createMonitoringPengajuan,
	deleteMonitoringPengajuan,
	listMonitoringPengajuan,
	listMonitoringPengajuanIds,
	updateStatusMonitoringPengajuan
} from '$lib/server/monitoring-pengajuan'
import { isAdminRole, resolveUserRole } from '$lib/server/supabase-auth'
import {
	INTEGRASI_STATUS_VALUES,
	LAYANAN_VALUES,
	STATUS_VALUES,
	type IntegrasiStatus,
	type StatusPengajuan
} from '$lib/supabase/constants'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

type PengajuanSortBy =
	| 'no_registrasi'
	| 'tanggal_masuk'
	| 'instansi'
	| 'kegiatan'
	| 'jenis_layanan'
	| 'posisi'
	| 'status'
	| 'tanggal_update'
	| 'created_at'
	| 'updated_at'

type LayananMonitoring = 'perling' | 'pertek' | 'integrasi'

type BulkDeletePayload =
	| {
			mode: 'ids'
			layanan: LayananMonitoring
			ids: string[]
	  }
	| {
			mode: 'allFiltered'
			layanan: LayananMonitoring
			keyword?: string
			status?: StatusPengajuan | IntegrasiStatus
			sortBy?: string
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
			error: json({ message: 'Perlu login Supabase Auth dengan role admin atau super admin' }, { status: 401 })
		}
	}

	return { supabase: auth.supabase }
}

const readLayananMonitoring = (value: unknown): LayananMonitoring | null => {
	if (value === 'integrasi') return 'integrasi'
	if (typeof value === 'string' && LAYANAN_VALUES.includes(value as 'perling' | 'pertek')) {
		return value as 'perling' | 'pertek'
	}
	return null
}

const normalizeDeleteErrorMessage = (message: string) => {
	if (message === 'PENGAJUAN_NOT_FOUND') return 'Data pengajuan tidak ditemukan'
	if (message === 'INTEGRASI_NOT_FOUND') return 'Data integrasi tidak ditemukan'
	if (message === 'DELETE_BLOCKED_BY_POLICY') {
		return 'Hapus data belum diizinkan oleh policy database untuk role ini'
	}
	return message
}

const parseBulkDeletePayload = (body: unknown): BulkDeletePayload | null => {
	if (typeof body !== 'object' || body === null) return null
	const payload = body as Record<string, unknown>
	const layanan = readLayananMonitoring(payload.layanan)
	if (!layanan) return null

	if (payload.mode === 'ids') {
		if (!Array.isArray(payload.ids)) return null
		const ids = payload.ids.filter((value): value is string => typeof value === 'string' && value.trim() !== '')
		return { mode: 'ids', layanan, ids: Array.from(new Set(ids)) }
	}

	if (payload.mode === 'allFiltered') {
		const keyword = typeof payload.keyword === 'string' ? payload.keyword : undefined
		const status =
			layanan === 'integrasi'
				? typeof payload.status === 'string' && INTEGRASI_STATUS_VALUES.includes(payload.status as IntegrasiStatus)
					? (payload.status as IntegrasiStatus)
					: undefined
				: typeof payload.status === 'string' && STATUS_VALUES.includes(payload.status as StatusPengajuan)
					? (payload.status as StatusPengajuan)
					: undefined
		const sortBy = typeof payload.sortBy === 'string' ? payload.sortBy : undefined
		const sortOrder = payload.sortOrder === 'asc' || payload.sortOrder === 'desc' ? payload.sortOrder : undefined
		const excludedIds = Array.isArray(payload.excludedIds)
			? Array.from(
					new Set(
						payload.excludedIds.filter(
							(value): value is string => typeof value === 'string' && value.trim() !== ''
						)
					)
				)
			: []

		return { mode: 'allFiltered', layanan, keyword, status, sortBy, sortOrder, excludedIds }
	}

	return null
}

export const GET: RequestHandler = async ({ locals, url }) => {
	const auth = await ensureAdminSession(locals)
	if (auth.error) return auth.error

	const query = url.searchParams
	const layanan = readLayananMonitoring(query.get('layanan'))

	if (layanan === 'integrasi') {
		const commonParams = {
			page: parseNumber(query.get('page'), 1),
			pageSize: parseNumber(query.get('pageSize'), 20),
			status: query.get('status') as IntegrasiStatus | undefined,
			keyword: query.get('keyword') ?? undefined,
			sortBy: query.get('sortBy') as never,
			sortOrder: (query.get('sortOrder') as 'asc' | 'desc' | undefined) ?? 'desc'
		}

		if (query.get('selectMode') === 'ids') {
			return json(await listMonitoringIntegrasiIds(auth.supabase, commonParams))
		}

		return json(await listMonitoringIntegrasi(auth.supabase, commonParams))
	}

	const commonParams = {
		page: parseNumber(query.get('page'), 1),
		pageSize: parseNumber(query.get('pageSize'), 20),
		layanan: layanan as 'perling' | 'pertek' | undefined,
		status: query.get('status') as StatusPengajuan | undefined,
		instansi: query.get('instansi') ?? undefined,
		jenisLayanan: query.get('jenisLayanan') ?? undefined,
		tanggalMulai: query.get('tanggalMulai') ?? undefined,
		tanggalSelesai: query.get('tanggalSelesai') ?? undefined,
		keyword: query.get('keyword') ?? undefined,
		sortBy: query.get('sortBy') as PengajuanSortBy | undefined,
		sortOrder: (query.get('sortOrder') as 'asc' | 'desc' | undefined) ?? 'desc'
	}

	if (query.get('selectMode') === 'ids') {
		return json(await listMonitoringPengajuanIds(auth.supabase, commonParams))
	}

	return json(await listMonitoringPengajuan(auth.supabase, commonParams))
}

export const DELETE: RequestHandler = async ({ locals, request }) => {
	const auth = await ensureAdminSession(locals)
	if (auth.error) return auth.error

	const { user } = await locals.safeGetSession()
	const role = resolveUserRole(user)
	if (!isAdminRole(role)) {
		return json({ message: 'Hapus data hanya dapat dilakukan oleh admin atau super admin' }, { status: 403 })
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
			const idsResult =
				payload.layanan === 'integrasi'
					? await listMonitoringIntegrasiIds(auth.supabase, {
							page,
							pageSize: IDS_FETCH_PAGE_SIZE,
							keyword: payload.keyword,
							status: payload.status as IntegrasiStatus | undefined,
							sortBy: payload.sortBy as never,
							sortOrder: payload.sortOrder
						})
					: await listMonitoringPengajuanIds(auth.supabase, {
							page,
							pageSize: IDS_FETCH_PAGE_SIZE,
							layanan: payload.layanan,
							keyword: payload.keyword,
							status: payload.status as StatusPengajuan | undefined,
							sortBy: payload.sortBy as PengajuanSortBy | undefined,
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
					if (payload.layanan === 'integrasi') {
						await deleteMonitoringIntegrasi(auth.supabase, { id })
					} else {
						await deleteMonitoringPengajuan(auth.supabase, { id })
					}
					return { ok: true as const }
				} catch (error) {
					const message = extractErrorMessage(error, 'Gagal menghapus data layanan')
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

export const POST: RequestHandler = async ({ locals, request }) => {
	const auth = await ensureAdminSession(locals)
	if (auth.error) return auth.error

	const body = await request.json()
	const layanan = readLayananMonitoring(body?.layanan)

	if (!layanan) return json({ message: 'Layanan wajib dipilih' }, { status: 400 })

	if (layanan === 'integrasi') {
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

	const noRegistrasi = typeof body?.no_registrasi === 'string' ? body.no_registrasi : null
	const tanggalMasuk = typeof body?.tanggal_masuk === 'string' ? body.tanggal_masuk : undefined
	const tanggalUpdate = typeof body?.tanggal_update === 'string' ? body.tanggal_update : undefined
	const instansi = typeof body?.instansi === 'string' ? body.instansi : undefined
	const kegiatan = typeof body?.kegiatan === 'string' ? body.kegiatan : undefined
	const jenisLayanan = typeof body?.jenis_layanan === 'string' ? body.jenis_layanan : undefined
	const posisi = typeof body?.posisi === 'string' ? body.posisi : undefined
	const status = body?.status as StatusPengajuan | undefined

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
		const created = await createMonitoringPengajuan(auth.supabase, {
			layanan,
			noRegistrasi,
			tanggalMasuk,
			tanggalUpdate,
			instansi,
			kegiatan,
			jenisLayanan,
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
			return json({ message: 'Perlu login Supabase Auth dengan role admin atau super admin' }, { status: 401 })
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

	const updated = await updateStatusMonitoringPengajuan(auth.supabase, {
		id: body.id,
		status: body.status,
		posisi: typeof body.posisi === 'string' ? body.posisi : null
	})

	return json({ data: updated })
}
