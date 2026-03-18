import type { PublicSubmission, PublicStatusKey } from '$lib/data/public-model';

export interface HomepageStat {
	label: string;
	value: string;
	description: string;
	status?: PublicStatusKey;
}

export const HOMEPAGE_AS_OF = '17 Maret 2026, 09:40 WITA';

export const HOMEPAGE_STATS: HomepageStat[] = [
	{
		label: 'Total pengajuan aktif',
		value: '148',
		description: 'Pengajuan yang masih berjalan di seluruh wilayah'
	},
	{
		label: 'Dalam penilaian teknis',
		value: '37',
		description: 'Berkas sedang ditelaah oleh tim teknis',
		status: 'penilaian_teknis'
	},
	{
		label: 'Perlu perbaikan',
		value: '19',
		description: 'Pengajuan menunggu tindak lanjut perbaikan',
		status: 'perlu_perbaikan'
	},
	{
		label: 'Disetujui bulan ini',
		value: '26',
		description: 'Persetujuan yang terbit sejak 1 Maret 2026',
		status: 'disetujui'
	}
];

export const QUICK_FILTERS = [
	'Semua Status',
	'Pemeriksaan Awal',
	'Penilaian Teknis',
	'Perlu Perbaikan',
	'Disetujui'
];

export const LATEST_SUBMISSIONS: PublicSubmission[] = [
	{
		registerId: 'SLP-AMDAL-2026-0148',
		companyName: 'PT Bumi Tirta Lestari',
		region: 'Kabupaten Gowa, Sulawesi Selatan',
		activityType: 'Instalasi pengolahan air baku',
		documentType: 'AMDAL',
		status: 'penilaian_teknis',
		activeStage: 'Telaah substansi dokumen',
		lastUpdated: '16 Maret 2026',
		progressSummary: 'Dokumen dinilai tim teknis dan menunggu hasil rapat penilaian.',
		history: [
			{
				stage: 'Pendaftaran',
				date: '02 Maret 2026',
				note: 'Nomor register diterbitkan.'
			},
			{
				stage: 'Pemeriksaan Awal',
				date: '07 Maret 2026',
				note: 'Administrasi lengkap dan diteruskan ke tahap teknis.'
			},
			{
				stage: 'Penilaian Teknis',
				date: '16 Maret 2026',
				note: 'Sedang dalam pembahasan tim teknis.'
			}
		]
	},
	{
		registerId: 'SLP-UKLUPL-2026-0113',
		companyName: 'PT Pesisir Energi Nusantara',
		region: 'Kota Makassar, Sulawesi Selatan',
		activityType: 'Terminal penyimpanan bahan bakar',
		documentType: 'UKL-UPL',
		status: 'perlu_perbaikan',
		activeStage: 'Revisi dokumen pemantauan',
		lastUpdated: '15 Maret 2026',
		progressSummary: 'Perusahaan diminta melengkapi rencana pemantauan kualitas udara.',
		history: [
			{
				stage: 'Pendaftaran',
				date: '27 Februari 2026',
				note: 'Berkas masuk ke sistem layanan.'
			},
			{
				stage: 'Pemeriksaan Awal',
				date: '04 Maret 2026',
				note: 'Dokumen administrasi dinyatakan lengkap.'
			},
			{
				stage: 'Penilaian Teknis',
				date: '15 Maret 2026',
				note: 'Tim meminta perbaikan dokumen.'
			}
		]
	},
	{
		registerId: 'SLP-AMDAL-2026-0096',
		companyName: 'PT Sawit Karya Timur',
		region: 'Kabupaten Bone, Sulawesi Selatan',
		activityType: 'Pengembangan kebun kelapa sawit',
		documentType: 'AMDAL',
		status: 'disetujui',
		activeStage: 'Tahap selesai',
		lastUpdated: '14 Maret 2026',
		progressSummary: 'Persetujuan lingkungan telah diterbitkan setelah seluruh tahapan selesai.',
		history: [
			{
				stage: 'Pendaftaran',
				date: '09 Februari 2026',
				note: 'Nomor register aktif.'
			},
			{
				stage: 'Pemeriksaan Awal',
				date: '13 Februari 2026',
				note: 'Administrasi dokumen dinyatakan lengkap.'
			},
			{
				stage: 'Penilaian Teknis',
				date: '01 Maret 2026',
				note: 'Seluruh catatan teknis telah dipenuhi.'
			},
			{
				stage: 'Keputusan',
				date: '14 Maret 2026',
				note: 'Persetujuan diterbitkan.'
			}
		]
	}
];

export const FAQ_ITEMS = [
	{
		question: 'Apa arti status Perlu Perbaikan?',
		answer:
			'Status ini berarti dokumen sudah diperiksa dan ada bagian yang harus dilengkapi sebelum proses dilanjutkan.'
	},
	{
		question: 'Seberapa sering data diperbarui?',
		answer:
			'Data publik diperbarui berkala dari sistem internal dinas. Waktu pembaruan terakhir selalu ditampilkan di portal.'
	},
	{
		question: 'Apakah seluruh dokumen bisa diunduh oleh publik?',
		answer:
			'Portal ini menampilkan status dan ringkasan progres publik. Dokumen detail mengikuti ketentuan keterbukaan informasi yang berlaku.'
	}
];
