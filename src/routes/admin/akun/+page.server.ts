import { createSupabaseAdminClient } from '$lib/supabase/admin'
import type { Database, Json } from '$lib/supabase/database.types'
import { isSuperAdminRole, resolveUserRole } from '$lib/server/supabase-auth'
import { fail } from '@sveltejs/kit'
import type { User } from '@supabase/supabase-js'
import type { Actions, PageServerLoad } from './$types'

type AdminProfile = Database['public']['Tables']['admin_profiles']['Row']
type AdminAccount = AdminProfile & {
	auth_email_confirmed_at: string | null
	auth_last_sign_in_at: string | null
	providers: string[]
}
type SupabaseAdminClient = NonNullable<ReturnType<typeof createSupabaseAdminClient>>

const ROLE_ADMIN = 'admin'
const ROLE_DISABLED_ADMIN = 'disabled_admin'

const normalizeEmail = (value: FormDataEntryValue | null) => String(value ?? '').trim().toLowerCase()
const normalizeText = (value: FormDataEntryValue | null) => String(value ?? '').trim()

const getUserMetadata = (user: User, role: string, fullName?: string | null) => ({
	...(user.user_metadata ?? {}),
	role,
	full_name: fullName || user.user_metadata?.full_name || user.email?.split('@')[0] || ''
})

const getAppMetadata = (user: User, role: string) => ({
	...(user.app_metadata ?? {}),
	role
})

const getRedirectUrl = (origin: string) => {
	return new URL('/auth/reset-password', origin).toString()
}

const findAuthUserByEmail = async (adminSupabase: SupabaseAdminClient, email: string) => {
	const { data, error } = await adminSupabase.auth.admin.listUsers({
		page: 1,
		perPage: 1000
	})

	if (error) return { user: null, error }

	return {
		user: data.users.find((authUser) => authUser.email?.trim().toLowerCase() === email) ?? null,
		error: null
	}
}

const insertAuditLog = async (
	adminSupabase: SupabaseAdminClient,
	actor: User,
	actorRole: string | null,
	action: 'insert' | 'update',
	resourceId: string,
	summary: string,
	beforeData: Json = null,
	afterData: Json = null,
	metadata: Json = null
) => {
	await adminSupabase.from('admin_audit_logs').insert({
		actor_id: actor.id,
		actor_email: actor.email ?? null,
		actor_role: actorRole,
		action,
		resource_type: 'admin_profiles',
		resource_id: resourceId,
		summary,
		before_data: beforeData,
		after_data: afterData,
		metadata
	})
}

const readActor = async (locals: App.Locals) => {
	const { user } = await locals.safeGetSession()
	const actorRole = resolveUserRole(user)
	return { user, actorRole, isAllowed: Boolean(user && isSuperAdminRole(actorRole)) }
}

export const load: PageServerLoad = async ({ locals, parent, fetch, depends }) => {
	depends('admin:accounts')

	const adminData = await parent()
	const emptyResult = {
		unavailable: false,
		forbidden: false,
		errorMessage: null as string | null,
		accounts: [] as AdminAccount[]
	}

	if (!adminData.supabaseAvailable || !locals.supabase) {
		return { ...emptyResult, unavailable: true }
	}

	if (!adminData.isAdmin || !isSuperAdminRole(adminData.role)) {
		return { ...emptyResult, forbidden: true }
	}

	const adminSupabase = createSupabaseAdminClient(fetch)
	if (!adminSupabase) {
		return {
			...emptyResult,
			errorMessage: 'SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di server.'
		}
	}

	const { data: profiles, error: profileError } = await adminSupabase
		.from('admin_profiles')
		.select('*')
		.order('role', { ascending: false })
		.order('created_at', { ascending: true })

	if (profileError) {
		return {
			...emptyResult,
			errorMessage: profileError.message
		}
	}

	const { data: authData, error: authError } = await adminSupabase.auth.admin.listUsers({
		page: 1,
		perPage: 1000
	})

	const authUsers = new Map((authData?.users ?? []).map((authUser) => [authUser.id, authUser]))
	const accounts = (profiles ?? []).map((profile) => {
		const authUser = authUsers.get(profile.id)
		return {
			...profile,
			auth_email_confirmed_at: authUser?.email_confirmed_at ?? null,
			auth_last_sign_in_at: authUser?.last_sign_in_at ?? profile.last_login_at,
			providers: authUser?.identities?.map((identity) => identity.provider).filter(Boolean) ?? []
		}
	})

	return {
		...emptyResult,
		errorMessage: authError?.message ?? null,
		accounts
	}
}

export const actions: Actions = {
	invite: async ({ request, locals, fetch, url }) => {
		const { user, actorRole, isAllowed } = await readActor(locals)
		if (!isAllowed || !user) {
			return fail(403, { error: 'Hanya super admin yang dapat mengundang admin baru.' })
		}

		const formData = await request.formData()
		const email = normalizeEmail(formData.get('email'))
		const fullName = normalizeText(formData.get('fullName'))

		if (!email) {
			return fail(400, {
				error: 'Email wajib diisi.',
				values: { email, fullName }
			})
		}

		const adminSupabase = createSupabaseAdminClient(fetch)
		if (!adminSupabase) {
			return fail(503, { error: 'SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di server.' })
		}

		const { user: existingAuthUser, error: listError } = await findAuthUserByEmail(adminSupabase, email)
		if (listError) {
			return fail(400, {
				error: `Gagal memeriksa akun Google/email yang sudah ada: ${listError.message}`,
				values: { email, fullName }
			})
		}

		let authUser = existingAuthUser
		let actionLabel = 'Mengaktifkan'

		if (!authUser) {
			const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(email, {
				data: {
					role: ROLE_ADMIN,
					full_name: fullName || email.split('@')[0]
				},
				redirectTo: getRedirectUrl(url.origin)
			})

			if (error || !data.user) {
				return fail(400, {
					error: error?.message ?? 'Undangan admin gagal dikirim.',
					values: { email, fullName }
				})
			}

			authUser = data.user
			actionLabel = 'Mengundang'
		}

		if (resolveUserRole(authUser) === 'super_admin') {
			return fail(400, {
				error: 'Email ini sudah menjadi super admin utama.',
				values: { email, fullName }
			})
		}

		const { error: authUpdateError } = await adminSupabase.auth.admin.updateUserById(authUser.id, {
			app_metadata: getAppMetadata(authUser, ROLE_ADMIN),
			user_metadata: getUserMetadata(authUser, ROLE_ADMIN, fullName),
			ban_duration: 'none'
		})

		if (authUpdateError) {
			return fail(400, {
				error: authUpdateError.message,
				values: { email, fullName }
			})
		}

		const profilePayload = {
			id: authUser.id,
			email,
			full_name: fullName || email.split('@')[0],
			role: ROLE_ADMIN,
			is_active: true,
			created_by: user.id,
			updated_by: user.id
		} satisfies Database['public']['Tables']['admin_profiles']['Insert']

		const { error: profileError } = await adminSupabase
			.from('admin_profiles')
			.upsert(profilePayload, { onConflict: 'id' })

		if (profileError) {
			return fail(500, {
				error: `Undangan terkirim, tetapi profil admin gagal disimpan: ${profileError.message}`,
				values: { email, fullName }
			})
		}

		await insertAuditLog(
			adminSupabase,
			user,
			actorRole,
			actionLabel === 'Mengundang' ? 'insert' : 'update',
			authUser.id,
			`${actionLabel} admin ${email}`,
			null,
			profilePayload as Json,
			{ source: 'admin_accounts_invite' }
		)

		return {
			success:
				actionLabel === 'Mengundang'
					? `Undangan admin sudah dikirim ke ${email}.`
					: `Akun ${email} sudah diberi akses admin. Silakan login ulang dengan Google.`
		}
	},
	resetPassword: async ({ request, locals, fetch, url }) => {
		const { user, actorRole, isAllowed } = await readActor(locals)
		if (!isAllowed || !user) {
			return fail(403, { error: 'Hanya super admin yang dapat mengirim reset sandi.' })
		}

		const formData = await request.formData()
		const id = normalizeText(formData.get('id'))
		const email = normalizeEmail(formData.get('email'))

		if (!id || !email) {
			return fail(400, { error: 'Akun admin tidak valid.' })
		}

		const adminSupabase = createSupabaseAdminClient(fetch)
		if (!adminSupabase) {
			return fail(503, { error: 'SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di server.' })
		}

		const { error } = await adminSupabase.auth.resetPasswordForEmail(email, {
			redirectTo: getRedirectUrl(url.origin)
		})

		if (error) {
			return fail(400, { error: error.message })
		}

		await insertAuditLog(
			adminSupabase,
			user,
			actorRole,
			'update',
			id,
			`Mengirim reset sandi admin ${email}`,
			null,
			null,
			{ source: 'admin_accounts_reset_password' }
		)

		return { success: `Email reset sandi sudah dikirim ke ${email}.` }
	},
	toggleActive: async ({ request, locals, fetch }) => {
		const { user, actorRole, isAllowed } = await readActor(locals)
		if (!isAllowed || !user) {
			return fail(403, { error: 'Hanya super admin yang dapat mengubah status admin.' })
		}

		const formData = await request.formData()
		const id = normalizeText(formData.get('id'))
		const nextActive = formData.get('nextActive') === 'true'

		if (!id) {
			return fail(400, { error: 'Akun admin tidak valid.' })
		}

		const adminSupabase = createSupabaseAdminClient(fetch)
		if (!adminSupabase) {
			return fail(503, { error: 'SUPABASE_SERVICE_ROLE_KEY belum dikonfigurasi di server.' })
		}

		const { data: profile, error: profileError } = await adminSupabase
			.from('admin_profiles')
			.select('*')
			.eq('id', id)
			.single()

		if (profileError || !profile) {
			return fail(404, { error: 'Profil admin tidak ditemukan.' })
		}

		if (profile.role === 'super_admin') {
			return fail(400, { error: 'Super admin utama tidak dapat dinonaktifkan dari halaman ini.' })
		}

		const { data: authData, error: authError } = await adminSupabase.auth.admin.getUserById(id)
		if (authError || !authData.user) {
			return fail(404, { error: authError?.message ?? 'Akun Auth tidak ditemukan.' })
		}

		const authRole = nextActive ? ROLE_ADMIN : ROLE_DISABLED_ADMIN
		const { error: updateAuthError } = await adminSupabase.auth.admin.updateUserById(id, {
			app_metadata: getAppMetadata(authData.user, authRole),
			user_metadata: getUserMetadata(authData.user, authRole, profile.full_name),
			ban_duration: nextActive ? 'none' : '876000h'
		})

		if (updateAuthError) {
			return fail(400, { error: updateAuthError.message })
		}

		const nextProfile = {
			is_active: nextActive,
			updated_by: user.id
		} satisfies Database['public']['Tables']['admin_profiles']['Update']

		const { error: updateProfileError } = await adminSupabase
			.from('admin_profiles')
			.update(nextProfile)
			.eq('id', id)

		if (updateProfileError) {
			return fail(500, { error: updateProfileError.message })
		}

		await insertAuditLog(
			adminSupabase,
			user,
			actorRole,
			'update',
			id,
			`${nextActive ? 'Mengaktifkan' : 'Menonaktifkan'} admin ${profile.email}`,
			profile as Json,
			{ ...profile, ...nextProfile } as Json,
			{ source: 'admin_accounts_toggle_active' }
		)

		return {
			success: `Akun ${profile.email} berhasil ${nextActive ? 'diaktifkan' : 'dinonaktifkan'}.`
		}
	}
}
