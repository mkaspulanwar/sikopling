import { env as privateEnv } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '$lib/supabase/database.types'

export type PublicAnnouncementType = 'perling' | 'pertek' | 'integrasi'

type PublicAnnouncementTable = 'pengumuman_perling' | 'pengumuman_pertek' | 'pengumuman_integrasi'

export type PublicAnnouncementRow = {
	agency: string
	activity: string
	skNumber: string
	date: string
}

type PublicAnnouncementDbRow = {
	instansi: string | null
	kegiatan: string | null
	no_sk: string | null
	tanggal: string | null
}

type ServerFetch = typeof fetch

const ANNOUNCEMENT_TABLE_MAP: Record<PublicAnnouncementType, PublicAnnouncementTable> = {
	perling: 'pengumuman_perling',
	pertek: 'pengumuman_pertek',
	integrasi: 'pengumuman_integrasi'
}

const resolveServiceClient = (serverFetch: ServerFetch) => {
	if (!publicEnv.PUBLIC_SUPABASE_URL || !privateEnv.SUPABASE_SERVICE_ROLE_KEY) return null
	const normalizedUrl = publicEnv.PUBLIC_SUPABASE_URL.trim()
		.replace(/\/+$/, '')
		.replace(/\/rest\/v1$/i, '')

	return createClient<Database>(normalizedUrl, privateEnv.SUPABASE_SERVICE_ROLE_KEY, {
		auth: { persistSession: false },
		global: { fetch: serverFetch }
	})
}

export const getPublicAnnouncementRows = async (
	type: PublicAnnouncementType,
	serverFetch: ServerFetch
): Promise<PublicAnnouncementRow[]> => {
	const supabase = resolveServiceClient(serverFetch)
	if (!supabase) return []

	const tableName = ANNOUNCEMENT_TABLE_MAP[type]
	const { data, error } = await supabase
		.from(tableName as 'pengumuman_perling')
		.select('instansi, kegiatan, no_sk, tanggal')
		.order('tanggal', { ascending: false, nullsFirst: false })
		.limit(300)

	if (error) {
		console.error(`Failed loading public announcement rows for ${type}:`, error.message)
		return []
	}

	return ((data ?? []) as unknown as PublicAnnouncementDbRow[]).map((row) => ({
		agency: row.instansi ?? '-',
		activity: row.kegiatan ?? '-',
		skNumber: row.no_sk ?? '-',
		date: row.tanggal ?? new Date().toISOString().slice(0, 10)
	}))
}
