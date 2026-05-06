import type { PageServerLoad } from './$types'

export type IntegrationQueueRow = {
	no: string
	instansi: string
	kegiatan: string
	jenis: string
	status: 'Uji admin' | 'Submit' | 'Ditolak' | 'SK/Rekomendasi'
	posisi: string
	tanggalUpdate: string
	keterangan: string
}

const queueRows: IntegrationQueueRow[] = [
	{
		no: '1',
		instansi: 'PT Jaya Sentral Indo',
		kegiatan: 'Perhotelan (Pyramid Suites Hotel)',
		jenis: 'PKPLH',
		status: 'Uji admin',
		posisi: 'Penyusun',
		tanggalUpdate: '2025-10-20',
		keterangan: 'balik ke kab/kota'
	},
	{
		no: '2',
		instansi: 'PT Prodia Widyahusada',
		kegiatan: 'Laboratorium medis kelas pratama',
		jenis: 'PKPLH',
		status: 'Submit',
		posisi: 'Sekretariat',
		tanggalUpdate: '2025-11-21',
		keterangan: ''
	},
	{
		no: '3',
		instansi: 'PT Terranata Hotel Indonesia',
		kegiatan: 'Perhotelan (Fave hotel Banjarmasin)',
		jenis: 'PKPLH',
		status: 'Ditolak',
		posisi: 'Penyusun',
		tanggalUpdate: '2025-08-11',
		keterangan: 'balik ke kab/kota'
	},
	{
		no: '4',
		instansi: 'PT Artama Sentosa Indonesia',
		kegiatan: 'Pengumpulan Limbah B3',
		jenis: 'PKPLH',
		status: 'SK/Rekomendasi',
		posisi: 'Sekretariat',
		tanggalUpdate: '2025-11-10',
		keterangan: ''
	},
	{
		no: '5',
		instansi: 'PT Tribuana Mas',
		kegiatan: 'Perkebunan kelapa sawit dan pengolahan serta terminal khusus untuk kepentingan sendiri',
		jenis: 'SKKL',
		status: 'Uji admin',
		posisi: 'Penyusun',
		tanggalUpdate: '2026-01-23',
		keterangan: ''
	},
	{
		no: '6',
		instansi: 'Sungai Danau Jaya',
		kegiatan: 'Pertambangan',
		jenis: 'SKKL',
		status: 'Ditolak',
		posisi: 'Penyusun',
		tanggalUpdate: '2025-09-18',
		keterangan: ''
	},
	{
		no: '7',
		instansi: 'PT Pelabuhan Talenta Bumi',
		kegiatan: 'Pelabuhan',
		jenis: 'SKKL',
		status: 'SK/Rekomendasi',
		posisi: 'Penyusun',
		tanggalUpdate: '2025-12-31',
		keterangan: ''
	},
	{
		no: '8',
		instansi: 'Rimbun Hutan Mandiri',
		kegiatan: 'PBPH Hutan Alam dan Hutan',
		jenis: 'SKKL',
		status: 'SK/Rekomendasi',
		posisi: 'Penyusun',
		tanggalUpdate: '2025-12-17',
		keterangan: ''
	}
]

export const load: PageServerLoad = async () => ({
	queueRows
})
