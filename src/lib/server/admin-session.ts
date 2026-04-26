import type { Cookies } from '@sveltejs/kit'

export const ADMIN_REMEMBER_COOKIE_NAME = 'admin_remember'
export const ADMIN_REMEMBER_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

const buildRememberCookieOptions = (secure: boolean) => ({
	path: '/',
	httpOnly: true,
	sameSite: 'lax' as const,
	secure
})

export const isRememberMeEnabled = (cookies: Cookies) =>
	cookies.get(ADMIN_REMEMBER_COOKIE_NAME) === '1'

export const setRememberMeCookie = (cookies: Cookies, remember: boolean, secure: boolean) => {
	if (remember) {
		cookies.set(ADMIN_REMEMBER_COOKIE_NAME, '1', {
			...buildRememberCookieOptions(secure),
			maxAge: ADMIN_REMEMBER_COOKIE_MAX_AGE
		})
		return
	}

	// Session cookie: removed when browser session ends.
	cookies.set(ADMIN_REMEMBER_COOKIE_NAME, '0', buildRememberCookieOptions(secure))
}

export const clearRememberMeCookie = (cookies: Cookies, secure: boolean) => {
	cookies.delete(ADMIN_REMEMBER_COOKIE_NAME, buildRememberCookieOptions(secure))
}

