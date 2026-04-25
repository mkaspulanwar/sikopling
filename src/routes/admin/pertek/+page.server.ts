import {
	EMPTY_SUMMARY,
	createEmptyResult,
	readAdminFilters,
	requireAdminSupabase
} from '$lib/server/admin-route'
import { getAntrianPengajuanSummary, listAntrianPengajuan } from '$lib/server/antrian-pengajuan'
import type { PageServerLoad } from './$types'

const EMPTY_PERTEK_STATUS_METRICS = {
	total: 0,
	selesai: 0,
	diproses: 0,
	ditolak: 0
}

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
			result: createEmptyResult(filters.page, filters.pageSize),
			pertekStatusMetrics: EMPTY_PERTEK_STATUS_METRICS
		}
	}

	if (auth.state === 'unauthorized') {
		return {
			unavailable: false,
			requiresSupabaseAuth: true,
			errorMessage: null,
			filters,
			summary: EMPTY_SUMMARY,
			result: createEmptyResult(filters.page, filters.pageSize),
			pertekStatusMetrics: EMPTY_PERTEK_STATUS_METRICS
		}
	}

	try {
		const applyPertekMetricFilters = (query: any) => {
			let nextQuery = query

			if (filters.status) {
				nextQuery = nextQuery.eq('status', filters.status)
			}

			if (filters.keyword?.trim()) {
				const keyword = `%${filters.keyword.trim()}%`
				nextQuery = nextQuery.or(
					`no_registrasi.ilike.${keyword},instansi.ilike.${keyword},kegiatan.ilike.${keyword}`
				)
			}

			return nextQuery
		}

		const [result, summary, totalPertekResult, selesaiPertekResult, ditolakPertekResult] = await Promise.all([
			listAntrianPengajuan(auth.supabase, {
				...filters,
				layanan: 'pertek'
			}),
			getAntrianPengajuanSummary(auth.supabase),
			applyPertekMetricFilters(
				auth.supabase
					.from('antrian_pengajuan')
					.select('*', { count: 'exact', head: true })
					.eq('layanan', 'pertek')
			),
			applyPertekMetricFilters(
				auth.supabase
					.from('antrian_pengajuan')
					.select('*', { count: 'exact', head: true })
					.eq('layanan', 'pertek')
					.eq('status', 'SK Terbit')
			),
			applyPertekMetricFilters(
				auth.supabase
					.from('antrian_pengajuan')
					.select('*', { count: 'exact', head: true })
					.eq('layanan', 'pertek')
					.eq('status', 'Ditolak')
			)
		])

		if (totalPertekResult.error) throw totalPertekResult.error
		if (selesaiPertekResult.error) throw selesaiPertekResult.error
		if (ditolakPertekResult.error) throw ditolakPertekResult.error

		const total = totalPertekResult.count ?? 0
		const selesai = selesaiPertekResult.count ?? 0
		const ditolak = ditolakPertekResult.count ?? 0
		const diproses = Math.max(total - selesai - ditolak, 0)

		return {
			unavailable: false,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary,
			result,
			pertekStatusMetrics: {
				total,
				selesai,
				diproses,
				ditolak
			}
		}
	} catch (error) {
		return {
			unavailable: false,
			requiresSupabaseAuth: false,
			errorMessage: error instanceof Error ? error.message : 'Gagal memuat data pertek',
			filters,
			summary: EMPTY_SUMMARY,
			result: createEmptyResult(filters.page, filters.pageSize),
			pertekStatusMetrics: EMPTY_PERTEK_STATUS_METRICS
		}
	}
}
