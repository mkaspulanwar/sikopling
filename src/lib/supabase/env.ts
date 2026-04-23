import { env } from '$env/dynamic/public'

const normalizeSupabaseUrl = (rawUrl: string) => {
	const trimmed = rawUrl.trim().replace(/\/+$/, '')
	return trimmed.replace(/\/rest\/v1$/i, '')
}

export const getSupabasePublicEnv = () => {
	if (!env.PUBLIC_SUPABASE_URL || !env.PUBLIC_SUPABASE_ANON_KEY) {
		return null
	}

	return {
		url: normalizeSupabaseUrl(env.PUBLIC_SUPABASE_URL),
		key: env.PUBLIC_SUPABASE_ANON_KEY
	}
}

export const hasSupabasePublicEnv = () => getSupabasePublicEnv() !== null
