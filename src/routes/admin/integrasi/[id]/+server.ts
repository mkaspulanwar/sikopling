import { requireAdminSupabase } from '$lib/server/admin-route'
import { deleteMonitoringIntegrasi, updateMonitoringIntegrasi } from '$lib/server/monitoring-integrasi'
import { resolveUserRole } from '$lib/server/supabase-auth'
import { INTEGRASI_STATUS_VALUES, type IntegrasiStatus } from '$lib/supabase/constants'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)

const extractErrorMessage = (error: unknown, fallback: string) => {
	if (error instanceof Error) return error.message
	if (typeof error === 'object' && error) {
		const maybeError = error as { message?: unknown; details?: unknown; hint?: unknown; code?: unknown }
		const chunks = [
			typeof maybeError.message === 'string' ? maybeError.message : '',
			typeof maybeError.details === 'string' ? maybeError.details : '',
			typeof maybeError.hint === 'string' ? maybeError.hint : '',
			typeof maybeError.code === 'string' ? `code=${maybeError.code}` : ''
		].filter(Boolean)
		if (chunks.length > 0) return chunks.join(' | ')
	}
	return fallback
}

const resolveAdminContext = async (locals: App.Locals) => {
	const auth = await requireAdminSupabase(locals)
	if (auth.state === 'unavailable') {
		return {
			ok: false,
			response: json({ message: 'Supabase belum dikonfigurasi di environment deployment' }, { status: 503 })
		} as const
	}

	if (auth.state === 'unauthorized') {
		return {
			ok: false,
			response: json({ message: 'Perlu login Supabase Auth dengan role admin' }, { status: 401 })
		} as const
	}

	return { ok: true, supabase: auth.supabase } as const
}

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	const auth = await resolveAdminContext(locals)
	if (!auth.ok) return auth.response

	if (!params.id) return json({ message: 'id integrasi wajib diisi' }, { status: 400 })

	const body = await request.json()
	const hasInstansiField = Object.prototype.hasOwnProperty.call(body ?? {}, 'instansi')
	const hasKegiatanField = Object.prototype.hasOwnProperty.call(body ?? {}, 'kegiatan')
	const hasJenisIntegrasiField = Object.prototype.hasOwnProperty.call(body ?? {}, 'jenis_integrasi')
	const hasPosisiField = Object.prototype.hasOwnProperty.call(body ?? {}, 'posisi')
	const hasStatusField = Object.prototype.hasOwnProperty.call(body ?? {}, 'status')
	const hasTanggalUpdateField = Object.prototype.hasOwnProperty.call(body ?? {}, 'tanggal_update')
	const hasKeteranganField = Object.prototype.hasOwnProperty.call(body ?? {}, 'keterangan')

	if (
		!hasInstansiField &&
		!hasKegiatanField &&
		!hasJenisIntegrasiField &&
		!hasPosisiField &&
		!hasStatusField &&
		!hasTanggalUpdateField &&
		!hasKeteranganField
	) {
		return json({ message: 'Tidak ada perubahan data yang dikirim' }, { status: 400 })
	}

	const tanggalUpdateRaw = typeof body?.tanggal_update === 'string' ? body.tanggal_update.trim() : undefined
	const status = typeof body?.status === 'string' ? (body.status as IntegrasiStatus) : undefined

	if (
		hasTanggalUpdateField &&
		tanggalUpdateRaw !== undefined &&
		tanggalUpdateRaw !== '' &&
		!isIsoDate(tanggalUpdateRaw)
	) {
		return json({ message: 'Format tanggal update harus YYYY-MM-DD' }, { status: 400 })
	}

	if (hasStatusField && status && !INTEGRASI_STATUS_VALUES.includes(status)) {
		return json({ message: 'Status tidak valid' }, { status: 400 })
	}

	try {
		const updated = await updateMonitoringIntegrasi(auth.supabase, {
			id: params.id,
			instansi: hasInstansiField && typeof body?.instansi === 'string' ? body.instansi : undefined,
			kegiatan: hasKegiatanField && typeof body?.kegiatan === 'string' ? body.kegiatan : undefined,
			jenisIntegrasi:
				hasJenisIntegrasiField && typeof body?.jenis_integrasi === 'string'
					? body.jenis_integrasi
					: undefined,
			posisi: hasPosisiField && typeof body?.posisi === 'string' ? body.posisi : undefined,
			status: hasStatusField ? status : undefined,
			tanggalUpdate: hasTanggalUpdateField ? (tanggalUpdateRaw === '' ? null : tanggalUpdateRaw) : undefined,
			keterangan: hasKeteranganField && typeof body?.keterangan === 'string' ? body.keterangan : undefined
		})
		return json({ data: updated })
	} catch (error) {
		const message = extractErrorMessage(error, 'Gagal memperbarui data integrasi')
		if (
			message.includes('JSON object requested') ||
			message.toLowerCase().includes('no rows returned') ||
			message.includes('PGRST116')
		) {
			return json({ message: 'Data integrasi tidak ditemukan' }, { status: 404 })
		}
		return json({ message }, { status: 400 })
	}
}

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const auth = await resolveAdminContext(locals)
	if (!auth.ok) return auth.response

	if (!params.id) return json({ message: 'id integrasi wajib diisi' }, { status: 400 })

	const { user } = await locals.safeGetSession()
	const role = resolveUserRole(user)
	if (role !== 'admin') {
		return json({ message: 'Hapus data hanya dapat dilakukan oleh admin' }, { status: 403 })
	}

	try {
		await deleteMonitoringIntegrasi(auth.supabase, { id: params.id })
		return json({ success: true })
	} catch (error) {
		const message = extractErrorMessage(error, 'Gagal menghapus data integrasi')
		if (message === 'INTEGRASI_NOT_FOUND') return json({ message: 'Data integrasi tidak ditemukan' }, { status: 404 })
		if (message === 'DELETE_BLOCKED_BY_POLICY') {
			return json({ message: 'Data belum terhapus karena policy database belum mengizinkan role ini.' }, { status: 403 })
		}
		return json({ message }, { status: 400 })
	}
}
