import {
	getActiveStageLabel,
	mapInternalStatusToPublic,
	type PublicStatusKey,
	type PublicSubmission
} from '$lib/data/public-model';

interface RawSheetEntry {
	registerId: string;
	receivedDate: string;
	companyName: string;
	activityType: string;
	documentType: string;
	internalStatus: string;
	updatedDate: string;
	notes: string;
}

export interface PublicCatalogSubmission extends PublicSubmission {
	receivedDate: string;
	internalStatus: string;
	activityCategory: string;
}

export const SHEET_SOURCE_LABEL =
	'Monitoring Pelayanan Persetujuan Lingkungan - Sheet1 (Dinas Lingkungan)';
export const SHEET_LAST_SYNC = '17 Maret 2026';

const RAW_SHEET_ENTRIES: RawSheetEntry[] = [
	{
		registerId: '681195DAEA4DD',
		receivedDate: '22/07/2025',
		companyName: 'PT Sumber Jaya Silika',
		activityType: 'Pertambangan mineral bukan logam jenis tertentu (pasir kuarsa)',
		documentType: 'ANDAL',
		internalStatus: 'Perbaikan Uji Adminstrasi',
		updatedDate: '19/09/2025',
		notes: 'Tidak ada update'
	},
	{
		registerId: '68A929AEDE796',
		receivedDate: '12/09/2025',
		companyName: 'Dinas PUPR Prov Kalsel',
		activityType: 'Pengembangan Jalan Ruas Banjar – Batulicin',
		documentType: 'ANDAL',
		internalStatus: 'SK terbit',
		updatedDate: '13/01/2026',
		notes: 'Nomor SK: 100.3.3.1/0104/KUM/2026'
	},
	{
		registerId: '6840386922FE9',
		receivedDate: '19/09/2025',
		companyName: 'Dinas PUPR Prov Kalsel',
		activityType: 'Pembangunan SPAM Regional Tanah Bumbu-Kotabaru',
		documentType: 'ANDAL',
		internalStatus: 'Pasca Sidang',
		updatedDate: '13/02/2026',
		notes: 'Menunggu tindak lanjut hasil sidang'
	},
	{
		registerId: '68F101D0015F2',
		receivedDate: '20/10/2025',
		companyName: 'Dinas PUPR Prov Kalsel',
		activityType:
			'Pembangunan dan peningkatan ruas Jalan Lintas Tengah Pulau Laut di Kabupaten Kotabaru',
		documentType: 'ANDAL',
		internalStatus: 'SK terbit',
		updatedDate: '29/12/2025',
		notes: 'Nomor SK: 100.3.3.1/0103/KUM/2026'
	},
	{
		registerId: '6911F57775BE4',
		receivedDate: '06/02/2026',
		companyName: 'RSUD Datu Kandang Haji',
		activityType: 'Rumah Sakit Umum Daerah Datu Kandang Haji Balangan',
		documentType: 'ANDAL',
		internalStatus: 'Penilaian KA',
		updatedDate: '02/03/2026',
		notes: 'Penilaian oleh TUK Provinsi'
	},
	{
		registerId: '68770DDD182BA',
		receivedDate: '24/07/2025',
		companyName: 'PT Smart Unit Tarjun',
		activityType:
			'Penambahan fasilitas industri pengolahan minyak mentah kelapa sawit (CPO/CPKO) beserta produk turunan',
		documentType: 'ADDENDUM',
		internalStatus: 'SK terbit',
		updatedDate: '02/01/2026',
		notes: 'Nomor SK: 100.3.3.1/01145/KUM/2025'
	},
	{
		registerId: 'DELH-2025-001',
		receivedDate: '01/09/2025',
		companyName: 'Dinas PUPR Kabupaten Hulu Sungai Tengah',
		activityType: 'DELH pembangunan Kolam Regulasi Murakata Kabupaten Hulu Sungai Tengah',
		documentType: 'DELH',
		internalStatus: 'Penjadwalan Rapat',
		updatedDate: '04/03/2026',
		notes: 'Menunggu jadwal rapat penilaian'
	},
	{
		registerId: '678F570AE3625',
		receivedDate: '23/05/2025',
		companyName: 'PT Laterite Sukses Makmur',
		activityType: 'Penambangan tanah urug',
		documentType: 'UKL-UPL',
		internalStatus: 'Perbaikan Uji Adminstrasi',
		updatedDate: '18/06/2025',
		notes: 'Tidak ada update'
	},
	{
		registerId: '67E206A7C490B',
		receivedDate: '22/10/2025',
		companyName: 'PT Batu Gunung Mulia',
		activityType: 'Pertambangan batuan komoditas batu gunung',
		documentType: 'UKL-UPL',
		internalStatus: 'Dikembalikan',
		updatedDate: '13/01/2026',
		notes: 'Dokumen dikembalikan untuk penyesuaian'
	},
	{
		registerId: '690B028F8A72E',
		receivedDate: '21/11/2025',
		companyName: 'PT Bintang Albar Indonesia',
		activityType: 'Pengumpul limbah B3',
		documentType: 'UKL-UPL',
		internalStatus: 'Perbaikan Uji Adminstrasi',
		updatedDate: '09/12/2025',
		notes: 'Menunggu perbaikan administrasi'
	},
	{
		registerId: '692DF48A5CC25',
		receivedDate: '03/12/2025',
		companyName: 'CV Berkah Citra Putri',
		activityType: 'Pertambangan batuan komoditas batu gunung',
		documentType: 'UKL-UPL',
		internalStatus: 'SK terbit',
		updatedDate: '19/01/2026',
		notes: 'Nomor SK: 188.4/46/DLH/2026'
	},
	{
		registerId: '6932D1C8A8EE8',
		receivedDate: '15/12/2025',
		companyName: 'CV Mitra Resolution Group (MRG)',
		activityType: 'Pertambangan batuan komoditas tanah urug',
		documentType: 'UKL-UPL',
		internalStatus: 'Pasca Sidang',
		updatedDate: '29/01/2026',
		notes: 'Tahap pasca sidang berjalan'
	},
	{
		registerId: '67DD72DF071D1',
		receivedDate: '18/12/2025',
		companyName: 'CV Adiraja Borneo Mandiri',
		activityType: 'Pertambangan pasir dan batu',
		documentType: 'UKL-UPL',
		internalStatus: 'Ditolak',
		updatedDate: '05/01/2026',
		notes: 'Penapisan ulang diperlukan untuk menentukan jenis dokumen'
	},
	{
		registerId: '693A54F43C3B1',
		receivedDate: '06/01/2026',
		companyName: 'CV Berdikari',
		activityType: 'Pertambangan batu gunung quarry besar',
		documentType: 'UKL-UPL',
		internalStatus: 'Perbaikan Uji Adminstrasi',
		updatedDate: '09/01/2026',
		notes: 'Perlu perbaikan administrasi'
	},
	{
		registerId: '6949E57B46E5A',
		receivedDate: '06/01/2026',
		companyName: 'PT Dorisfa Gunung Mulia',
		activityType: 'Pertambangan batuan komoditas batu gunung',
		documentType: 'UKL-UPL',
		internalStatus: 'Perbaikan Uji Adminstrasi',
		updatedDate: '09/01/2026',
		notes: 'Perlu perbaikan administrasi'
	},
	{
		registerId: '694E319E24CD2',
		receivedDate: '08/01/2026',
		companyName: 'CV Gunung Mitra Utama',
		activityType: 'Pertambangan batuan komoditas batu gunung',
		documentType: 'UKL-UPL',
		internalStatus: 'Perbaikan Uji Adminstrasi',
		updatedDate: '09/01/2026',
		notes: 'Perlu perbaikan administrasi'
	},
	{
		registerId: '69004AD0BFEC4',
		receivedDate: '22/01/2026',
		companyName: 'CV Andersit Kita Bersama',
		activityType: 'Pertambangan batu gamping',
		documentType: 'UKL-UPL',
		internalStatus: 'Perbaikan Uji Adminstrasi',
		updatedDate: '03/02/2026',
		notes: 'Perlu perbaikan administrasi'
	},
	{
		registerId: '67FF7A190CABA',
		receivedDate: '24/01/2026',
		companyName: 'PT Borneo Silika Pasifik',
		activityType: 'Pertambangan pasir kuarsa',
		documentType: 'UKL-UPL',
		internalStatus: 'Ditolak',
		updatedDate: '06/02/2026',
		notes: 'Perlu ubah FS sesuai kapasitas produksi'
	},
	{
		registerId: '697E1B5B25775',
		receivedDate: '01/02/2026',
		companyName: 'PT Nusa Meta Alam',
		activityType: 'Eksplorasi batubara',
		documentType: 'UKL-UPL',
		internalStatus: 'Ditolak',
		updatedDate: '03/02/2026',
		notes: 'Kewenangan Kabupaten/Kota'
	},
	{
		registerId: '68F3A75703DB5',
		receivedDate: '06/02/2026',
		companyName: 'CV Karya Intan Permata',
		activityType: 'Pertambangan batuan komoditas batu gunung',
		documentType: 'UKL-UPL',
		internalStatus: 'Perbaikan Uji Adminstrasi',
		updatedDate: '20/02/2026',
		notes: 'Perlu perbaikan administrasi'
	},
	{
		registerId: '69920C39D667C',
		receivedDate: '27/02/2026',
		companyName: 'CV Adiraja Borneo Mandiri',
		activityType: 'Pertambangan pasir dan batu',
		documentType: 'UKL-UPL',
		internalStatus: 'Perbaikan Uji Adminstrasi',
		updatedDate: '04/03/2026',
		notes: 'Perlu perbaikan administrasi'
	},
	{
		registerId: 'PERTEK-AIR-2025-001',
		receivedDate: '21/07/2025',
		companyName: 'PT Dorisfa Gunung Mulia',
		activityType: 'Pertambangan batuan komoditas batu gunung',
		documentType: 'PERTEK AIR',
		internalStatus: 'Evaluasi Dokumen',
		updatedDate: '02/01/2026',
		notes: 'Evaluasi dokumen pertek air'
	},
	{
		registerId: 'PERTEK-AIR-2025-002',
		receivedDate: '24/12/2025',
		companyName: 'PT Borneo Silica Pasifik',
		activityType: 'Pertambangan galian C (kuarsa/pasir kuarsa)',
		documentType: 'PERTEK AIR',
		internalStatus: 'Penjadwalan Rapat',
		updatedDate: '28/01/2026',
		notes: 'Menunggu jadwal rapat'
	},
	{
		registerId: 'PERTEK-AIR-2025-003',
		receivedDate: '17/11/2025',
		companyName: 'PT Batu Sama Rangga',
		activityType: 'Pertambangan batuan komoditas batu gunung',
		documentType: 'PERTEK AIR',
		internalStatus: 'Evaluasi Dokumen',
		updatedDate: '29/01/2026',
		notes: 'Evaluasi dokumen pertek air'
	},
	{
		registerId: 'PERTEK-AIR-2025-004',
		receivedDate: '24/12/2025',
		companyName: 'PT Rahman Berkah Parazakian',
		activityType: 'Pertambangan galian C (kuarsa/pasir kuarsa)',
		documentType: 'PERTEK AIR',
		internalStatus: 'Dikembalikan',
		updatedDate: '29/01/2026',
		notes: 'Dokumen dikembalikan untuk penyesuaian'
	},
	{
		registerId: 'PERTEK-AIR-2025-005',
		receivedDate: '30/12/2025',
		companyName: 'CV Karya Intan Permata',
		activityType: 'Pertambangan batuan komoditas batu gunung',
		documentType: 'PERTEK AIR',
		internalStatus: 'Dikembalikan',
		updatedDate: '29/01/2026',
		notes: 'Dokumen dikembalikan untuk penyesuaian'
	},
	{
		registerId: 'PERTEK-AIR-2025-006',
		receivedDate: '10/12/2025',
		companyName: 'CV Adiraja Borneo Mandiri',
		activityType: 'Pertambangan pasir dan batu',
		documentType: 'PERTEK AIR',
		internalStatus: 'Dikembalikan',
		updatedDate: '11/03/2026',
		notes: 'Dokumen dikembalikan untuk penyesuaian'
	},
	{
		registerId: 'PERTEK-AIR-2026-007',
		receivedDate: '20/01/2026',
		companyName: 'PT Armas Mujur Alazaran',
		activityType: 'Pertambangan tanah urug',
		documentType: 'PERTEK AIR',
		internalStatus: 'Submit/Masuk',
		updatedDate: '10/02/2026',
		notes: 'Berkas masuk untuk pemeriksaan'
	},
	{
		registerId: 'PERTEK-AIR-2026-008',
		receivedDate: '26/01/2026',
		companyName: 'PT Rizky Perdana Grup',
		activityType: 'Penggalian batu hias dan batu bangunan',
		documentType: 'PERTEK AIR',
		internalStatus: 'Submit/Masuk',
		updatedDate: '03/02/2026',
		notes: 'Berkas masuk untuk pemeriksaan'
	},
	{
		registerId: 'PERTEK-AIR-2026-009',
		receivedDate: '02/02/2026',
		companyName: 'PT Saijaan Prima Cemerlang',
		activityType: 'Pertambangan batuan komoditas batu gunung',
		documentType: 'PERTEK AIR',
		internalStatus: 'Submit/Masuk',
		updatedDate: '02/02/2026',
		notes: 'Berkas masuk untuk pemeriksaan'
	}
];

function parseDate(value: string): Date {
	const [day, month, year] = value.split('/').map((item) => Number(item.trim()));
	return new Date(year, month - 1, day);
}

function formatDate(value: string): string {
	return new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	}).format(parseDate(value));
}

function inferRegion(companyName: string, activityType: string): string {
	const combined = `${companyName} ${activityType}`.toLowerCase();
	if (combined.includes('hulu sungai tengah')) return 'Kabupaten Hulu Sungai Tengah';
	if (combined.includes('balangan')) return 'Kabupaten Balangan';
	if (
		combined.includes('kotabaru') ||
		combined.includes('pulau laut') ||
		combined.includes('tarjun')
	)
		return 'Kabupaten Kotabaru';
	if (combined.includes('tanah bumbu') || combined.includes('batulicin'))
		return 'Kabupaten Tanah Bumbu';
	if (combined.includes('banjar')) return 'Kabupaten Banjar';
	if (combined.includes('prov kalsel')) return 'Provinsi Kalimantan Selatan';
	return 'Kalimantan Selatan';
}

function inferActivityCategory(activityType: string): string {
	const activity = activityType.toLowerCase();
	if (
		activity.includes('pertambangan') ||
		activity.includes('batubara') ||
		activity.includes('quarry') ||
		activity.includes('penggalian')
	)
		return 'Pertambangan';
	if (
		activity.includes('jalan') ||
		activity.includes('spam') ||
		activity.includes('kolam regulasi')
	)
		return 'Infrastruktur';
	if (activity.includes('rumah sakit')) return 'Kesehatan';
	if (activity.includes('limbah')) return 'Pengelolaan Limbah';
	if (activity.includes('industri') || activity.includes('minyak')) return 'Industri Pengolahan';
	return 'Lainnya';
}

function buildProgressSummary(
	internalStatus: string,
	notes: string,
	publicStatus: PublicStatusKey
): string {
	const publicLabel = {
		disetujui: 'Persetujuan sudah diterbitkan.',
		ditolak: 'Pengajuan belum dapat disetujui.',
		perlu_perbaikan: 'Dokumen perlu dilengkapi sebelum lanjut ke tahap berikut.',
		penilaian_teknis: 'Dokumen sedang dinilai oleh tim teknis.',
		pemeriksaan_awal: 'Berkas sedang diperiksa pada tahap awal.',
		menunggu_keputusan: 'Proses teknis selesai dan menunggu keputusan.',
		belum_diproses: 'Berkas telah tercatat dan menunggu proses.',
		dibatalkan: 'Pengajuan dihentikan.'
	}[publicStatus];

	return `${publicLabel} Status internal: ${internalStatus}. ${
		notes ? `Catatan: ${notes}.` : 'Belum ada catatan tambahan.'
	}`;
}

function buildHistory(entry: RawSheetEntry, publicStatus: PublicStatusKey) {
	return [
		{
			stage: 'Pendaftaran',
			date: formatDate(entry.receivedDate),
			note: 'Pengajuan tercatat dalam sistem monitoring.'
		},
		{
			stage: getActiveStageLabel(publicStatus),
			date: formatDate(entry.updatedDate),
			note: entry.notes || `Status internal: ${entry.internalStatus}`
		}
	];
}

const builtCatalog = RAW_SHEET_ENTRIES.map((entry) => {
	const status = mapInternalStatusToPublic(entry.internalStatus);
	return {
		registerId: entry.registerId,
		companyName: entry.companyName,
		region: inferRegion(entry.companyName, entry.activityType),
		activityType: entry.activityType,
		documentType: entry.documentType,
		status,
		activeStage: getActiveStageLabel(status),
		lastUpdated: formatDate(entry.updatedDate),
		progressSummary: buildProgressSummary(entry.internalStatus, entry.notes, status),
		history: buildHistory(entry, status),
		receivedDate: formatDate(entry.receivedDate),
		internalStatus: entry.internalStatus,
		activityCategory: inferActivityCategory(entry.activityType),
		sortTimestamp: parseDate(entry.updatedDate).getTime()
	};
});

export const PUBLIC_SUBMISSIONS_CATALOG: PublicCatalogSubmission[] = builtCatalog
	.sort((a, b) => b.sortTimestamp - a.sortTimestamp)
	.map((item) => {
		const { sortTimestamp, ...cleanedItem } = item;
		void sortTimestamp;
		return cleanedItem;
	});
