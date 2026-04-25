<script lang="ts">
	import type { PageData } from './$types'
	import ArrowRight from 'lucide-svelte/icons/arrow-right'
	import ClipboardList from 'lucide-svelte/icons/clipboard-list'
	import ListTodo from 'lucide-svelte/icons/list-todo'
	import ShieldUser from 'lucide-svelte/icons/shield-user'

	const { data }: { data: PageData } = $props()

	const dateFormatter = new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	})

	const numberFormatter = new Intl.NumberFormat('id-ID')
	const formatDate = (value: string | null) => (value ? dateFormatter.format(new Date(`${value}T00:00:00`)) : '-')
	const formatNumber = (value: number) => numberFormatter.format(value)
</script>

<section class="mx-auto w-full max-w-[1320px] space-y-6">
	<header class="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_22px_50px_-42px_rgba(15,23,42,0.42)] sm:p-7">
		<div class="relative">
			<div class="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[radial-gradient(circle,_rgba(100,173,49,0.28)_0%,_transparent_72%)]"></div>
			<p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">Dashboard Admin</p>
			<h1 class="mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-[2rem]">Control Center Sikopling</h1>
			<p class="mt-2 max-w-3xl text-sm text-[var(--muted)] sm:text-[0.96rem]">
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

	<div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
		<article class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_16px_30px_-28px_rgba(15,23,42,0.4)]">
			<p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Total Pengajuan</p>
			<p class="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)]">{formatNumber(data.summary.total)}</p>
		</article>
		<article class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_16px_30px_-28px_rgba(15,23,42,0.4)]">
			<p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Pending</p>
			<p class="mt-2 text-3xl font-semibold tracking-tight text-amber-600">{formatNumber(data.summary.pending)}</p>
		</article>
		<article class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_16px_30px_-28px_rgba(15,23,42,0.4)]">
			<p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Dokling</p>
			<p class="mt-2 text-3xl font-semibold tracking-tight text-[#3d7f1d]">{formatNumber(data.summary.dokling)}</p>
		</article>
		<article class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_16px_30px_-28px_rgba(15,23,42,0.4)]">
			<p class="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Pertek</p>
			<p class="mt-2 text-3xl font-semibold tracking-tight text-[#2b8ec9]">{formatNumber(data.summary.pertek)}</p>
		</article>
	</div>

	<div class="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
		<section class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_16px_30px_-28px_rgba(15,23,42,0.4)] sm:p-5">
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

			<div class="mt-3 overflow-hidden rounded-xl border border-[var(--line)]">
				<table class="hidden w-full border-collapse md:table">
					<thead class="bg-[var(--accent-soft)]">
						<tr>
							<th class="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">No Registrasi</th>
							<th class="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">Layanan</th>
							<th class="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">Status</th>
							<th class="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">Update</th>
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

		<section class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_16px_30px_-28px_rgba(15,23,42,0.4)] sm:p-5">
			<h2 class="text-base font-semibold text-[var(--ink)] sm:text-lg">Aksi Cepat</h2>
			<div class="mt-3 grid gap-2">
				<a
					href="/admin/dokling"
					class="group flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-3 text-sm font-semibold text-[var(--muted)] transition hover:border-[#b9d9a3] hover:bg-[var(--secondary-soft)] hover:text-[#2f5f17]"
				>
					<span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface)] text-[#3f7f1f]">
						<ClipboardList class="h-4.5 w-4.5" />
					</span>
					<span>Kelola Dokling</span>
					<ArrowRight class="ml-auto h-4 w-4 transition group-hover:translate-x-0.5" />
				</a>
				<a
					href="/admin/pertek"
					class="group flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-3 text-sm font-semibold text-[var(--muted)] transition hover:border-[#b9d9a3] hover:bg-[var(--secondary-soft)] hover:text-[#2f5f17]"
				>
					<span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface)] text-[#3f7f1f]">
						<ShieldUser class="h-4.5 w-4.5" />
					</span>
					<span>Kelola Pertek</span>
					<ArrowRight class="ml-auto h-4 w-4 transition group-hover:translate-x-0.5" />
				</a>
				<a
					href="/admin/profil"
					class="group flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-3 text-sm font-semibold text-[var(--muted)] transition hover:border-[#b9d9a3] hover:bg-[var(--secondary-soft)] hover:text-[#2f5f17]"
				>
					<span class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface)] text-[#3f7f1f]">
						<ListTodo class="h-4.5 w-4.5" />
					</span>
					<span>Lihat Profil Admin</span>
					<ArrowRight class="ml-auto h-4 w-4 transition group-hover:translate-x-0.5" />
				</a>
			</div>
		</section>
	</div>
</section>
