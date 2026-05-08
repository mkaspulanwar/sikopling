import { STATUS_VALUES } from '$lib/supabase/constants'
import { isLayanan, requireAdminSupabase } from '$lib/server/admin-route'
import { listAntrianPengajuan } from '$lib/server/antrian-pengajuan'
import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const INTEGRATION_STATUSES = [
	'Submit',
	'Uji admin',
	'Ditolak',
	'SK/Rekomendasi',
	'Evaluasi Dokumen',
	'Verifikasi Integrasi',
	'Dikembalikan',
	'Selesai'
] as const

const escapeCsvValue = (value: string) => {
	if (!value.includes(',') && !value.includes('"') && !value.includes('\n')) return value
	return `"${value.replaceAll('"', '""')}"`
}

const toIntegrasiCsv = (
	rows: Array<{
		no_registrasi: string | null
		tanggal_masuk: string | null
		instansi: string | null
		kegiatan: string | null
		jenis_dokumen: string | null
		posisi: string | null
		status: string
		tanggal_update: string | null
		keterangan: string | null
	}>
) => {
	const header = [
		'no_registrasi',
		'tanggal_masuk',
		'instansi',
		'kegiatan',
		'jenis_dokumen',
		'posisi',
		'status',
		'tanggal_update',
		'keterangan'
	]

	const lines = rows.map((row) =>
		[
			row.no_registrasi,
			row.tanggal_masuk ?? '',
			row.instansi ?? '',
			row.kegiatan ?? '',
			row.jenis_dokumen ?? '',
			row.posisi ?? '',
			row.status,
			row.tanggal_update ?? '',
			row.keterangan ?? ''
		]
			.map((value) => escapeCsvValue(String(value)))
			.join(',')
	)

	return [header.join(','), ...lines].join('\n')
}

const toCsv = (
	rows: Array<{
		no_registrasi: string | null
		tanggal_masuk: string | null
		instansi: string | null
		kegiatan: string | null
		jenis_dokumen: string | null
		posisi: string | null
		status: string
		tanggal_update: string | null
	}>
) => {
	const header = [
		'no_registrasi',
		'tanggal_masuk',
		'instansi',
		'kegiatan',
		'jenis_dokumen',
		'posisi',
		'status',
		'tanggal_update'
	]

	const lines = rows.map((row) =>
		[
			row.no_registrasi,
			row.tanggal_masuk ?? '',
			row.instansi ?? '',
			row.kegiatan ?? '',
			row.jenis_dokumen ?? '',
			row.posisi ?? '',
			row.status,
			row.tanggal_update ?? ''
		]
			.map((value) => escapeCsvValue(String(value)))
			.join(',')
	)

	return [header.join(','), ...lines].join('\n')
}

const buildFileTimestamp = () => {
	const now = new Date()
	const year = now.getFullYear()
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')
	const hour = String(now.getHours()).padStart(2, '0')
	const minute = String(now.getMinutes()).padStart(2, '0')
	return `${year}${month}${day}-${hour}${minute}`
}

export const GET: RequestHandler = async ({ locals, params, url }) => {
	const auth = await requireAdminSupabase(locals)
	if (auth.state === 'unavailable') {
		throw error(503, 'Supabase belum dikonfigurasi')
	}
	if (auth.state === 'unauthorized') {
		throw error(401, 'Akses ditolak')
	}

	if (params.layanan === 'integrasi') {
		const keyword = url.searchParams.get('keyword')?.trim() || undefined
		const statusRaw = url.searchParams.get('status')
		const status = INTEGRATION_STATUSES.includes(
			statusRaw as (typeof INTEGRATION_STATUSES)[number]
		)
			? (statusRaw as (typeof INTEGRATION_STATUSES)[number])
			: undefined

		let query = auth.supabase
			.from('monitoring_integrasi')
			.select(
				'no_registrasi, tanggal_masuk, instansi, kegiatan, jenis_dokumen, posisi, status, tanggal_update, keterangan'
			)
			.order('tanggal_update', { ascending: false, nullsFirst: false })
			.order('created_at', { ascending: false, nullsFirst: false })

		if (status) {
			query = query.eq('status', status)
		}
		if (keyword) {
			const pattern = `%${keyword}%`
			query = query.or(
				`no_registrasi.ilike.${pattern},instansi.ilike.${pattern},kegiatan.ilike.${pattern},jenis_dokumen.ilike.${pattern},keterangan.ilike.${pattern}`
			)
		}

		const { data, error: queryError } = await query
		if (queryError) throw error(400, queryError.message)

		const csvContent = toIntegrasiCsv(data ?? [])
		const timestamp = buildFileTimestamp()

		return new Response(csvContent, {
			headers: {
				'content-type': 'text/csv; charset=utf-8',
				'content-disposition': `attachment; filename="${params.layanan}-export-${timestamp}.csv"`
			}
		})
	}

	if (!isLayanan(params.layanan)) {
		throw error(404, 'Layanan tidak ditemukan')
	}

	const keyword = url.searchParams.get('keyword')?.trim() || undefined
	const statusRaw = url.searchParams.get('status')
	const status = STATUS_VALUES.includes(statusRaw as (typeof STATUS_VALUES)[number])
		? (statusRaw as (typeof STATUS_VALUES)[number])
		: undefined

	const allRows: Awaited<ReturnType<typeof listAntrianPengajuan>>['data'] = []
	let page = 1
	let totalPages = 1

	while (page <= totalPages) {
		const result = await listAntrianPengajuan(auth.supabase, {
			page,
			pageSize: 100,
			layanan: params.layanan,
			keyword,
			status,
			sortBy: 'tanggal_update',
			sortOrder: 'desc'
		})

		totalPages = result.totalPages
		allRows.push(...result.data)
		page += 1
	}

	const csvContent = toCsv(allRows)
	const timestamp = buildFileTimestamp()

	return new Response(csvContent, {
		headers: {
			'content-type': 'text/csv; charset=utf-8',
			'content-disposition': `attachment; filename="${params.layanan}-export-${timestamp}.csv"`
		}
	})
}
