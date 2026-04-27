<script lang="ts">
	import type { PageData } from './$types'
	import ArrowRight from 'lucide-svelte/icons/arrow-right'

	const { data }: { data: PageData } = $props()

	const dateFormatter = new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
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
</script>

<section class="mx-auto w-full max-w-[1320px] space-y-6">
	<header class="overflow-hidden rounded-3xl border border-[var(--line)] bg-[#64AD31] p-6 sm:p-7">
		<div class="relative">
			<div class="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full"></div>
			<p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--surface)]">Dashboard Admin</p>
			<h1 class="mt-2 text-2xl font-semibold tracking-tight text-[var(--surface)] sm:text-[2rem]">Control Center Sikopling</h1>
			<p class="mt-2 max-w-3xl text-sm text-[var(--surface)] sm:text-[0.96rem]">
				Pantau volume dokumen lingkungan dan persetujuan teknis secara real-time, lalu lanjutkan ke halaman operasional untuk tindakan berikutnya.
			</p>
		</div>
	</header>

	{#if data.unavailable}
		<p class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
			Supabase belum dikonfigurasi. Isi `PUBLIC_SUPABASE_URL` dan `PUBLIC_SUPABASE_ANON_KEY`.
		</p>
	{/if}
	{#if data.requiresSupabaseAuth}
		<p class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
			Halaman admin membutuhkan akun Supabase Auth dengan role admin.
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
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Total Dokling</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.summary.dokling)}</p>
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
					href="/admin/dokling"
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
