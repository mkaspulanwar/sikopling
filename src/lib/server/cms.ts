import { createItem, deleteItem, readItems, updateItem } from '@directus/sdk'
import { env } from '$env/dynamic/private'
import { getDirectusClient } from '$lib/server/directus'

export type CmsQueueRow = {
	id: string
	registrationNo: string
	receivedDate: string
	agency: string
	activity: string
	documentType: string
	position: string
	progressStatus: string
	progressUpdatedDate: string
}

type CmsCollection = 'dokling' | 'pertek'
type CmsDataSource = 'directus' | 'fallback'
export type CmsMutationInput = Omit<CmsQueueRow, 'id'>

const resolveCollectionCandidates = (collection: CmsCollection) => {
	if (collection === 'dokling') {
		const customName = env.DIRECTUS_COLLECTION_DOKLING?.trim()
		return [customName, 'dokling', 'layanan_dokling'].filter((item): item is string => Boolean(item))
	}

	const customName = env.DIRECTUS_COLLECTION_PERTEK?.trim()
	return [customName, 'pertek', 'layanan_pertek'].filter((item): item is string => Boolean(item))
}

const resolveWriteCollectionName = (collection: CmsCollection) => resolveCollectionCandidates(collection)[0]

const doklingStatusValues = [
	'SK terbit',
	'Perbaikan Uji Administrasi',
	'Pasca Sidang',
	'Penilaian KA',
	'Penjadwalan Rapat',
	'Dikembalikan',
	'Ditolak',
	'Submit'
] as const

const pertekStatusValues = [
	'Evaluasi Dokumen',
	'Perbaikan Uji Administrasi',
	'Penjadwalan Rapat',
	'Dikembalikan',
	'Submit'
] as const

const positionValues = ['Penyusun', 'Pemrakarsa', 'Sekretariat TU'] as const

const pickString = (source: Record<string, unknown>, keys: string[], fallbackValue = '-') => {
	for (const key of keys) {
		const value = source[key]
		if (typeof value === 'string' && value.trim()) return value.trim()
		if (typeof value === 'number' || typeof value === 'boolean') return String(value)
	}
	return fallbackValue
}

const toIsoDate = (value: unknown, fallbackValue = '2026-01-06') => {
	if (typeof value === 'string') {
		const raw = value.trim()
		if (!raw) return fallbackValue
		if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw
		const parsedDate = new Date(raw)
		if (!Number.isNaN(parsedDate.getTime())) {
			return parsedDate.toISOString().slice(0, 10)
		}
		return fallbackValue
	}

	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value.toISOString().slice(0, 10)
	}

	return fallbackValue
}

const asAllowedValue = (value: string, allowedValues: readonly string[], fallbackValue: string) => {
	const normalizedValue = value.trim().toLowerCase()
	const match = allowedValues.find((item) => item.toLowerCase() === normalizedValue)
	if (match) return match
	return fallbackValue
}

const mapToQueueRow = (source: Record<string, unknown>, collection: CmsCollection): CmsQueueRow => {
	const id = pickString(source, ['id', 'uuid', 'registration_no', 'nomor_registrasi'], crypto.randomUUID())
	const registrationNo = pickString(source, [
		'registration_no',
		'nomor_registrasi',
		'registrationNo',
		'no_registrasi',
		'id'
	])
	const receivedDate = toIsoDate(source.received_date ?? source.tanggal_masuk ?? source.date_created)
	const progressUpdatedDate = toIsoDate(
		source.progress_updated_date ?? source.tanggal_update_progres ?? source.date_updated ?? source.date_created,
		receivedDate
	)
	const agency = pickString(source, ['agency', 'instansi', 'nama_instansi', 'pemrakarsa'])
	const activity = pickString(source, ['activity', 'kegiatan', 'nama_kegiatan', 'judul'])
	const documentType =
		collection === 'pertek'
			? pickString(source, ['document_type', 'jenis_dokumen', 'jenis', 'tipe'], 'Air')
			: pickString(source, ['document_type', 'jenis_dokumen', 'jenis', 'tipe'], 'Andal')
	const rawPosition = pickString(source, ['position', 'posisi', 'antrian_posisi'], positionValues[0])
	const position = asAllowedValue(rawPosition, positionValues, positionValues[0])
	const rawStatus = pickString(source, ['progress_status', 'status', 'status_progres'], 'Submit')
	const progressStatus =
		collection === 'pertek'
			? asAllowedValue(rawStatus, pertekStatusValues, 'Submit')
			: asAllowedValue(rawStatus, doklingStatusValues, 'Submit')

	return {
		id,
		registrationNo,
		receivedDate,
		agency,
		activity,
		documentType,
		position,
		progressStatus,
		progressUpdatedDate
	}
}

const addDaysUtc = (isoDate: string, offsetDays: number) => {
	const [year, month, day] = isoDate.split('-').map(Number)
	const baseDate = new Date(Date.UTC(year, month - 1, day))
	baseDate.setUTCDate(baseDate.getUTCDate() + offsetDays)
	return baseDate.toISOString().slice(0, 10)
}

const generateFallbackRows = (collection: CmsCollection): CmsQueueRow[] => {
	if (collection === 'dokling') {
		const doklingTemplates = [
			{
				agency: 'PT Mitra Agro Banua',
				activity: 'Pengembangan Kawasan Industri Pengolahan Hasil Pertanian',
				documentType: 'Andal',
				progressStatus: 'Penilaian KA'
			},
			{
				agency: 'Dinas PUPR Kab. Banjar',
				activity: 'Normalisasi Sungai dan Penguatan Tanggul',
				documentType: 'UKP-UPL',
				progressStatus: 'Perbaikan Uji Administrasi'
			},
			{
				agency: 'PT Karya Borneo Energi',
				activity: 'Pembangunan Fasilitas Penyimpanan Limbah B3',
				documentType: 'DPLH',
				progressStatus: 'Penjadwalan Rapat'
			},
			{
				agency: 'PT Sinar Khatulistiwa Mineral',
				activity: 'Perluasan Area Stockpile Batubara',
				documentType: 'Andal',
				progressStatus: 'Pasca Sidang'
			}
		] as const
		const registrationSeed = Number.parseInt('681195DAEA4DD', 16)

		return Array.from({ length: 40 }, (_, index) => {
			const template = doklingTemplates[index % doklingTemplates.length]
			const receivedDate = addDaysUtc('2026-01-06', index * 2)
			return {
				id: `dokling-${registrationSeed + index}`,
				registrationNo: (registrationSeed + index).toString(16).toUpperCase(),
				receivedDate,
				agency: template.agency,
				activity: template.activity,
				documentType: template.documentType,
				position: positionValues[index % positionValues.length],
				progressStatus: template.progressStatus,
				progressUpdatedDate: addDaysUtc(receivedDate, (index % 6) + 1)
			}
		})
	}

	const pertekAgencies = [
		'PT Tirta Banua Lestari',
		'Dinas PUPR Kota Banjarbaru',
		'PT Borneo Kencana Industri',
		'PT Energi Hijau Nusantara'
	]
	const pertekActivities = [
		'Pembangunan instalasi pengolahan air limbah kawasan industri',
		'Optimalisasi jaringan drainase kawasan permukiman',
		'Pengembangan fasilitas daur ulang air proses produksi',
		'Peningkatan kapasitas unit pengolahan air limbah domestik'
	]
	const registrationSeed = Number.parseInt('782AA4B0912EF', 16)

	return Array.from({ length: 20 }, (_, index) => {
		const receivedDate = addDaysUtc('2026-01-06', index * 2)
		return {
			id: `pertek-${registrationSeed + index}`,
			registrationNo: (registrationSeed + index).toString(16).toUpperCase(),
			receivedDate,
			agency: pertekAgencies[index % pertekAgencies.length],
			activity: pertekActivities[index % pertekActivities.length],
			documentType: 'Air',
			position: positionValues[index % positionValues.length],
			progressStatus: pertekStatusValues[index % pertekStatusValues.length],
			progressUpdatedDate: addDaysUtc(receivedDate, (index % 5) + 1)
		}
	})
}

const sortNewestFirst = (rows: CmsQueueRow[]) =>
	[...rows].sort(
		(left, right) =>
			new Date(`${right.progressUpdatedDate}T00:00:00`).getTime() -
			new Date(`${left.progressUpdatedDate}T00:00:00`).getTime()
	)

export const getCmsRows = async (collection: CmsCollection) => {
	const directusClient = getDirectusClient()
	if (!directusClient) {
		return {
			source: 'fallback' as CmsDataSource,
			rows: sortNewestFirst(generateFallbackRows(collection))
		}
	}

	try {
		const collectionCandidates = resolveCollectionCandidates(collection)
		for (const collectionName of collectionCandidates) {
			try {
				const items = (await directusClient.request(
					readItems(collectionName, {
						fields: ['*'],
						limit: -1,
						sort: ['-date_updated', '-date_created']
					})
				)) as Record<string, unknown>[]

				const rows = sortNewestFirst(items.map((item) => mapToQueueRow(item, collection)))
				return {
					source: 'directus' as CmsDataSource,
					rows
				}
			} catch {
				continue
			}
		}

		throw new Error(`Collection ${collection} tidak ditemukan di Directus`)
	} catch {
		return {
			source: 'fallback' as CmsDataSource,
			rows: sortNewestFirst(generateFallbackRows(collection))
		}
	}
}

const createStatusSummary = (rows: CmsQueueRow[]) => {
	const summary: Record<string, number> = {}
	for (const row of rows) {
		summary[row.progressStatus] = (summary[row.progressStatus] ?? 0) + 1
	}
	return Object.entries(summary)
		.map(([status, total]) => ({ status, total }))
		.sort((left, right) => right.total - left.total)
}

export const getCmsDashboardData = async () => {
	const [doklingResult, pertekResult] = await Promise.all([getCmsRows('dokling'), getCmsRows('pertek')])
	const source: CmsDataSource =
		doklingResult.source === 'directus' || pertekResult.source === 'directus' ? 'directus' : 'fallback'

	return {
		source,
		doklingRows: doklingResult.rows,
		pertekRows: pertekResult.rows,
		doklingSummary: createStatusSummary(doklingResult.rows),
		pertekSummary: createStatusSummary(pertekResult.rows)
	}
}

const ensureDirectusClient = () => {
	const directusClient = getDirectusClient()
	if (!directusClient) {
		throw new Error('Directus belum terhubung. Set DIRECTUS_URL terlebih dahulu')
	}
	return directusClient
}

const toWritePayload = (input: CmsMutationInput) => ({
	registration_no: input.registrationNo,
	received_date: input.receivedDate,
	agency: input.agency,
	activity: input.activity,
	document_type: input.documentType,
	position: input.position,
	progress_status: input.progressStatus,
	progress_updated_date: input.progressUpdatedDate
})

export const createCmsRow = async (collection: CmsCollection, input: CmsMutationInput) => {
	const directusClient = ensureDirectusClient()
	const collectionName = resolveWriteCollectionName(collection)
	await directusClient.request(
		createItem(collectionName, toWritePayload(input) as Record<string, unknown>)
	)
}

export const updateCmsRow = async (
	collection: CmsCollection,
	id: string,
	input: CmsMutationInput
) => {
	const directusClient = ensureDirectusClient()
	const collectionName = resolveWriteCollectionName(collection)
	await directusClient.request(
		updateItem(collectionName, id, toWritePayload(input) as Record<string, unknown>)
	)
}

export const deleteCmsRow = async (collection: CmsCollection, id: string) => {
	const directusClient = ensureDirectusClient()
	const collectionName = resolveWriteCollectionName(collection)
	await directusClient.request(deleteItem(collectionName, id))
}
