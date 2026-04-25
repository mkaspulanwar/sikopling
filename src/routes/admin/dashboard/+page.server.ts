import {
	EMPTY_SUMMARY,
	createEmptyResult,
	readAdminFilters,
	requireAdminSupabase
} from '$lib/server/admin-route'
import { getAntrianPengajuanSummary, listAntrianPengajuan } from '$lib/server/antrian-pengajuan'
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

export const load: PageServerLoad = async ({ locals, url }) => {
	const filters = readAdminFilters(url.searchParams)
	const auth = await requireAdminSupabase(locals)

	if (auth.state === 'unavailable') {
		return {
			unavailable: true,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary: EMPTY_SUMMARY,
			recentResult: createEmptyResult(filters.page, filters.pageSize),
			loginHistory: []
		}
	}

	if (auth.state === 'unauthorized') {
		return {
			unavailable: false,
			requiresSupabaseAuth: true,
			errorMessage: null,
			filters,
			summary: EMPTY_SUMMARY,
			recentResult: createEmptyResult(filters.page, filters.pageSize),
			loginHistory: []
		}
	}

	try {
		const { user } = await locals.safeGetSession()
		const [summary, recentResult] = await Promise.all([
			getAntrianPengajuanSummary(auth.supabase),
			listAntrianPengajuan(auth.supabase, {
				page: filters.page,
				pageSize: Math.min(filters.pageSize, 12),
				keyword: filters.keyword,
				status: filters.status,
				sortBy: filters.sortBy,
				sortOrder: filters.sortOrder
			})
		])

		return {
			unavailable: false,
			requiresSupabaseAuth: false,
			errorMessage: null,
			filters,
			summary,
			recentResult,
			loginHistory: user ? buildLoginHistory(user) : []
		}
	} catch (error) {
		return {
			unavailable: false,
			requiresSupabaseAuth: false,
			errorMessage: error instanceof Error ? error.message : 'Gagal memuat ringkasan dashboard',
			filters,
			summary: EMPTY_SUMMARY,
			recentResult: createEmptyResult(filters.page, filters.pageSize),
			loginHistory: []
		}
	}
}
