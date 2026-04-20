import { isAdminAuthenticated, setAdminSession, validateAdminCredentials } from '$lib/server/auth'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

const resolveRedirectTarget = (value: string) => {
	if (!value.startsWith('/')) return '/admin/cms'
	if (!value.startsWith('/admin')) return '/admin/cms'
	return value
}

export const load: PageServerLoad = async ({ cookies, url }) => {
	const redirectTo = resolveRedirectTarget(url.searchParams.get('redirectTo') ?? '/admin/cms')

	if (isAdminAuthenticated(cookies)) {
		throw redirect(303, redirectTo)
	}

	return { redirectTo }
}

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData()
		const username = String(formData.get('email') ?? '').trim()
		const password = String(formData.get('password') ?? '')
		const redirectTo = resolveRedirectTarget(String(formData.get('redirectTo') ?? '/admin/cms'))

		if (!username || !password) {
			return fail(400, {
				error: 'Email/Username dan kata sandi wajib diisi',
				redirectTo
			})
		}

		if (!validateAdminCredentials(username, password)) {
			return fail(401, {
				error: 'Kredensial tidak valid',
				redirectTo
			})
		}

		setAdminSession(cookies)
		throw redirect(303, redirectTo)
	}
}
