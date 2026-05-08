import { env as privateEnv } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '$lib/supabase/database.types'

type LayananType = 'perling' | 'pertek'
type MonitoringTable = 'monitoring_perling' | 'monitoring_pertek'

type PublicQueueRow = {
	registrationNo: string
	receivedDate: string
	agency: string
	activity: string
	documentType: string
	position: string
	progressStatus: string
	progressUpdatedDate: string
}

export type PublicIntegrationRow = {
	no: string
	instansi: string
	kegiatan: string
	jenis: string
	status: 'Uji admin' | 'Submit' | 'Ditolak' | 'SK/Rekomendasi'
	posisi: string
	tanggalUpdate: string
	keterangan: string
}

type PublicSummaryMetrics = {
	total: number
	selesai: number
}

type ServerFetch = typeof fetch

const LAYANAN_TABLE_MAP: Record<LayananType, MonitoringTable> = {
	perling: 'monitoring_perling',
	pertek: 'monitoring_pertek'
}

const resolveServiceClient = (serverFetch: ServerFetch) => {
	if (!publicEnv.PUBLIC_SUPABASE_URL || !privateEnv.SUPABASE_SERVICE_ROLE_KEY) return null
	const normalizedUrl = publicEnv.PUBLIC_SUPABASE_URL.trim()
		.replace(/\/+$/, '')
		.replace(/\/rest\/v1$/i, '')

	return createClient<Database>(normalizedUrl, privateEnv.SUPABASE_SERVICE_ROLE_KEY, {
		auth: { persistSession: false },
		global: { fetch: serverFetch }
	})
}

const asQueuePosition = (value: string | null): PublicQueueRow['position'] => {
	const normalized = value?.trim()
	if (!normalized) return 'Penyusun'
	if (normalized === 'Pemrakarsa' || normalized === 'Sekretariat TU' || normalized === 'Penyusun') {
		return normalized
	}
	return normalized
}

const mapPerlingStatus = (status: string): string => {
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

export const getPublicQueueRows = async (layanan: LayananType, serverFetch: ServerFetch): Promise<PublicQueueRow[]> => {
	const supabase = resolveServiceClient(serverFetch)
	if (!supabase) return []

	const tableName = LAYANAN_TABLE_MAP[layanan]
	const { data, error } = await supabase
		.from(tableName)
		.select('no_registrasi, tanggal_masuk, instansi, kegiatan, jenis_dokumen, posisi, status, tanggal_update')
		.order('tanggal_update', { ascending: false, nullsFirst: false })
		.limit(300)

	if (error) {
		console.error('Failed loading public queue rows:', error.message)
		return []
	}

	return (data ?? []).map((row) => ({
		registrationNo: row.no_registrasi ?? '-',
		receivedDate: row.tanggal_masuk ?? row.tanggal_update ?? new Date().toISOString().slice(0, 10),
		agency: row.instansi ?? '-',
		activity: row.kegiatan ?? '-',
		documentType: row.jenis_dokumen ?? '-',
		position: asQueuePosition(row.posisi),
		progressStatus: layanan === 'perling' ? mapPerlingStatus(row.status) : mapPertekStatus(row.status),
		progressUpdatedDate: row.tanggal_update ?? row.tanggal_masuk ?? new Date().toISOString().slice(0, 10)
	}))
}

export const getPublicIntegrationRows = async (serverFetch: ServerFetch): Promise<PublicIntegrationRow[]> => {
	const supabase = resolveServiceClient(serverFetch)
	if (!supabase) return []

	const { data, error } = await supabase
		.from('monitoring_integrasi')
		.select('no_registrasi, instansi, kegiatan, jenis_dokumen, status, posisi, tanggal_update, keterangan')
		.order('tanggal_update', { ascending: false, nullsFirst: false })
		.limit(300)

	if (error) {
		console.error('Failed loading public integration rows:', error.message)
		return []
	}

	const allowedStatuses: PublicIntegrationRow['status'][] = [
		'Uji admin',
		'Submit',
		'Ditolak',
		'SK/Rekomendasi'
	]

	return (data ?? []).map((row, index) => ({
		no: row.no_registrasi ?? String(index + 1),
		instansi: row.instansi ?? '-',
		kegiatan: row.kegiatan ?? '-',
		jenis: row.jenis_dokumen ?? '-',
		status: allowedStatuses.includes(row.status as PublicIntegrationRow['status'])
			? (row.status as PublicIntegrationRow['status'])
			: 'Submit',
		posisi: row.posisi ?? '-',
		tanggalUpdate: row.tanggal_update ?? new Date().toISOString().slice(0, 10),
		keterangan: row.keterangan ?? ''
	}))
}

export const getPublicSummaryMetrics = async (serverFetch: ServerFetch): Promise<PublicSummaryMetrics> => {
	const supabase = resolveServiceClient(serverFetch)
	if (!supabase) {
		return { total: 0, selesai: 0 }
	}

	const [perlingTotalResult, pertekTotalResult, perlingSelesaiResult, pertekSelesaiResult] = await Promise.all([
		supabase.from('monitoring_perling').select('id', { count: 'exact', head: true }),
		supabase.from('monitoring_pertek').select('id', { count: 'exact', head: true }),
		supabase.from('monitoring_perling').select('id', { count: 'exact', head: true }).eq('status', 'SK Terbit'),
		supabase.from('monitoring_pertek').select('id', { count: 'exact', head: true }).eq('status', 'SK Terbit')
	])

	if (perlingTotalResult.error || pertekTotalResult.error || perlingSelesaiResult.error || pertekSelesaiResult.error) {
		console.error(
			'Failed loading public summary metrics:',
			perlingTotalResult.error?.message ??
				pertekTotalResult.error?.message ??
				perlingSelesaiResult.error?.message ??
				pertekSelesaiResult.error?.message
		)
		return { total: 0, selesai: 0 }
	}

	return {
		total: (perlingTotalResult.count ?? 0) + (pertekTotalResult.count ?? 0),
		selesai: (perlingSelesaiResult.count ?? 0) + (pertekSelesaiResult.count ?? 0)
	}
}