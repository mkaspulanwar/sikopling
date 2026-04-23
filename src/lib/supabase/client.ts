import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import { getSupabasePublicEnv } from './env'

export const createSupabaseBrowserClient = () => {
	const config = getSupabasePublicEnv()
	if (!config) return null

	return createBrowserClient<Database>(config.url, config.key)
}
