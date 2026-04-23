export const LAYANAN_VALUES = ['dokling', 'pertek'] as const

export const STATUS_VALUES = [
	'Masuk',
	'Verifikasi',
	'Perbaikan',
	'Penjadwalan',
	'Pasca Sidang',
	'Selesai'
] as const

export type Layanan = (typeof LAYANAN_VALUES)[number]
export type StatusPengajuan = (typeof STATUS_VALUES)[number]
