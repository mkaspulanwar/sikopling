export const LAYANAN_VALUES = ['dokling', 'pertek'] as const

export const STATUS_VALUES = [
	'Submit / Masuk',
	'Perbaikan Uji Administrasi',
	'Penjadwalan Rapat',
	'Drafting SK',
	'SK Terbit',
	'Belum Submit Perbaikan',
	'Uji Administrasi',
	'Ditolak',
	'Pasca Sidang',
	'Evaluasi Dokumen',
	'Hold',
	'Dikembalikan',
	'Penilaian KA'
] as const

export type Layanan = (typeof LAYANAN_VALUES)[number]
export type StatusPengajuan = (typeof STATUS_VALUES)[number]

