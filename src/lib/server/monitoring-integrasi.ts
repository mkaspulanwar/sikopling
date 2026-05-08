import { INTEGRASI_STATUS_VALUES, type IntegrasiStatus } from '$lib/supabase/constants'
import type { Database } from '$lib/supabase/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100
const MAX_IDS_PAGE_SIZE = 1000

export const INTEGRASI_SORTABLE_COLUMNS = [
	'instansi',
	'kegiatan',
	'jenis_integrasi',
	'posisi',
	'status',
	'tanggal_update',
	'keterangan',
	'created_at',
	'updated_at'
] as const

export type IntegrasiSortColumn = (typeof INTEGRASI_SORTABLE_COLUMNS)[number]
export type SortOrder = 'asc' | 'desc'
export type MonitoringIntegrasiRow = Database['public']['Tables']['monitoring_integrasi']['Row']

const MONITORING_INTEGRASI_COLUMNS =
	'id, instansi, kegiatan, jenis_integrasi, posisi, status, tanggal_update, keterangan, created_at, updated_at'

export type ListMonitoringIntegrasiParams = {
	page?: number
	pageSize?: number
	status?: IntegrasiStatus
	keyword?: string
	sortBy?: IntegrasiSortColumn
	sortOrder?: SortOrder
}

export type ListMonitoringIntegrasiResult = {
	data: MonitoringIntegrasiRow[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

export type ListMonitoringIntegrasiIdsResult = {
	data: Array<{ id: string }>
	total: number
	page: number
	pageSize: number
	totalPages: number
}

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

const normalizeSortBy = (value?: string): IntegrasiSortColumn => {
	if (!value || !INTEGRASI_SORTABLE_COLUMNS.includes(value as IntegrasiSortColumn)) {
		return 'tanggal_update'
	}
	return value as IntegrasiSortColumn
}

const normalizeSortOrder = (value?: string): SortOrder => (value === 'asc' ? 'asc' : 'desc')

const applyIntegrasiFilters = <T>(query: T, params: ListMonitoringIntegrasiParams) => {
	let nextQuery = query as any

	if (params.status && INTEGRASI_STATUS_VALUES.includes(params.status)) {
		nextQuery = nextQuery.eq('status', params.status)
	}

	if (params.keyword?.trim()) {
		const keyword = `%${params.keyword.trim()}%`
		nextQuery = nextQuery.or(
			`instansi.ilike.${keyword},kegiatan.ilike.${keyword},jenis_integrasi.ilike.${keyword},posisi.ilike.${keyword},keterangan.ilike.${keyword}`
		)
	}

	return nextQuery
}

export const listMonitoringIntegrasi = async (
	supabase: SupabaseClient<Database>,
	params: ListMonitoringIntegrasiParams = {}
): Promise<ListMonitoringIntegrasiResult> => {
	const page = normalizePage(params.page)
	const pageSize = normalizePageSize(params.pageSize)
	const sortBy = normalizeSortBy(params.sortBy)
	const sortOrder = normalizeSortOrder(params.sortOrder)
	const from = (page - 1) * pageSize
	const to = from + pageSize - 1

	let query = supabase
		.from('monitoring_integrasi')
		.select(MONITORING_INTEGRASI_COLUMNS, { count: 'exact' })
		.order(sortBy, { ascending: sortOrder === 'asc', nullsFirst: false })
		.range(from, to)

	query = applyIntegrasiFilters(query, params)

	const { data, count, error } = await query
	if (error) throw error

	const total = count ?? 0
	const totalPages = Math.max(1, Math.ceil(total / pageSize))

	return {
		data: (data ?? []) as MonitoringIntegrasiRow[],
		total,
		page,
		pageSize,
		totalPages
	}
}

export const listMonitoringIntegrasiIds = async (
	supabase: SupabaseClient<Database>,
	params: ListMonitoringIntegrasiParams = {}
): Promise<ListMonitoringIntegrasiIdsResult> => {
	const page = normalizePage(params.page)
	const pageSize = normalizeIdsPageSize(params.pageSize)
	const sortBy = normalizeSortBy(params.sortBy)
	const sortOrder = normalizeSortOrder(params.sortOrder)
	const from = (page - 1) * pageSize
	const to = from + pageSize - 1

	let query = supabase
		.from('monitoring_integrasi')
		.select('id', { count: 'exact' })
		.order(sortBy, { ascending: sortOrder === 'asc', nullsFirst: false })
		.range(from, to)

	query = applyIntegrasiFilters(query, params)

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

export const createMonitoringIntegrasi = async (
	supabase: SupabaseClient<Database>,
	payload: {
		instansi?: string | null
		kegiatan?: string | null
		jenisIntegrasi?: string | null
		posisi?: string | null
		status?: IntegrasiStatus
		tanggalUpdate?: string | null
		keterangan?: string | null
	}
) => {
	if (payload.status && !INTEGRASI_STATUS_VALUES.includes(payload.status)) {
		throw new Error('Status integrasi tidak valid')
	}

	const { data, error } = await supabase
		.from('monitoring_integrasi')
		.insert({
			instansi: payload.instansi?.trim() || null,
			kegiatan: payload.kegiatan?.trim() || null,
			jenis_integrasi: payload.jenisIntegrasi?.trim() || null,
			posisi: payload.posisi?.trim() || null,
			status: payload.status ?? 'Submit',
			tanggal_update: payload.tanggalUpdate || null,
			keterangan: payload.keterangan?.trim() || null
		})
		.select(MONITORING_INTEGRASI_COLUMNS)
		.single()

	if (error) throw error
	return data as MonitoringIntegrasiRow
}

export const updateMonitoringIntegrasi = async (
	supabase: SupabaseClient<Database>,
	payload: {
		id: string
		instansi?: string | null
		kegiatan?: string | null
		jenisIntegrasi?: string | null
		posisi?: string | null
		status?: IntegrasiStatus
		tanggalUpdate?: string | null
		keterangan?: string | null
	}
) => {
	const updates: Database['public']['Tables']['monitoring_integrasi']['Update'] = {}

	if (payload.instansi !== undefined) updates.instansi = payload.instansi?.trim() || null
	if (payload.kegiatan !== undefined) updates.kegiatan = payload.kegiatan?.trim() || null
	if (payload.jenisIntegrasi !== undefined) {
		updates.jenis_integrasi = payload.jenisIntegrasi?.trim() || null
	}
	if (payload.posisi !== undefined) updates.posisi = payload.posisi?.trim() || null
	if (payload.tanggalUpdate !== undefined) updates.tanggal_update = payload.tanggalUpdate || null
	if (payload.keterangan !== undefined) updates.keterangan = payload.keterangan?.trim() || null
	if (payload.status !== undefined) {
		if (!INTEGRASI_STATUS_VALUES.includes(payload.status)) {
			throw new Error('Status integrasi tidak valid')
		}
		updates.status = payload.status
	}

	if (Object.keys(updates).length === 0) {
		throw new Error('Tidak ada perubahan data yang dikirim')
	}

	const { data, error } = await supabase
		.from('monitoring_integrasi')
		.update(updates)
		.eq('id', payload.id)
		.select(MONITORING_INTEGRASI_COLUMNS)
		.single()

	if (error) throw error
	return data as MonitoringIntegrasiRow
}

export const deleteMonitoringIntegrasi = async (
	supabase: SupabaseClient<Database>,
	payload: { id: string }
) => {
	const { data: existingRow, error: existingError } = await supabase
		.from('monitoring_integrasi')
		.select('id')
		.eq('id', payload.id)
		.maybeSingle()

	if (existingError) throw existingError

	const { data: deletedRow, error } = await supabase
		.from('monitoring_integrasi')
		.delete()
		.eq('id', payload.id)
		.select('id')
		.maybeSingle()

	if (error) throw error
	if (!deletedRow) {
		if (!existingRow) throw new Error('INTEGRASI_NOT_FOUND')
		throw new Error('DELETE_BLOCKED_BY_POLICY')
	}
}
