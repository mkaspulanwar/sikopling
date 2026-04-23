import { redirect, type RequestHandler } from '@sveltejs/kit'

const doLogout: RequestHandler = async ({ locals }) => {
	if (locals.supabase) {
		await locals.supabase.auth.signOut()
	}
	throw redirect(303, '/login')
}

export const GET: RequestHandler = doLogout
export const POST: RequestHandler = doLogout
