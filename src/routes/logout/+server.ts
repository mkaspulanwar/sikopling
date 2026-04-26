import { redirect, type RequestHandler } from '@sveltejs/kit'
import { clearRememberMeCookie } from '$lib/server/admin-session'
import { dev } from '$app/environment'

const doLogout: RequestHandler = async ({ locals, url, cookies }) => {
	if (locals.supabase) {
		await locals.supabase.auth.signOut()
	}
	clearRememberMeCookie(cookies, !dev && url.protocol === 'https:')
	throw redirect(303, '/')
}

export const GET: RequestHandler = doLogout
export const POST: RequestHandler = doLogout
