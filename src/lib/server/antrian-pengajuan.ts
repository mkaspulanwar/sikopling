import { LAYANAN_VALUES, STATUS_VALUES, type Layanan, type StatusPengajuan } from '$lib/supabase/constants'
import type { Database } from '$lib/supabase/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100
const MAX_IDS_PAGE_SIZE = 1000

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
type MonitoringTableName = 'monitoring_perling' | 'monitoring_pertek'
type MonitoringRow = Database['public']['Tables']['monitoring_perling']['Row']
type WorkflowHistoryRow = Database['public']['Tables']['workflow_history']['Row']

type AntrianRow = MonitoringRow & { layanan: Layanan }

const LAYANAN_TABLE_MAP: Record<Layanan, MonitoringTableName> = {
	perling: 'monitoring_perling',
	pertek: 'monitoring_pertek'
}

const STATUS_SELESAI: StatusPengajuan = 'SK Terbit'
const STATUS_DITOLAK: StatusPengajuan = 'Ditolak'
const STATUS_PERLU_PERBAIKAN: StatusPengajuan[] = [
	'Perbaikan Uji Administrasi',
	'Belum Submit Perbaikan',
	'Dikembalikan'
]

const MONITORING_LIST_COLUMNS =
	'id, no_registrasi, tanggal_masuk, instansi, kegiatan, jenis_dokumen, posisi, status, tanggal_update, created_at, updated_at'

const WORKFLOW_HISTORY_COLUMNS =
	'id, pengajuan_id, layanan, old_status, new_status, old_posisi, new_posisi, note, changed_by, changed_at'

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

export type ListAntrianPengajuanIdsResult = {
	data: Array<{ id: string }>
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export type AntrianPengajuanSummary = {
	total: number
	pending: number
	selesai: number
	perling: number
	pertek: number
	diproses: number
	ditolak: number
	admin: number
	perluPerbaikan: number
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

const normalizeIdsPageSize = (value?: number) => {
	if (!value || Number.isNaN(value) || value < 1) return MAX_IDS_PAGE_SIZE
	return Math.min(Math.floor(value), MAX_IDS_PAGE_SIZE)
}

const normalizeSortBy = (value?: string): SortColumn => {
	if (!value || !SORTABLE_COLUMNS.includes(value as SortColumn)) return 'tanggal_update'
	return value as SortColumn
}

const normalizeSortOrder = (value?: string): SortOrder => (value === 'asc' ? 'asc' : 'desc')
const normalizeNoRegistrasi = (value?: string | null) => {
	const normalized = value?.trim()
	return normalized ? normalized : null
}

const normalizeCount = (value: unknown) => {
	if (typeof value === 'number' && Number.isFinite(value)) return value
	const parsed = Number(value)
	return Number.isFinite(parsed) ? parsed : 0
}

const mapRowsWithLayanan = (rows: MonitoringRow[] | null, layanan: Layanan): AntrianRow[] =>
	(rows ?? []).map((row) => ({ ...row, layanan }))

const applyCommonFilters = <T>(query: T, params: ListAntrianPengajuanParams) => {
	let nextQuery = query as any

	if (params.status && STATUS_VALUES.includes(params.status)) {
		nextQuery = nextQuery.eq('status', params.status)
	}

	if (params.instansi) {
		nextQuery = nextQuery.ilike('instansi', `%${params.instansi.trim()}%`)
	}

	if (params.jenisDokumen) {
		nextQuery = nextQuery.ilike('jenis_dokumen', `%${params.jenisDokumen.trim()}%`)
	}

	if (params.tanggalMulai) {
		nextQuery = nextQuery.gte('tanggal_masuk', params.tanggalMulai)
	}

	if (params.tanggalSelesai) {
		nextQuery = nextQuery.lte('tanggal_masuk', params.tanggalSelesai)
	}

	if (params.keyword?.trim()) {
		const keyword = `%${params.keyword.trim()}%`
		nextQuery = nextQuery.or(`no_registrasi.ilike.${keyword},instansi.ilike.${keyword},kegiatan.ilike.${keyword}`)
	}

	return nextQuery
}

const compareValues = (left: unknown, right: unknown) => {
	if (left == null && right == null) return 0
	if (left == null) return 1
	if (right == null) return -1

	if (typeof left === 'string' && typeof right === 'string') {
		return left.localeCompare(right, 'id-ID', { sensitivity: 'base' })
	}

	if (typeof left === 'number' && typeof right === 'number') {
		return left - right
	}

	return String(left).localeCompare(String(right), 'id-ID', { sensitivity: 'base' })
}

const sortRows = (rows: AntrianRow[], sortBy: SortColumn, sortOrder: SortOrder) =>
	[...rows].sort((left, right) => {
		const comparison = compareValues(left[sortBy], right[sortBy])
		return sortOrder === 'asc' ? comparison : -comparison
	})

const resolveLayananById = async (supabase: SupabaseClient<Database>, id: string): Promise<Layanan | null> => {
	const checks = await Promise.all([
		supabase.from('monitoring_perling').select('id').eq('id', id).maybeSingle(),
		supabase.from('monitoring_pertek').select('id').eq('id', id).maybeSingle()
	])

	for (const [index, result] of checks.entries()) {
		if (result.error) throw result.error
		if (result.data?.id) {
			return index === 0 ? 'perling' : 'pertek'
		}
	}

	return null
}

const listSingleLayanan = async (
	supabase: SupabaseClient<Database>,
	layanan: Layanan,
	params: ListAntrianPengajuanParams,
	page: number,
	pageSize: number,
	sortBy: SortColumn,
	sortOrder: SortOrder
): Promise<ListAntrianPengajuanResult> => {
	const from = (page - 1) * pageSize
	const to = from + pageSize - 1
	const tableName = LAYANAN_TABLE_MAP[layanan]

	let query = supabase
		.from(tableName)
		.select(MONITORING_LIST_COLUMNS, { count: 'exact' })
		.order(sortBy, { ascending: sortOrder === 'asc', nullsFirst: false })
		.range(from, to)

	query = applyCommonFilters(query, params)

	const { data, count, error } = await query
	if (error) throw error

	const total = count ?? 0
	const totalPages = Math.max(1, Math.ceil(total / pageSize))

	return {
		data: mapRowsWithLayanan(data as MonitoringRow[] | null, layanan),
		total,
		page,
		pageSize,
		totalPages
	}
}

export const listAntrianPengajuan = async (
	supabase: SupabaseClient<Database>,
	params: ListAntrianPengajuanParams = {}
): Promise<ListAntrianPengajuanResult> => {
	const page = normalizePage(params.page)
	const pageSize = normalizePageSize(params.pageSize)
	const sortBy = normalizeSortBy(params.sortBy)
	const sortOrder = normalizeSortOrder(params.sortOrder)

	if (params.layanan && LAYANAN_VALUES.includes(params.layanan)) {
		return listSingleLayanan(supabase, params.layanan, params, page, pageSize, sortBy, sortOrder)
	}

	const [perlingResult, pertekResult] = await Promise.all([
		applyCommonFilters(
			supabase
				.from('monitoring_perling')
				.select(MONITORING_LIST_COLUMNS)
				.order(sortBy, { ascending: sortOrder === 'asc', nullsFirst: false }),
			params
		),
		applyCommonFilters(
			supabase
				.from('monitoring_pertek')
				.select(MONITORING_LIST_COLUMNS)
				.order(sortBy, { ascending: sortOrder === 'asc', nullsFirst: false }),
			params
		)
	])

	if (perlingResult.error) throw perlingResult.error
	if (pertekResult.error) throw pertekResult.error

	const mergedRows = sortRows(
		[
			...mapRowsWithLayanan(perlingResult.data as MonitoringRow[] | null, 'perling'),
			...mapRowsWithLayanan(pertekResult.data as MonitoringRow[] | null, 'pertek')
		],
		sortBy,
		sortOrder
	)

	const total = mergedRows.length
	const totalPages = Math.max(1, Math.ceil(total / pageSize))
	const from = (page - 1) * pageSize
	const to = from + pageSize

	return {
		data: mergedRows.slice(from, to),
		total,
		page,
		pageSize,
		totalPages
	}
}

export const listAntrianPengajuanIds = async (
	supabase: SupabaseClient<Database>,
	params: ListAntrianPengajuanParams = {}
): Promise<ListAntrianPengajuanIdsResult> => {
	const page = normalizePage(params.page)
	const pageSize = normalizeIdsPageSize(params.pageSize)
	const sortBy = normalizeSortBy(params.sortBy)
	const sortOrder = normalizeSortOrder(params.sortOrder)

	if (params.layanan && LAYANAN_VALUES.includes(params.layanan)) {
		const tableName = LAYANAN_TABLE_MAP[params.layanan]
		const from = (page - 1) * pageSize
		const to = from + pageSize - 1

		let query = supabase
			.from(tableName)
			.select('id', { count: 'exact' })
			.order(sortBy, { ascending: sortOrder === 'asc', nullsFirst: false })
			.range(from, to)

		query = applyCommonFilters(query, params)

		const { data, count, error } = await query
		if (error) throw error

		const total = count ?? 0
		const totalPages = Math.max(1, Math.ceil(total / pageSize))

		return {
			data: (data ?? []).map((row: { id: string }) => ({ id: row.id })),
			total,
			page,
			pageSize,
			totalPages
		}
	}

	const fullList = await listAntrianPengajuan(supabase, {
		...params,
		page: 1,
		pageSize: MAX_IDS_PAGE_SIZE,
		sortBy,
		sortOrder
	})

	const from = (page - 1) * pageSize
	const to = from + pageSize
	const ids = fullList.data.slice(from, to).map((row) => ({ id: row.id }))

	return {
		data: ids,
		total: fullList.total,
		page,
		pageSize,
		totalPages: Math.max(1, Math.ceil(fullList.total / pageSize))
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

	const layanan = await resolveLayananById(supabase, payload.id)
	if (!layanan) throw new Error('PENGAJUAN_NOT_FOUND')

	const tableName = LAYANAN_TABLE_MAP[layanan]

	const { data, error } = await supabase
		.from(tableName)
		.update({
			status: payload.status,
			posisi: payload.posisi ?? null,
			tanggal_update: new Date().toISOString().slice(0, 10)
		})
		.eq('id', payload.id)
		.select(MONITORING_LIST_COLUMNS)
		.single()

	if (error) throw error

	const cleanedNote = payload.note?.trim()
	if (cleanedNote) {
		const { data: latestHistory, error: latestHistoryError } = await supabase
			.from('workflow_history')
			.select('id')
			.eq('pengajuan_id', payload.id)
			.eq('layanan', layanan)
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

	return { ...(data as MonitoringRow), layanan }
}

export const createAntrianPengajuan = async (
	supabase: SupabaseClient<Database>,
	payload: {
		layanan: Layanan
		noRegistrasi?: string | null
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

	const normalizedNoRegistrasi = normalizeNoRegistrasi(payload.noRegistrasi)
	const tableName = LAYANAN_TABLE_MAP[payload.layanan]

	const { data, error } = await supabase
		.from(tableName)
		.insert({
			no_registrasi: normalizedNoRegistrasi,
			tanggal_masuk: payload.tanggalMasuk ?? null,
			instansi: payload.instansi?.trim() || null,
			kegiatan: payload.kegiatan?.trim() || null,
			jenis_dokumen: payload.jenisDokumen?.trim() || null,
			posisi: payload.posisi?.trim() || null,
			status: payload.status ?? 'Submit / Masuk',
			tanggal_update: payload.tanggalUpdate ?? null
		})
		.select(MONITORING_LIST_COLUMNS)
		.single()

	if (error) throw error
	return { ...(data as MonitoringRow), layanan: payload.layanan }
}

export const updateAntrianPengajuan = async (
	supabase: SupabaseClient<Database>,
	payload: {
		id: string
		noRegistrasi?: string | null
		tanggalMasuk?: string | null
		tanggalUpdate?: string | null
		instansi?: string | null
		kegiatan?: string | null
		jenisDokumen?: string | null
		posisi?: string | null
		status?: StatusPengajuan
	}
) => {
	const layanan = await resolveLayananById(supabase, payload.id)
	if (!layanan) throw new Error('PENGAJUAN_NOT_FOUND')

	const updates: Database['public']['Tables']['monitoring_perling']['Update'] = {}

	if (payload.noRegistrasi !== undefined) {
		updates.no_registrasi = normalizeNoRegistrasi(payload.noRegistrasi)
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

	const tableName = LAYANAN_TABLE_MAP[layanan]

	const { data, error } = await supabase
		.from(tableName)
		.update(updates)
		.eq('id', payload.id)
		.select(MONITORING_LIST_COLUMNS)
		.single()

	if (error) throw error
	return { ...(data as MonitoringRow), layanan }
}

export const deleteAntrianPengajuan = async (
	supabase: SupabaseClient<Database>,
	payload: { id: string }
) => {
	const layanan = await resolveLayananById(supabase, payload.id)
	if (!layanan) {
		throw new Error('PENGAJUAN_NOT_FOUND')
	}

	const tableName = LAYANAN_TABLE_MAP[layanan]

	const { data: existingRow, error: existingError } = await supabase
		.from(tableName)
		.select('id')
		.eq('id', payload.id)
		.maybeSingle()

	if (existingError) throw existingError

	const { data: deletedRow, error } = await supabase
		.from(tableName)
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
	const [
		perlingTotalResult,
		pertekTotalResult,
		perlingSelesaiResult,
		pertekSelesaiResult,
		perlingDitolakResult,
		pertekDitolakResult,
		perlingPerluPerbaikanResult,
		pertekPerluPerbaikanResult,
		adminResult
	] = await Promise.all([
		supabase.from('monitoring_perling').select('id', { count: 'exact', head: true }),
		supabase.from('monitoring_pertek').select('id', { count: 'exact', head: true }),
		supabase.from('monitoring_perling').select('id', { count: 'exact', head: true }).eq('status', STATUS_SELESAI),
		supabase.from('monitoring_pertek').select('id', { count: 'exact', head: true }).eq('status', STATUS_SELESAI),
		supabase.from('monitoring_perling').select('id', { count: 'exact', head: true }).eq('status', STATUS_DITOLAK),
		supabase.from('monitoring_pertek').select('id', { count: 'exact', head: true }).eq('status', STATUS_DITOLAK),
		supabase.from('monitoring_perling').select('id', { count: 'exact', head: true }).in('status', STATUS_PERLU_PERBAIKAN),
		supabase.from('monitoring_pertek').select('id', { count: 'exact', head: true }).in('status', STATUS_PERLU_PERBAIKAN),
		supabase.rpc('count_registered_admins')
	])

	if (perlingTotalResult.error) throw perlingTotalResult.error
	if (pertekTotalResult.error) throw pertekTotalResult.error
	if (perlingSelesaiResult.error) throw perlingSelesaiResult.error
	if (pertekSelesaiResult.error) throw pertekSelesaiResult.error
	if (perlingDitolakResult.error) throw perlingDitolakResult.error
	if (pertekDitolakResult.error) throw pertekDitolakResult.error
	if (perlingPerluPerbaikanResult.error) throw perlingPerluPerbaikanResult.error
	if (pertekPerluPerbaikanResult.error) throw pertekPerluPerbaikanResult.error
	if (adminResult.error) {
		const missingFunction =
			adminResult.error.code === 'PGRST202' ||
			adminResult.error.message.toLowerCase().includes('count_registered_admins')
		if (!missingFunction) throw adminResult.error
	}

	const perling = perlingTotalResult.count ?? 0
	const pertek = pertekTotalResult.count ?? 0
	const total = perling + pertek
	const selesai = (perlingSelesaiResult.count ?? 0) + (pertekSelesaiResult.count ?? 0)
	const ditolak = (perlingDitolakResult.count ?? 0) + (pertekDitolakResult.count ?? 0)
	const perluPerbaikan =
		(perlingPerluPerbaikanResult.count ?? 0) + (pertekPerluPerbaikanResult.count ?? 0)
	const admin = adminResult.error ? 0 : Math.max(normalizeCount(adminResult.data), 0)
	const diproses = Math.max(total - selesai - ditolak, 0)
	const pending = Math.max(total - selesai, 0)

	return { total, pending, selesai, perling, pertek, diproses, ditolak, admin, perluPerbaikan }
}

export const getWorkflowHistoryByPengajuanIds = async (
	supabase: SupabaseClient<Database>,
	pengajuanIds: string[]
): Promise<WorkflowHistoryByPengajuan> => {
	if (pengajuanIds.length === 0) return {}

	const { data, error } = await supabase
		.from('workflow_history')
		.select(WORKFLOW_HISTORY_COLUMNS)
		.in('pengajuan_id', pengajuanIds)
		.in('layanan', ['perling', 'pertek'])
		.order('changed_at', { ascending: false })

	if (error) throw error

	const historyByPengajuan: WorkflowHistoryByPengajuan = {}
	for (const row of data ?? []) {
		if (!historyByPengajuan[row.pengajuan_id]) {
			historyByPengajuan[row.pengajuan_id] = []
		}
		historyByPengajuan[row.pengajuan_id].push(row as WorkflowHistoryRow)
	}

	return historyByPengajuan
}