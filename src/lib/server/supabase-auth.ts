import type { User } from '@supabase/supabase-js'

export const ADMIN_ROLES = new Set(['super_admin', 'admin', 'operator', 'reviewer'])

const normalizeRole = (value: unknown) =>
	typeof value === 'string' ? value.trim().toLowerCase() : null

export const resolveUserRole = (user: User | null) => {
	const roleCandidates = [
		user?.app_metadata?.role,
		user?.user_metadata?.role,
		user?.app_metadata?.user_role,
		user?.user_metadata?.user_role
	]

	for (const candidate of roleCandidates) {
		const normalized = normalizeRole(candidate)
		if (normalized) return normalized
	}

	return null
}

export const isAdminRole = (role: string | null) => Boolean(role && ADMIN_ROLES.has(role))
