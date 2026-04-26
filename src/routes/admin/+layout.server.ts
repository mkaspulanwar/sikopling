import { EMPTY_SUMMARY, logAdminLoad } from '$lib/server/admin-route'
import { getAntrianPengajuanSummary } from '$lib/server/antrian-pengajuan'
import { isAdminRole, resolveUserRole } from '$lib/server/supabase-auth'
import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ url, locals, depends, untrack }) => {
	depends('admin:session')
	depends('admin:summary')

	if (!locals.supabase) {
		logAdminLoad('admin/+layout.server', { state: 'unavailable' })
		return {
			session: null,
			user: null,
			role: null,
			isAdmin: false,
			supabaseAvailable: false,
			summary: EMPTY_SUMMARY
		}
	}

	const { session, user } = await locals.safeGetSession()
	if (!session) {
		const redirectTarget = untrack(() => `${url.pathname}${url.search}`)
		const encodedTarget = encodeURIComponent(redirectTarget)
		throw redirect(303, `/login?redirectTo=${encodedTarget}`)
	}

	const role = resolveUserRole(user)
	if (!isAdminRole(role)) {
		logAdminLoad('admin/+layout.server', { state: 'forbidden', role })
		return {
			session,
			user,
			role,
			isAdmin: false,
			supabaseAvailable: true,
			summary: EMPTY_SUMMARY
		}
	}

	const summary = await getAntrianPengajuanSummary(locals.supabase)
	logAdminLoad('admin/+layout.server', { state: 'ok', role })

	return {
		session,
		user,
		role,
		isAdmin: true,
		supabaseAvailable: true,
		summary
	}
}
