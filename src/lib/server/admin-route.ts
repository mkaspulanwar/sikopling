import { STATUS_VALUES, type Layanan, type StatusPengajuan } from '$lib/supabase/constants'
import type { Database } from '$lib/supabase/database.types'
import { isAdminRole, resolveUserRole } from '$lib/server/supabase-auth'
import type { SupabaseClient } from '@supabase/supabase-js'

export const SORTABLE_COLUMNS = [
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

export type SortableColumn = (typeof SORTABLE_COLUMNS)[number]
export type SortOrder = 'asc' | 'desc'

export type AdminListFilters = {
	page: number
	pageSize: number
	keyword?: string
	status?: StatusPengajuan
	sortBy: SortableColumn
	sortOrder: SortOrder
}

export const EMPTY_SUMMARY = {
	total: 0,
	pending: 0,
	selesai: 0,
	dokling: 0,
	pertek: 0
}

export const createEmptyResult = (page: number, pageSize: number) => ({
	data: [],
	total: 0,
	page,
	pageSize,
	totalPages: 1
})

const readNumber = (value: string | null, fallback: number) => {
	if (!value) return fallback
	const parsed = Number(value)
	if (!Number.isFinite(parsed)) return fallback
	return Math.floor(parsed)
}

const readString = (value: string | null) => {
	if (!value) return undefined
	const trimmed = value.trim()
	return trimmed.length > 0 ? trimmed : undefined
}

const readSortBy = (value: string | null): SortableColumn => {
	if (!value) return 'tanggal_update'
	return SORTABLE_COLUMNS.includes(value as SortableColumn)
		? (value as SortableColumn)
		: 'tanggal_update'
}

const readSortOrder = (value: string | null): SortOrder => (value === 'asc' ? 'asc' : 'desc')

export const readAdminFilters = (query: URLSearchParams): AdminListFilters => ({
	page: Math.max(1, readNumber(query.get('page'), 1)),
	pageSize: Math.min(100, Math.max(10, readNumber(query.get('pageSize'), 20))),
	keyword: readString(query.get('keyword')),
	status: STATUS_VALUES.includes(query.get('status') as StatusPengajuan)
		? (query.get('status') as StatusPengajuan)
		: undefined,
	sortBy: readSortBy(query.get('sortBy')),
	sortOrder: readSortOrder(query.get('sortOrder'))
})

export const isLayanan = (value: string): value is Layanan => value === 'dokling' || value === 'pertek'

export const requireAdminSupabase = async (
	locals: App.Locals
): Promise<
	| { state: 'ok'; supabase: SupabaseClient<Database> }
	| { state: 'unavailable' }
	| { state: 'unauthorized' }
> => {
	if (!locals.supabase) {
		return { state: 'unavailable' }
	}

	const { session, user } = await locals.safeGetSession()
	const role = resolveUserRole(user)
	if (!session || !isAdminRole(role)) {
		return { state: 'unauthorized' }
	}

	return { state: 'ok', supabase: locals.supabase }
}
