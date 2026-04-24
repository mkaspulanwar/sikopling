<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import ArrowDown from 'lucide-svelte/icons/arrow-down'
	import ArrowUp from 'lucide-svelte/icons/arrow-up'
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down'
	import PengajuanStatusBadge from '$lib/components/badges/PengajuanStatusBadge.svelte'
	import { LAYANAN_VALUES, STATUS_VALUES, type StatusPengajuan } from '$lib/supabase/constants'
	import type { PageData } from './$types'

	type SortableColumn =
		| 'no_registrasi'
		| 'tanggal_masuk'
		| 'instansi'
		| 'kegiatan'
		| 'jenis_dokumen'
		| 'posisi'
		| 'status'
		| 'tanggal_update'
		| 'created_at'
		| 'updated_at'

	type FlashState = { type: 'success' | 'error'; message: string } | null

	const { data }: { data: PageData } = $props()

	const dateFormatter = new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'long',
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

	const sortLabels: Record<SortableColumn, string> = {
		no_registrasi: 'No Registrasi',
		tanggal_masuk: 'Tanggal Masuk',
		instansi: 'Instansi',
		kegiatan: 'Kegiatan',
		jenis_dokumen: 'Jenis Dokumen',
		posisi: 'Posisi',
		status: 'Status',
		tanggal_update: 'Tanggal Update',
		created_at: 'Dibuat',
		updated_at: 'Diubah'
	}

	let flash = $state<FlashState>(null)
	let pendingRowId = $state<string | null>(null)
	let isCreating = $state(false)
	let expandedRowsById = $state<Record<string, boolean>>({})
	let draftStatusById = $state<Record<string, StatusPengajuan>>({})
	let draftPosisiById = $state<Record<string, string>>({})
	let draftNoteById = $state<Record<string, string>>({})
	let createForm = $state({
		layanan: 'dokling',
		no_registrasi: '',
		tanggal_masuk: '',
		instansi: '',
		kegiatan: '',
		jenis_dokumen: '',
		posisi: '',
		status: 'Masuk' as StatusPengajuan
	})

	const formatDate = (value: string | null) => {
		if (!value) return '-'
		return dateFormatter.format(new Date(`${value}T00:00:00`))
	}

	const formatDateTime = (value: string) => dateTimeFormatter.format(new Date(value))
	const formatNumber = (value: number) => numberFormatter.format(value)

	const getRowHistory = (pengajuanId: string) => {
		const historyMap = data.historyByPengajuan as Record<
			string,
			Array<{
				old_status: string | null
				new_status: string
				old_posisi: string | null
				new_posisi: string | null
				note: string | null
				changed_at: string
			}>
		>
		return historyMap[pengajuanId] ?? []
	}

	const buildQuery = (overrides: Record<string, string | number | undefined | null>) => {
		const params = new URLSearchParams(page.url.searchParams)

		for (const [key, value] of Object.entries(overrides)) {
			if (value === undefined || value === null || value === '') {
				params.delete(key)
			} else {
				params.set(key, String(value))
			}
		}

		const queryString = params.toString()
		return queryString ? `?${queryString}` : page.url.pathname
	}

	const sortHref = (column: SortableColumn) => {
		const nextSortOrder =
			data.filters.sortBy === column && data.filters.sortOrder === 'asc' ? 'desc' : 'asc'

		return buildQuery({
			sortBy: column,
			sortOrder: nextSortOrder,
			page: 1
		})
	}

	const paginationWindow = (current: number, total: number) => {
		if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)
		const start = Math.max(1, current - 2)
		const end = Math.min(total, start + 4)
		const adjustedStart = Math.max(1, end - 4)
		return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index)
	}

	const hasActiveFilter = $derived.by(
		() =>
			Boolean(data.filters.keyword) ||
			Boolean(data.filters.layanan) ||
			Boolean(data.filters.status) ||
			Boolean(data.filters.instansi) ||
			Boolean(data.filters.jenisDokumen) ||
			Boolean(data.filters.tanggalMulai) ||
			Boolean(data.filters.tanggalSelesai)
	)

	const pageNumbers = $derived.by(() => paginationWindow(data.result.page, data.result.totalPages))
	const visibleRangeStart = $derived.by(
		() => (data.result.total === 0 ? 0 : (data.result.page - 1) * data.result.pageSize + 1)
	)
	const visibleRangeEnd = $derived.by(
		() => Math.min(data.result.page * data.result.pageSize, data.result.total)
	)

	const getSortDirection = (column: SortableColumn): 'none' | 'asc' | 'desc' => {
		if (data.filters.sortBy !== column) return 'none'
		return data.filters.sortOrder === 'asc' ? 'asc' : 'desc'
	}

	const isRowExpanded = (id: string) => Boolean(expandedRowsById[id])
	const toggleRowExpanded = (id: string) => {
		expandedRowsById[id] = !expandedRowsById[id]
	}

	const changePageSize = async (value: string) => {
		const parsed = Number(value)
		if (!Number.isFinite(parsed)) return
		await goto(buildQuery({ pageSize: parsed, page: 1 }), { invalidateAll: true, keepFocus: true })
	}

	const submitStatusUpdate = async (id: string) => {
		const status = draftStatusById[id]
		if (!status) {
			flash = { type: 'error', message: 'Status belum dipilih' }
			return
		}

		pendingRowId = id
		flash = null

		const response = await fetch('/admin/pengajuan', {
			method: 'PATCH',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				id,
				status,
				posisi: draftPosisiById[id] ?? null,
				note: draftNoteById[id] ?? null
			})
		})

		const payload = await response.json().catch(() => ({ message: 'Gagal memproses respons server' }))

		if (!response.ok) {
			flash = { type: 'error', message: payload?.message ?? 'Gagal memperbarui status' }
			pendingRowId = null
			return
		}

		flash = { type: 'success', message: `Status untuk ${id.slice(0, 8)} berhasil diperbarui` }
		await goto(`${page.url.pathname}${page.url.search}`, {
			invalidateAll: true,
			replaceState: true,
			noScroll: true,
			keepFocus: true
		})
		pendingRowId = null
	}

	const submitCreatePengajuan = async () => {
		if (!createForm.no_registrasi.trim()) {
			flash = { type: 'error', message: 'No registrasi wajib diisi' }
			return
		}

		isCreating = true
		flash = null

		const response = await fetch('/admin/pengajuan', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(createForm)
		})

		const payload = await response.json().catch(() => ({ message: 'Gagal memproses respons server' }))
		if (!response.ok) {
			flash = { type: 'error', message: payload?.message ?? 'Gagal menambahkan pengajuan' }
			isCreating = false
			return
		}

		flash = { type: 'success', message: 'Data pengajuan berhasil ditambahkan' }
		createForm = {
			layanan: 'dokling',
			no_registrasi: '',
			tanggal_masuk: '',
			instansi: '',
			kegiatan: '',
			jenis_dokumen: '',
			posisi: '',
			status: 'Masuk'
		}
		await goto(`${page.url.pathname}${page.url.search}`, {
			invalidateAll: true,
			replaceState: true,
			noScroll: true,
			keepFocus: true
		})
		isCreating = false
	}
</script>

<section class="mx-auto flex w-full max-w-440 flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
	<header class="rounded-xl border border-[#d7dee8] bg-white px-5 py-5 sm:px-6">
		<div class="flex flex-wrap items-start justify-between gap-3">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.05em] text-(--muted)">Dashboard Admin</p>
				<h1 class="mt-1 text-2xl font-semibold tracking-tight text-[#20232A] sm:text-[2rem]">Antrian Pengajuan</h1>
				<p class="mt-2 max-w-3xl text-sm text-(--muted) sm:text-[0.96rem]">
					Kelola antrean dokling dan pertek dengan tabel operasional, pembaruan status, dan histori workflow.
				</p>
			</div>
			<a
				href="/logout"
				class="inline-flex h-10 items-center rounded-lg border border-[#cfd7e3] bg-[#ffffff] px-3.5 text-sm font-semibold text-[#20232A] transition-colors hover:bg-[#f4f8f0]"
			>
				Logout
			</a>
		</div>
		<div class="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
			<div class="rounded-lg border border-[#e7edf5] bg-[#f8fafc] px-3.5 py-2.5 text-sm text-[#475467]">
				Total: <span class="font-semibold text-[#20232A]">{formatNumber(data.summary.total)}</span>
			</div>
			<div class="rounded-lg border border-[#e7edf5] bg-[#f8fafc] px-3.5 py-2.5 text-sm text-[#475467]">
				Pending: <span class="font-semibold text-[#20232A]">{formatNumber(data.summary.pending)}</span>
			</div>
			<div class="rounded-lg border border-[#e7edf5] bg-[#f8fafc] px-3.5 py-2.5 text-sm text-[#475467]">
				Selesai: <span class="font-semibold text-[#20232A]">{formatNumber(data.summary.selesai)}</span>
			</div>
			<div class="rounded-lg border border-[#e7edf5] bg-[#f8fafc] px-3.5 py-2.5 text-sm text-[#475467]">
				Dokling/Pertek: <span class="font-semibold text-[#20232A]">{formatNumber(data.summary.dokling)} / {formatNumber(data.summary.pertek)}</span>
			</div>
		</div>
	</header>

	{#if data.unavailable}
		<div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
			Supabase belum dikonfigurasi. Isi `PUBLIC_SUPABASE_URL` dan `PUBLIC_SUPABASE_ANON_KEY`.
		</div>
	{/if}
	{#if data.requiresSupabaseAuth}
		<div class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
			Akses dashboard membutuhkan Supabase Auth dengan role admin.
		</div>
	{/if}
	{#if data.errorMessage}
		<div class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
			Gagal memuat data: {data.errorMessage}
		</div>
	{/if}
	{#if flash}
		<div
			class={`rounded-xl border px-4 py-3 text-sm ${
				flash.type === 'success'
					? 'border-emerald-200 bg-emerald-50 text-emerald-700'
					: 'border-rose-200 bg-rose-50 text-rose-700'
			}`}
		>
			{flash.message}
		</div>
	{/if}

	<section class="rounded-xl border border-[#d7dee8] bg-white p-4 sm:p-5">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<h2 class="text-base font-semibold text-[#20232A] sm:text-lg">Tambah Pengajuan Baru</h2>
			<p class="text-xs text-(--muted)">Isi kolom sesuai data pengajuan lalu simpan.</p>
		</div>
		<div class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">Layanan *</span>
				<select bind:value={createForm.layanan} class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]">
					{#each LAYANAN_VALUES as layanan}
						<option value={layanan}>{layanan.toUpperCase()}</option>
					{/each}
				</select>
			</label>
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">No Registrasi *</span>
				<input type="text" bind:value={createForm.no_registrasi} placeholder="Contoh: REG-2026-0001" class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]" />
			</label>
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">Tanggal Masuk</span>
				<input type="date" bind:value={createForm.tanggal_masuk} class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]" />
			</label>
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">Status Awal</span>
				<select bind:value={createForm.status} class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]">
					{#each STATUS_VALUES as status}
						<option value={status}>{status}</option>
					{/each}
				</select>
			</label>
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">Instansi</span>
				<input type="text" bind:value={createForm.instansi} class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]" />
			</label>
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">Kegiatan</span>
				<input type="text" bind:value={createForm.kegiatan} class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]" />
			</label>
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">Jenis Dokumen</span>
				<input type="text" bind:value={createForm.jenis_dokumen} class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]" />
			</label>
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">Posisi</span>
				<input type="text" bind:value={createForm.posisi} class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]" />
			</label>
		</div>
		<div class="mt-3 flex justify-end">
			<button type="button" onclick={submitCreatePengajuan} disabled={isCreating || data.unavailable} class="inline-flex h-10 items-center rounded-lg bg-[#64AD31] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#4f8925] disabled:cursor-not-allowed disabled:bg-slate-300">
				{isCreating ? 'Menyimpan...' : 'Tambah Pengajuan'}
			</button>
		</div>
	</section>

	<form method="GET" class="rounded-xl border border-[#d7dee8] bg-white p-4 sm:p-5">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<h2 class="text-base font-semibold text-[#20232A] sm:text-lg">Filter dan Pencarian</h2>
			{#if hasActiveFilter}
				<a
					href={page.url.pathname}
					class="inline-flex h-9 items-center rounded-lg border border-[#d3dbe7] bg-[#ffffff] px-3 text-xs font-semibold text-(--muted) transition-colors hover:bg-[#f3f5f8]"
				>
					Reset semua filter
				</a>
			{/if}
		</div>
		<div class="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">Kata Kunci</span>
				<input type="search" name="keyword" value={data.filters.keyword ?? ''} placeholder="No registrasi / instansi / kegiatan" class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]" />
			</label>
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">Layanan</span>
				<select name="layanan" class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]">
					<option value="">Semua layanan</option>
					{#each LAYANAN_VALUES as layanan}
						<option value={layanan} selected={data.filters.layanan === layanan}>{layanan.toUpperCase()}</option>
					{/each}
				</select>
			</label>
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">Status</span>
				<select name="status" class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]">
					<option value="">Semua status</option>
					{#each STATUS_VALUES as status}
						<option value={status} selected={data.filters.status === status}>{status}</option>
					{/each}
				</select>
			</label>
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">Instansi</span>
				<input type="text" name="instansi" value={data.filters.instansi ?? ''} placeholder="Nama instansi" class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]" />
			</label>
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">Jenis Dokumen</span>
				<input type="text" name="jenisDokumen" value={data.filters.jenisDokumen ?? ''} placeholder="AMDAL, UKL-UPL, dll" class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]" />
			</label>
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">Tanggal Mulai</span>
				<input type="date" name="tanggalMulai" value={data.filters.tanggalMulai ?? ''} class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]" />
			</label>
			<label class="grid gap-1.5">
				<span class="text-xs font-semibold text-(--muted)">Tanggal Selesai</span>
				<input type="date" name="tanggalSelesai" value={data.filters.tanggalSelesai ?? ''} class="h-11 rounded-lg border border-[#cfd7e3] bg-white px-3 text-sm text-[#20232A]" />
			</label>
		</div>
		<div class="mt-3 flex justify-end">
			<button type="submit" class="inline-flex h-10 items-center rounded-lg bg-[#64AD31] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#4f8925]">Terapkan Filter</button>
		</div>
		<input type="hidden" name="page" value="1" />
		<input type="hidden" name="sortBy" value={data.filters.sortBy} />
		<input type="hidden" name="sortOrder" value={data.filters.sortOrder} />
	</form>

	<div class="space-y-4">
		<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
			<div class="hidden flex-wrap items-center gap-x-5 gap-y-1 text-xs text-(--muted) sm:text-sm md:flex">
				<p>Rentang <span class="font-semibold text-(--ink)">{formatNumber(visibleRangeStart)}-{formatNumber(visibleRangeEnd)}</span></p>
				<p>Hasil Filter <span class="font-semibold text-(--ink)">{formatNumber(data.result.data.length)}</span></p>
				<p>Total Pengajuan <span class="font-semibold text-(--ink)">{formatNumber(data.result.total)}</span></p>
			</div>
			<label class="inline-flex items-center gap-2 text-xs text-(--muted) sm:text-sm">
				<span class="font-medium">Tampilkan:</span>
				<select value={data.result.pageSize} onchange={(event) => changePageSize((event.currentTarget as HTMLSelectElement).value)} class="h-9 w-[3.9rem] rounded-lg border border-[#cfd7e3] bg-[#ffffff] px-2.5 text-xs font-semibold text-[#20232A] shadow-[0_1px_1px_rgba(15,23,42,0.03)]">
					{#each [10, 20, 50, 100] as size}
						<option value={size}>{size}</option>
					{/each}
				</select>
			</label>
		</div>

		<div class="hidden overflow-hidden rounded-xl border-y border-[#d7dee8] bg-transparent md:block">
			<table class="w-full table-fixed border-collapse">
				<thead class="bg-[#64AD31]">
					<tr>
						<th class="w-14 border-b border-[#64AD31] px-3 py-4 text-center text-sm font-semibold tracking-[0.01em] text-white">No</th>
						<th class="border-b border-[#64AD31] px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Layanan</th>
						{#each ['no_registrasi', 'tanggal_masuk', 'instansi', 'kegiatan', 'jenis_dokumen', 'posisi', 'status', 'tanggal_update'] as rawColumn}
							{@const column = rawColumn as SortableColumn}
							<th class="border-b border-[#64AD31] px-4 py-4 text-left align-middle text-sm font-semibold tracking-[0.01em] text-white">
								<a href={sortHref(column)} class="inline-flex items-center gap-1.5 align-middle hover:text-white/90">
									<span class="leading-none">{sortLabels[column]}</span>
									{#if getSortDirection(column) === 'asc'}
										<ArrowUp class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
									{:else if getSortDirection(column) === 'desc'}
										<ArrowDown class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
									{:else}
										<ArrowUpDown class="h-3.5 w-3.5 shrink-0 opacity-80" aria-hidden="true" />
									{/if}
									<span class="sr-only">
										Urutkan {sortLabels[column]} ({getSortDirection(column) === 'none' ? 'belum diurutkan' : getSortDirection(column)})
									</span>
								</a>
							</th>
						{/each}
						<th class="border-b border-[#64AD31] px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Aksi</th>
					</tr>
				</thead>
				<tbody>
					{#if data.result.data.length === 0}
						<tr>
							<td colspan="11" class="px-6 py-12 text-center">
								<p class="text-base font-semibold text-(--ink)">Data tidak ditemukan</p>
								<p class="mt-1 text-sm text-(--muted)">Coba ubah kata kunci pencarian atau reset filter.</p>
							</td>
						</tr>
					{:else}
						{#each data.result.data as row, index}
							<tr class="border-t border-[#e9edf3] align-top">
								<td class="w-14 px-3 py-4 text-center text-sm text-[#20232A]">{(data.result.page - 1) * data.result.pageSize + index + 1}</td>
								<td class="px-4 py-4 text-sm text-[#20232A]">
									<span class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase text-slate-700">{row.layanan}</span>
								</td>
								<td class="px-4 py-4 text-sm font-semibold text-[#20232A] wrap-break-word">{row.no_registrasi}</td>
								<td class="px-4 py-4 text-sm text-[#20232A]">{formatDate(row.tanggal_masuk)}</td>
								<td class="px-4 py-4 text-sm text-[#20232A] wrap-break-word">{row.instansi ?? '-'}</td>
								<td class="px-4 py-4 text-sm text-[#20232A] wrap-break-word">{row.kegiatan ?? '-'}</td>
								<td class="px-4 py-4 text-sm text-[#20232A] wrap-break-word">{row.jenis_dokumen ?? '-'}</td>
								<td class="px-4 py-4 text-sm text-[#20232A] wrap-break-word">{row.posisi ?? '-'}</td>
								<td class="px-4 py-4 text-sm"><PengajuanStatusBadge status={row.status} /></td>
								<td class="px-4 py-4 text-sm text-[#20232A]">{formatDate(row.tanggal_update)}</td>
								<td class="px-4 py-4">
									<div class="flex flex-col gap-2">
										<select value={draftStatusById[row.id] ?? row.status} onchange={(event) => {
											const value = (event.currentTarget as HTMLSelectElement).value
											if (STATUS_VALUES.includes(value as StatusPengajuan)) {
												draftStatusById[row.id] = value as StatusPengajuan
											}
										}} class="h-10 rounded-lg border border-[#cfd7e3] px-2.5 text-xs font-medium">
											{#each STATUS_VALUES as status}
												<option value={status}>{status}</option>
											{/each}
										</select>
										<button type="button" onclick={() => toggleRowExpanded(row.id)} class="h-10 rounded-lg border border-[#cfd7e3] bg-white px-3 text-xs font-semibold text-[#334155] transition-colors hover:bg-[#f8fafc]">
											{isRowExpanded(row.id) ? 'Tutup Detail' : 'Detail'}
										</button>
									</div>
								</td>
							</tr>
							{#if isRowExpanded(row.id)}
								<tr class="border-t border-[#e9edf3] bg-[#f8fafc]">
									<td colspan="11" class="px-4 py-4">
										<div class="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
											<div class="grid gap-3 md:grid-cols-2">
												<input type="text" placeholder="Posisi terbaru" value={draftPosisiById[row.id] ?? row.posisi ?? ''} onchange={(event) => {
													draftPosisiById[row.id] = (event.currentTarget as HTMLInputElement).value
												}} class="h-10 rounded-lg border border-[#cfd7e3] bg-white px-3 text-xs text-[#20232A]" />
												<input type="text" placeholder="Catatan perubahan (opsional)" value={draftNoteById[row.id] ?? ''} onchange={(event) => {
													draftNoteById[row.id] = (event.currentTarget as HTMLInputElement).value
												}} class="h-10 rounded-lg border border-[#cfd7e3] bg-white px-3 text-xs text-[#20232A]" />
											</div>
											<div class="flex flex-wrap items-start gap-2 xl:justify-end">
												<button type="button" onclick={() => submitStatusUpdate(row.id)} disabled={pendingRowId === row.id || data.unavailable} class="h-10 rounded-lg bg-[#64AD31] px-3 text-xs font-semibold text-white transition enabled:hover:bg-[#4f8925] disabled:cursor-not-allowed disabled:bg-slate-300">{pendingRowId === row.id ? 'Menyimpan...' : 'Simpan Status'}</button>
												<details class="min-w-48 rounded-lg border border-[#d7dee8] bg-white p-2.5">
													<summary class="cursor-pointer text-xs font-semibold text-[#334155]">History ({getRowHistory(row.id).length})</summary>
													{#if getRowHistory(row.id).length === 0}
														<p class="mt-2 text-xs text-(--muted)">Belum ada histori perubahan.</p>
													{:else}
														<ul class="mt-2 space-y-2">
															{#each getRowHistory(row.id) as history}
																<li class="rounded-md border border-[#d7dee8] bg-[#f8fafc] px-2 py-1.5 text-[11px] text-[#475467]">
																	<p class="font-semibold text-[#20232A]">{history.old_status ?? 'Belum ada'} -> {history.new_status}</p>
																	<p>Posisi: {history.old_posisi ?? '-'} -> {history.new_posisi ?? '-'}</p>
																	<p>Catatan: {history.note ?? '-'}</p>
																	<p class="text-(--muted)">{formatDateTime(history.changed_at)}</p>
																</li>
															{/each}
														</ul>
													{/if}
												</details>
											</div>
										</div>
									</td>
								</tr>
							{/if}
						{/each}
					{/if}
				</tbody>
			</table>
		</div>

		<div class="mt-1 overflow-hidden rounded-xl border-y border-[#d7dee8] bg-transparent md:hidden">
			<div class="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 border-b border-[#64AD31] bg-[#64AD31] px-3 py-4 text-[0.78rem] font-semibold tracking-[0.01em] text-white">
				<span class="text-center">No</span>
				<span class="text-sm">Detail Pengajuan</span>
			</div>
			{#if data.result.data.length === 0}
				<div class="px-6 py-12 text-center">
					<p class="text-base font-semibold text-(--ink)">Data tidak ditemukan</p>
					<p class="mt-1 text-sm text-(--muted)">Coba ubah kata kunci pencarian atau reset filter.</p>
				</div>
			{:else}
				<ul>
					{#each data.result.data as row, index}
						<li class="border-t border-(--line) first:border-t-0 px-3 py-3">
							<div class="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
								<p class="pt-0.5 text-center text-sm font-semibold text-[#20232A]">{(data.result.page - 1) * data.result.pageSize + index + 1}</p>
								<div>
									<div class="flex items-start justify-between gap-2">
										<div class="min-w-0">
											<p class="truncate text-sm font-semibold text-[#20232A]">{row.instansi ?? '-'}</p>
											<p class="mt-1 text-[0.75rem] break-all text-(--muted)">{row.no_registrasi}</p>
										</div>
										<PengajuanStatusBadge status={row.status} />
									</div>
									<p class="mt-2 text-xs text-[#20232A]">{row.kegiatan ?? '-'}</p>
									<p class="mt-1 text-[0.75rem] text-(--muted)">Update: {formatDate(row.tanggal_update)}</p>
								</div>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<footer class="flex flex-col items-start justify-between gap-3 border-t border-[#d7dee8] pt-3 md:flex-row md:items-center">
			<p class="text-sm text-(--muted)">Halaman <span class="font-semibold text-(--ink)">{data.result.page}</span> dari <span class="font-semibold text-(--ink)">{data.result.totalPages}</span></p>
			<div class="flex flex-wrap gap-2">
				<a href={buildQuery({ page: Math.max(data.result.page - 1, 1) })} class={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${data.result.page === 1 ? 'pointer-events-none border-slate-200 text-slate-400' : 'border-slate-300 text-slate-700 hover:border-slate-500 hover:text-slate-900'}`}>Sebelumnya</a>
				{#each pageNumbers as pageNumber}
					<a href={buildQuery({ page: pageNumber })} class={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${pageNumber === data.result.page ? 'border-[#64AD31] bg-[#64AD31] text-white' : 'border-slate-300 text-slate-700 hover:border-slate-500 hover:text-slate-900'}`}>{pageNumber}</a>
				{/each}
				<a href={buildQuery({ page: Math.min(data.result.page + 1, data.result.totalPages) })} class={`rounded-lg border px-3 py-1.5 text-sm font-semibold ${data.result.page === data.result.totalPages ? 'pointer-events-none border-slate-200 text-slate-400' : 'border-slate-300 text-slate-700 hover:border-slate-500 hover:text-slate-900'}`}>Berikutnya</a>
			</div>
		</footer>
	</div>
</section>
