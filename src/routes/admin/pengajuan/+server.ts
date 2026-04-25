import { LAYANAN_VALUES, STATUS_VALUES, type StatusPengajuan } from '$lib/supabase/constants'
import {
	createAntrianPengajuan,
	listAntrianPengajuan,
	updateStatusAntrianPengajuan
} from '$lib/server/antrian-pengajuan'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
const ADMIN_ROLES = new Set(['super_admin', 'admin', 'operator', 'reviewer'])

const parseNumber = (value: string | null, fallback: number) => {
	if (!value) return fallback
	const parsed = Number(value)
	return Number.isFinite(parsed) ? parsed : fallback
}

const isIsoDate = (value: string | undefined) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value)

const ensureAdminSession = async (locals: App.Locals) => {
	if (!locals.supabase) {
		return {
			error: json({ message: 'Supabase belum dikonfigurasi di environment deployment' }, { status: 503 })
		}
	}
	const { session, user } = await locals.safeGetSession()
	const role =
		(typeof user?.app_metadata?.role === 'string' && user.app_metadata.role) ||
		(typeof user?.user_metadata?.role === 'string' && user.user_metadata.role) ||
		null
	if (!session || !role || !ADMIN_ROLES.has(role)) {
		return {
			error: json({ message: 'Perlu login Supabase Auth dengan role admin' }, { status: 401 })
		}
	}
	return { supabase: locals.supabase }
}

export const GET: RequestHandler = async ({ locals, url }) => {
	const auth = await ensureAdminSession(locals)
	if (auth.error) return auth.error

	const query = url.searchParams

	const result = await listAntrianPengajuan(auth.supabase, {
		page: parseNumber(query.get('page'), 1),
		pageSize: parseNumber(query.get('pageSize'), 20),
		layanan: query.get('layanan') as 'dokling' | 'pertek' | undefined,
		status: query.get('status') as StatusPengajuan | undefined,
		instansi: query.get('instansi') ?? undefined,
		jenisDokumen: query.get('jenisDokumen') ?? undefined,
		tanggalMulai: query.get('tanggalMulai') ?? undefined,
		tanggalSelesai: query.get('tanggalSelesai') ?? undefined,
		keyword: query.get('keyword') ?? undefined,
		sortBy: (query.get('sortBy') as
			| 'no_registrasi'
			| 'tanggal_masuk'
			| 'instansi'
			| 'kegiatan'
			| 'jenis_dokumen'
			| 'posisi'
			| 'status'
			| 'tanggal_update'
			| 'created_at'
			| 'updated_at'
			| undefined),
		sortOrder: (query.get('sortOrder') as 'asc' | 'desc' | undefined) ?? 'desc'
	})

	return json(result)
}

export const POST: RequestHandler = async ({ locals, request }) => {
	const auth = await ensureAdminSession(locals)
	if (auth.error) return auth.error

	const body = await request.json()
	const layanan = typeof body?.layanan === 'string' ? body.layanan : ''
	const noRegistrasi = typeof body?.no_registrasi === 'string' ? body.no_registrasi : ''
	const tanggalMasuk = typeof body?.tanggal_masuk === 'string' ? body.tanggal_masuk : undefined
	const tanggalUpdate = typeof body?.tanggal_update === 'string' ? body.tanggal_update : undefined
	const instansi = typeof body?.instansi === 'string' ? body.instansi : undefined
	const kegiatan = typeof body?.kegiatan === 'string' ? body.kegiatan : undefined
	const jenisDokumen = typeof body?.jenis_dokumen === 'string' ? body.jenis_dokumen : undefined
	const posisi = typeof body?.posisi === 'string' ? body.posisi : undefined
	const status = body?.status as StatusPengajuan | undefined

	if (!LAYANAN_VALUES.includes(layanan as 'dokling' | 'pertek')) {
		return json({ message: 'Layanan wajib dipilih' }, { status: 400 })
	}

	if (!noRegistrasi.trim()) {
		return json({ message: 'No registrasi wajib diisi' }, { status: 400 })
	}

	if (!isIsoDate(tanggalMasuk)) {
		return json({ message: 'Format tanggal masuk harus YYYY-MM-DD' }, { status: 400 })
	}

	if (!isIsoDate(tanggalUpdate)) {
		return json({ message: 'Format tanggal update harus YYYY-MM-DD' }, { status: 400 })
	}

	if (status && !STATUS_VALUES.includes(status)) {
		return json({ message: 'Status tidak valid' }, { status: 400 })
	}

	try {
		const created = await createAntrianPengajuan(auth.supabase, {
			layanan: layanan as 'dokling' | 'pertek',
			noRegistrasi,
			tanggalMasuk,
			tanggalUpdate,
			instansi,
			kegiatan,
			jenisDokumen,
			posisi,
			status
		})
		return json({ data: created }, { status: 201 })
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Gagal menambahkan data pengajuan'
		if (message.toLowerCase().includes('duplicate key')) {
			return json({ message: 'No registrasi sudah digunakan' }, { status: 409 })
		}
		return json({ message }, { status: 400 })
	}
}

export const PATCH: RequestHandler = async ({ locals, request }) => {
	const auth = await ensureAdminSession(locals)
	if (auth.error) return auth.error

	const body = await request.json()

	if (!body?.id || typeof body.id !== 'string') {
		return json({ message: 'id wajib diisi' }, { status: 400 })
	}

	if (!body?.status || !STATUS_VALUES.includes(body.status)) {
		return json({ message: 'status tidak valid' }, { status: 400 })
	}

	const updated = await updateStatusAntrianPengajuan(auth.supabase, {
		id: body.id,
		status: body.status,
		posisi: typeof body.posisi === 'string' ? body.posisi : null,
		note: typeof body.note === 'string' ? body.note : null
	})

	return json({ data: updated })
}
