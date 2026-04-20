import { env } from '$env/dynamic/private'
import type { Cookies } from '@sveltejs/kit'

const ADMIN_SESSION_COOKIE = 'sikopling_admin_session'

const resolveCookieSecureFlag = () => env.NODE_ENV === 'production'

const resolveCredentials = () => {
	const username = env.CMS_ADMIN_USERNAME ?? 'admin'
	const password = env.CMS_ADMIN_PASSWORD ?? 'admin12345'
	return { username, password }
}

export const isAdminAuthenticated = (cookies: Cookies) =>
	cookies.get(ADMIN_SESSION_COOKIE) === 'authenticated'

export const setAdminSession = (cookies: Cookies) => {
	cookies.set(ADMIN_SESSION_COOKIE, 'authenticated', {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: resolveCookieSecureFlag(),
		maxAge: 60 * 60 * 8
	})
}

export const clearAdminSession = (cookies: Cookies) => {
	cookies.delete(ADMIN_SESSION_COOKIE, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: resolveCookieSecureFlag()
	})
}

export const validateAdminCredentials = (username: string, password: string) => {
	const credentials = resolveCredentials()
	return username === credentials.username && password === credentials.password
}
