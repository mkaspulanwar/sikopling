<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { STATUS_VALUES, type StatusPengajuan } from '$lib/supabase/constants'
	import PositionDropdown from '$lib/components/admin/PositionDropdown.svelte'
	import StatusDropdown from '$lib/components/admin/StatusDropdown.svelte'
	import { cubicOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'
	import type { PageData } from './$types'
	import Calendar from 'lucide-svelte/icons/calendar'
	import ChevronDown from 'lucide-svelte/icons/chevron-down'
	import ChevronLeft from 'lucide-svelte/icons/chevron-left'
	import ChevronRight from 'lucide-svelte/icons/chevron-right'
	import Download from 'lucide-svelte/icons/download'
	import CirclePlus from 'lucide-svelte/icons/circle-plus'
	import SquarePen from 'lucide-svelte/icons/square-pen'
	import Trash from 'lucide-svelte/icons/trash'
	import Upload from 'lucide-svelte/icons/upload'
	import X from 'lucide-svelte/icons/x'

	type FlashState = { type: 'success' | 'error'; message: string } | null
	type QueueRow = PageData['result']['data'][number]
	type QueueForm = {
		no_registrasi: string
		tanggal_masuk: string
		tanggal_update: string
		instansi: string
		kegiatan: string
		jenis_dokumen: string
		posisi: string
		status: StatusPengajuan
	}
	type DeleteTarget = { ids: string[]; labels: string[] } | null

	const { data }: { data: PageData } = $props()
	const layanan = 'dokling' as const
	const POSITION_OPTIONS = [
		'Penyusun',
		'Pemrakarsa',
		'Sekretariat TU',
		'Lainnya'
	] as const

	const dateFormatter = new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	})

	const numberFormatter = new Intl.NumberFormat('id-ID')

	const statusBadgeClassMap: Record<StatusPengajuan, string> = {
		'Submit / Masuk': 'border-[#bfc8d7] bg-[#f4f6f9] text-[#364152]',
		'Perbaikan Uji Administrasi': 'border-[#e3b985] bg-[#fff4e5] text-[#8a5a1e]',
		'Penjadwalan Rapat': 'border-[#9bcfd5] bg-[#eaf8fa] text-[#1f5f69]',
		'Drafting SK': 'border-[#a8b8d6] bg-[#edf2ff] text-[#274472]',
		'SK Terbit': 'border-[#91c5ad] bg-[#e8f7ef] text-[#1f6d46]',
		'Belum Submit Perbaikan': 'border-[#e8b5a3] bg-[#fff2ed] text-[#8a3a2f]',
		'Uji Administrasi': 'border-[#9cb6de] bg-[#edf4ff] text-[#1f4e8c]',
		Ditolak: 'border-[#e1a5a5] bg-[#fff0f0] text-[#8c2f2f]',
		'Pasca Sidang': 'border-[#b6a6dd] bg-[#f4efff] text-[#4a2f80]',
		'Evaluasi Dokumen': 'border-[#9cb6de] bg-[#edf4ff] text-[#1f4e8c]',
		Hold: 'border-[#d5d8de] bg-[#f4f5f7] text-[#4b5563]',
		Dikembalikan: 'border-[#d9a98a] bg-[#fff1e8] text-[#8a4522]',
		'Penilaian KA': 'border-[#b6a6dd] bg-[#f4efff] text-[#4a2f80]'
	}

	const createInitialForm = (): QueueForm => ({
		no_registrasi: '',
		tanggal_masuk: '',
		tanggal_update: '',
		instansi: '',
		kegiatan: '',
		jenis_dokumen: '',
		posisi: 'Penyusun',
		status: 'Submit / Masuk'
	})

	const formFromRow = (row: QueueRow): QueueForm => ({
		no_registrasi: row.no_registrasi ?? '',
		tanggal_masuk: row.tanggal_masuk ?? '',
		tanggal_update: row.tanggal_update ?? '',
		instansi: row.instansi ?? '',
		kegiatan: row.kegiatan ?? '',
		jenis_dokumen: row.jenis_dokumen ?? '',
		posisi: row.posisi ?? '',
		status: row.status
	})

	const normalizePayload = (form: QueueForm) => ({
		no_registrasi: form.no_registrasi,
		tanggal_masuk: form.tanggal_masuk,
		tanggal_update: form.tanggal_update,
		instansi: form.instansi,
		kegiatan: form.kegiatan,
		jenis_dokumen: form.jenis_dokumen,
		posisi: form.posisi,
		status: form.status
	})

	let flash = $state<FlashState>(null)
	let isImporting = $state(false)
	let importInput = $state<HTMLInputElement | null>(null)
	let isCreateModalOpen = $state(false)
	let isEditModalOpen = $state(false)
	let isSavingCreate = $state(false)
	let isSavingEdit = $state(false)
	let isDeleting = $state(false)
	let editRowId = $state<string | null>(null)
	let selectedRowIds = $state<string[]>([])
	let filterKeyword = $state('')
	let filterStatus = $state<StatusPengajuan | ''>('')
	let rowsPerPage = $state('20')
	let deleteTarget = $state<DeleteTarget>(null)
	let expandedRowsById = $state<Record<string, boolean>>({})
	let createForm = $state<QueueForm>(createInitialForm())
	let editForm = $state<QueueForm>(createInitialForm())

	$effect(() => {
		if (!flash) return
		const timeoutId = setTimeout(() => {
			flash = null
		}, 2500)
		return () => {
			clearTimeout(timeoutId)
		}
	})

	$effect(() => {
		filterKeyword = data.filters.keyword ?? ''
		filterStatus = data.filters.status ?? ''
		rowsPerPage = String(data.result.pageSize)
		selectedRowIds = []
		expandedRowsById = {}
	})

	const formatDate = (value: string | null) => (value ? dateFormatter.format(new Date(`${value}T00:00:00`)) : '-')
	const formatNumber = (value: number) => numberFormatter.format(value)
	const getStatusBadgeClass = (status: StatusPengajuan) => statusBadgeClassMap[status]

	const refreshPage = async () => {
		await goto(`${page.url.pathname}${page.url.search}`, {
			invalidateAll: true,
			replaceState: true,
			noScroll: true,
			keepFocus: true
		})
	}

	const buildListUrl = (params: URLSearchParams) => {
		const queryString = params.toString()
		return queryString ? `${page.url.pathname}?${queryString}` : page.url.pathname
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
		return buildListUrl(params)
	}

	const applyFilters = async () => {
		const params = new URLSearchParams(page.url.searchParams)
		const keyword = filterKeyword.trim()
		const size = Number(rowsPerPage)
		const sanitizedPageSize = Number.isFinite(size)
			? Math.min(100, Math.max(10, Math.floor(size)))
			: data.result.pageSize

		if (keyword) {
			params.set('keyword', keyword)
		} else {
			params.delete('keyword')
		}

		if (filterStatus) {
			params.set('status', filterStatus)
		} else {
			params.delete('status')
		}

		params.set('pageSize', String(sanitizedPageSize))
		params.set('page', '1')

		await goto(buildListUrl(params), {
			invalidateAll: true,
			replaceState: true,
			noScroll: true,
			keepFocus: true
		})
	}

	const resetFilters = async () => {
		filterKeyword = ''
		filterStatus = ''
		rowsPerPage = '20'
		await applyFilters()
	}

	const visibleRangeStart = $derived.by(
		() => (data.result.total === 0 ? 0 : (data.result.page - 1) * data.result.pageSize + 1)
	)
	const visibleRangeEnd = $derived.by(() =>
		Math.min(data.result.page * data.result.pageSize, data.result.total)
	)
	const selectedRows = $derived.by(() =>
		data.result.data.filter((row) => selectedRowIds.includes(row.id))
	)
	const selectedCount = $derived.by(() => selectedRowIds.length)
	const allVisibleSelected = $derived.by(
		() =>
			data.result.data.length > 0 &&
			data.result.data.every((row) => selectedRowIds.includes(row.id))
	)
	const selectionSummaryText = $derived.by(
		() => `${formatNumber(selectedCount)}/${formatNumber(data.result.total)} terpilih`
	)

	const exportHref = `/admin/api/${layanan}/export`

	const openImportPicker = () => {
		importInput?.click()
	}

	const openCreateModal = () => {
		createForm = createInitialForm()
		isCreateModalOpen = true
	}

	const closeCreateModal = () => {
		if (isSavingCreate) return
		isCreateModalOpen = false
	}

	const isRowSelected = (rowId: string) => selectedRowIds.includes(rowId)

	const setRowSelection = (rowId: string, checked: boolean) => {
		if (checked) {
			if (!selectedRowIds.includes(rowId)) {
				selectedRowIds = [...selectedRowIds, rowId]
			}
			return
		}
		selectedRowIds = selectedRowIds.filter((id) => id !== rowId)
	}

	const setAllVisibleSelection = (checked: boolean) => {
		const visibleIds = data.result.data.map((row) => row.id)
		if (checked) {
			selectedRowIds = Array.from(new Set([...selectedRowIds, ...visibleIds]))
			return
		}
		selectedRowIds = selectedRowIds.filter((id) => !visibleIds.includes(id))
	}

	const clearSelection = () => {
		selectedRowIds = []
	}

	const isRowExpanded = (rowId: string) => Boolean(expandedRowsById[rowId])

	const toggleRowExpanded = (rowId: string) => {
		expandedRowsById = {
			...expandedRowsById,
			[rowId]: !expandedRowsById[rowId]
		}
	}

	const dismissFlash = () => {
		flash = null
	}

	const openSelectedRowForEdit = () => {
		if (selectedRows.length === 0) {
			flash = { type: 'error', message: 'Pilih data terlebih dahulu untuk diedit.' }
			return
		}
		if (selectedRows.length > 1) {
			flash = { type: 'error', message: 'Edit hanya bisa untuk satu data. Pilih satu baris saja.' }
			return
		}
		openEditModal(selectedRows[0])
	}

	const openSelectedRowForDelete = () => {
		if (selectedRows.length === 0) {
			flash = { type: 'error', message: 'Pilih minimal satu data untuk dihapus.' }
			return
		}
		openDeleteModal(selectedRows)
	}

	const openEditModal = (row: QueueRow) => {
		editRowId = row.id
		editForm = formFromRow(row)
		isEditModalOpen = true
	}

	const closeEditModal = () => {
		if (isSavingEdit) return
		isEditModalOpen = false
		editRowId = null
	}

	const openDeleteModal = (rows: QueueRow[]) => {
		deleteTarget = {
			ids: rows.map((row) => row.id),
			labels: rows.map((row) => row.no_registrasi ?? '-')
		}
	}

	const closeDeleteModal = () => {
		if (isDeleting) return
		deleteTarget = null
	}

	const handleModalEscape = (event: KeyboardEvent) => {
		if (event.key !== 'Escape') return
		if (isCreateModalOpen) closeCreateModal()
		if (isEditModalOpen) closeEditModal()
		if (deleteTarget) closeDeleteModal()
	}

	const handleImport = async (event: Event) => {
		const target = event.currentTarget as HTMLInputElement
		const file = target.files?.[0]
		if (!file) return

		isImporting = true
		flash = null

		const formData = new FormData()
		formData.append('file', file)

		const response = await fetch(`/admin/api/${layanan}/import`, {
			method: 'POST',
			credentials: 'include',
			body: formData
		})

		const payload = await response
			.json()
			.catch(() => ({ message: 'Gagal membaca respons import dari server' }))

		if (!response.ok) {
			flash = { type: 'error', message: payload?.message ?? 'Import data gagal' }
			isImporting = false
			target.value = ''
			return
		}

		const imported = typeof payload?.imported === 'number' ? payload.imported : 0
		const failed = typeof payload?.failed === 'number' ? payload.failed : 0
		flash = {
			type: failed > 0 ? 'error' : 'success',
			message: `Import selesai. Berhasil ${imported} data, gagal ${failed} data.`
		}
		target.value = ''
		await refreshPage()
		isImporting = false
	}

	const submitCreate = async () => {
		if (!createForm.tanggal_update.trim()) {
			flash = { type: 'error', message: 'Tanggal update wajib diisi' }
			return
		}
		if (!createForm.posisi.trim()) {
			flash = { type: 'error', message: 'Posisi wajib diisi' }
			return
		}

		isSavingCreate = true
		flash = null

		const response = await fetch('/admin/pengajuan', {
			method: 'POST',
			credentials: 'include',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				layanan,
				...normalizePayload(createForm)
			})
		})

		const payload = await response.json().catch(() => ({ message: 'Gagal memproses respons server' }))
		if (!response.ok) {
			flash = { type: 'error', message: payload?.message ?? 'Gagal menambahkan data' }
			isSavingCreate = false
			return
		}

		isCreateModalOpen = false
		createForm = createInitialForm()
		flash = { type: 'success', message: 'Data dokling berhasil ditambahkan.' }
		await refreshPage()
		isSavingCreate = false
	}

	const submitEdit = async () => {
		if (!editRowId) return
		if (!editForm.tanggal_update.trim()) {
			flash = { type: 'error', message: 'Tanggal update wajib diisi' }
			return
		}
		if (!editForm.posisi.trim()) {
			flash = { type: 'error', message: 'Posisi wajib diisi' }
			return
		}

		isSavingEdit = true
		flash = null

		const response = await fetch(`/admin/pengajuan/${editRowId}`, {
			method: 'PATCH',
			credentials: 'include',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(normalizePayload(editForm))
		})

		const payload = await response.json().catch(() => ({ message: 'Gagal memproses respons server' }))
		if (!response.ok) {
			flash = { type: 'error', message: payload?.message ?? 'Gagal memperbarui data' }
			isSavingEdit = false
			return
		}

		isEditModalOpen = false
		editRowId = null
		flash = { type: 'success', message: 'Data dokling berhasil diperbarui.' }
		await refreshPage()
		isSavingEdit = false
	}

	const confirmDelete = async () => {
		if (!deleteTarget) return

		isDeleting = true
		flash = null
		const targetIds = [...deleteTarget.ids]

		const deleteResults = await Promise.all(
			targetIds.map(async (id) => {
				const response = await fetch(`/admin/pengajuan/${id}`, {
					method: 'DELETE',
					credentials: 'include'
				})
				const payload = await response
					.json()
					.catch(() => ({ message: 'Gagal memproses respons server' }))
				return { ok: response.ok, message: payload?.message as string | undefined }
			})
		)

		const failedDeletes = deleteResults.filter((result) => !result.ok)
		if (failedDeletes.length > 0) {
			const successCount = deleteResults.length - failedDeletes.length
			flash = {
				type: 'error',
				message:
					successCount > 0
						? `Sebagian data gagal dihapus. Berhasil ${successCount}, gagal ${failedDeletes.length}.`
						: (failedDeletes[0]?.message ?? 'Gagal menghapus data')
			}
			isDeleting = false
			return
		}

		selectedRowIds = selectedRowIds.filter((id) => !targetIds.includes(id))
		deleteTarget = null
		flash = {
			type: 'success',
			message:
				deleteResults.length > 1
					? `${deleteResults.length} data dokling berhasil dihapus.`
					: 'Data dokling berhasil dihapus.'
		}
		await refreshPage()
		isDeleting = false
	}
</script>

<svelte:window onkeydown={handleModalEscape} />

<section class="w-full space-y-5">
	{#if data.unavailable}
		<p class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
			Supabase belum dikonfigurasi. Isi `PUBLIC_SUPABASE_URL` dan `PUBLIC_SUPABASE_ANON_KEY`.
		</p>
	{/if}
	{#if data.requiresSupabaseAuth}
		<p class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
			Akses halaman dokling membutuhkan akun admin pada Supabase Auth.
		</p>
	{/if}
	{#if data.errorMessage}
		<p class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
			Gagal memuat data: {data.errorMessage}
		</p>
	{/if}
	{#if flash}
		<div class="pointer-events-none fixed left-1/2 top-4 z-[70] w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 sm:top-6 sm:w-full">
			<div
				role="status"
				aria-live="polite"
				transition:fly={{ y: -22, duration: 320, easing: cubicOut }}
				class={`pointer-events-auto rounded-2xl border shadow-[0_22px_45px_-28px_rgba(15,23,42,0.55)] backdrop-blur-[2px] ${
					flash.type === 'success'
						? 'border-emerald-200 bg-emerald-50/95 text-emerald-800'
						: 'border-rose-200 bg-rose-50/95 text-rose-800'
				}`}
			>
				<div class="flex items-start gap-3 px-4 py-3.5">
					<p class="flex-1 text-sm font-medium leading-relaxed">{flash.message}</p>
					<button
						type="button"
						onclick={dismissFlash}
						class={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition ${
							flash.type === 'success'
								? 'border-emerald-200/90 text-emerald-700 hover:bg-emerald-100'
								: 'border-rose-200/90 text-rose-700 hover:bg-rose-100'
						}`}
						aria-label="Tutup notifikasi"
					>
						<X class="h-3.5 w-3.5" />
					</button>
				</div>
			</div>
		</div>
	{/if}

	<div class="flex flex-wrap items-start justify-between gap-3 border-b border-[#e8edf5] pb-3">
		<h1 class="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
			Data Antrian Dokumen Lingkungan
		</h1>
		<div class="flex flex-wrap gap-2">
			<a
				href={exportHref}
				aria-disabled={data.unavailable}
				class={`inline-flex h-10 items-center gap-2 rounded-xl border border-[#d5dce8] bg-white px-4 text-sm font-semibold text-slate-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cfe0f2] focus-visible:ring-offset-2 ${
					data.unavailable
						? 'pointer-events-none opacity-50'
						: 'hover:border-[#c2cfdf] hover:bg-[#f8fafc] hover:text-slate-900'
				}`}
			>
				<Upload class="h-4 w-4" />
				Export
			</a>
			<button
				type="button"
				onclick={openImportPicker}
				disabled={isImporting || data.unavailable}
				class="inline-flex h-10 items-center gap-2 rounded-xl border border-[#64AD31] bg-[#64AD31] px-4 text-sm font-semibold !text-white transition hover:border-[#4f8925] hover:bg-[#4f8925] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8dca1] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
			>
				<Download class="h-4 w-4 text-white" />
				{isImporting ? 'Mengimpor...' : 'Import'}
			</button>
			<input bind:this={importInput} type="file" accept=".csv,text/csv" class="hidden" onchange={handleImport} />
		</div>
	</div>

	<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Total</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.doklingStatusMetrics.total)}</p>
		</article>
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Selesai</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.doklingStatusMetrics.selesai)}</p>
		</article>
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Diproses</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.doklingStatusMetrics.diproses)}</p>
		</article>
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Ditolak</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(data.doklingStatusMetrics.ditolak)}</p>
		</article>
	</div>

	<div class="flex flex-wrap items-center justify-between gap-2">
		<div class="flex items-center gap-2">
			<p class="text-sm font-medium text-slate-700">
				<span class="font-semibold text-slate-900">{selectionSummaryText}</span>
			</p>
			{#if selectedCount > 0}
				<button
					type="button"
					onclick={clearSelection}
					class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-[#D64545] bg-[#D64545] text-white transition hover:border-[#b93a3a] hover:bg-[#b93a3a] hover:text-white"
					aria-label="Hapus semua pilihan checkbox"
					title="Hapus semua pilihan"
				>
					<X class="h-3.5 w-3.5 text-white" />
				</button>
			{/if}
		</div>
		<div class="flex flex-wrap gap-2">
			<button
				type="button"
				onclick={openCreateModal}
				disabled={data.unavailable}
				class="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#64AD31] bg-[#64AD31] px-4 text-sm font-semibold !text-white transition hover:border-[#4f8925] hover:bg-[#4f8925] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a8d488] focus-visible:ring-offset-2 active:translate-y-px disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-300 disabled:text-slate-500"
			>
				<CirclePlus class="h-4 w-4 text-white" />
				Tambah
			</button>
			<button
				type="button"
				onclick={openSelectedRowForEdit}
				class="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#d7dee8] bg-white px-4 text-sm font-semibold text-[#2f4f6f] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#cfe0f2] focus-visible:ring-offset-2 active:translate-y-px"
			>
				<SquarePen class="h-4 w-4" />
				Edit
			</button>
			<button
				type="button"
				onclick={openSelectedRowForDelete}
				class="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-[#D64545] bg-[#D64545] px-4 text-sm font-semibold !text-white transition hover:border-[#b93a3a] hover:bg-[#b93a3a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d2d2] focus-visible:ring-offset-2 active:translate-y-px"
			>
				<Trash class="h-4 w-4 text-white" />
				Hapus
			</button>
		</div>
	</div>

	<section class="overflow-x-auto overflow-y-hidden rounded-2xl border-y border-[#d7dee8] bg-white">
		<table class="hidden w-full min-w-[1080px] border-collapse md:table">
			<thead class="bg-[#64AD31]">
				<tr>
					<th class="w-11 border-b border-[#64AD31] px-2 py-4 text-center text-sm font-semibold text-white">
						<input
							type="checkbox"
							checked={allVisibleSelected}
							onchange={(event) => {
								const target = event.currentTarget as HTMLInputElement
								setAllVisibleSelection(target.checked)
							}}
							class="h-4 w-4 rounded border-white/70 bg-white/10 text-[#2f6f1b] focus:ring-white"
							aria-label="Pilih semua data di halaman ini"
						/>
					</th>
					<th class="w-14 border-b border-[#64AD31] px-3 py-4 text-center text-sm font-semibold tracking-[0.01em] text-white">No</th>
					<th class="border-b border-[#64AD31] px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">No Registrasi</th>
					<th class="border-b border-[#64AD31] px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Tanggal Masuk</th>
					<th class="border-b border-[#64AD31] px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Instansi</th>
					<th class="border-b border-[#64AD31] px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Kegiatan</th>
					<th class="border-b border-[#64AD31] px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Jenis Dokumen</th>
					<th class="w-36 border-b border-[#64AD31] px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Posisi</th>
					<th class="w-36 border-b border-[#64AD31] px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Status</th>
					<th class="border-b border-[#64AD31] px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Tanggal Update</th>
				</tr>
			</thead>
			<tbody>
				{#if data.result.data.length === 0}
					<tr>
						<td colspan="10" class="px-6 py-12 text-center">
							<p class="text-base font-semibold text-[var(--ink)]">Belum ada data dokling.</p>
							<p class="mt-1 text-sm text-[var(--muted)]">Silakan tambah baris baru.</p>
						</td>
					</tr>
				{:else}
					{#each data.result.data as row, index}
						<tr
							class={`border-t border-[#e9edf3] align-top transition ${
								isRowSelected(row.id) ? 'bg-[#eef7e8]' : 'bg-white'
							}`}
						>
							<td class="px-2 py-4 text-center">
								<input
									type="checkbox"
									checked={isRowSelected(row.id)}
									onchange={(event) => {
										const target = event.currentTarget as HTMLInputElement
										setRowSelection(row.id, target.checked)
									}}
									class="h-4 w-4 rounded border-[#c3cfdd] text-[#64AD31] focus:ring-[#64AD31]"
									aria-label={`Pilih data ${row.no_registrasi}`}
								/>
							</td>
							<td class="w-14 px-3 py-4 text-center text-sm text-[#20232A]">{(data.result.page - 1) * data.result.pageSize + index + 1}</td>
							<td class="px-4 py-4 text-sm font-semibold text-[#20232A]">{row.no_registrasi ?? '-'}</td>
							<td class="px-4 py-4 text-sm text-[#20232A]">{formatDate(row.tanggal_masuk)}</td>
							<td class="px-4 py-4 text-sm text-[#20232A]">{row.instansi ?? '-'}</td>
							<td class="px-4 py-4 text-sm leading-relaxed text-[#20232A]">{row.kegiatan ?? '-'}</td>
							<td class="px-4 py-4 text-sm text-[#20232A]">{row.jenis_dokumen ?? '-'}</td>
							<td class="px-4 py-4 text-sm text-[#20232A]">{row.posisi ?? '-'}</td>
							<td class="px-4 py-4 text-sm">
								<span class={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.72rem] leading-tight font-medium ${getStatusBadgeClass(row.status)}`}>
									{row.status}
								</span>
							</td>
							<td class="px-4 py-4 text-sm text-[#20232A]">{formatDate(row.tanggal_update)}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>

		<div class="overflow-hidden border-y border-[#d7dee8] bg-transparent md:hidden">
			<div class="grid grid-cols-[1.5rem_2.25rem_minmax(0,1fr)] items-center gap-3 border-b border-[#64AD31] bg-[#64AD31] px-3 py-4 text-[0.78rem] font-semibold tracking-[0.01em] text-white">
				<span class="inline-flex justify-center">
					<input
						type="checkbox"
						checked={allVisibleSelected}
						onchange={(event) => {
							const target = event.currentTarget as HTMLInputElement
							setAllVisibleSelection(target.checked)
						}}
						class="h-4 w-4 rounded border-white/70 bg-white/10 text-[#2f6f1b] focus:ring-white"
						aria-label="Pilih semua data di halaman ini"
					/>
				</span>
				<span class="text-center">No</span>
				<span class="text-sm">Detail Dokumen</span>
			</div>

			{#if data.result.data.length === 0}
				<p class="px-2 py-8 text-center text-sm text-slate-500">Belum ada data dokling.</p>
			{:else}
				<ul>
					{#each data.result.data as row, index}
						<li class="border-t border-[var(--line)] first:border-t-0">
							<div class={`grid grid-cols-[1.5rem_2.25rem_minmax(0,1fr)] items-start gap-3 px-3 py-3.5 ${isRowSelected(row.id) ? 'bg-[#f4fbea]' : ''}`}>
								<span class="inline-flex justify-center pt-0.5">
									<input
										type="checkbox"
										checked={isRowSelected(row.id)}
										onchange={(event) => {
											const target = event.currentTarget as HTMLInputElement
											setRowSelection(row.id, target.checked)
										}}
										class="h-4 w-4 rounded border-[#c3cfdd] text-[#64AD31] focus:ring-[#64AD31]"
										aria-label={`Pilih data ${row.no_registrasi}`}
									/>
								</span>
								<p class="pt-0.5 text-center text-sm font-semibold text-[#20232A]">
									{(data.result.page - 1) * data.result.pageSize + index + 1}
								</p>
								<button
									type="button"
									class="min-w-0 text-left"
									onclick={() => toggleRowExpanded(row.id)}
									aria-expanded={isRowExpanded(row.id)}
								>
									<div class="flex items-start justify-between gap-2">
										<div class="min-w-0">
											<p class="truncate pr-1 text-sm leading-snug font-semibold text-[#20232A]">
												{row.instansi ?? '-'}
											</p>
											<p class="mt-1 text-[0.75rem] leading-tight break-all text-[var(--muted)]">
												{row.no_registrasi ?? '-'}
											</p>
											<div class="mt-2 flex flex-wrap items-center gap-1.5">
												<span class="text-[0.75rem] leading-tight text-[var(--muted)]">
													{row.jenis_dokumen ?? '-'}
												</span>
												<span class={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.75rem] leading-tight ${getStatusBadgeClass(row.status)}`}>
													{row.status}
												</span>
											</div>
											<p class="mt-2 text-[0.75rem] text-[var(--muted)]">Update: {formatDate(row.tanggal_update)}</p>
										</div>
										<span
											class={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-transparent text-[var(--muted)] transition-transform ${isRowExpanded(row.id) ? 'rotate-180' : ''}`}
											aria-hidden="true"
										>
											<ChevronDown class="h-3 w-3" strokeWidth={2.2} />
										</span>
									</div>
								</button>
							</div>
							{#if isRowExpanded(row.id)}
								<div class={`border-t border-[var(--line)] px-4 py-4 ${isRowSelected(row.id) ? 'bg-[#f4fbea]' : 'bg-transparent'}`}>
									<dl class="space-y-4">
										<div>
											<dt class="text-[0.76rem] font-semibold tracking-[0.01em] text-[#20232A]">Tanggal Masuk</dt>
											<dd class="mt-1 text-sm text-[#20232A]">{formatDate(row.tanggal_masuk)}</dd>
										</div>
										<div>
											<dt class="text-[0.76rem] font-semibold tracking-[0.01em] text-[#20232A]">Kegiatan</dt>
											<dd class="mt-1 text-sm leading-relaxed text-[#20232A]">{row.kegiatan ?? '-'}</dd>
										</div>
										<div>
											<dt class="text-[0.76rem] font-semibold tracking-[0.01em] text-[#20232A]">Posisi</dt>
											<dd class="mt-1 text-sm text-[#20232A]">{row.posisi ?? '-'}</dd>
										</div>
									</dl>
								</div>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</section>

	<footer class="mt-6 pt-2">
		<nav aria-label="Navigasi halaman antrian dokling admin" class="mx-auto flex flex-wrap items-center justify-center gap-1.5">
			<a
				href={buildQuery({ page: 1 })}
				aria-disabled={data.result.page === 1}
				class={`inline-flex h-9 items-center justify-center rounded-md px-2.5 text-xs font-semibold transition-colors ${
					data.result.page === 1
						? 'pointer-events-none text-[#475467] opacity-40'
						: 'text-[#475467] hover:bg-[#f4f8f0] hover:text-[#20232A]'
				}`}
			>
				Awal
			</a>
			<a
				href={buildQuery({ page: Math.max(data.result.page - 1, 1) })}
				aria-label="Halaman sebelumnya"
				aria-disabled={data.result.page === 1}
				class={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
					data.result.page === 1
						? 'pointer-events-none text-[#475467] opacity-40'
						: 'text-[#475467] hover:bg-[#f4f8f0] hover:text-[#20232A]'
				}`}
			>
				<ChevronLeft class="h-4 w-4" strokeWidth={2.3} />
			</a>
			<div class="inline-flex h-9 min-w-[4.5rem] items-center justify-center px-1.5 text-xs font-semibold text-[#20232A] tabular-nums">
				{data.result.page} / {data.result.totalPages}
			</div>
			<a
				href={buildQuery({ page: Math.min(data.result.page + 1, data.result.totalPages) })}
				aria-label="Halaman berikutnya"
				aria-disabled={data.result.page === data.result.totalPages}
				class={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
					data.result.page === data.result.totalPages
						? 'pointer-events-none text-[#475467] opacity-40'
						: 'text-[#475467] hover:bg-[#f4f8f0] hover:text-[#20232A]'
				}`}
			>
				<ChevronRight class="h-4 w-4" strokeWidth={2.3} />
			</a>
			<a
				href={buildQuery({ page: data.result.totalPages })}
				aria-disabled={data.result.page === data.result.totalPages}
				class={`inline-flex h-9 items-center justify-center rounded-md px-2.5 text-xs font-semibold transition-colors ${
					data.result.page === data.result.totalPages
						? 'pointer-events-none text-[#475467] opacity-40'
						: 'text-[#475467] hover:bg-[#f4f8f0] hover:text-[#20232A]'
				}`}
			>
				Akhir
			</a>
		</nav>
	</footer>
</section>

{#if isCreateModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button type="button" class="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px]" onclick={closeCreateModal} aria-label="Tutup modal tambah data"></button>
		<div class="relative w-full max-w-3xl rounded-2xl border border-[#d7dee8] bg-white shadow-[0_32px_68px_-42px_rgba(15,23,42,0.7)]">
			<div class="flex items-center justify-between border-b border-[#e6ebf2] px-5 py-4">
				<div>
					<h2 class="text-xl font-semibold text-slate-900">Tambahkan Data</h2>
				</div>
				<button type="button" onclick={closeCreateModal} class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d7dee8] text-slate-500 hover:bg-slate-50">
					<X class="h-4 w-4" />
				</button>
			</div>
			<div class="max-h-[78vh] overflow-y-auto px-5 py-4">
				<div class="grid gap-3 sm:grid-cols-2">
					<label class="grid gap-1.5">
						<span class="text-xs font-semibold text-slate-600">No Registrasi *</span>
						<input type="text" bind:value={createForm.no_registrasi} placeholder="Contoh: 68A929AEDE796" class="h-11 rounded-lg border border-[#c9dcb8] bg-white px-3 text-sm text-slate-700 transition focus:border-[#8fbd6d] focus:outline-none focus:ring-0 focus:shadow-none" />
					</label>
					<label class="grid gap-1.5">
						<span class="text-xs font-semibold text-slate-600">Status</span>
						<StatusDropdown
							bind:value={createForm.status}
							options={STATUS_VALUES}
							disabled={isSavingCreate || data.unavailable}
						/>
					</label>
					<label class="grid gap-1.5">
						<span class="text-xs font-semibold text-slate-600">Tanggal Masuk</span>
						<div class="group relative">
							<input
								type="date"
								bind:value={createForm.tanggal_masuk}
								class="modern-date-input h-11 w-full rounded-xl border border-[#c9dcb8] bg-white px-3 pr-12 text-sm text-slate-700 transition focus:border-[#8fbd6d] focus:outline-none focus:ring-0 focus:shadow-none"
							/>
							<span class="pointer-events-none absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg border border-[#c7ddb7] bg-[#f2f9ea] text-[#4f6f3d] transition group-focus-within:border-[#89b866] group-focus-within:bg-[#e8f4db] group-focus-within:text-[#2f6b1f]">
								<Calendar class="h-4 w-4" />
							</span>
						</div>
					</label>
					<label class="grid gap-1.5">
						<span class="text-xs font-semibold text-slate-600">Tanggal Update *</span>
						<div class="group relative">
							<input
								type="date"
								bind:value={createForm.tanggal_update}
								class="modern-date-input h-11 w-full rounded-xl border border-[#c9dcb8] bg-white px-3 pr-12 text-sm text-slate-700 transition focus:border-[#8fbd6d] focus:outline-none focus:ring-0 focus:shadow-none"
							/>
							<span class="pointer-events-none absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg border border-[#c7ddb7] bg-[#f2f9ea] text-[#4f6f3d] transition group-focus-within:border-[#89b866] group-focus-within:bg-[#e8f4db] group-focus-within:text-[#2f6b1f]">
								<Calendar class="h-4 w-4" />
							</span>
						</div>
					</label>
					<label class="grid gap-1.5 sm:col-span-2">
						<span class="text-xs font-semibold text-slate-600">Instansi</span>
						<input type="text" bind:value={createForm.instansi} placeholder="Contoh: Dinas Lingkungan Hidup Kalsel" class="h-11 rounded-lg border border-[#c9dcb8] bg-white px-3 text-sm text-slate-700 transition focus:border-[#8fbd6d] focus:outline-none focus:ring-0 focus:shadow-none" />
					</label>
					<label class="grid gap-1.5 sm:col-span-2">
						<span class="text-xs font-semibold text-slate-600">Kegiatan</span>
						<input type="text" bind:value={createForm.kegiatan} placeholder="Contoh: Membangun gedung baru" class="h-11 rounded-lg border border-[#c9dcb8] bg-white px-3 text-sm text-slate-700 transition focus:border-[#8fbd6d] focus:outline-none focus:ring-0 focus:shadow-none" />
					</label>
					<label class="grid gap-1.5 sm:col-span-2">
						<span class="text-xs font-semibold text-slate-600">Jenis Dokumen</span>
						<input type="text" bind:value={createForm.jenis_dokumen} placeholder="Contoh: Andal" class="h-11 rounded-lg border border-[#c9dcb8] bg-white px-3 text-sm text-slate-700 transition focus:border-[#8fbd6d] focus:outline-none focus:ring-0 focus:shadow-none" />
					</label>
					<label class="grid gap-1.5 sm:col-span-2">
						<span class="text-xs font-semibold text-slate-600">Posisi</span>
						<PositionDropdown
							bind:value={createForm.posisi}
							options={POSITION_OPTIONS}
							disabled={isSavingCreate || data.unavailable}
							placeholder="Contoh: Koordinator Tim"
						/>
					</label>
				</div>
			</div>
			<div class="flex flex-wrap justify-end gap-2 border-t border-[#e6ebf2] px-5 py-4">
				<button type="button" onclick={closeCreateModal} class="inline-flex h-10 items-center rounded-lg border border-[#cfd7e3] bg-white px-4 text-sm font-semibold text-slate-700">Batal</button>
				<button type="button" onclick={submitCreate} disabled={isSavingCreate || data.unavailable} class="inline-flex h-10 items-center rounded-lg bg-[#64AD31] px-4 text-sm font-semibold !text-white transition hover:bg-[#4f8925] disabled:cursor-not-allowed disabled:bg-slate-300">
					{isSavingCreate ? 'Menyimpan...' : 'Simpan'}
				</button>
			</div>
		</div>
	</div>
{/if}

{#if isEditModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button type="button" class="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px]" onclick={closeEditModal} aria-label="Tutup modal edit data"></button>
		<div class="relative w-full max-w-3xl rounded-2xl border border-[#d7dee8] bg-white shadow-[0_32px_68px_-42px_rgba(15,23,42,0.7)]">
			<div class="flex items-center justify-between border-b border-[#e6ebf2] px-5 py-4">
				<div>
					<h2 class="text-xl font-semibold text-slate-900">Edit Data</h2>
				</div>
				<button type="button" onclick={closeEditModal} class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d7dee8] text-slate-500 hover:bg-slate-50">
					<X class="h-4 w-4" />
				</button>
			</div>
			<div class="max-h-[78vh] overflow-y-auto px-5 py-4">
				<div class="grid gap-3 sm:grid-cols-2">
					<label class="grid gap-1.5">
						<span class="text-xs font-semibold text-slate-600">No Registrasi *</span>
						<input type="text" bind:value={editForm.no_registrasi} placeholder="Contoh: 68A929AEDE796" class="h-11 rounded-lg border border-[#c9dcb8] bg-white px-3 text-sm text-slate-700 transition focus:border-[#8fbd6d] focus:outline-none focus:ring-0 focus:shadow-none" />
					</label>
					<label class="grid gap-1.5">
						<span class="text-xs font-semibold text-slate-600">Status</span>
						<StatusDropdown
							bind:value={editForm.status}
							options={STATUS_VALUES}
							disabled={isSavingEdit || data.unavailable}
						/>
					</label>
					<label class="grid gap-1.5">
						<span class="text-xs font-semibold text-slate-600">Tanggal Masuk</span>
						<div class="group relative">
							<input
								type="date"
								bind:value={editForm.tanggal_masuk}
								class="modern-date-input h-11 w-full rounded-xl border border-[#c9dcb8] bg-white px-3 pr-12 text-sm text-slate-700 transition focus:border-[#8fbd6d] focus:outline-none focus:ring-0 focus:shadow-none"
							/>
							<span class="pointer-events-none absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg border border-[#c7ddb7] bg-[#f2f9ea] text-[#4f6f3d] transition group-focus-within:border-[#89b866] group-focus-within:bg-[#e8f4db] group-focus-within:text-[#2f6b1f]">
								<Calendar class="h-4 w-4" />
							</span>
						</div>
					</label>
					<label class="grid gap-1.5">
						<span class="text-xs font-semibold text-slate-600">Tanggal Update *</span>
						<div class="group relative">
							<input
								type="date"
								bind:value={editForm.tanggal_update}
								class="modern-date-input h-11 w-full rounded-xl border border-[#c9dcb8] bg-white px-3 pr-12 text-sm text-slate-700 transition focus:border-[#8fbd6d] focus:outline-none focus:ring-0 focus:shadow-none"
							/>
							<span class="pointer-events-none absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg border border-[#c7ddb7] bg-[#f2f9ea] text-[#4f6f3d] transition group-focus-within:border-[#89b866] group-focus-within:bg-[#e8f4db] group-focus-within:text-[#2f6b1f]">
								<Calendar class="h-4 w-4" />
							</span>
						</div>
					</label>
					<label class="grid gap-1.5 sm:col-span-2">
						<span class="text-xs font-semibold text-slate-600">Instansi</span>
						<input type="text" bind:value={editForm.instansi} placeholder="Contoh: Dinas Lingkungan Hidup Kalsel" class="h-11 rounded-lg border border-[#c9dcb8] bg-white px-3 text-sm text-slate-700 transition focus:border-[#8fbd6d] focus:outline-none focus:ring-0 focus:shadow-none" />
					</label>
					<label class="grid gap-1.5 sm:col-span-2">
						<span class="text-xs font-semibold text-slate-600">Kegiatan</span>
						<input type="text" bind:value={editForm.kegiatan} placeholder="Contoh: Membangun gedung baru" class="h-11 rounded-lg border border-[#c9dcb8] bg-white px-3 text-sm text-slate-700 transition focus:border-[#8fbd6d] focus:outline-none focus:ring-0 focus:shadow-none" />
					</label>
					<label class="grid gap-1.5 sm:col-span-2">
						<span class="text-xs font-semibold text-slate-600">Jenis Dokumen</span>
						<input type="text" bind:value={editForm.jenis_dokumen} placeholder="Contoh: Andal" class="h-11 rounded-lg border border-[#c9dcb8] bg-white px-3 text-sm text-slate-700 transition focus:border-[#8fbd6d] focus:outline-none focus:ring-0 focus:shadow-none" />
					</label>
					<label class="grid gap-1.5 sm:col-span-2">
						<span class="text-xs font-semibold text-slate-600">Posisi</span>
						<PositionDropdown
							bind:value={editForm.posisi}
							options={POSITION_OPTIONS}
							disabled={isSavingEdit || data.unavailable}
							placeholder="Contoh: Koordinator Tim"
						/>
					</label>
				</div>
			</div>
			<div class="flex flex-wrap justify-end gap-2 border-t border-[#e6ebf2] px-5 py-4">
				<button type="button" onclick={closeEditModal} class="inline-flex h-10 items-center rounded-lg border border-[#cfd7e3] bg-white px-4 text-sm font-semibold text-slate-700">Batal</button>
				<button type="button" onclick={submitEdit} disabled={isSavingEdit || data.unavailable} class="inline-flex h-10 items-center rounded-lg bg-[#64AD31] px-4 text-sm font-semibold !text-white transition hover:bg-[#4f8925] disabled:cursor-not-allowed disabled:bg-slate-300">
					{isSavingEdit ? 'Menyimpan...' : 'Simpan'}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modern-date-input {
		appearance: none;
		-webkit-appearance: none;
		color-scheme: light;
	}

	.modern-date-input::-webkit-calendar-picker-indicator {
		position: absolute;
		right: 0;
		width: 2.75rem;
		height: 100%;
		margin: 0;
		opacity: 0;
		cursor: pointer;
	}

	.modern-date-input::-webkit-inner-spin-button,
	.modern-date-input::-webkit-clear-button {
		display: none;
	}

</style>


{#if deleteTarget}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button type="button" class="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px]" onclick={closeDeleteModal} aria-label="Tutup modal hapus data"></button>
		<div class="relative w-full max-w-md rounded-2xl border border-[#f3c5c5] bg-white p-5 shadow-[0_28px_50px_-36px_rgba(15,23,42,0.7)]">
			<h2 class="text-lg font-semibold text-slate-900">Data akan dihapus permanen</h2>
			<div class="mt-5 flex flex-wrap justify-end gap-2">
				<button type="button" onclick={closeDeleteModal} class="inline-flex h-10 items-center rounded-lg border border-[#cfd7e3] bg-white px-4 text-sm font-semibold text-slate-700">Batal</button>
				<button type="button" onclick={confirmDelete} disabled={isDeleting || data.unavailable} class="inline-flex h-10 items-center rounded-lg bg-rose-600 px-4 text-sm font-semibold !text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:!text-white">
					{isDeleting ? 'Menghapus...' : 'Hapus'}
				</button>
			</div>
		</div>
	</div>
{/if}






