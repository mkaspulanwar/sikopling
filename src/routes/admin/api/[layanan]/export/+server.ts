import { STATUS_VALUES } from '$lib/supabase/constants'
import { isLayanan, requireAdminSupabase } from '$lib/server/admin-route'
import { listAntrianPengajuan } from '$lib/server/antrian-pengajuan'
import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const escapeCsvValue = (value: string) => {
	if (!value.includes(',') && !value.includes('"') && !value.includes('\n')) return value
	return `"${value.replaceAll('"', '""')}"`
}

const toCsv = (
	rows: Array<{
		no_registrasi: string
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
	if (!isLayanan(params.layanan)) {
		throw error(404, 'Layanan tidak ditemukan')
	}

	const auth = await requireAdminSupabase(locals)
	if (auth.state === 'unavailable') {
		throw error(503, 'Supabase belum dikonfigurasi')
	}
	if (auth.state === 'unauthorized') {
		throw error(401, 'Akses ditolak')
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
