import { isAdminAuthenticated } from '$lib/server/auth'
import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	if (isAdminAuthenticated(cookies)) return {}

	const redirectTarget = `${url.pathname}${url.search}`
	const encodedTarget = encodeURIComponent(redirectTarget)
	throw redirect(303, `/login?redirectTo=${encodedTarget}`)
}
