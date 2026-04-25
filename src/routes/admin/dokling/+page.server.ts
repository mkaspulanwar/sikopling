import {
	EMPTY_SUMMARY,
	createEmptyResult,
	readAdminFilters,
	requireAdminSupabase
} from '$lib/server/admin-route'
import { getAntrianPengajuanSummary, listAntrianPengajuan } from '$lib/server/antrian-pengajuan'
import type { PageServerLoad } from './$types'

const EMPTY_DOKLING_STATUS_METRICS = {
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
			doklingStatusMetrics: EMPTY_DOKLING_STATUS_METRICS
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
			doklingStatusMetrics: EMPTY_DOKLING_STATUS_METRICS
		}
	}

	try {
		const applyDoklingMetricFilters = (query: any) => {
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

		const [result, summary, totalDoklingResult, selesaiDoklingResult, ditolakDoklingResult] =
			await Promise.all([
			listAntrianPengajuan(auth.supabase, {
				...filters,
				layanan: 'dokling'
			}),
			getAntrianPengajuanSummary(auth.supabase),
			applyDoklingMetricFilters(
				auth.supabase
					.from('antrian_pengajuan')
					.select('*', { count: 'exact', head: true })
					.eq('layanan', 'dokling')
			),
			applyDoklingMetricFilters(
				auth.supabase
					.from('antrian_pengajuan')
					.select('*', { count: 'exact', head: true })
					.eq('layanan', 'dokling')
					.eq('status', 'SK Terbit')
			),
			applyDoklingMetricFilters(
				auth.supabase
					.from('antrian_pengajuan')
					.select('*', { count: 'exact', head: true })
					.eq('layanan', 'dokling')
					.eq('status', 'Ditolak')
			)
		])

		if (totalDoklingResult.error) throw totalDoklingResult.error
		if (selesaiDoklingResult.error) throw selesaiDoklingResult.error
		if (ditolakDoklingResult.error) throw ditolakDoklingResult.error

		const total = totalDoklingResult.count ?? 0
		const selesai = selesaiDoklingResult.count ?? 0
		const ditolak = ditolakDoklingResult.count ?? 0
		const diproses = Math.max(total - selesai - ditolak, 0)

		return {
			unavailable: false,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary,
			result,
			doklingStatusMetrics: {
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
			errorMessage: error instanceof Error ? error.message : 'Gagal memuat data dokling',
			filters,
			summary: EMPTY_SUMMARY,
			result: createEmptyResult(filters.page, filters.pageSize),
			doklingStatusMetrics: EMPTY_DOKLING_STATUS_METRICS
		}
	}
}
