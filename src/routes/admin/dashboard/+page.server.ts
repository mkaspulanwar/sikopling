import {
	EMPTY_SUMMARY,
	createEmptyResult,
	logAdminLoad,
	readAdminFilters
} from '$lib/server/admin-route'
import { listAntrianPengajuan } from '$lib/server/antrian-pengajuan'
import type { PageServerLoad } from './$types'

type LoginHistoryItem = {
	id: string
	label: string
	description: string
	timestamp: string
}

const buildLoginHistory = (user: { email?: string | null; last_sign_in_at?: string | null; created_at?: string | null }) => {
	const emailLabel = user.email ?? 'akun admin'
	const items = [
		{
			id: 'last-login',
			label: 'Login Terakhir',
			description: `Akses terbaru oleh ${emailLabel}.`,
			timestamp: user.last_sign_in_at
		},
		{
			id: 'account-created',
			label: 'Akun Terdaftar',
			description: `Akun ${emailLabel} tercatat di sistem.`,
			timestamp: user.created_at
		}
	].filter((item): item is LoginHistoryItem => Boolean(item.timestamp))

	return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export const load: PageServerLoad = async ({ locals, url, parent, depends }) => {
	depends('admin:dashboard')

	const filters = readAdminFilters(url.searchParams)
	const adminData = await parent()

	if (!adminData.supabaseAvailable || !locals.supabase) {
		logAdminLoad('admin/dashboard/+page.server', { state: 'unavailable' })
		return {
			unavailable: true,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary: adminData.summary ?? EMPTY_SUMMARY,
			recentResult: createEmptyResult(filters.page, filters.pageSize),
			loginHistory: []
		}
	}

	if (!adminData.isAdmin) {
		logAdminLoad('admin/dashboard/+page.server', { state: 'forbidden', role: adminData.role })
		return {
			unavailable: false,
			requiresSupabaseAuth: true,
			errorMessage: null,
			filters,
			summary: adminData.summary ?? EMPTY_SUMMARY,
			recentResult: createEmptyResult(filters.page, filters.pageSize),
			loginHistory: []
		}
	}

	try {
		const recentResult = await listAntrianPengajuan(locals.supabase, {
			page: filters.page,
			pageSize: Math.min(filters.pageSize, 12),
			keyword: filters.keyword,
			status: filters.status,
			sortBy: filters.sortBy,
			sortOrder: filters.sortOrder
		})

		logAdminLoad('admin/dashboard/+page.server', {
			state: 'ok',
			page: filters.page,
			pageSize: Math.min(filters.pageSize, 12)
		})

		return {
			unavailable: false,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary: adminData.summary,
			recentResult,
			loginHistory: adminData.user ? buildLoginHistory(adminData.user) : []
		}
	} catch (error) {
		return {
			unavailable: false,
			requiresSupabaseAuth: false,
			errorMessage: error instanceof Error ? error.message : 'Gagal memuat ringkasan dashboard',
			filters,
			summary: adminData.summary ?? EMPTY_SUMMARY,
			recentResult: createEmptyResult(filters.page, filters.pageSize),
			loginHistory: []
		}
	}
}
