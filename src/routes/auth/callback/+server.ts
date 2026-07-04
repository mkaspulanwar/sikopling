import { isAdminRole, resolveUserRole } from '$lib/server/supabase-auth'
import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const resolveRedirectTarget = (value: string | null) => {
	if (!value || !value.startsWith('/')) return '/admin/dashboard'
	if (value === '/auth/reset-password') return value
	if (!value.startsWith('/admin')) return '/admin/dashboard'
	return value
}

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code')
	const redirectTo = resolveRedirectTarget(url.searchParams.get('redirectTo'))

	if (!locals.supabase || !code) {
		throw redirect(
			303,
			`/login?authError=${encodeURIComponent('Proses autentikasi tidak lengkap. Silakan coba lagi.')}`
		)
	}

	const { error } = await locals.supabase.auth.exchangeCodeForSession(code)
	if (error) {
		throw redirect(303, `/login?authError=${encodeURIComponent('Proses autentikasi gagal. Silakan coba lagi.')}`)
	}

	const {
		data: { user }
	} = await locals.supabase.auth.getUser()
	const role = resolveUserRole(user)

	if (!user || !isAdminRole(role)) {
		await locals.supabase.auth.signOut()
		throw redirect(
			303,
			`/login?authError=${encodeURIComponent('Akun berhasil masuk, tetapi belum memiliki role admin atau super admin.')}`
		)
	}

	throw redirect(303, redirectTo)
}
