<script lang="ts">
	import type { PageData } from './$types'
	import ArrowRight from 'lucide-svelte/icons/arrow-right'
	import Bell from 'lucide-svelte/icons/bell'
	import Search from 'lucide-svelte/icons/search'
	import Settings2 from 'lucide-svelte/icons/settings-2'

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

	const dateFormatter = new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	})
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

	const numberFormatter = new Intl.NumberFormat('id-ID')
	const formatDate = (value: string | null) => (value ? dateFormatter.format(new Date(`${value}T00:00:00`)) : '-')
	const formatDateTime = (value: string | null) => {
		if (!value) return '-'
		const parsed = new Date(value)
		return Number.isNaN(parsed.getTime()) ? '-' : dateTimeFormatter.format(parsed)
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
</script>

<section class="mx-auto w-full max-w-[1320px] space-y-6">
	<header class="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
		<div class="flex flex-col gap-5">
			<div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
				<div class="flex w-full min-w-0 flex-col gap-4 lg:max-w-3xl">
					<div class="flex flex-col gap-3 lg:flex-row lg:items-center">
						<label
							class="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 text-[var(--muted)] transition focus-within:border-[#64AD31]"
						>
							<Search class="h-5 w-5 shrink-0" aria-hidden="true" />
							<input
								type="search"
								placeholder="Cari pengajuan, instansi, atau nomor registrasi"
								class="w-full appearance-none border-0 bg-transparent text-sm font-medium text-[var(--ink)] outline-none ring-0 shadow-none focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none placeholder:text-[var(--muted)]"
								aria-label="Cari pengajuan di dashboard admin"
							/>
						</label>

						<div
							class="flex h-17 w-17 shrink-0 flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-white text-center"
							aria-label={`Tanggal hari ini ${todayLabel}`}
						>
							<span class="bg-[#64AD31] px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white">
								{todayMonthLabel}
							</span>
							<span class="pt-1 text-xl font-semibold leading-none text-[var(--ink)]">{todayDayLabel}</span>
							<span class="pb-1 text-[0.68rem] font-medium text-[var(--muted)]">{todayWeekdayLabel}</span>
						</div>
					</div>
				</div>

				<div class="flex items-center gap-2 self-start lg:self-auto">
					<a
						href="/admin/pengaturan"
						class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-[var(--muted)] transition hover:border-[#64AD31] hover:text-[var(--ink)]"
						aria-label="Buka pengaturan admin"
					>
						<Settings2 class="h-5 w-5" aria-hidden="true" />
					</a>

					<button
						type="button"
						class="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] text-[var(--muted)] transition hover:border-[#64AD31] hover:text-[var(--ink)]"
						aria-label="Lihat notifikasi admin"
					>
						<Bell class="h-5 w-5" aria-hidden="true" />
						<span class="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#64AD31]" aria-hidden="true"></span>
					</button>

					<a
						href="/admin/profil"
						class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-[#6278d6] text-sm font-semibold text-white transition hover:brightness-95"
						aria-label="Buka profil admin"
					>
						{profileInitials}
					</a>
				</div>
			</div>

			<div class="space-y-2">
				<p class="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Selamat datang kembali</p>
				<h1 class="max-w-4xl text-[2.15rem] font-semibold leading-[0.96] tracking-tight text-[var(--ink)] sm:text-[3.1rem] lg:text-[3.75rem]">
					<div class=" text-[#64AD31] uppercase">{accountLabel}</div>
				</h1>
			</div>
		</div>
	</header>

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
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Total Pengajuan</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.summary.total)}</p>
		</article>
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Total Perling</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.summary.perling)}</p>
		</article>
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Total Pertek</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.summary.pertek)}</p>
		</article>
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Selesai</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.summary.selesai)}</p>
		</article>
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Diproses</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.summary.diproses)}</p>
		</article>
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Ditolak</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.summary.ditolak)}</p>
		</article>
	</div>

	<div class="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
		<section class="rounded-2xl border border-(--line) bg-[var(--surface)] p-4 sm:p-5">
			<div class="flex flex-wrap items-center justify-between gap-2">
				<h2 class="text-base font-semibold text-[var(--ink)] sm:text-lg">Pengajuan Terbaru</h2>
				<a
					href="/admin/layanan/perling"
					class="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 text-xs font-semibold text-[var(--muted)] transition hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]"
				>
					Lihat antrian
					<ArrowRight class="h-3.5 w-3.5" />
				</a>
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
						{#if data.recentResult.data.length === 0}
							<tr class="border-t border-[var(--line)]">
								<td colspan="4" class="px-3 py-8 text-center text-sm text-[var(--muted)]">Belum ada data pengajuan.</td>
							</tr>
						{:else}
							{#each data.recentResult.data as row}
								<tr class="border-t border-[var(--line)]">
									<td class="px-3 py-2.5 text-sm font-semibold text-[var(--ink)]">{row.no_registrasi}</td>
									<td class="px-3 py-2.5 text-sm uppercase text-[var(--muted)]">{row.layanan}</td>
									<td class="px-3 py-2.5 text-sm text-[var(--muted)]">{row.status}</td>
									<td class="px-3 py-2.5 text-sm text-[var(--muted)]">{formatDate(row.tanggal_update)}</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>

				<div class="space-y-2 p-3 md:hidden">
					{#if data.recentResult.data.length === 0}
						<p class="px-2 py-6 text-center text-sm text-[var(--muted)]">Belum ada data pengajuan.</p>
					{:else}
						{#each data.recentResult.data as row}
							<div class="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3">
								<p class="text-sm font-semibold text-[var(--ink)]">{row.no_registrasi}</p>
								<p class="mt-1 text-xs uppercase tracking-[0.08em] text-[var(--muted)]">{row.layanan}</p>
								<p class="mt-2 text-xs text-[var(--muted)]">{row.status} - {formatDate(row.tanggal_update)}</p>
							</div>
						{/each}
					{/if}
				</div>
			</div>
		</section>

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
	</div>
</section>
