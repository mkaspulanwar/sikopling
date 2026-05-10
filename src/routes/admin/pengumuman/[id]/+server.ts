import { deleteAnnouncementRow, isAnnouncementType, updateAnnouncementRow } from '$lib/server/admin-announcements'
import { requireAdminSupabase } from '$lib/server/admin-route'
import { resolveUserRole } from '$lib/server/supabase-auth'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const isIsoDate = (value: string | undefined) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)
const extractErrorMessage = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback

const ensureAdmin = async (locals: App.Locals) => {
	const auth = await requireAdminSupabase(locals)
	if (auth.state === 'unavailable') return { error: json({ message: 'Supabase belum dikonfigurasi' }, { status: 503 }) }
	if (auth.state === 'unauthorized') return { error: json({ message: 'Perlu login Supabase Auth dengan role admin' }, { status: 401 }) }
	return { supabase: auth.supabase }
}

export const PATCH: RequestHandler = async ({ locals, params, request }) => {
	const auth = await ensureAdmin(locals)
	if (auth.error) return auth.error

	const body = await request.json()
	const type = typeof body?.type === 'string' ? body.type : ''
	const tanggal = typeof body?.tanggal === 'string' ? body.tanggal.trim() : undefined
	if (!params.id) return json({ message: 'id wajib diisi' }, { status: 400 })
	if (!isAnnouncementType(type)) return json({ message: 'Jenis penerbitan tidak valid' }, { status: 400 })
	if (!isIsoDate(tanggal)) return json({ message: 'Format tanggal harus YYYY-MM-DD' }, { status: 400 })

	try {
		const updated = await updateAnnouncementRow(auth.supabase, {
			id: params.id,
			type,
			instansi: typeof body?.instansi === 'string' ? body.instansi : null,
			kegiatan: typeof body?.kegiatan === 'string' ? body.kegiatan : null,
			noSk: typeof body?.no_sk === 'string' ? body.no_sk : null,
			tanggal
		})
		return json({ data: updated })
	} catch (error) {
		return json({ message: extractErrorMessage(error, 'Gagal memperbarui data penerbitan') }, { status: 400 })
	}
}

export const DELETE: RequestHandler = async ({ locals, params, request }) => {
	const auth = await ensureAdmin(locals)
	if (auth.error) return auth.error
	if (!params.id) return json({ message: 'id wajib diisi' }, { status: 400 })

	const { user } = await locals.safeGetSession()
	if (resolveUserRole(user) !== 'admin') return json({ message: 'Hapus data hanya dapat dilakukan oleh admin' }, { status: 403 })

	const body = await request.json().catch(() => ({}))
	const type = typeof body?.type === 'string' ? body.type : ''
	if (!isAnnouncementType(type)) return json({ message: 'Jenis penerbitan tidak valid' }, { status: 400 })

	try {
		await deleteAnnouncementRow(auth.supabase, { type, id: params.id })
		return json({ success: true })
	} catch (error) {
		return json({ message: extractErrorMessage(error, 'Gagal menghapus data penerbitan') }, { status: 400 })
	}
}
