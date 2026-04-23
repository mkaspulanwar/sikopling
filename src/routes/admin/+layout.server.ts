import { isAdminRole, resolveUserRole } from '$lib/server/supabase-auth'
import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ url, locals }) => {
	const { session, user } = await locals.safeGetSession()
	const role = resolveUserRole(user)

	if (session && isAdminRole(role)) {
		return {
			session,
			user,
			role
		}
	}

	const redirectTarget = `${url.pathname}${url.search}`
	const encodedTarget = encodeURIComponent(redirectTarget)
	throw redirect(303, `/login?redirectTo=${encodedTarget}`)
}
