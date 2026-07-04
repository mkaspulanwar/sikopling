<script lang="ts">
	import {
		ADMIN_DASHBOARD_PREFERENCES_CHANGED_EVENT,
		DEFAULT_ADMIN_DASHBOARD_PREFERENCES,
		loadAdminDashboardPreferences,
		type AdminDashboardPreferences
	} from '$lib/admin-dashboard-preferences'
	import type { PageData } from './$types'
	import ArrowRight from 'lucide-svelte/icons/arrow-right'
	import Bell from 'lucide-svelte/icons/bell'
	import Search from 'lucide-svelte/icons/search'
	import Settings2 from 'lucide-svelte/icons/settings-2'
	import { onMount } from 'svelte'

	const { data }: { data: PageData } = $props()

	type AdminProfileUser = {
		email?: string | null
		user_metadata?: {
			full_name?: unknown
			name?: unknown
			display_name?: unknown
			username?: unknown
		} | null
	}

	const headerDateFormatter = new Intl.DateTimeFormat('id-ID', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric'
	})
	const calendarDayFormatter = new Intl.DateTimeFormat('id-ID', {
		day: '2-digit'
	})
	const calendarMonthFormatter = new Intl.DateTimeFormat('id-ID', {
		month: 'short'
	})
	const calendarWeekdayFormatter = new Intl.DateTimeFormat('id-ID', {
		weekday: 'short'
	})
	const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
	const dateTimeWithSecondsFormatter = new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit'
	})

	let dashboardPreferences = $state<AdminDashboardPreferences>({ ...DEFAULT_ADMIN_DASHBOARD_PREFERENCES })
	let recentSearchKeyword = $state('')

	const numberFormatter = new Intl.NumberFormat('id-ID')
	const formatDateTime = (value: string | null) => {
		if (!value) return '-'
		const parsed = new Date(value)
		if (Number.isNaN(parsed.getTime())) return '-'
		return dashboardPreferences.showUpdateSeconds ? dateTimeWithSecondsFormatter.format(parsed) : dateTimeFormatter.format(parsed)
	}
	const formatNumber = (value: number) => numberFormatter.format(value)

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
			if (typeof candidate === 'string' && candidate.trim()) {
				return candidate.trim()
			}
		}

		return 'Admin Sikopling'
	}

	const accountLabel = $derived.by(() => resolveAccountLabel(data.user as AdminProfileUser | null | undefined))
	const todayDate = $derived.by(() => new Date())
	const todayLabel = $derived.by(() => headerDateFormatter.format(new Date()))
	const todayDayLabel = $derived.by(() => calendarDayFormatter.format(todayDate))
	const todayMonthLabel = $derived.by(() => calendarMonthFormatter.format(todayDate).toUpperCase())
	const todayWeekdayLabel = $derived.by(() => calendarWeekdayFormatter.format(todayDate))
	const profileInitials = $derived.by(
		() =>
			accountLabel
				.split(/[\s._-]+/)
				.filter(Boolean)
				.slice(0, 2)
				.map((part) => part[0]?.toUpperCase() ?? '')
				.join('') || 'AS'
	)
	const recentRows = $derived.by(() => data.recentResult.data.slice(0, dashboardPreferences.recentItemsLimit))
	const filteredRecentRows = $derived.by(() => {
		const keyword = recentSearchKeyword.trim().toLowerCase()
		if (!keyword) return recentRows
		return recentRows.filter((row) =>
			[
				row.no_registrasi,
				row.layanan,
				row.status,
				formatDateTime(row.updated_at)
			]
				.filter(Boolean)
				.some((value) => String(value).toLowerCase().includes(keyword))
		)
	})
	const summaryCardClass = $derived.by(
		() =>
			`rounded-xl border border-[#d7dee8] bg-white text-center ${
				dashboardPreferences.compactSummaryCards ? 'px-3 py-3.5' : 'px-4 py-5'
			}`
	)

	onMount(() => {
		const syncPreferences = () => {
			dashboardPreferences = loadAdminDashboardPreferences()
		}
		const handlePreferencesChange = (event: Event) => {
			dashboardPreferences = { ...(event as CustomEvent<AdminDashboardPreferences>).detail }
		}

		syncPreferences()
		window.addEventListener('storage', syncPreferences)
		window.addEventListener(ADMIN_DASHBOARD_PREFERENCES_CHANGED_EVENT, handlePreferencesChange)

		return () => {
			window.removeEventListener('storage', syncPreferences)
			window.removeEventListener(ADMIN_DASHBOARD_PREFERENCES_CHANGED_EVENT, handlePreferencesChange)
		}
	})
</script>

<section class="mx-auto w-full max-w-[1320px] space-y-6">
	<header class={dashboardPreferences.stickyToolbar ? 'sticky top-[4.75rem] z-30 lg:top-4' : undefined}>
		<div class="flex items-center gap-2 rounded-[1.35rem] border border-[var(--line)] bg-[var(--surface)]/90 p-2 sm:gap-3 sm:p-2.5">
			<form method="GET" class="min-w-0 flex-1">
				<label
					class="flex h-11 min-w-0 items-center gap-2.5 rounded-[0.95rem] border border-transparent bg-[#f5f8fb] px-3 text-[var(--muted)] transition focus-within:border-[#64AD31] focus-within:bg-white"
				>
					<Search class="h-4.5 w-4.5 shrink-0" aria-hidden="true" />
					<input
						type="search"
						name="keyword"
						value={data.filters.keyword}
						placeholder="Cari pengajuan, instansi, atau nomor registrasi"
						class="min-w-0 w-full appearance-none border-0 bg-transparent text-sm font-medium text-[var(--ink)] outline-none ring-0 shadow-none focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none placeholder:text-[var(--muted)]"
						aria-label="Cari pengajuan di dashboard admin"
					/>
				</label>
			</form>

			{#if dashboardPreferences.showToolbarDate}
				<div
					class="hidden h-11 shrink-0 items-center gap-2 rounded-[0.95rem] border border-[var(--line)] bg-white px-2.5 xl:flex"
					aria-label={`Tanggal hari ini ${todayLabel}`}
				>
					<span class="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-[#64AD31] px-1.5 text-xs font-bold text-white">
						{todayDayLabel}
					</span>
					<span class="pr-1 text-left leading-tight">
						<span class="block text-[0.66rem] font-semibold text-[var(--ink)]">{todayWeekdayLabel}</span>
						<span class="block text-[0.62rem] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">{todayMonthLabel}</span>
					</span>
				</div>
			{/if}

			<div class="flex shrink-0 items-center gap-1 sm:gap-1.5">
				<a
					href="/admin/pengaturan"
					class="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[var(--muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]"
					aria-label="Buka pengaturan admin"
				>
					<Settings2 class="h-4.5 w-4.5" aria-hidden="true" />
				</a>

				<button
					type="button"
					class="relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-[var(--muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]"
					aria-label="Lihat notifikasi admin"
				>
					<Bell class="h-4.5 w-4.5" aria-hidden="true" />
					<span class="absolute right-2.5 top-2 h-2 w-2 rounded-full border border-white bg-[#64AD31]" aria-hidden="true"></span>
				</button>

				<a
					href="/admin/profil"
					class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#6278d6] text-xs font-semibold text-white transition hover:brightness-95"
					aria-label="Buka profil admin"
				>
					{profileInitials}
				</a>
			</div>
		</div>
	</header>

	{#if dashboardPreferences.showWelcomePanel}
		<section class="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-7">
			<div class="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#64AD31]/10" aria-hidden="true"></div>
			<div class="absolute -bottom-16 right-20 h-32 w-32 rounded-full bg-[#6278d6]/10" aria-hidden="true"></div>

			<div class="relative">
				<div class="flex flex-wrap items-center gap-2">
					<span class="rounded-full bg-[#64AD31]/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[#4e9123]">
						Dashboard Admin
					</span>
					<span class="text-xs font-medium text-[var(--muted)]">{todayLabel}</span>
				</div>

				<p class="mt-7 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Selamat datang kembali</p>
				<h1 class="mt-2 max-w-4xl text-[2.15rem] font-semibold uppercase leading-[0.96] tracking-tight text-[#64AD31] sm:text-[3.1rem] lg:text-[3.75rem]">
					{accountLabel}
				</h1>
				<p class="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
					Pantau ringkasan layanan dan progres pengajuan dari satu tampilan.
				</p>
			</div>
		</section>
	{/if}

	{#if data.unavailable}
		<p class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
			Supabase belum dikonfigurasi. Isi `PUBLIC_SUPABASE_URL` dan `PUBLIC_SUPABASE_ANON_KEY`.
		</p>
	{/if}
	{#if data.requiresSupabaseAuth}
		<p class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
			Halaman admin membutuhkan akun Supabase Auth dengan role admin atau super admin.
		</p>
	{/if}
	{#if data.errorMessage}
		<p class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
			Gagal memuat data: {data.errorMessage}
		</p>
	{/if}

	<div class="grid grid-cols-2 gap-3 lg:grid-cols-3">
		<article class={summaryCardClass}>
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Total Pengajuan</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.summary.total)}</p>
		</article>
		<article class={summaryCardClass}>
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Total Perling</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.summary.perling)}</p>
		</article>
		<article class={summaryCardClass}>
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Total Pertek</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.summary.pertek)}</p>
		</article>
		<article class={summaryCardClass}>
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Selesai</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.summary.selesai)}</p>
		</article>
		<article class={summaryCardClass}>
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Diproses</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.summary.diproses)}</p>
		</article>
		<article class={summaryCardClass}>
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Ditolak</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.summary.ditolak)}</p>
		</article>
	</div>

	<div class={`grid gap-4 ${dashboardPreferences.showLoginHistory ? 'lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]' : ''}`}>
		<section class="rounded-2xl border border-(--line) bg-[var(--surface)] p-4 sm:p-5">
			<div class="flex flex-wrap items-center justify-between gap-2">
				<h2 class="text-base font-semibold text-[var(--ink)] sm:text-lg">Pengajuan Terbaru</h2>
				<div class="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2">
					<label class="flex h-9 min-w-[13rem] flex-1 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 text-[var(--muted)] transition focus-within:border-[#64AD31] sm:max-w-xs">
						<Search class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
						<input
							type="search"
							bind:value={recentSearchKeyword}
							placeholder="Cari pengajuan"
							class="min-w-0 flex-1 border-0 bg-transparent text-xs font-medium text-[var(--ink)] outline-none ring-0 shadow-none focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none placeholder:text-[var(--muted)]"
							aria-label="Cari pengajuan terbaru"
						/>
					</label>
					<a
						href="/admin/layanan/perling"
						class="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]"
					>
						Lihat antrian
						<ArrowRight class="h-3.5 w-3.5" />
					</a>
				</div>
			</div>

			<div class="mt-3 overflow-hidden rounded-xl border border-(--line)">
				<table class="hidden w-full border-collapse md:table">
					<thead class="bg-[#64AD31]">
						<tr>
							<th class="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-(--surface)">No Registrasi</th>
							<th class="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-(--surface)">Layanan</th>
							<th class="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-(--surface)">Status</th>
							<th class="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-(--surface)">Update</th>
						</tr>
					</thead>
					<tbody>
						{#if filteredRecentRows.length === 0}
							<tr class="border-t border-[var(--line)]">
								<td colspan="4" class="px-3 py-8 text-center text-sm text-[var(--muted)]">Belum ada data pengajuan.</td>
							</tr>
						{:else}
							{#each filteredRecentRows as row}
								<tr class="border-t border-[var(--line)]">
									<td class="px-3 py-2.5 text-sm font-semibold text-[var(--ink)]">{row.no_registrasi}</td>
									<td class="px-3 py-2.5 text-sm uppercase text-[var(--muted)]">{row.layanan}</td>
									<td class="px-3 py-2.5 text-sm text-[var(--muted)]">{row.status}</td>
									<td class="px-3 py-2.5 text-sm text-[var(--muted)]">{formatDateTime(row.updated_at)}</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>

				<div class="space-y-2 p-3 md:hidden">
					{#if filteredRecentRows.length === 0}
						<p class="px-2 py-6 text-center text-sm text-[var(--muted)]">Belum ada data pengajuan.</p>
					{:else}
						{#each filteredRecentRows as row}
							<div class="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
								<p class="text-sm font-semibold text-[var(--ink)]">{row.no_registrasi}</p>
								<p class="mt-1 text-xs uppercase tracking-[0.08em] text-[var(--muted)]">{row.layanan}</p>
								<p class="mt-2 text-xs text-[var(--muted)]">{row.status} - {formatDateTime(row.updated_at)}</p>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</section>

		{#if dashboardPreferences.showLoginHistory}
			<section class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
				<div class="flex items-center justify-between gap-2">
					<h2 class="text-base font-semibold text-[var(--ink)] sm:text-lg">Riwayat Login</h2>
					<a
						href="/admin/profil"
						class="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]"
					>
						Profil admin
						<ArrowRight class="h-3.5 w-3.5" />
					</a>
				</div>

				<div class="mt-3 space-y-2">
					{#if data.loginHistory.length === 0}
						<p class="rounded-xl border border-dashed border-[var(--line)] bg-[var(--accent-soft)] px-3 py-6 text-center text-sm text-[var(--muted)]">
							Belum ada data riwayat login.
						</p>
					{:else}
						{#each data.loginHistory as item}
							<article class="rounded-xl border border-[var(--line)] bg-[var(--accent-soft)] p-3">
								<div class="flex items-start gap-3">
									<span class="mt-1.5 h-2.5 w-2.5 rounded-full bg-[#64AD31]" aria-hidden="true"></span>
									<div class="min-w-0">
										<p class="text-sm font-semibold text-[var(--ink)]">{item.label}</p>
										<p class="mt-1 text-xs text-[var(--muted)]">{item.description}</p>
										<p class="mt-2 text-xs font-medium text-[#64AD31]">{formatDateTime(item.timestamp)}</p>
									</div>
								</div>
							</article>
						{/each}
					{/if}
				</div>
			</section>
		{/if}
	</div>
</section>
