import { isAdminRole, resolveUserRole } from '$lib/server/supabase-auth'
import { isRememberMeEnabled, setRememberMeCookie } from '$lib/server/admin-session'
import { dev } from '$app/environment'
import { fail, redirect } from '@sveltejs/kit'
import type { AuthError } from '@supabase/supabase-js'
import type { Actions, PageServerLoad } from './$types'

const resolveRedirectTarget = (value: string) => {
	if (!value.startsWith('/')) return '/admin/dashboard'
	if (!value.startsWith('/admin')) return '/admin/dashboard'
	return value
}

const mapSignInErrorMessage = (error: AuthError | null) => {
	if (!error) return 'Email atau kata sandi tidak valid, atau akun belum terdaftar di Supabase Auth.'

	const normalized = error.message.toLowerCase()
	if (normalized.includes('invalid login credentials')) {
		return 'Email atau kata sandi tidak valid, atau akun belum terdaftar di Supabase Auth.'
	}
	if (normalized.includes('email not confirmed')) {
		return 'Email belum dikonfirmasi. Cek inbox/verifikasi email di Supabase Auth.'
	}
	if (normalized.includes('email logins are disabled')) {
		return 'Login email/password sedang dinonaktifkan di Supabase Auth (Auth > Providers).'
	}

	return 'Login ke Supabase gagal. Pastikan akun ada di Supabase Auth dan konfigurasi Auth sudah benar.'
}

export const load: PageServerLoad = async ({ url, locals, cookies }) => {
	const redirectTo = resolveRedirectTarget(url.searchParams.get('redirectTo') ?? '/admin/dashboard')
	const remember = isRememberMeEnabled(cookies)

	const { session, user } = await locals.safeGetSession()
	const role = resolveUserRole(user)
	if (session && isAdminRole(role)) {
		throw redirect(303, redirectTo)
	}

	return { redirectTo, remember }
}

export const actions: Actions = {
	default: async ({ request, locals, url, cookies }) => {
		const formData = await request.formData()
		const email = String(formData.get('email') ?? '').trim()
		const password = String(formData.get('password') ?? '')
		const redirectTo = resolveRedirectTarget(String(formData.get('redirectTo') ?? '/admin/dashboard'))
		const remember = formData.get('remember') === 'on'
		const secureCookie = !dev && url.protocol === 'https:'

		if (!email || !password) {
			return fail(400, {
				error: 'Email dan kata sandi wajib diisi',
				redirectTo,
				remember
			})
		}

		if (!locals.supabase) {
			return fail(503, {
				error: 'Supabase belum dikonfigurasi. Hubungi administrator.',
				redirectTo,
				remember
			})
		}

		locals.rememberSessionOverride = remember
		setRememberMeCookie(cookies, remember, secureCookie)

		const { data, error } = await locals.supabase.auth.signInWithPassword({ email, password })
		if (error || !data.user) {
			if (error) {
				console.warn('Supabase signInWithPassword failed', {
					code: error.code ?? null,
					status: error.status ?? null,
					message: error.message
				})
			}

			return fail(401, {
				error: mapSignInErrorMessage(error),
				redirectTo,
				remember
			})
		}

		const role = resolveUserRole(data.user)
		if (!isAdminRole(role)) {
			await locals.supabase.auth.signOut()
			return fail(403, {
				error: 'Akun berhasil login tetapi belum memiliki role admin (super_admin/admin/operator/reviewer).',
				redirectTo,
				remember
			})
		}
		throw redirect(303, redirectTo)
	}
}
