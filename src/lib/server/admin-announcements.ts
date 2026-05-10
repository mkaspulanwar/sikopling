import type { Database } from '$lib/supabase/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

export type AnnouncementType = 'perling' | 'pertek' | 'integrasi'
type AnnouncementTable = 'pengumuman_perling' | 'pengumuman_pertek' | 'pengumuman_integrasi'
type SortColumn = 'instansi' | 'kegiatan' | 'no_sk' | 'tanggal' | 'created_at' | 'updated_at'
type SortOrder = 'asc' | 'desc'

export type AnnouncementRow = Database['public']['Tables']['pengumuman_perling']['Row']

export type AnnouncementListParams = {
	type: AnnouncementType
	page?: number
	pageSize?: number
	keyword?: string
	sortBy?: string
	sortOrder?: string
}

export type AnnouncementPayload = {
	type: AnnouncementType
	instansi?: string | null
	kegiatan?: string | null
	noSk?: string | null
	tanggal?: string | null
}

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 100
const MAX_IDS_PAGE_SIZE = 1000
const SORTABLE_COLUMNS: SortColumn[] = ['instansi', 'kegiatan', 'no_sk', 'tanggal', 'created_at', 'updated_at']

const TABLE_MAP: Record<AnnouncementType, AnnouncementTable> = {
	perling: 'pengumuman_perling',
	pertek: 'pengumuman_pertek',
	integrasi: 'pengumuman_integrasi'
}

export const ANNOUNCEMENT_TYPES = ['perling', 'pertek', 'integrasi'] as const
export const isAnnouncementType = (value: string): value is AnnouncementType =>
	ANNOUNCEMENT_TYPES.includes(value as AnnouncementType)

const normalizePage = (value?: number) => {
	if (!value || Number.isNaN(value) || value < 1) return DEFAULT_PAGE
	return Math.floor(value)
}

const normalizePageSize = (value?: number) => {
	if (!value || Number.isNaN(value) || value < 1) return DEFAULT_PAGE_SIZE
	return Math.min(Math.floor(value), MAX_PAGE_SIZE)
}

const normalizeSortBy = (value?: string): SortColumn =>
	SORTABLE_COLUMNS.includes(value as SortColumn) ? (value as SortColumn) : 'tanggal'

const normalizeSortOrder = (value?: string): SortOrder => (value === 'asc' ? 'asc' : 'desc')

const tableFor = (type: AnnouncementType) => TABLE_MAP[type]

const applyFilters = <T>(query: T, params: AnnouncementListParams) => {
	let nextQuery = query as any
	if (params.keyword?.trim()) {
		const keyword = `%${params.keyword.trim()}%`
		nextQuery = nextQuery.or(`instansi.ilike.${keyword},kegiatan.ilike.${keyword},no_sk.ilike.${keyword}`)
	}
	return nextQuery
}

export const listAnnouncementRows = async (
	supabase: SupabaseClient<Database>,
	params: AnnouncementListParams
) => {
	const page = normalizePage(params.page)
	const pageSize = normalizePageSize(params.pageSize)
	const sortBy = normalizeSortBy(params.sortBy)
	const sortOrder = normalizeSortOrder(params.sortOrder)
	const from = (page - 1) * pageSize
	const to = from + pageSize - 1

	let query = supabase
		.from(tableFor(params.type))
		.select('id, instansi, kegiatan, no_sk, tanggal, created_at, updated_at', { count: 'exact' })
		.order(sortBy, { ascending: sortOrder === 'asc', nullsFirst: false })
		.order('created_at', { ascending: false, nullsFirst: false })
		.range(from, to)

	query = applyFilters(query, params)

	const { data, count, error } = await query
	if (error) throw error

	const total = count ?? 0
	return {
		data: (data ?? []) as AnnouncementRow[],
		total,
		page,
		pageSize,
		totalPages: Math.max(1, Math.ceil(total / pageSize))
	}
}

export const listAnnouncementIds = async (
	supabase: SupabaseClient<Database>,
	params: AnnouncementListParams
) => {
	const page = normalizePage(params.page)
	const pageSize = Math.min(normalizePageSize(params.pageSize ?? MAX_IDS_PAGE_SIZE), MAX_IDS_PAGE_SIZE)
	const sortBy = normalizeSortBy(params.sortBy)
	const sortOrder = normalizeSortOrder(params.sortOrder)
	const from = (page - 1) * pageSize
	const to = from + pageSize - 1

	let query = supabase
		.from(tableFor(params.type))
		.select('id', { count: 'exact' })
		.order(sortBy, { ascending: sortOrder === 'asc', nullsFirst: false })
		.range(from, to)

	query = applyFilters(query, params)
	const { data, count, error } = await query
	if (error) throw error

	const total = count ?? 0
	return {
		data: (data ?? []).map((row) => ({ id: row.id })),
		total,
		page,
		pageSize,
		totalPages: Math.max(1, Math.ceil(total / pageSize))
	}
}

const normalizePayload = (payload: AnnouncementPayload) => ({
	instansi: payload.instansi?.trim() || null,
	kegiatan: payload.kegiatan?.trim() || null,
	no_sk: payload.noSk?.trim() || null,
	tanggal: payload.tanggal || null
})

export const createAnnouncementRow = async (
	supabase: SupabaseClient<Database>,
	payload: AnnouncementPayload
) => {
	const { data, error } = await supabase
		.from(tableFor(payload.type))
		.insert(normalizePayload(payload))
		.select('id, instansi, kegiatan, no_sk, tanggal, created_at, updated_at')
		.single()

	if (error) throw error
	return data as AnnouncementRow
}

export const updateAnnouncementRow = async (
	supabase: SupabaseClient<Database>,
	payload: AnnouncementPayload & { id: string }
) => {
	const { data, error } = await supabase
		.from(tableFor(payload.type))
		.update(normalizePayload(payload))
		.eq('id', payload.id)
		.select('id, instansi, kegiatan, no_sk, tanggal, created_at, updated_at')
		.single()

	if (error) throw error
	return data as AnnouncementRow
}

export const deleteAnnouncementRow = async (
	supabase: SupabaseClient<Database>,
	payload: { type: AnnouncementType; id: string }
) => {
	const { data, error } = await supabase
		.from(tableFor(payload.type))
		.delete()
		.eq('id', payload.id)
		.select('id')
		.maybeSingle()

	if (error) throw error
	if (!data) throw new Error('ANNOUNCEMENT_NOT_FOUND')
}

export const listAllAnnouncementRows = async (
	supabase: SupabaseClient<Database>,
	params: AnnouncementListParams
) => {
	const rows: AnnouncementRow[] = []
	let page = 1
	let totalPages = 1

	while (page <= totalPages) {
		const result = await listAnnouncementRows(supabase, {
			...params,
			page,
			pageSize: 100
		})
		rows.push(...result.data)
		totalPages = result.totalPages
		page += 1
	}

	return rows
}
