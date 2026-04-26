import { LAYANAN_VALUES, STATUS_VALUES } from '$lib/supabase/constants'
import { requireAdminSupabase } from '$lib/server/admin-route'
import {
	getAntrianPengajuanSummary,
	getWorkflowHistoryByPengajuanIds,
	listAntrianPengajuan
} from '$lib/server/antrian-pengajuan'
import type { PageServerLoad } from './$types'

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

const readNumber = (value: string | null, fallback: number) => {
	if (!value) return fallback
	const parsed = Number(value)
	if (!Number.isFinite(parsed)) return fallback
	return parsed
}

const readString = (value: string | null) => {
	if (!value) return undefined
	const trimmed = value.trim()
	return trimmed.length > 0 ? trimmed : undefined
}

const readDate = (value: string | null) => {
	if (!value) return undefined
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
	return value
}

const readSortBy = (value: string | null) => {
	if (!value) return 'tanggal_update'
	return SORTABLE_COLUMNS.includes(value as (typeof SORTABLE_COLUMNS)[number])
		? (value as (typeof SORTABLE_COLUMNS)[number])
		: 'tanggal_update'
}

const readSortOrder = (value: string | null): 'asc' | 'desc' => (value === 'asc' ? 'asc' : 'desc')
export const load: PageServerLoad = async ({ locals, url }) => {
	const query = url.searchParams

	const filters = {
		page: Math.max(1, Math.floor(readNumber(query.get('page'), 1))),
		pageSize: Math.min(100, Math.max(10, Math.floor(readNumber(query.get('pageSize'), 20)))),
		layanan: LAYANAN_VALUES.includes(query.get('layanan') as 'dokling' | 'pertek')
			? (query.get('layanan') as 'dokling' | 'pertek')
			: undefined,
		status: STATUS_VALUES.includes(query.get('status') as (typeof STATUS_VALUES)[number])
			? (query.get('status') as (typeof STATUS_VALUES)[number])
			: undefined,
		instansi: readString(query.get('instansi')),
		jenisDokumen: readString(query.get('jenisDokumen')),
		tanggalMulai: readDate(query.get('tanggalMulai')),
		tanggalSelesai: readDate(query.get('tanggalSelesai')),
		keyword: readString(query.get('keyword')),
		sortBy: readSortBy(query.get('sortBy')),
		sortOrder: readSortOrder(query.get('sortOrder'))
	}

	const auth = await requireAdminSupabase(locals)
	if (auth.state === 'unavailable') {
		return {
			unavailable: true,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary: {
				total: 0,
				pending: 0,
				selesai: 0,
				dokling: 0,
				pertek: 0
			},
			result: {
				data: [],
				total: 0,
				page: filters.page,
				pageSize: filters.pageSize,
				totalPages: 1
			},
			historyByPengajuan: {}
		}
	}

	if (auth.state === 'unauthorized') {
		return {
			unavailable: false,
			requiresSupabaseAuth: true,
			errorMessage: null,
			filters,
			summary: {
				total: 0,
				pending: 0,
				selesai: 0,
				dokling: 0,
				pertek: 0
			},
			result: {
				data: [],
				total: 0,
				page: filters.page,
				pageSize: filters.pageSize,
				totalPages: 1
			},
			historyByPengajuan: {}
		}
	}

	try {
		const [result, summary] = await Promise.all([
			listAntrianPengajuan(auth.supabase, filters),
			getAntrianPengajuanSummary(auth.supabase)
		])
		const historyByPengajuan = await getWorkflowHistoryByPengajuanIds(
			auth.supabase,
			result.data.map((row) => row.id)
		)

		return {
			unavailable: false,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary,
			result,
			historyByPengajuan
		}
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Gagal memuat data pengajuan'
		return {
			unavailable: false,
			requiresSupabaseAuth: false,
			errorMessage: message,
			filters,
			summary: {
				total: 0,
				pending: 0,
				selesai: 0,
				dokling: 0,
				pertek: 0
			},
			result: {
				data: [],
				total: 0,
				page: filters.page,
				pageSize: filters.pageSize,
				totalPages: 1
			},
			historyByPengajuan: {}
		}
	}
}
