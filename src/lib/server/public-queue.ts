import { env as privateEnv } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '$lib/supabase/database.types'

type LayananType = 'dokling' | 'pertek'

type PublicQueueRow = {
	registrationNo: string
	receivedDate: string
	agency: string
	activity: string
	documentType: string
	position: 'Penyusun' | 'Pemrakarsa' | 'Sekretariat TU'
	progressStatus: string
	progressUpdatedDate: string
}

const resolveServiceClient = () => {
	if (!publicEnv.PUBLIC_SUPABASE_URL || !privateEnv.SUPABASE_SERVICE_ROLE_KEY) return null
	const normalizedUrl = publicEnv.PUBLIC_SUPABASE_URL.trim()
		.replace(/\/+$/, '')
		.replace(/\/rest\/v1$/i, '')

	return createClient<Database>(normalizedUrl, privateEnv.SUPABASE_SERVICE_ROLE_KEY, {
		auth: { persistSession: false }
	})
}

const asQueuePosition = (value: string | null): PublicQueueRow['position'] => {
	if (value === 'Pemrakarsa' || value === 'Sekretariat TU') return value
	return 'Penyusun'
}

const mapDoklingStatus = (status: string): string => {
	switch (status) {
		case 'Submit / Masuk':
		case 'Masuk':
			return 'Submit'
		case 'Penilaian KA':
		case 'Verifikasi':
			return 'Penilaian KA'
		case 'Perbaikan Uji Administrasi':
		case 'Perbaikan':
			return 'Perbaikan Uji Administrasi'
		case 'Penjadwalan Rapat':
		case 'Penjadwalan':
			return 'Penjadwalan Rapat'
		case 'Pasca Sidang':
			return 'Pasca Sidang'
		case 'Dikembalikan':
			return 'Dikembalikan'
		case 'Ditolak':
			return 'Ditolak'
		case 'Belum Submit Perbaikan':
			return 'Perbaikan Uji Administrasi'
		case 'Uji Administrasi':
			return 'Penilaian KA'
		case 'Selesai':
		case 'SK Terbit':
			return 'SK terbit'
		default:
			return 'Submit'
	}
}

const mapPertekStatus = (status: string): string => {
	switch (status) {
		case 'Submit / Masuk':
		case 'Masuk':
			return 'Submit'
		case 'Evaluasi Dokumen':
		case 'Verifikasi':
			return 'Evaluasi Dokumen'
		case 'Perbaikan Uji Administrasi':
		case 'Perbaikan':
			return 'Perbaikan Uji Administrasi'
		case 'Penjadwalan Rapat':
		case 'Penjadwalan':
			return 'Penjadwalan Rapat'
		case 'Dikembalikan':
			return 'Dikembalikan'
		case 'Ditolak':
			return 'Dikembalikan'
		case 'Belum Submit Perbaikan':
			return 'Perbaikan Uji Administrasi'
		case 'Uji Administrasi':
			return 'Evaluasi Dokumen'
		case 'Pasca Sidang':
			return 'Penjadwalan Rapat'
		case 'Hold':
			return 'Evaluasi Dokumen'
		case 'Drafting SK':
			return 'Evaluasi Dokumen'
		case 'Penilaian KA':
			return 'Evaluasi Dokumen'
		case 'Selesai':
		case 'SK Terbit':
			return 'Evaluasi Dokumen'
		default:
			return 'Submit'
	}
}

export const getPublicQueueRows = async (layanan: LayananType): Promise<PublicQueueRow[]> => {
	const supabase = resolveServiceClient()
	if (!supabase) return []

	const { data, error } = await supabase
		.from('antrian_pengajuan')
		.select('no_registrasi, tanggal_masuk, instansi, kegiatan, jenis_dokumen, posisi, status, tanggal_update')
		.eq('layanan', layanan)
		.order('tanggal_update', { ascending: false, nullsFirst: false })
		.limit(300)

	if (error) {
		console.error('Failed loading public queue rows:', error.message)
		return []
	}

	return (data ?? []).map((row) => ({
		registrationNo: row.no_registrasi,
		receivedDate: row.tanggal_masuk ?? row.tanggal_update ?? new Date().toISOString().slice(0, 10),
		agency: row.instansi ?? '-',
		activity: row.kegiatan ?? '-',
		documentType: row.jenis_dokumen ?? '-',
		position: asQueuePosition(row.posisi),
		progressStatus: layanan === 'dokling' ? mapDoklingStatus(row.status) : mapPertekStatus(row.status),
		progressUpdatedDate: row.tanggal_update ?? row.tanggal_masuk ?? new Date().toISOString().slice(0, 10)
	}))
}

