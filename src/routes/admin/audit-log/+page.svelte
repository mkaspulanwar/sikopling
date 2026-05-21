<script lang="ts">
	import { page } from '$app/state'
	import type { Json } from '$lib/supabase/database.types'
	import type { PageData } from './$types'

	const { data }: { data: PageData } = $props()

	const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
		dateStyle: 'medium',
		timeStyle: 'short'
	})

	const numberFormatter = new Intl.NumberFormat('id-ID')

	const resourceLabels: Record<string, string> = {
		admin_profiles: 'Akun admin',
		monitoring_perling: 'Data perling',
		monitoring_pertek: 'Data pertek',
		monitoring_integrasi: 'Data integrasi',
		pengumuman_perling: 'Pengumuman perling',
		pengumuman_pertek: 'Pengumuman pertek',
		pengumuman_integrasi: 'Pengumuman integrasi'
	}

	const actionLabels: Record<string, string> = {
		insert: 'Ditambahkan',
		update: 'Diubah',
		delete: 'Dihapus'
	}

	const actionVerbs: Record<string, string> = {
		insert: 'menambahkan',
		update: 'mengubah',
		delete: 'menghapus'
	}

	const actionBadgeClass = (action: string) => {
		if (action === 'insert') return 'border-[#cfe7bd] bg-[#eef8e7] text-[#2f6f1b]'
		if (action === 'delete') return 'border-[#f2c7c7] bg-[#fff1f1] text-[#a33939]'
		return 'border-[#cddaf3] bg-[#f0f6ff] text-[#2d5bd1]'
	}

	const formatDateTime = (value: string) => {
		const parsed = new Date(value)
		return Number.isNaN(parsed.getTime()) ? '-' : dateTimeFormatter.format(parsed)
	}

	const formatNumber = (value: number) => numberFormatter.format(value)
	const formatActionLabel = (value: string) => actionLabels[value] ?? value
	const formatResourceLabel = (value: string) => resourceLabels[value] ?? value.replaceAll('_', ' ')
	const formatActionVerb = (value: string) => actionVerbs[value] ?? value

	const formatActorLabel = (value: string | null, fallback: string) => {
		if (!value) return fallback
		const [accountName] = value.split('@')
		return accountName || value
	}

	const formatAuditHeadline = (entry: PageData['result']['data'][number]) => {
		const actor = formatActorLabel(entry.actor_email, 'Admin')
		const resource = formatResourceLabel(entry.resource_type).toLowerCase()
		const resourceSuffix = entry.resource_id ? ` dengan ID ${entry.resource_id}` : ''
		return `${actor} ${formatActionVerb(entry.action)} ${resource}${resourceSuffix}`
	}

	const formatJson = (value: Json) => {
		try {
			return JSON.stringify(value, null, 2)
		} catch {
			return '{}'
		}
	}

	const getChangedFields = (value: Json) => {
		if (!value || typeof value !== 'object' || Array.isArray(value)) return []
		const changedFields = (value as Record<string, Json>).changed_fields
		return Array.isArray(changedFields) ? changedFields.filter((item): item is string => typeof item === 'string') : []
	}

	const buildQuery = (overrides: Record<string, string | number | undefined>) => {
		const params = new URLSearchParams(page.url.searchParams)
		for (const [key, value] of Object.entries(overrides)) {
			if (value === undefined || value === '') {
				params.delete(key)
				continue
			}
			params.set(key, String(value))
		}

		const query = params.toString()
		return query ? `${page.url.pathname}?${query}` : page.url.pathname
	}

	const totalPages = $derived.by(() => data.result.totalPages)
	const activeFilterCount = $derived.by(
		() =>
			Number(Boolean(data.filters.keyword)) +
			Number(Boolean(data.filters.actorEmail)) +
			Number(Boolean(data.filters.action)) +
			Number(Boolean(data.filters.resourceType))
	)
</script>

<section class="mx-auto w-full max-w-[1320px] space-y-6">
	<header class="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_28px_60px_-45px_rgba(15,23,42,0.48)] sm:p-7">
		<p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Super Admin</p>
		<h1 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.95rem]">Riwayat Aktivitas Admin</h1>
		<p class="mt-2 max-w-3xl text-sm text-slate-600 sm:text-[0.96rem]">
			Lihat siapa yang menambah, mengubah, atau menghapus data di seluruh panel admin.
		</p>
	</header>

	{#if data.unavailable}
		<p class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
			Supabase belum dikonfigurasi. Audit log belum dapat dimuat.
		</p>
	{/if}
	{#if data.forbidden}
		<p class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
			Halaman ini hanya dapat diakses oleh super admin.
		</p>
	{/if}
	{#if data.errorMessage}
		<p class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
			Gagal memuat audit log: {data.errorMessage}
		</p>
	{/if}

	<section class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_20px_40px_-35px_rgba(15,23,42,0.48)] sm:p-5">
		<form method="GET" class="grid gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)_170px_220px_120px]">
			<input
				type="search"
				name="keyword"
				value={data.filters.keyword ?? ''}
				placeholder="Cari aktivitas atau ID data"
				class="h-11 rounded-xl border border-[var(--line)] bg-white px-3.5 text-sm text-[var(--ink)] placeholder:text-slate-400 focus:border-[#64AD31] focus:outline-none"
			/>
			<input
				type="search"
				name="actorEmail"
				value={data.filters.actorEmail ?? ''}
				placeholder="Cari email admin"
				class="h-11 rounded-xl border border-[var(--line)] bg-white px-3.5 text-sm text-[var(--ink)] placeholder:text-slate-400 focus:border-[#64AD31] focus:outline-none"
			/>
			<select
				name="action"
				class="h-11 rounded-xl border border-[var(--line)] bg-white px-3.5 text-sm text-[var(--ink)] focus:border-[#64AD31] focus:outline-none"
			>
				<option value="">Semua aksi</option>
				{#each data.actionOptions as option}
					<option value={option} selected={data.filters.action === option}>{formatActionLabel(option)}</option>
				{/each}
			</select>
			<select
				name="resourceType"
				class="h-11 rounded-xl border border-[var(--line)] bg-white px-3.5 text-sm text-[var(--ink)] focus:border-[#64AD31] focus:outline-none"
			>
				<option value="">Semua data</option>
				{#each data.resourceOptions as option}
					<option value={option} selected={data.filters.resourceType === option}>{formatResourceLabel(option)}</option>
				{/each}
			</select>
			<div class="flex gap-2">
				<input type="hidden" name="pageSize" value={data.result.pageSize} />
				<button
					type="submit"
					class="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-[#64AD31] bg-[#64AD31] px-4 text-sm font-semibold text-white transition hover:border-[#4f8925] hover:bg-[#4f8925]"
				>
					Filter
				</button>
				<a
					href={page.url.pathname}
					class="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
				>
					Reset
				</a>
			</div>
		</form>
	</section>

	<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Total Aktivitas</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.result.total)}</p>
		</article>
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Halaman</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{data.result.page} / {totalPages}</p>
		</article>
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Data per Halaman</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.result.pageSize)}</p>
		</article>
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Filter Aktif</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{activeFilterCount}</p>
		</article>
	</div>

	<section class="space-y-4">
		{#if data.result.data.length === 0}
			<div class="rounded-2xl border border-dashed border-[var(--line)] bg-white px-4 py-12 text-center text-sm text-[var(--muted)]">
				Belum ada riwayat aktivitas yang cocok dengan filter saat ini.
			</div>
		{:else}
			{#each data.result.data as entry}
				<article class="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-[0_18px_36px_-34px_rgba(15,23,42,0.46)] sm:p-5">
					<div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
						<div class="min-w-0">
							<div class="flex flex-wrap items-center gap-2">
								<span class={`inline-flex items-center rounded-full border px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.08em] ${actionBadgeClass(entry.action)}`}>
									{formatActionLabel(entry.action)}
								</span>
								<span class="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-slate-600">
									{formatResourceLabel(entry.resource_type)}
								</span>
							</div>
							<h2 class="mt-3 text-base font-semibold text-slate-900 sm:text-lg">
								{formatAuditHeadline(entry)}
							</h2>
							<p class="mt-1 text-sm text-slate-600">
								<span class="font-medium text-slate-800">{entry.actor_email ?? entry.actor_id}</span>
								<span class="mx-1.5 text-slate-300">•</span>
								<span class="capitalize">{entry.actor_role?.replaceAll('_', ' ') ?? 'admin'}</span>
								<span class="mx-1.5 text-slate-300">•</span>
								<span>{formatDateTime(entry.created_at)}</span>
							</p>
							{#if entry.resource_id}
								<p class="mt-2 text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
									ID data: <span class="normal-case tracking-normal text-slate-700">{entry.resource_id}</span>
								</p>
							{/if}
						</div>
					</div>

					{#if getChangedFields(entry.metadata).length > 0}
						<div class="mt-4">
							<p class="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Bagian yang berubah</p>
							<div class="mt-2 flex flex-wrap gap-2">
								{#each getChangedFields(entry.metadata) as field}
									<span class="inline-flex rounded-full border border-[#d7dee8] bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
										{field}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					<div class="mt-4 grid gap-3 lg:grid-cols-2">
						<details class="rounded-xl border border-[var(--line)] bg-slate-50 p-3">
							<summary class="cursor-pointer text-sm font-semibold text-slate-800">Sebelum</summary>
							<pre class="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-white p-3 text-xs leading-relaxed text-slate-700">{formatJson(entry.before_data)}</pre>
						</details>

						<details class="rounded-xl border border-[var(--line)] bg-slate-50 p-3">
							<summary class="cursor-pointer text-sm font-semibold text-slate-800">Sesudah</summary>
							<pre class="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-lg bg-white p-3 text-xs leading-relaxed text-slate-700">{formatJson(entry.after_data)}</pre>
						</details>
					</div>
				</article>
			{/each}
		{/if}
	</section>

	<nav aria-label="Navigasi audit log" class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
		<p class="text-sm text-slate-600">
			Menampilkan halaman <span class="font-semibold text-slate-900">{data.result.page}</span> dari <span class="font-semibold text-slate-900">{totalPages}</span>
		</p>
		<div class="flex items-center gap-2">
			<a
				href={buildQuery({ page: Math.max(1, data.result.page - 1) })}
				aria-disabled={data.result.page === 1}
				class={`inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition ${
					data.result.page === 1
						? 'pointer-events-none border-slate-200 bg-slate-100 text-slate-400'
						: 'border-[var(--line)] bg-white text-slate-700 hover:bg-slate-50'
				}`}
			>
				Sebelumnya
			</a>
			<a
				href={buildQuery({ page: Math.min(data.result.page + 1, totalPages) })}
				aria-disabled={data.result.page === totalPages}
				class={`inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition ${
					data.result.page === totalPages
						? 'pointer-events-none border-slate-200 bg-slate-100 text-slate-400'
						: 'border-[var(--line)] bg-white text-slate-700 hover:bg-slate-50'
				}`}
			>
				Berikutnya
			</a>
		</div>
	</nav>
</section>
