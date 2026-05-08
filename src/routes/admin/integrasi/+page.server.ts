import {
	EMPTY_SUMMARY,
	createEmptyResult,
	logAdminLoad,
	readAdminFilters
} from '$lib/server/admin-route'
import { listMonitoringIntegrasi } from '$lib/server/monitoring-integrasi'
import { INTEGRASI_STATUS_VALUES, type IntegrasiStatus } from '$lib/supabase/constants'
import type { PageServerLoad } from './$types'

const EMPTY_INTEGRASI_STATUS_METRICS = {
	total: 0,
	selesai: 0,
	diproses: 0,
	ditolak: 0
}
const PAGE_SIZE_OPTIONS = [5, 10, 20] as const
const DEFAULT_PAGE_SIZE = 10

const normalizeIntegrasiPageSize = (value: string | null) => {
	const parsed = Number(value)
	if (!Number.isFinite(parsed)) return DEFAULT_PAGE_SIZE
	const sanitized = Math.floor(parsed)
	return PAGE_SIZE_OPTIONS.includes(sanitized as (typeof PAGE_SIZE_OPTIONS)[number])
		? sanitized
		: DEFAULT_PAGE_SIZE
}

const readIntegrasiStatus = (value: string | null) =>
	INTEGRASI_STATUS_VALUES.includes(value as IntegrasiStatus) ? (value as IntegrasiStatus) : undefined

export const load: PageServerLoad = async ({ locals, url, parent, depends }) => {
	depends('admin:integrasi')

	const baseFilters = readAdminFilters(url.searchParams)
	const filters = {
		...baseFilters,
		status: readIntegrasiStatus(url.searchParams.get('status')),
		pageSize: normalizeIntegrasiPageSize(url.searchParams.get('pageSize'))
	}
	const adminData = await parent()

	if (!adminData.supabaseAvailable || !locals.supabase) {
		logAdminLoad('admin/integrasi/+page.server', { state: 'unavailable' })
		return {
			unavailable: true,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary: adminData.summary ?? EMPTY_SUMMARY,
			result: createEmptyResult(filters.page, filters.pageSize),
			integrasiStatusMetrics: EMPTY_INTEGRASI_STATUS_METRICS
		}
	}

	if (!adminData.isAdmin) {
		logAdminLoad('admin/integrasi/+page.server', { state: 'forbidden', role: adminData.role })
		return {
			unavailable: false,
			requiresSupabaseAuth: true,
			errorMessage: null,
			filters,
			summary: adminData.summary ?? EMPTY_SUMMARY,
			result: createEmptyResult(filters.page, filters.pageSize),
			integrasiStatusMetrics: EMPTY_INTEGRASI_STATUS_METRICS
		}
	}

	try {
		const applyIntegrasiMetricFilters = (query: any) => {
			let nextQuery = query

			if (filters.status) {
				nextQuery = nextQuery.eq('status', filters.status)
			}

			if (filters.keyword?.trim()) {
				const keyword = `%${filters.keyword.trim()}%`
				nextQuery = nextQuery.or(
					`instansi.ilike.${keyword},kegiatan.ilike.${keyword},jenis_integrasi.ilike.${keyword},posisi.ilike.${keyword},keterangan.ilike.${keyword}`
				)
			}

			return nextQuery
		}

		const [result, totalIntegrasiResult, selesaiIntegrasiResult, ditolakIntegrasiResult] =
			await Promise.all([
				listMonitoringIntegrasi(locals.supabase, {
					page: filters.page,
					pageSize: filters.pageSize,
					keyword: filters.keyword,
					status: filters.status,
					sortBy: filters.sortBy as never,
					sortOrder: filters.sortOrder
				}),
				applyIntegrasiMetricFilters(
					locals.supabase
						.from('monitoring_integrasi')
						.select('id', { count: 'exact', head: true })
				),
				applyIntegrasiMetricFilters(
					locals.supabase
						.from('monitoring_integrasi')
						.select('id', { count: 'exact', head: true })
						.eq('status', 'SK/Rekom Terbit')
				),
				applyIntegrasiMetricFilters(
					locals.supabase
						.from('monitoring_integrasi')
						.select('id', { count: 'exact', head: true })
						.eq('status', 'Ditolak')
				)
			])

		if (totalIntegrasiResult.error) throw totalIntegrasiResult.error
		if (selesaiIntegrasiResult.error) throw selesaiIntegrasiResult.error
		if (ditolakIntegrasiResult.error) throw ditolakIntegrasiResult.error

		const total = totalIntegrasiResult.count ?? 0
		const selesai = selesaiIntegrasiResult.count ?? 0
		const ditolak = ditolakIntegrasiResult.count ?? 0
		const diproses = Math.max(total - selesai - ditolak, 0)

		logAdminLoad('admin/integrasi/+page.server', {
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
			integrasiStatusMetrics: {
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
			errorMessage: error instanceof Error ? error.message : 'Gagal memuat data integrasi',
			filters,
			summary: adminData.summary ?? EMPTY_SUMMARY,
			result: createEmptyResult(filters.page, filters.pageSize),
			integrasiStatusMetrics: EMPTY_INTEGRASI_STATUS_METRICS
		}
	}
}
