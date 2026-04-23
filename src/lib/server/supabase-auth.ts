import type { User } from '@supabase/supabase-js'

export const ADMIN_ROLES = new Set(['super_admin', 'admin', 'operator', 'reviewer'])

export const resolveUserRole = (user: User | null) =>
	(typeof user?.app_metadata?.role === 'string' && user.app_metadata.role) ||
	(typeof user?.user_metadata?.role === 'string' && user.user_metadata.role) ||
	null

export const isAdminRole = (role: string | null) => Boolean(role && ADMIN_ROLES.has(role))
