import { isAnnouncementType, listAllAnnouncementRows } from '$lib/server/admin-announcements'
import { requireAdminSupabase } from '$lib/server/admin-route'
import { error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const escapeCsvValue = (value: string) => {
	if (!value.includes(',') && !value.includes('"') && !value.includes('\n')) return value
	return `"${value.replaceAll('"', '""')}"`
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
	if (auth.state === 'unavailable') throw error(503, 'Supabase belum dikonfigurasi')
	if (auth.state === 'unauthorized') throw error(401, 'Akses ditolak')
	if (!isAnnouncementType(params.type)) throw error(404, 'Jenis pengumuman tidak ditemukan')

	const rows = await listAllAnnouncementRows(auth.supabase, {
		type: params.type,
		keyword: url.searchParams.get('keyword')?.trim() || undefined,
		sortBy: url.searchParams.get('sortBy') ?? undefined,
		sortOrder: url.searchParams.get('sortOrder') ?? undefined
	})

	const header = ['instansi', 'kegiatan', 'no_sk', 'tanggal']
	const lines = rows.map((row) =>
		[row.instansi ?? '', row.kegiatan ?? '', row.no_sk ?? '', row.tanggal ?? '']
			.map((value) => escapeCsvValue(String(value)))
			.join(',')
	)
	const csv = [header.join(','), ...lines].join('\n')
	const timestamp = buildFileTimestamp()

	return new Response(csv, {
		headers: {
			'content-type': 'text/csv; charset=utf-8',
			'content-disposition': `attachment; filename="penerbitan-${params.type}-export-${timestamp}.csv"`
		}
	})
}
