import { createServerClient } from '@supabase/ssr'
import type { RequestEvent } from '@sveltejs/kit'
import type { Database } from './database.types'
import { getSupabasePublicEnv } from './env'
import { isRememberMeEnabled } from '$lib/server/admin-session'

const isSupabaseAuthCookie = (name: string) => name.startsWith('sb-')

export const createSupabaseServerClient = (event: RequestEvent) =>
{
	const config = getSupabasePublicEnv()
	if (!config) return null

	return createServerClient<Database>(config.url, config.key, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				const shouldPersistAuthSession =
					event.locals.rememberSessionOverride ?? isRememberMeEnabled(event.cookies)

				for (const { name, value, options } of cookiesToSet) {
					const mergedOptions = { ...options, path: '/' }

					if (isSupabaseAuthCookie(name) && !shouldPersistAuthSession) {
						const { maxAge, expires, ...sessionOptions } = mergedOptions
						void maxAge
						void expires
						event.cookies.set(name, value, sessionOptions)
						continue
					}

					event.cookies.set(name, value, mergedOptions)
				}
			}
		}
	})
}
