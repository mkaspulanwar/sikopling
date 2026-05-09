import {
	deleteAntrianPengajuan,
	updateAntrianPengajuan
} from '$lib/server/antrian-pengajuan'
import { requireAdminSupabase } from '$lib/server/admin-route'
import { resolveUserRole } from '$lib/server/supabase-auth'
import { STATUS_VALUES, type StatusPengajuan } from '$lib/supabase/constants'
import type { Database } from '$lib/supabase/database.types'
import { json } from '@sveltejs/kit'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { RequestHandler } from './$types'

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
		const message = typeof maybeError.message === 'string' ? maybeError.message : ''
		const details = typeof maybeError.details === 'string' ? maybeError.details : ''
		const hint = typeof maybeError.hint === 'string' ? maybeError.hint : ''
		const code = typeof maybeError.code === 'string' ? maybeError.code : ''
		const chunks = [message, details, hint, code ? `code=${code}` : ''].filter(Boolean)
		if (chunks.length > 0) return chunks.join(' | ')
	}
	return fallback
}

type AdminContext =
	| { ok: true; supabase: SupabaseClient<Database> }
	| { ok: false; response: Response }

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

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	const auth = await resolveAdminContext(locals)
	if (!auth.ok) return auth.response

	if (!params.id) {
		return json({ message: 'id pengajuan wajib diisi' }, { status: 400 })
	}

	const body = await request.json()

	const hasNoRegistrasiField = Object.prototype.hasOwnProperty.call(body ?? {}, 'no_registrasi')
	const hasTanggalMasukField = Object.prototype.hasOwnProperty.call(body ?? {}, 'tanggal_masuk')
	const hasTanggalUpdateField = Object.prototype.hasOwnProperty.call(body ?? {}, 'tanggal_update')
	const hasInstansiField = Object.prototype.hasOwnProperty.call(body ?? {}, 'instansi')
	const hasKegiatanField = Object.prototype.hasOwnProperty.call(body ?? {}, 'kegiatan')
	const hasJenisDokumenField = Object.prototype.hasOwnProperty.call(body ?? {}, 'jenis_dokumen')
	const hasPosisiField = Object.prototype.hasOwnProperty.call(body ?? {}, 'posisi')
	const hasStatusField = Object.prototype.hasOwnProperty.call(body ?? {}, 'status')

	const noRegistrasi = typeof body?.no_registrasi === 'string' ? body.no_registrasi : undefined
	const tanggalMasukRaw = typeof body?.tanggal_masuk === 'string' ? body.tanggal_masuk.trim() : undefined
	const tanggalUpdateRaw = typeof body?.tanggal_update === 'string' ? body.tanggal_update.trim() : undefined
	const instansi = typeof body?.instansi === 'string' ? body.instansi : undefined
	const kegiatan = typeof body?.kegiatan === 'string' ? body.kegiatan : undefined
	const jenisDokumen = typeof body?.jenis_dokumen === 'string' ? body.jenis_dokumen : undefined
	const posisi = typeof body?.posisi === 'string' ? body.posisi : undefined
	const status = typeof body?.status === 'string' ? (body.status as StatusPengajuan) : undefined

	if (
		!hasNoRegistrasiField &&
		!hasTanggalMasukField &&
		!hasTanggalUpdateField &&
		!hasInstansiField &&
		!hasKegiatanField &&
		!hasJenisDokumenField &&
		!hasPosisiField &&
		!hasStatusField
	) {
		return json({ message: 'Tidak ada perubahan data yang dikirim' }, { status: 400 })
	}

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
		const updated = await updateAntrianPengajuan(auth.supabase, {
			id: params.id,
			noRegistrasi: hasNoRegistrasiField ? noRegistrasi : undefined,
			tanggalMasuk: hasTanggalMasukField ? (tanggalMasukRaw === '' ? null : tanggalMasukRaw) : undefined,
			tanggalUpdate: hasTanggalUpdateField ? (tanggalUpdateRaw === '' ? null : tanggalUpdateRaw) : undefined,
			instansi: hasInstansiField ? instansi ?? null : undefined,
			kegiatan: hasKegiatanField ? kegiatan ?? null : undefined,
			jenisDokumen: hasJenisDokumenField ? jenisDokumen ?? null : undefined,
			posisi: hasPosisiField ? posisi ?? null : undefined,
			status: hasStatusField ? status : undefined
		})
		return json({ data: updated })
	} catch (error) {
		const message = extractErrorMessage(error, 'Gagal memperbarui data pengajuan')
		if (message.toLowerCase().includes('duplicate key')) {
			return json({ message: 'No registrasi sudah digunakan' }, { status: 409 })
		}
		if (
			message.includes('JSON object requested') ||
			message.toLowerCase().includes('no rows returned') ||
			message.includes('PGRST116')
		) {
			return json({ message: 'Data pengajuan tidak ditemukan' }, { status: 404 })
		}
		return json({ message }, { status: 400 })
	}
}

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const auth = await resolveAdminContext(locals)
	if (!auth.ok) return auth.response

	if (!params.id) {
		return json({ message: 'id pengajuan wajib diisi' }, { status: 400 })
	}

	const { user } = await locals.safeGetSession()
	const role = resolveUserRole(user)
	if (role !== 'super_admin') {
		return json({ message: 'Hapus data hanya dapat dilakukan oleh super admin' }, { status: 403 })
	}

	try {
		await deleteAntrianPengajuan(auth.supabase, { id: params.id })
		return json({ success: true })
	} catch (error) {
		const message = extractErrorMessage(error, 'Gagal menghapus data pengajuan')
		if (message === 'PENGAJUAN_NOT_FOUND') {
			return json({ message: 'Data pengajuan tidak ditemukan' }, { status: 404 })
		}
		if (message === 'DELETE_BLOCKED_BY_POLICY') {
			return json(
				{
					message:
						'Data belum terhapus karena policy database belum mengizinkan role ini. Pastikan policy delete hanya untuk super admin sudah aktif.'
				},
				{ status: 403 }
			)
		}
		if (
			message.includes('JSON object requested') ||
			message.toLowerCase().includes('no rows returned') ||
			message.includes('PGRST116')
		) {
			return json({ message: 'Data pengajuan tidak ditemukan' }, { status: 404 })
		}
		return json({ message }, { status: 400 })
	}
}
