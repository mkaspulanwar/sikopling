import { EMPTY_SUMMARY, createEmptyResult, logAdminLoad } from '$lib/server/admin-route'
import { listAnnouncementRows } from '$lib/server/admin-announcements'
import type { PageServerLoad } from './$types'

const PAGE_SIZE_OPTIONS = [5, 10, 20] as const
const DEFAULT_PAGE_SIZE = 10

const readNumber = (value: string | null, fallback: number) => {
	const parsed = Number(value)
	return Number.isFinite(parsed) ? Math.floor(parsed) : fallback
}

const normalizePageSize = (value: string | null) => {
	const parsed = readNumber(value, DEFAULT_PAGE_SIZE)
	return PAGE_SIZE_OPTIONS.includes(parsed as (typeof PAGE_SIZE_OPTIONS)[number])
		? parsed
		: DEFAULT_PAGE_SIZE
}

const readFilters = (query: URLSearchParams) => ({
	page: Math.max(1, readNumber(query.get('page'), 1)),
	pageSize: normalizePageSize(query.get('pageSize')),
	keyword: query.get('keyword')?.trim() || undefined,
	sortBy: query.get('sortBy') || 'tanggal',
	sortOrder: query.get('sortOrder') === 'asc' ? ('asc' as const) : ('desc' as const)
})

export const load: PageServerLoad = async ({ locals, url, parent, depends }) => {
	depends('admin:pengumuman-pertek')

	const filters = readFilters(url.searchParams)
	const adminData = await parent()

	if (!adminData.supabaseAvailable || !locals.supabase) {
		logAdminLoad('admin/pengumuman/pertek/+page.server', { state: 'unavailable' })
		return {
			unavailable: true,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary: adminData.summary ?? EMPTY_SUMMARY,
			result: createEmptyResult(filters.page, filters.pageSize)
		}
	}

	if (!adminData.isAdmin) {
		logAdminLoad('admin/pengumuman/pertek/+page.server', { state: 'forbidden', role: adminData.role })
		return {
			unavailable: false,
			requiresSupabaseAuth: true,
			errorMessage: null,
			filters,
			summary: adminData.summary ?? EMPTY_SUMMARY,
			result: createEmptyResult(filters.page, filters.pageSize)
		}
	}

	try {
		const result = await listAnnouncementRows(locals.supabase, {
			type: 'pertek',
			...filters
		})

		return {
			unavailable: false,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary: adminData.summary,
			result
		}
	} catch (error) {
		return {
			unavailable: false,
			requiresSupabaseAuth: false,
			errorMessage: error instanceof Error ? error.message : 'Gagal memuat data penerbitan pertek',
			filters,
			summary: adminData.summary ?? EMPTY_SUMMARY,
			result: createEmptyResult(filters.page, filters.pageSize)
		}
	}
}
