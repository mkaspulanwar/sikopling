import { createCmsRow, deleteCmsRow, getCmsDashboardData, updateCmsRow } from '$lib/server/cms'
import { fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const data = await getCmsDashboardData()
	return data
}

type CmsCollection = 'dokling' | 'pertek'

const isCmsCollection = (value: string): value is CmsCollection =>
	value === 'dokling' || value === 'pertek'

const readString = (formData: FormData, key: string) => {
	const value = formData.get(key)
	if (typeof value !== 'string') return ''
	return value.trim()
}

const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)

const readMutationInput = (formData: FormData) => {
	const registrationNo = readString(formData, 'registrationNo')
	const receivedDate = readString(formData, 'receivedDate')
	const agency = readString(formData, 'agency')
	const activity = readString(formData, 'activity')
	const documentType = readString(formData, 'documentType')
	const position = readString(formData, 'position')
	const progressStatus = readString(formData, 'progressStatus')
	const progressUpdatedDate = readString(formData, 'progressUpdatedDate')

	if (!registrationNo || !agency || !activity || !documentType || !position || !progressStatus) {
		return { error: 'Semua field wajib diisi' }
	}

	if (!isIsoDate(receivedDate) || !isIsoDate(progressUpdatedDate)) {
		return { error: 'Format tanggal wajib YYYY-MM-DD' }
	}

	return {
		input: {
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
}

const readCollection = (formData: FormData) => {
	const collection = readString(formData, 'collection')
	if (!isCmsCollection(collection)) return null
	return collection
}

export const actions: Actions = {
	create: async ({ request }) => {
		const formData = await request.formData()
		const collection = readCollection(formData)
		if (!collection) {
			return fail(400, { success: false, message: 'Koleksi tidak valid' })
		}

		const parsedInput = readMutationInput(formData)
		if ('error' in parsedInput) {
			return fail(400, { success: false, message: parsedInput.error })
		}

		try {
			await createCmsRow(collection, parsedInput.input)
			return { success: true, message: 'Data berhasil ditambahkan', collection, action: 'create' }
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Gagal menambahkan data'
			return fail(400, { success: false, message, collection, action: 'create' })
		}
	},
	update: async ({ request }) => {
		const formData = await request.formData()
		const collection = readCollection(formData)
		if (!collection) {
			return fail(400, { success: false, message: 'Koleksi tidak valid' })
		}

		const id = readString(formData, 'id')
		if (!id) {
			return fail(400, { success: false, message: 'ID data wajib diisi' })
		}

		const parsedInput = readMutationInput(formData)
		if ('error' in parsedInput) {
			return fail(400, { success: false, message: parsedInput.error })
		}

		try {
			await updateCmsRow(collection, id, parsedInput.input)
			return { success: true, message: 'Data berhasil diperbarui', collection, action: 'update' }
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Gagal memperbarui data'
			return fail(400, { success: false, message, collection, action: 'update' })
		}
	},
	delete: async ({ request }) => {
		const formData = await request.formData()
		const collection = readCollection(formData)
		if (!collection) {
			return fail(400, { success: false, message: 'Koleksi tidak valid' })
		}

		const id = readString(formData, 'id')
		if (!id) {
			return fail(400, { success: false, message: 'ID data wajib diisi' })
		}

		try {
			await deleteCmsRow(collection, id)
			return { success: true, message: 'Data berhasil dihapus', collection, action: 'delete' }
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Gagal menghapus data'
			return fail(400, { success: false, message, collection, action: 'delete' })
		}
	}
}
