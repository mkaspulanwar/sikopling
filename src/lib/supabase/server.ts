import { createServerClient } from '@supabase/ssr'
import type { RequestEvent } from '@sveltejs/kit'
import type { Database } from './database.types'
import { getSupabasePublicEnv } from './env'

export const createSupabaseServerClient = (event: RequestEvent) =>
{
	const config = getSupabasePublicEnv()
	if (!config) return null

	return createServerClient<Database>(config.url, config.key, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				for (const { name, value, options } of cookiesToSet) {
					event.cookies.set(name, value, { ...options, path: '/' })
				}
			}
		}
	})
}
