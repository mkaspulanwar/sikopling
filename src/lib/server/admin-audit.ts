import type { Database } from '$lib/supabase/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

export const AUDIT_ACTION_OPTIONS = ['insert', 'update', 'delete'] as const
export const AUDIT_RESOURCE_OPTIONS = [
	'admin_profiles',
	'monitoring_perling',
	'monitoring_pertek',
	'monitoring_integrasi',
	'pengumuman_perling',
	'pengumuman_pertek',
	'pengumuman_integrasi'
] as const

export type AuditAction = (typeof AUDIT_ACTION_OPTIONS)[number]
export type AuditResourceType = (typeof AUDIT_RESOURCE_OPTIONS)[number]
export type AdminAuditLogRow = Database['public']['Tables']['admin_audit_logs']['Row']

export type AdminAuditFilters = {
	page: number
	pageSize: number
	keyword?: string
	action?: AuditAction
	resourceType?: AuditResourceType
	actorEmail?: string
}

export type AdminAuditLogResult = {
	data: AdminAuditLogRow[]
	total: number
	page: number
	pageSize: number
	totalPages: number
}

const readNumber = (value: string | null, fallback: number) => {
	if (!value) return fallback
	const parsed = Number(value)
	if (!Number.isFinite(parsed)) return fallback
	return Math.floor(parsed)
}

const readString = (value: string | null) => {
	if (!value) return undefined
	const trimmed = value.trim()
	return trimmed.length > 0 ? trimmed : undefined
}

export const readAdminAuditFilters = (query: URLSearchParams): AdminAuditFilters => {
	const action = readString(query.get('action'))
	const resourceType = readString(query.get('resourceType'))

	return {
		page: Math.max(1, readNumber(query.get('page'), DEFAULT_PAGE)),
		pageSize: Math.min(MAX_PAGE_SIZE, Math.max(10, readNumber(query.get('pageSize'), DEFAULT_PAGE_SIZE))),
		keyword: readString(query.get('keyword')),
		actorEmail: readString(query.get('actorEmail')),
		action: AUDIT_ACTION_OPTIONS.includes(action as AuditAction) ? (action as AuditAction) : undefined,
		resourceType: AUDIT_RESOURCE_OPTIONS.includes(resourceType as AuditResourceType)
			? (resourceType as AuditResourceType)
			: undefined
	}
}

export const createEmptyAdminAuditResult = (page: number, pageSize: number): AdminAuditLogResult => ({
	data: [],
	total: 0,
	page,
	pageSize,
	totalPages: 1
})

export const listAdminAuditLogs = async (
	supabase: SupabaseClient<Database>,
	filters: AdminAuditFilters
): Promise<AdminAuditLogResult> => {
	const from = (filters.page - 1) * filters.pageSize
	const to = from + filters.pageSize - 1

	let query = supabase
		.from('admin_audit_logs')
		.select(
			'id, actor_id, actor_email, actor_role, action, resource_type, resource_id, summary, before_data, after_data, metadata, created_at',
			{ count: 'exact' }
		)
		.order('created_at', { ascending: false })
		.range(from, to)

	if (filters.action) {
		query = query.eq('action', filters.action)
	}

	if (filters.resourceType) {
		query = query.eq('resource_type', filters.resourceType)
	}

	if (filters.actorEmail) {
		query = query.ilike('actor_email', `%${filters.actorEmail}%`)
	}

	if (filters.keyword) {
		const keyword = `%${filters.keyword}%`
		query = query.or(
			`summary.ilike.${keyword},actor_email.ilike.${keyword},resource_id.ilike.${keyword},resource_type.ilike.${keyword}`
		)
	}

	const { data, count, error } = await query
	if (error) throw error

	const total = count ?? 0
	return {
		data: (data ?? []) as AdminAuditLogRow[],
		total,
		page: filters.page,
		pageSize: filters.pageSize,
		totalPages: Math.max(1, Math.ceil(total / filters.pageSize))
	}
}
