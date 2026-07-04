import { env as privateEnv } from '$env/dynamic/private'
import { env as publicEnv } from '$env/dynamic/public'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

type ServerFetch = typeof fetch

const normalizeSupabaseUrl = (rawUrl: string) =>
	rawUrl
		.trim()
		.replace(/\/+$/, '')
		.replace(/\/rest\/v1$/i, '')

export const createSupabaseAdminClient = (serverFetch: ServerFetch) => {
	if (!publicEnv.PUBLIC_SUPABASE_URL || !privateEnv.SUPABASE_SERVICE_ROLE_KEY) return null

	return createClient<Database>(
		normalizeSupabaseUrl(publicEnv.PUBLIC_SUPABASE_URL),
		privateEnv.SUPABASE_SERVICE_ROLE_KEY,
		{
			auth: { persistSession: false, autoRefreshToken: false },
			global: { fetch: serverFetch }
		}
	)
}
