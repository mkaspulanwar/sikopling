import { isAdminRole, resolveUserRole } from '$lib/server/supabase-auth'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

const resolveRedirectTarget = (value: string) => {
	if (!value.startsWith('/')) return '/admin/pengajuan'
	if (!value.startsWith('/admin')) return '/admin/pengajuan'
	return value
}

export const load: PageServerLoad = async ({ url, locals }) => {
	const redirectTo = resolveRedirectTarget(url.searchParams.get('redirectTo') ?? '/admin/pengajuan')

	const { session, user } = await locals.safeGetSession()
	const role = resolveUserRole(user)
	if (session && isAdminRole(role)) {
		throw redirect(303, redirectTo)
	}

	return { redirectTo }
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData()
		const email = String(formData.get('email') ?? '').trim()
		const password = String(formData.get('password') ?? '')
		const redirectTo = resolveRedirectTarget(String(formData.get('redirectTo') ?? '/admin/pengajuan'))

		if (!email || !password) {
			return fail(400, {
				error: 'Email dan kata sandi wajib diisi',
				redirectTo
			})
		}

		if (!locals.supabase) {
			return fail(503, {
				error: 'Supabase belum dikonfigurasi. Hubungi administrator.',
				redirectTo
			})
		}

		const { data, error } = await locals.supabase.auth.signInWithPassword({ email, password })
		if (error || !data.user) {
			return fail(401, {
				error: 'Email atau kata sandi tidak valid, atau akun belum terdaftar di Supabase Auth.',
				redirectTo
			})
		}

		const role = resolveUserRole(data.user)
		if (!isAdminRole(role)) {
			await locals.supabase.auth.signOut()
			return fail(403, {
				error: 'Akun berhasil login tetapi belum memiliki role admin (super_admin/admin/operator/reviewer).',
				redirectTo
			})
		}
		throw redirect(303, redirectTo)
	}
}
