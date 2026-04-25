import {
	EMPTY_SUMMARY,
	createEmptyResult,
	readAdminFilters,
	requireAdminSupabase
} from '$lib/server/admin-route'
import { getAntrianPengajuanSummary, listAntrianPengajuan } from '$lib/server/antrian-pengajuan'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, url }) => {
	const filters = readAdminFilters(url.searchParams)
	const auth = await requireAdminSupabase(locals)

	if (auth.state === 'unavailable') {
		return {
			unavailable: true,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary: EMPTY_SUMMARY,
			recentResult: createEmptyResult(filters.page, filters.pageSize)
		}
	}

	if (auth.state === 'unauthorized') {
		return {
			unavailable: false,
			requiresSupabaseAuth: true,
			errorMessage: null,
			filters,
			summary: EMPTY_SUMMARY,
			recentResult: createEmptyResult(filters.page, filters.pageSize)
		}
	}

	try {
		const [summary, recentResult] = await Promise.all([
			getAntrianPengajuanSummary(auth.supabase),
			listAntrianPengajuan(auth.supabase, {
				page: filters.page,
				pageSize: Math.min(filters.pageSize, 12),
				keyword: filters.keyword,
				status: filters.status,
				sortBy: filters.sortBy,
				sortOrder: filters.sortOrder
			})
		])

		return {
			unavailable: false,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary,
			recentResult
		}
	} catch (error) {
		return {
			unavailable: false,
			requiresSupabaseAuth: false,
			errorMessage: error instanceof Error ? error.message : 'Gagal memuat ringkasan dashboard',
			filters,
			summary: EMPTY_SUMMARY,
			recentResult: createEmptyResult(filters.page, filters.pageSize)
		}
	}
}
