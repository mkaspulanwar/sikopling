import { requireAdminSupabase } from '$lib/server/admin-route'
import { deleteMonitoringIntegrasi, updateMonitoringIntegrasi } from '$lib/server/monitoring-integrasi'
import { deleteMonitoringPengajuan, updateMonitoringPengajuan } from '$lib/server/monitoring-pengajuan'
import { resolveUserRole } from '$lib/server/supabase-auth'
import {
	INTEGRASI_STATUS_VALUES,
	STATUS_VALUES,
	type IntegrasiStatus,
	type StatusPengajuan
} from '$lib/supabase/constants'
import type { Database } from '$lib/supabase/database.types'
import { json } from '@sveltejs/kit'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { RequestHandler } from './$types'

type AdminContext =
	| { ok: true; supabase: SupabaseClient<Database> }
	| { ok: false; response: Response }

const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)

const extractErrorMessage = (error: unknown, fallback: string) => {
	if (error instanceof Error) return error.message
	if (typeof error === 'object' && error) {
		const maybeError = error as {
			message?: unknown
			details?: unknown
			hint?: unknown
			code?: unknown
		}
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
		} satisfies AdminContext
	}

	if (auth.state === 'unauthorized') {
		return {
			ok: false,
			response: json({ message: 'Perlu login Supabase Auth dengan role admin' }, { status: 401 })
		} satisfies AdminContext
	}

	return { ok: true, supabase: auth.supabase } satisfies AdminContext
}

const isNotFoundMessage = (message: string) =>
	message.includes('JSON object requested') ||
	message.toLowerCase().includes('no rows returned') ||
	message.includes('PGRST116')

const patchIntegrasi = async (supabase: SupabaseClient<Database>, id: string, body: Record<string, unknown>) => {
	const hasInstansiField = Object.prototype.hasOwnProperty.call(body, 'instansi')
	const hasKegiatanField = Object.prototype.hasOwnProperty.call(body, 'kegiatan')
	const hasJenisIntegrasiField = Object.prototype.hasOwnProperty.call(body, 'jenis_integrasi')
	const hasPosisiField = Object.prototype.hasOwnProperty.call(body, 'posisi')
	const hasStatusField = Object.prototype.hasOwnProperty.call(body, 'status')
	const hasTanggalUpdateField = Object.prototype.hasOwnProperty.call(body, 'tanggal_update')
	const hasKeteranganField = Object.prototype.hasOwnProperty.call(body, 'keterangan')

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

	const tanggalUpdateRaw = typeof body.tanggal_update === 'string' ? body.tanggal_update.trim() : undefined
	const status = typeof body.status === 'string' ? (body.status as IntegrasiStatus) : undefined

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
		const updated = await updateMonitoringIntegrasi(supabase, {
			id,
			instansi: hasInstansiField && typeof body.instansi === 'string' ? body.instansi : undefined,
			kegiatan: hasKegiatanField && typeof body.kegiatan === 'string' ? body.kegiatan : undefined,
			jenisIntegrasi:
				hasJenisIntegrasiField && typeof body.jenis_integrasi === 'string'
					? body.jenis_integrasi
					: undefined,
			posisi: hasPosisiField && typeof body.posisi === 'string' ? body.posisi : undefined,
			status: hasStatusField ? status : undefined,
			tanggalUpdate: hasTanggalUpdateField ? (tanggalUpdateRaw === '' ? null : tanggalUpdateRaw) : undefined,
			keterangan: hasKeteranganField && typeof body.keterangan === 'string' ? body.keterangan : undefined
		})
		return json({ data: updated })
	} catch (error) {
		const message = extractErrorMessage(error, 'Gagal memperbarui data integrasi')
		if (isNotFoundMessage(message)) {
			return json({ message: 'Data integrasi tidak ditemukan' }, { status: 404 })
		}
		return json({ message }, { status: 400 })
	}
}

const patchPengajuan = async (supabase: SupabaseClient<Database>, id: string, body: Record<string, unknown>) => {
	const hasNoRegistrasiField = Object.prototype.hasOwnProperty.call(body, 'no_registrasi')
	const hasTanggalMasukField = Object.prototype.hasOwnProperty.call(body, 'tanggal_masuk')
	const hasTanggalUpdateField = Object.prototype.hasOwnProperty.call(body, 'tanggal_update')
	const hasInstansiField = Object.prototype.hasOwnProperty.call(body, 'instansi')
	const hasKegiatanField = Object.prototype.hasOwnProperty.call(body, 'kegiatan')
	const hasJenisLayananField = Object.prototype.hasOwnProperty.call(body, 'jenis_layanan')
	const hasPosisiField = Object.prototype.hasOwnProperty.call(body, 'posisi')
	const hasStatusField = Object.prototype.hasOwnProperty.call(body, 'status')

	if (
		!hasNoRegistrasiField &&
		!hasTanggalMasukField &&
		!hasTanggalUpdateField &&
		!hasInstansiField &&
		!hasKegiatanField &&
		!hasJenisLayananField &&
		!hasPosisiField &&
		!hasStatusField
	) {
		return json({ message: 'Tidak ada perubahan data yang dikirim' }, { status: 400 })
	}

	const noRegistrasi = typeof body.no_registrasi === 'string' ? body.no_registrasi : undefined
	const tanggalMasukRaw = typeof body.tanggal_masuk === 'string' ? body.tanggal_masuk.trim() : undefined
	const tanggalUpdateRaw = typeof body.tanggal_update === 'string' ? body.tanggal_update.trim() : undefined
	const instansi = typeof body.instansi === 'string' ? body.instansi : undefined
	const kegiatan = typeof body.kegiatan === 'string' ? body.kegiatan : undefined
	const jenisLayanan = typeof body.jenis_layanan === 'string' ? body.jenis_layanan : undefined
	const posisi = typeof body.posisi === 'string' ? body.posisi : undefined
	const status = typeof body.status === 'string' ? (body.status as StatusPengajuan) : undefined

	if (
		hasTanggalMasukField &&
		tanggalMasukRaw !== undefined &&
		tanggalMasukRaw !== '' &&
		!isIsoDate(tanggalMasukRaw)
	) {
		return json({ message: 'Format tanggal masuk harus YYYY-MM-DD' }, { status: 400 })
	}

	if (
		hasTanggalUpdateField &&
		tanggalUpdateRaw !== undefined &&
		tanggalUpdateRaw !== '' &&
		!isIsoDate(tanggalUpdateRaw)
	) {
		return json({ message: 'Format tanggal update harus YYYY-MM-DD' }, { status: 400 })
	}

	if (hasStatusField && status && !STATUS_VALUES.includes(status)) {
		return json({ message: 'Status tidak valid' }, { status: 400 })
	}

	try {
		const updated = await updateMonitoringPengajuan(supabase, {
			id,
			noRegistrasi: hasNoRegistrasiField ? noRegistrasi : undefined,
			tanggalMasuk: hasTanggalMasukField ? (tanggalMasukRaw === '' ? null : tanggalMasukRaw) : undefined,
			tanggalUpdate: hasTanggalUpdateField ? (tanggalUpdateRaw === '' ? null : tanggalUpdateRaw) : undefined,
			instansi: hasInstansiField ? instansi ?? null : undefined,
			kegiatan: hasKegiatanField ? kegiatan ?? null : undefined,
			jenisLayanan: hasJenisLayananField ? jenisLayanan ?? null : undefined,
			posisi: hasPosisiField ? posisi ?? null : undefined,
			status: hasStatusField ? status : undefined
		})
		return json({ data: updated })
	} catch (error) {
		const message = extractErrorMessage(error, 'Gagal memperbarui data pengajuan')
		if (message.toLowerCase().includes('duplicate key')) {
			return json({ message: 'No registrasi sudah digunakan' }, { status: 409 })
		}
		if (message === 'PENGAJUAN_NOT_FOUND' || isNotFoundMessage(message)) {
			return json({ message: 'Data pengajuan tidak ditemukan' }, { status: 404 })
		}
		return json({ message }, { status: 400 })
	}
}

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	const auth = await resolveAdminContext(locals)
	if (!auth.ok) return auth.response

	if (!params.id) return json({ message: 'id layanan wajib diisi' }, { status: 400 })

	const body = await request.json()
	if (typeof body !== 'object' || body === null) {
		return json({ message: 'Payload perubahan tidak valid' }, { status: 400 })
	}

	const payload = body as Record<string, unknown>
	return payload.layanan === 'integrasi'
		? patchIntegrasi(auth.supabase, params.id, payload)
		: patchPengajuan(auth.supabase, params.id, payload)
}

export const DELETE: RequestHandler = async ({ locals, params, request }) => {
	const auth = await resolveAdminContext(locals)
	if (!auth.ok) return auth.response

	if (!params.id) return json({ message: 'id layanan wajib diisi' }, { status: 400 })

	const { user } = await locals.safeGetSession()
	const role = resolveUserRole(user)
	if (role !== 'admin') {
		return json({ message: 'Hapus data hanya dapat dilakukan oleh admin' }, { status: 403 })
	}

	let layanan: unknown
	try {
		const body = await request.json()
		layanan = body?.layanan
	} catch {
		layanan = undefined
	}

	try {
		if (layanan === 'integrasi') {
			await deleteMonitoringIntegrasi(auth.supabase, { id: params.id })
		} else {
			await deleteMonitoringPengajuan(auth.supabase, { id: params.id })
		}
		return json({ success: true })
	} catch (error) {
		const message = extractErrorMessage(error, 'Gagal menghapus data layanan')
		if (message === 'PENGAJUAN_NOT_FOUND') {
			return json({ message: 'Data pengajuan tidak ditemukan' }, { status: 404 })
		}
		if (message === 'INTEGRASI_NOT_FOUND') {
			return json({ message: 'Data integrasi tidak ditemukan' }, { status: 404 })
		}
		if (message === 'DELETE_BLOCKED_BY_POLICY') {
			return json({ message: 'Data belum terhapus karena policy database belum mengizinkan role ini.' }, { status: 403 })
		}
		if (isNotFoundMessage(message)) {
			return json({ message: 'Data layanan tidak ditemukan' }, { status: 404 })
		}
		return json({ message }, { status: 400 })
	}
}
