import { LAYANAN_VALUES, STATUS_VALUES, type Layanan, type StatusPengajuan } from '$lib/supabase/constants'
import type { Database } from '$lib/supabase/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

const SORTABLE_COLUMNS = [
	'no_registrasi',
	'tanggal_masuk',
	'instansi',
	'kegiatan',
	'jenis_dokumen',
	'posisi',
	'status',
	'tanggal_update',
	'created_at',
	'updated_at'
] as const

type SortColumn = (typeof SORTABLE_COLUMNS)[number]

type SortOrder = 'asc' | 'desc'

type AntrianRow = Database['public']['Tables']['antrian_pengajuan']['Row']
type WorkflowHistoryRow = Database['public']['Tables']['workflow_history']['Row']

export type ListAntrianPengajuanParams = {
	page?: number
	pageSize?: number
	layanan?: Layanan
	status?: StatusPengajuan
	instansi?: string
	jenisDokumen?: string
	tanggalMulai?: string
	tanggalSelesai?: string
	keyword?: string
	sortBy?: SortColumn
	sortOrder?: SortOrder
}

export type ListAntrianPengajuanResult = {
	data: AntrianRow[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export type AntrianPengajuanSummary = {
	total: number
	pending: number
	selesai: number
	dokling: number
	pertek: number
}

export type WorkflowHistoryByPengajuan = Record<string, WorkflowHistoryRow[]>

const normalizePage = (value?: number) => {
	if (!value || Number.isNaN(value) || value < 1) return DEFAULT_PAGE
	return Math.floor(value)
}

const normalizePageSize = (value?: number) => {
	if (!value || Number.isNaN(value) || value < 1) return DEFAULT_PAGE_SIZE
	return Math.min(Math.floor(value), MAX_PAGE_SIZE)
}

const normalizeSortBy = (value?: string): SortColumn => {
	if (!value || !SORTABLE_COLUMNS.includes(value as SortColumn)) return 'tanggal_update'
	return value as SortColumn
}

const normalizeSortOrder = (value?: string): SortOrder => (value === 'asc' ? 'asc' : 'desc')

export const listAntrianPengajuan = async (
	supabase: SupabaseClient<Database>,
	params: ListAntrianPengajuanParams = {}
): Promise<ListAntrianPengajuanResult> => {
	const page = normalizePage(params.page)
	const pageSize = normalizePageSize(params.pageSize)
	const from = (page - 1) * pageSize
	const to = from + pageSize - 1

	const sortBy = normalizeSortBy(params.sortBy)
	const sortOrder = normalizeSortOrder(params.sortOrder)

	let query = supabase
		.from('antrian_pengajuan')
		.select('*', { count: 'exact' })
		.order(sortBy, { ascending: sortOrder === 'asc', nullsFirst: false })
		.range(from, to)

	if (params.layanan && LAYANAN_VALUES.includes(params.layanan)) {
		query = query.eq('layanan', params.layanan)
	}

	if (params.status && STATUS_VALUES.includes(params.status)) {
		query = query.eq('status', params.status)
	}

	if (params.instansi) {
		query = query.ilike('instansi', `%${params.instansi.trim()}%`)
	}

	if (params.jenisDokumen) {
		query = query.ilike('jenis_dokumen', `%${params.jenisDokumen.trim()}%`)
	}

	if (params.tanggalMulai) {
		query = query.gte('tanggal_masuk', params.tanggalMulai)
	}

	if (params.tanggalSelesai) {
		query = query.lte('tanggal_masuk', params.tanggalSelesai)
	}

	if (params.keyword?.trim()) {
		const keyword = `%${params.keyword.trim()}%`
		query = query.or(`no_registrasi.ilike.${keyword},instansi.ilike.${keyword},kegiatan.ilike.${keyword}`)
	}

	const { data, count, error } = await query
	if (error) throw error

	const total = count ?? 0
	const totalPages = Math.max(1, Math.ceil(total / pageSize))

	return {
		data: data ?? [],
		total,
		page,
		pageSize,
		totalPages
	}
}

export const updateStatusAntrianPengajuan = async (
	supabase: SupabaseClient<Database>,
	payload: {
		id: string
		status: StatusPengajuan
		posisi?: string | null
		note?: string | null
	}
) => {
	if (!STATUS_VALUES.includes(payload.status)) {
		throw new Error('Status pengajuan tidak valid')
	}

	const { data, error } = await supabase
		.from('antrian_pengajuan')
		.update({
			status: payload.status,
			posisi: payload.posisi ?? null,
			tanggal_update: new Date().toISOString().slice(0, 10)
		})
		.eq('id', payload.id)
		.select('*')
		.single()

	if (error) throw error

	const cleanedNote = payload.note?.trim()
	if (cleanedNote) {
		const { data: latestHistory, error: latestHistoryError } = await supabase
			.from('workflow_history')
			.select('id')
			.eq('pengajuan_id', payload.id)
			.order('changed_at', { ascending: false })
			.limit(1)
			.maybeSingle()

		if (latestHistoryError) throw latestHistoryError

		if (latestHistory?.id) {
			const { error: updateHistoryError } = await supabase
				.from('workflow_history')
				.update({ note: cleanedNote })
				.eq('id', latestHistory.id)

			if (updateHistoryError) throw updateHistoryError
		}
	}

	return data
}

export const createAntrianPengajuan = async (
	supabase: SupabaseClient<Database>,
	payload: {
		layanan: Layanan
		noRegistrasi: string
		tanggalMasuk?: string | null
		tanggalUpdate?: string | null
		instansi?: string | null
		kegiatan?: string | null
		jenisDokumen?: string | null
		posisi?: string | null
		status?: StatusPengajuan
	}
) => {
	if (!LAYANAN_VALUES.includes(payload.layanan)) {
		throw new Error('Layanan tidak valid')
	}

	const normalizedNoRegistrasi = payload.noRegistrasi.trim()
	if (!normalizedNoRegistrasi) {
		throw new Error('No registrasi wajib diisi')
	}

	const { data, error } = await supabase
		.from('antrian_pengajuan')
		.insert({
			layanan: payload.layanan,
			no_registrasi: normalizedNoRegistrasi,
			tanggal_masuk: payload.tanggalMasuk ?? null,
			instansi: payload.instansi?.trim() || null,
			kegiatan: payload.kegiatan?.trim() || null,
			jenis_dokumen: payload.jenisDokumen?.trim() || null,
			posisi: payload.posisi?.trim() || null,
			status: payload.status ?? 'Submit / Masuk',
			tanggal_update: payload.tanggalUpdate ?? null
		})
		.select('*')
		.single()

	if (error) throw error
	return data
}

export const updateAntrianPengajuan = async (
	supabase: SupabaseClient<Database>,
	payload: {
		id: string
		noRegistrasi?: string
		tanggalMasuk?: string | null
		tanggalUpdate?: string | null
		instansi?: string | null
		kegiatan?: string | null
		jenisDokumen?: string | null
		posisi?: string | null
		status?: StatusPengajuan
	}
) => {
	const updates: Database['public']['Tables']['antrian_pengajuan']['Update'] = {}

	if (payload.noRegistrasi !== undefined) {
		const normalizedNoRegistrasi = payload.noRegistrasi.trim()
		if (!normalizedNoRegistrasi) {
			throw new Error('No registrasi wajib diisi')
		}
		updates.no_registrasi = normalizedNoRegistrasi
	}

	if (payload.tanggalMasuk !== undefined) {
		updates.tanggal_masuk = payload.tanggalMasuk || null
	}

	if (payload.tanggalUpdate !== undefined) {
		updates.tanggal_update = payload.tanggalUpdate || null
	}

	if (payload.instansi !== undefined) {
		updates.instansi = payload.instansi?.trim() || null
	}

	if (payload.kegiatan !== undefined) {
		updates.kegiatan = payload.kegiatan?.trim() || null
	}

	if (payload.jenisDokumen !== undefined) {
		updates.jenis_dokumen = payload.jenisDokumen?.trim() || null
	}

	if (payload.posisi !== undefined) {
		updates.posisi = payload.posisi?.trim() || null
	}

	if (payload.status !== undefined) {
		if (!STATUS_VALUES.includes(payload.status)) {
			throw new Error('Status pengajuan tidak valid')
		}
		updates.status = payload.status
	}

	if (Object.keys(updates).length === 0) {
		throw new Error('Tidak ada perubahan data yang dikirim')
	}

	const { data, error } = await supabase
		.from('antrian_pengajuan')
		.update(updates)
		.eq('id', payload.id)
		.select('*')
		.single()

	if (error) throw error
	return data
}

export const deleteAntrianPengajuan = async (
	supabase: SupabaseClient<Database>,
	payload: { id: string }
) => {
	const { data: existingRow, error: existingError } = await supabase
		.from('antrian_pengajuan')
		.select('id')
		.eq('id', payload.id)
		.maybeSingle()

	if (existingError) throw existingError

	const { data: deletedRow, error } = await supabase
		.from('antrian_pengajuan')
		.delete()
		.eq('id', payload.id)
		.select('id')
		.maybeSingle()

	if (error) throw error

	if (!deletedRow) {
		if (!existingRow) {
			throw new Error('PENGAJUAN_NOT_FOUND')
		}
		throw new Error('DELETE_BLOCKED_BY_POLICY')
	}
}

export const getAntrianPengajuanSummary = async (
	supabase: SupabaseClient<Database>
): Promise<AntrianPengajuanSummary> => {
	const [totalResult, selesaiResult, doklingResult, pertekResult] = await Promise.all([
		supabase.from('antrian_pengajuan').select('*', { count: 'exact', head: true }),
		supabase.from('antrian_pengajuan').select('*', { count: 'exact', head: true }).eq('status', 'SK Terbit'),
		supabase.from('antrian_pengajuan').select('*', { count: 'exact', head: true }).eq('layanan', 'dokling'),
		supabase.from('antrian_pengajuan').select('*', { count: 'exact', head: true }).eq('layanan', 'pertek')
	])

	if (totalResult.error) throw totalResult.error
	if (selesaiResult.error) throw selesaiResult.error
	if (doklingResult.error) throw doklingResult.error
	if (pertekResult.error) throw pertekResult.error

	const total = totalResult.count ?? 0
	const selesai = selesaiResult.count ?? 0
	const dokling = doklingResult.count ?? 0
	const pertek = pertekResult.count ?? 0
	const pending = Math.max(total - selesai, 0)

	return { total, pending, selesai, dokling, pertek }
}

export const getWorkflowHistoryByPengajuanIds = async (
	supabase: SupabaseClient<Database>,
	pengajuanIds: string[]
): Promise<WorkflowHistoryByPengajuan> => {
	if (pengajuanIds.length === 0) return {}

	const { data, error } = await supabase
		.from('workflow_history')
		.select('*')
		.in('pengajuan_id', pengajuanIds)
		.order('changed_at', { ascending: false })

	if (error) throw error

	const historyByPengajuan: WorkflowHistoryByPengajuan = {}
	for (const row of data ?? []) {
		if (!historyByPengajuan[row.pengajuan_id]) {
			historyByPengajuan[row.pengajuan_id] = []
		}
		historyByPengajuan[row.pengajuan_id].push(row)
	}

	return historyByPengajuan
}
