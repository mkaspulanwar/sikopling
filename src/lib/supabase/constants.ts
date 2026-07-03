export const LAYANAN_VALUES = ['perling', 'pertek'] as const

export const PERLING_AMDAL_STATUS_VALUES = [
	'Submit FKA',
	'Uji Administrasi FKA',
	'Perbaikan Uji Adminstrasi FKA',
	'Penjadwalan Rapat FKA',
	'Pasca Sidang FKA',
	'Submit Andal RKL-RPL',
	'Uji Administrasi Andal RKL-RPL',
	'Penjadwalan Rapat Teknis',
	'Penjadwalan Rapat Komisi',
	'Pasca Sidang Andal RKL-RPL',
	'Drafting SK',
	'SK Terbit'
] as const

export const PERLING_NON_AMDAL_STATUS_VALUES = [
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

export const PERLING_STATUS_VALUES = [
	...PERLING_AMDAL_STATUS_VALUES,
	'Submit / Masuk',
	'Perbaikan Uji Administrasi',
	'Penjadwalan Rapat',
	'Belum Submit Perbaikan',
	'Uji Administrasi',
	'Ditolak',
	'Pasca Sidang',
	'Evaluasi Dokumen',
	'Hold',
	'Dikembalikan',
	'Penilaian KA'
] as const

export const PERTEK_STATUS_VALUES = PERLING_NON_AMDAL_STATUS_VALUES

export const STATUS_VALUES = [...PERLING_STATUS_VALUES, ...PERTEK_STATUS_VALUES] as const

export const JENIS_PERLING_CATEGORY_VALUES = [
	'AMDAL',
	'UKL-UPL',
	'DELH',
	'DPLH',
	'Addendum',
	'Lainnya'
] as const

export const INTEGRASI_STATUS_VALUES = [
	'Submit',
	'Uji Admin',
	'Uji Substansi',
	'Drafting SK/Rekom',
	'SK/Rekom Terbit',
	'Ditolak',
	'Lainnya'
] as const

export type Layanan = (typeof LAYANAN_VALUES)[number]
export type JenisPerlingCategory = (typeof JENIS_PERLING_CATEGORY_VALUES)[number]
export type PerlingAmdalStatus = (typeof PERLING_AMDAL_STATUS_VALUES)[number]
export type PerlingNonAmdalStatus = (typeof PERLING_NON_AMDAL_STATUS_VALUES)[number]
export type PerlingStatus = (typeof PERLING_STATUS_VALUES)[number]
export type PertekStatus = (typeof PERTEK_STATUS_VALUES)[number]
export type StatusPengajuan = (typeof STATUS_VALUES)[number]
export type IntegrasiStatus = (typeof INTEGRASI_STATUS_VALUES)[number]

export const STATUS_VALUES_BY_LAYANAN = {
	perling: PERLING_STATUS_VALUES,
	pertek: PERTEK_STATUS_VALUES
} as const satisfies Record<Layanan, readonly StatusPengajuan[]>

export const isStatusPengajuan = (value: string): value is StatusPengajuan =>
	(STATUS_VALUES as readonly string[]).includes(value)

export const isStatusPengajuanForLayanan = (
	layanan: Layanan,
	value: string
): value is StatusPengajuan =>
	(STATUS_VALUES_BY_LAYANAN[layanan] as readonly string[]).includes(value)

export const isAmdalJenisPerling = (value: string | null | undefined) => {
	const normalized = value?.trim().toLowerCase()
	return Boolean(normalized?.includes('amdal') || normalized?.includes('andal'))
}

export const getPerlingStatusValuesForJenis = (
	jenisPerling: string | null | undefined
): readonly StatusPengajuan[] =>
	isAmdalJenisPerling(jenisPerling)
		? PERLING_AMDAL_STATUS_VALUES
		: PERLING_NON_AMDAL_STATUS_VALUES

export const isPerlingStatusValidForJenis = (
	jenisPerling: string | null | undefined,
	status: string
): status is StatusPengajuan =>
	(getPerlingStatusValuesForJenis(jenisPerling) as readonly string[]).includes(status)
