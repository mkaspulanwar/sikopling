import { requireAdminSupabase } from '$lib/server/admin-route'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const keepAlive: RequestHandler = async ({ locals }) => {
	const auth = await requireAdminSupabase(locals)

	if (auth.state === 'unavailable') {
		return json({ message: 'Supabase belum dikonfigurasi di environment deployment' }, { status: 503 })
	}

	if (auth.state === 'unauthorized') {
		return json({ message: 'Perlu login Supabase Auth dengan role admin' }, { status: 401 })
	}

	return new Response(null, { status: 204 })
}

export const GET: RequestHandler = keepAlive
export const POST: RequestHandler = keepAlive
