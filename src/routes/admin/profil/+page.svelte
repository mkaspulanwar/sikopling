<script lang="ts">
	import type { PageData } from './$types'
	import ArrowRight from 'lucide-svelte/icons/arrow-right'
	import CalendarDays from 'lucide-svelte/icons/calendar-days'
	import CheckCircle2 from 'lucide-svelte/icons/check-circle-2'
	import Clock3 from 'lucide-svelte/icons/clock-3'
	import KeyRound from 'lucide-svelte/icons/key-round'
	import LogOut from 'lucide-svelte/icons/log-out'
	import Mail from 'lucide-svelte/icons/mail'
	import Settings2 from 'lucide-svelte/icons/settings-2'
	import ShieldCheck from 'lucide-svelte/icons/shield-check'
	import UserRound from 'lucide-svelte/icons/user-round'

	const { data }: { data: PageData } = $props()

	type AdminProfileUser = {
		id?: string
		email?: string | null
		email_confirmed_at?: string | null
		created_at?: string | null
		last_sign_in_at?: string | null
		app_metadata?: {
			provider?: unknown
		} | null
		user_metadata?: {
			full_name?: unknown
			name?: unknown
			display_name?: unknown
			username?: unknown
		} | null
	}

	const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'long',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})

	const formatDateTime = (value: string | null | undefined) => {
		if (!value) return 'Belum tersedia'
		const parsed = new Date(value)
		return Number.isNaN(parsed.getTime()) ? 'Belum tersedia' : dateTimeFormatter.format(parsed)
	}

	const resolveAccountLabel = (user: AdminProfileUser | null | undefined) => {
		const metadata = user?.user_metadata ?? {}
		const candidates = [
			metadata.full_name,
			metadata.name,
			metadata.display_name,
			metadata.username,
			user?.email?.split('@')[0]
		]

		for (const candidate of candidates) {
			if (typeof candidate === 'string' && candidate.trim()) return candidate.trim()
		}

		return 'Admin Sikopling'
	}

	const user = $derived.by(() => data.user as AdminProfileUser | null | undefined)
	const roleLabel = $derived.by(() => (data.role ? data.role.replaceAll('_', ' ') : 'admin'))
	const accountLabel = $derived.by(() => resolveAccountLabel(user))
	const emailLabel = $derived.by(() => user?.email ?? 'admin@sikopling.id')
	const providerLabel = $derived.by(() => {
		const provider = user?.app_metadata?.provider
		return typeof provider === 'string' && provider.trim() ? provider.trim() : 'email'
	})
	const profileInitials = $derived.by(
		() =>
			accountLabel
				.split(/[\s._-]+/)
				.filter(Boolean)
				.slice(0, 2)
				.map((part) => part[0]?.toUpperCase() ?? '')
				.join('') || 'AS'
	)
</script>

<section class="mx-auto w-full max-w-[1120px]">
	<header class="border-b border-[var(--line)] pb-6">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-[#4e9123]">Administrasi Akun</p>
		<h1 class="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-[2.35rem]">Profil Pengguna</h1>
		<p class="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-[0.96rem]">
			Tinjau identitas akun, hak akses, dan aktivitas login yang terhubung ke panel admin Sikopling.
		</p>
	</header>

	<div class="grid gap-8 py-7 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-10">
		<aside>
			<div class="inline-flex h-24 w-24 items-center justify-center rounded-[1.75rem] bg-[#64AD31] text-2xl font-semibold tracking-tight text-white shadow-[0_18px_36px_-24px_rgba(78,145,35,0.85)]">
				{profileInitials}
			</div>

			<h2 class="mt-5 break-words text-xl font-semibold tracking-tight text-[var(--ink)]">{accountLabel}</h2>
			<p class="mt-1 break-all text-sm text-[var(--muted)]">{emailLabel}</p>

			<div class="mt-4 flex flex-wrap gap-2">
				<span class="inline-flex items-center gap-1.5 rounded-full bg-[#eaf6e1] px-2.5 py-1 text-xs font-semibold text-[#39751c]">
					<CheckCircle2 class="h-3.5 w-3.5" />
					Aktif
				</span>
				<span class="rounded-full bg-[#edf0fb] px-2.5 py-1 text-xs font-semibold capitalize text-[#5267bf]">{roleLabel}</span>
			</div>

			<a
				href="/admin/pengaturan"
				class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)] transition hover:text-[#4e9123]"
			>
				<Settings2 class="h-4 w-4" />
				Pengaturan dashboard
			</a>
		</aside>

		<div class="lg:border-l lg:border-[var(--line)] lg:pl-10">
			<section class="pb-7">
				<div class="flex items-center gap-2.5">
					<UserRound class="h-5 w-5 text-[#4e9123]" />
					<h2 class="text-lg font-semibold text-[var(--ink)]">Informasi Dasar</h2>
				</div>
				<p class="mt-1.5 text-sm text-[var(--muted)]">Identitas utama yang digunakan pada panel admin.</p>

				<dl class="mt-5 divide-y divide-[var(--line)] border-y border-[var(--line)]">
					<div class="grid gap-1 py-3.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
						<dt class="text-sm font-medium text-[var(--muted)]">Nama tampilan</dt>
						<dd class="break-words text-sm font-semibold text-[var(--ink)]">{accountLabel}</dd>
					</div>
					<div class="grid gap-1 py-3.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
						<dt class="text-sm font-medium text-[var(--muted)]">Alamat email</dt>
						<dd class="break-all text-sm font-semibold text-[var(--ink)]">{emailLabel}</dd>
					</div>
					<div class="grid gap-1 py-3.5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
						<dt class="text-sm font-medium text-[var(--muted)]">ID akun</dt>
						<dd class="break-all font-mono text-xs font-medium text-[var(--ink)]">{user?.id ?? 'Belum tersedia'}</dd>
					</div>
				</dl>
			</section>

			<section class="border-t border-[var(--line)] py-7">
				<div class="flex items-center gap-2.5">
					<ShieldCheck class="h-5 w-5 text-[#4e9123]" />
					<h2 class="text-lg font-semibold text-[var(--ink)]">Akses dan Keamanan</h2>
				</div>
				<p class="mt-1.5 text-sm text-[var(--muted)]">Ringkasan akses akun yang sedang digunakan.</p>

				<div class="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
					<div>
						<p class="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Role akun</p>
						<p class="mt-1.5 text-sm font-semibold capitalize text-[var(--ink)]">{roleLabel}</p>
					</div>
					<div>
						<p class="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Metode masuk</p>
						<p class="mt-1.5 text-sm font-semibold capitalize text-[var(--ink)]">{providerLabel}</p>
					</div>
					<div>
						<p class="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Verifikasi email</p>
						<p class="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]">
							<Mail class="h-4 w-4 text-[#4e9123]" />
							{user?.email_confirmed_at ? 'Terverifikasi' : 'Belum terverifikasi'}
						</p>
					</div>
					<div>
						<p class="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Status akses</p>
						<p class="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]">
							<KeyRound class="h-4 w-4 text-[#4e9123]" />
							Akses admin aktif
						</p>
					</div>
				</div>
			</section>

			<section class="border-t border-[var(--line)] py-7">
				<div class="flex items-center gap-2.5">
					<Clock3 class="h-5 w-5 text-[#4e9123]" />
					<h2 class="text-lg font-semibold text-[var(--ink)]">Aktivitas Akun</h2>
				</div>
				<p class="mt-1.5 text-sm text-[var(--muted)]">Waktu penting yang tercatat pada akun Supabase Auth.</p>

				<div class="mt-5 grid gap-3 sm:grid-cols-2">
					<div class="flex gap-3 rounded-xl bg-[#f5f8fb] p-3.5">
						<Clock3 class="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#4e9123]" />
						<div>
							<p class="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">Login terakhir</p>
							<p class="mt-1 text-sm font-semibold leading-relaxed text-[var(--ink)]">{formatDateTime(user?.last_sign_in_at)}</p>
						</div>
					</div>
					<div class="flex gap-3 rounded-xl bg-[#f5f8fb] p-3.5">
						<CalendarDays class="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#4e9123]" />
						<div>
							<p class="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">Akun dibuat</p>
							<p class="mt-1 text-sm font-semibold leading-relaxed text-[var(--ink)]">{formatDateTime(user?.created_at)}</p>
						</div>
					</div>
				</div>
			</section>

			<section class="flex flex-col gap-3 border-t border-[var(--line)] pt-7 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 class="text-base font-semibold text-[var(--ink)]">Keluar dari sesi admin</h2>
					<p class="mt-1 text-sm text-[var(--muted)]">Akhiri sesi pada perangkat ini jika panel tidak lagi digunakan.</p>
				</div>
				<a
					href="/logout"
					class="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#d64545] px-3.5 text-sm font-semibold text-[#c63d3d] transition hover:bg-[#d64545] hover:text-white"
				>
					<LogOut class="h-4 w-4" />
					Logout
					<ArrowRight class="h-3.5 w-3.5" />
				</a>
			</section>
		</div>
	</div>
</section>
