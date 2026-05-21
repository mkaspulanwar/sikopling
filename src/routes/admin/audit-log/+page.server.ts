import {
	AUDIT_ACTION_OPTIONS,
	AUDIT_RESOURCE_OPTIONS,
	createEmptyAdminAuditResult,
	listAdminAuditLogs,
	readAdminAuditFilters
} from '$lib/server/admin-audit'
import { logAdminLoad } from '$lib/server/admin-route'
import { isSuperAdminRole } from '$lib/server/supabase-auth'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals, parent, depends }) => {
	depends('admin:audit-log')

	const adminData = await parent()
	const filters = readAdminAuditFilters(url.searchParams)

	if (!adminData.supabaseAvailable || !locals.supabase) {
		logAdminLoad('admin/audit-log/+page.server', { state: 'unavailable' })
		return {
			unavailable: true,
			forbidden: false,
			errorMessage: null,
			filters,
			result: createEmptyAdminAuditResult(filters.page, filters.pageSize),
			actionOptions: [...AUDIT_ACTION_OPTIONS],
			resourceOptions: [...AUDIT_RESOURCE_OPTIONS]
		}
	}

	if (!adminData.isAdmin || !isSuperAdminRole(adminData.role)) {
		logAdminLoad('admin/audit-log/+page.server', { state: 'forbidden', role: adminData.role })
		return {
			unavailable: false,
			forbidden: true,
			errorMessage: null,
			filters,
			result: createEmptyAdminAuditResult(filters.page, filters.pageSize),
			actionOptions: [...AUDIT_ACTION_OPTIONS],
			resourceOptions: [...AUDIT_RESOURCE_OPTIONS]
		}
	}

	try {
		const result = await listAdminAuditLogs(locals.supabase, filters)
		logAdminLoad('admin/audit-log/+page.server', {
			state: 'ok',
			page: filters.page,
			pageSize: filters.pageSize,
			action: filters.action,
			resourceType: filters.resourceType
		})

		return {
			unavailable: false,
			forbidden: false,
			errorMessage: null,
			filters,
			result,
			actionOptions: [...AUDIT_ACTION_OPTIONS],
			resourceOptions: [...AUDIT_RESOURCE_OPTIONS]
		}
	} catch (error) {
		return {
			unavailable: false,
			forbidden: false,
			errorMessage: error instanceof Error ? error.message : 'Gagal memuat audit log',
			filters,
			result: createEmptyAdminAuditResult(filters.page, filters.pageSize),
			actionOptions: [...AUDIT_ACTION_OPTIONS],
			resourceOptions: [...AUDIT_RESOURCE_OPTIONS]
		}
	}
}
