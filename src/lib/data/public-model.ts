export type PublicStatusKey =
	| 'belum_diproses'
	| 'pemeriksaan_awal'
	| 'penilaian_teknis'
	| 'perlu_perbaikan'
	| 'menunggu_keputusan'
	| 'disetujui'
	| 'ditolak'
	| 'dibatalkan';

export type StatusTone = 'neutral' | 'progress' | 'success' | 'danger';

export interface PublicStatusDefinition {
	key: PublicStatusKey;
	label: string;
	tone: StatusTone;
	description: string;
}

export interface PublicFieldDefinition {
	key: keyof PublicSubmission;
	label: string;
	sourceColumn: string;
	purpose: string;
}

export interface StageHistoryItem {
	stage: string;
	date: string;
	note: string;
}

export interface PublicSubmission {
	registerId: string;
	companyName: string;
	region: string;
	activityType: string;
	documentType: string;
	status: PublicStatusKey;
	activeStage: string;
	lastUpdated: string;
	progressSummary: string;
	history: StageHistoryItem[];
}

export const PUBLIC_INFORMATION_FIELDS: PublicFieldDefinition[] = [
	{
		key: 'companyName',
		label: 'Nama perusahaan',
		sourceColumn: 'nama_pemrakarsa',
		purpose: 'Identitas utama pengajuan'
	},
	{
		key: 'region',
		label: 'Wilayah/lokasi',
		sourceColumn: 'lokasi_kegiatan',
		purpose: 'Konteks sebaran pengajuan per daerah'
	},
	{
		key: 'activityType',
		label: 'Jenis usaha/kegiatan',
		sourceColumn: 'jenis_kegiatan',
		purpose: 'Penjelasan konteks pengajuan secara publik'
	},
	{
		key: 'documentType',
		label: 'Jenis dokumen',
		sourceColumn: 'jenis_dokumen',
		purpose: 'Klasifikasi proses persetujuan lingkungan'
	},
	{
		key: 'status',
		label: 'Status saat ini',
		sourceColumn: 'status_internal',
		purpose: 'Informasi utama yang paling cepat dipahami'
	},
	{
		key: 'activeStage',
		label: 'Tahap aktif',
		sourceColumn: 'tahap_aktif',
		purpose: 'Posisi proses berjalan saat ini'
	},
	{
		key: 'lastUpdated',
		label: 'Tanggal pembaruan terakhir',
		sourceColumn: 'updated_at',
		purpose: 'Kredibilitas data publik'
	},
	{
		key: 'progressSummary',
		label: 'Ringkasan progres',
		sourceColumn: 'catatan_ringkas',
		purpose: 'Terjemahan bahasa teknis ke bahasa publik'
	},
	{
		key: 'history',
		label: 'Riwayat tahapan',
		sourceColumn: 'log_tahapan',
		purpose: 'Transparansi proses dari awal hingga tahap aktif'
	}
];

export const PUBLIC_STATUS_DEFINITIONS: PublicStatusDefinition[] = [
	{
		key: 'belum_diproses',
		label: 'Belum diproses',
		tone: 'neutral',
		description: 'Berkas tercatat, belum masuk pemeriksaan.'
	},
	{
		key: 'pemeriksaan_awal',
		label: 'Pemeriksaan awal',
		tone: 'progress',
		description: 'Kelengkapan administrasi sedang diverifikasi.'
	},
	{
		key: 'penilaian_teknis',
		label: 'Penilaian teknis',
		tone: 'progress',
		description: 'Isi dokumen dinilai oleh tim teknis.'
	},
	{
		key: 'perlu_perbaikan',
		label: 'Perlu perbaikan',
		tone: 'danger',
		description: 'Ada bagian dokumen yang perlu dilengkapi.'
	},
	{
		key: 'menunggu_keputusan',
		label: 'Menunggu keputusan',
		tone: 'progress',
		description: 'Tahap teknis selesai, menunggu keputusan akhir.'
	},
	{
		key: 'disetujui',
		label: 'Disetujui',
		tone: 'success',
		description: 'Persetujuan lingkungan telah diterbitkan.'
	},
	{
		key: 'ditolak',
		label: 'Ditolak',
		tone: 'danger',
		description: 'Pengajuan belum dapat disetujui.'
	},
	{
		key: 'dibatalkan',
		label: 'Dibatalkan',
		tone: 'neutral',
		description: 'Proses pengajuan dihentikan.'
	}
];

export const INTERNAL_STATUS_MAPPING: Array<{ internal: string; publicStatus: PublicStatusKey }> = [
	{ internal: 'Draft belum diproses', publicStatus: 'belum_diproses' },
	{ internal: 'Verifikasi administrasi', publicStatus: 'pemeriksaan_awal' },
	{ internal: 'Penilaian substansi teknis', publicStatus: 'penilaian_teknis' },
	{ internal: 'Perbaikan dokumen diminta', publicStatus: 'perlu_perbaikan' },
	{ internal: 'Menunggu penetapan', publicStatus: 'menunggu_keputusan' },
	{ internal: 'Persetujuan terbit', publicStatus: 'disetujui' },
	{ internal: 'Pengajuan ditolak', publicStatus: 'ditolak' },
	{ internal: 'Pengajuan ditarik', publicStatus: 'dibatalkan' },
	{ internal: 'Perbaikan Uji Adminstrasi', publicStatus: 'perlu_perbaikan' },
	{ internal: 'Dikembalikan', publicStatus: 'perlu_perbaikan' },
	{ internal: 'SK terbit', publicStatus: 'disetujui' },
	{ internal: 'Pasca Sidang', publicStatus: 'penilaian_teknis' },
	{ internal: 'Penilaian KA', publicStatus: 'penilaian_teknis' },
	{ internal: 'Penjadwalan Rapat', publicStatus: 'penilaian_teknis' },
	{ internal: 'Evaluasi Dokumen', publicStatus: 'penilaian_teknis' },
	{ internal: 'Submit/Masuk', publicStatus: 'pemeriksaan_awal' }
];

export const PUBLIC_TERM_GLOSSARY = [
	{ technical: 'Pemrakarsa', publicLabel: 'Perusahaan pengaju' },
	{ technical: 'Verifikasi administrasi', publicLabel: 'Pemeriksaan awal' },
	{ technical: 'Substansi teknis', publicLabel: 'Isi dokumen teknis' },
	{
		technical: 'RKL-RPL',
		publicLabel: 'Rencana pengelolaan dan pemantauan lingkungan'
	},
	{ technical: 'Berita acara', publicLabel: 'Catatan hasil pemeriksaan' }
];

export const APPROVAL_STAGES = [
	{
		key: 'pendaftaran',
		title: 'Pendaftaran',
		description: 'Pengajuan masuk dan nomor register diterbitkan.'
	},
	{
		key: 'pemeriksaan_awal',
		title: 'Pemeriksaan Awal',
		description: 'Kelengkapan administrasi dokumen diperiksa.'
	},
	{
		key: 'penilaian_teknis',
		title: 'Penilaian Teknis',
		description: 'Isi dokumen dievaluasi oleh tim teknis.'
	},
	{
		key: 'keputusan',
		title: 'Keputusan',
		description: 'Hasil akhir ditetapkan sesuai hasil evaluasi.'
	},
	{
		key: 'selesai',
		title: 'Terbit/Selesai',
		description: 'Persetujuan diterbitkan atau status akhir diumumkan.'
	}
];

export function getStatusDefinition(key: PublicStatusKey): PublicStatusDefinition {
	return (
		PUBLIC_STATUS_DEFINITIONS.find((statusDefinition) => statusDefinition.key === key) ??
		PUBLIC_STATUS_DEFINITIONS[0]
	);
}

function normalizeInternalStatus(internalStatus: string): string {
	return internalStatus.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function mapInternalStatusToPublic(internalStatus: string): PublicStatusKey {
	const normalizedStatus = normalizeInternalStatus(internalStatus);

	if (normalizedStatus.includes('sk terbit')) return 'disetujui';
	if (normalizedStatus.includes('ditolak')) return 'ditolak';
	if (normalizedStatus.includes('dikembalikan') || normalizedStatus.includes('perbaikan'))
		return 'perlu_perbaikan';
	if (
		normalizedStatus.includes('pasca sidang') ||
		normalizedStatus.includes('penilaian ka') ||
		normalizedStatus.includes('evaluasi dokumen') ||
		normalizedStatus.includes('penjadwalan rapat')
	)
		return 'penilaian_teknis';
	if (
		normalizedStatus.includes('submit/masuk') ||
		normalizedStatus.includes('submit') ||
		normalizedStatus.includes('masuk')
	)
		return 'pemeriksaan_awal';

	const mapped = INTERNAL_STATUS_MAPPING.find(
		(item) => normalizeInternalStatus(item.internal) === normalizedStatus
	);
	return mapped?.publicStatus ?? 'belum_diproses';
}

export function getActiveStageLabel(status: PublicStatusKey): string {
	if (status === 'disetujui') return 'Keputusan terbit';
	if (status === 'ditolak') return 'Keputusan akhir';
	if (status === 'perlu_perbaikan') return 'Perbaikan dokumen';
	if (status === 'penilaian_teknis') return 'Telaah teknis';
	if (status === 'pemeriksaan_awal') return 'Pemeriksaan awal';
	if (status === 'menunggu_keputusan') return 'Menunggu penetapan';
	return 'Pendaftaran';
}
