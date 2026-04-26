import {
	EMPTY_SUMMARY,
	createEmptyResult,
	logAdminLoad,
	readAdminFilters
} from '$lib/server/admin-route'
import { listAntrianPengajuan } from '$lib/server/antrian-pengajuan'
import type { PageServerLoad } from './$types'

const EMPTY_PERTEK_STATUS_METRICS = {
	total: 0,
	selesai: 0,
	diproses: 0,
	ditolak: 0
}

export const load: PageServerLoad = async ({ locals, url, parent, depends }) => {
	depends('admin:pertek')

	const filters = readAdminFilters(url.searchParams)
	const adminData = await parent()

	if (!adminData.supabaseAvailable || !locals.supabase) {
		logAdminLoad('admin/pertek/+page.server', { state: 'unavailable' })
		return {
			unavailable: true,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary: adminData.summary ?? EMPTY_SUMMARY,
			result: createEmptyResult(filters.page, filters.pageSize),
			pertekStatusMetrics: EMPTY_PERTEK_STATUS_METRICS
		}
	}

	if (!adminData.isAdmin) {
		logAdminLoad('admin/pertek/+page.server', { state: 'forbidden', role: adminData.role })
		return {
			unavailable: false,
			requiresSupabaseAuth: true,
			errorMessage: null,
			filters,
			summary: adminData.summary ?? EMPTY_SUMMARY,
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

		const [result, totalPertekResult, selesaiPertekResult, ditolakPertekResult] = await Promise.all([
			listAntrianPengajuan(locals.supabase, {
				...filters,
				layanan: 'pertek'
			}),
			applyPertekMetricFilters(
				locals.supabase
					.from('antrian_pengajuan')
					.select('id', { count: 'exact', head: true })
					.eq('layanan', 'pertek')
			),
			applyPertekMetricFilters(
				locals.supabase
					.from('antrian_pengajuan')
					.select('id', { count: 'exact', head: true })
					.eq('layanan', 'pertek')
					.eq('status', 'SK Terbit')
			),
			applyPertekMetricFilters(
				locals.supabase
					.from('antrian_pengajuan')
					.select('id', { count: 'exact', head: true })
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

		logAdminLoad('admin/pertek/+page.server', {
			state: 'ok',
			page: filters.page,
			pageSize: filters.pageSize,
			total: result.total
		})

		return {
			unavailable: false,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary: adminData.summary,
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
			summary: adminData.summary ?? EMPTY_SUMMARY,
			result: createEmptyResult(filters.page, filters.pageSize),
			pertekStatusMetrics: EMPTY_PERTEK_STATUS_METRICS
		}
	}
}
