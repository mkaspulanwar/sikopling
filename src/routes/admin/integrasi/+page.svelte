<script lang="ts">
	import Calendar from 'lucide-svelte/icons/calendar'
	import ChevronLeft from 'lucide-svelte/icons/chevron-left'
	import ChevronRight from 'lucide-svelte/icons/chevron-right'
	import CirclePlus from 'lucide-svelte/icons/circle-plus'
	import SquarePen from 'lucide-svelte/icons/square-pen'
	import Trash from 'lucide-svelte/icons/trash'
	import X from 'lucide-svelte/icons/x'

	type IntegrationStatus = 'Submit' | 'Evaluasi Dokumen' | 'Verifikasi Integrasi' | 'Dikembalikan' | 'Selesai'
	type QueueRow = {
		id: string
		no: string
		instansi: string
		kegiatan: string
		jenis: string
		status: IntegrationStatus
		posisi: string
		tanggalUpdate: string
		keterangan: string
	}
	type QueueForm = Omit<QueueRow, 'id'>

	const dateFormatter = new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	})
	const numberFormatter = new Intl.NumberFormat('id-ID')
	const ROWS_PER_PAGE_OPTIONS = [5, 10, 20] as const
	const STATUS_OPTIONS: IntegrationStatus[] = ['Submit', 'Evaluasi Dokumen', 'Verifikasi Integrasi', 'Dikembalikan', 'Selesai']
	const statusBadgeClassMap: Record<IntegrationStatus, string> = {
		Submit: 'border-[#bfc8d7] bg-[#f4f6f9] text-[#364152]',
		'Evaluasi Dokumen': 'border-[#9cb6de] bg-[#edf4ff] text-[#1f4e8c]',
		'Verifikasi Integrasi': 'border-[#9bcfd5] bg-[#eaf8fa] text-[#1f5f69]',
		Dikembalikan: 'border-[#d9a98a] bg-[#fff1e8] text-[#8a4522]',
		Selesai: 'border-[#91c5ad] bg-[#e8f7ef] text-[#1f6d46]'
	}
	const createInitialForm = (): QueueForm => ({
		no: '',
		instansi: '',
		kegiatan: '',
		jenis: '',
		status: 'Submit',
		posisi: '',
		tanggalUpdate: '',
		keterangan: ''
	})

	let rows = $state<QueueRow[]>([
		{
			id: 'int-1',
			no: 'INT-2026-001',
			instansi: 'Dinas Lingkungan Hidup Provinsi Kalimantan Selatan',
			kegiatan: 'Sinkronisasi dokumen lingkungan lintas layanan',
			jenis: 'Integrasi Perling-Pertek',
			status: 'Verifikasi Integrasi',
			posisi: 'Sekretariat',
			tanggalUpdate: '2026-05-04',
			keterangan: 'Menunggu validasi kelengkapan data teknis.'
		},
		{
			id: 'int-2',
			no: 'INT-2026-002',
			instansi: 'PT Banua Energi Sejahtera',
			kegiatan: 'Integrasi pemantauan persetujuan teknis air limbah',
			jenis: 'Integrasi Pertek',
			status: 'Evaluasi Dokumen',
			posisi: 'Tim Teknis',
			tanggalUpdate: '2026-05-02',
			keterangan: 'Evaluasi substansi sedang berjalan.'
		},
		{
			id: 'int-3',
			no: 'INT-2026-003',
			instansi: 'Pemerintah Kabupaten Banjar',
			kegiatan: 'Konsolidasi data kegiatan pembangunan kawasan',
			jenis: 'Integrasi Dokling',
			status: 'Dikembalikan',
			posisi: 'Pemrakarsa',
			tanggalUpdate: '2026-04-29',
			keterangan: 'Perlu perbaikan uraian kegiatan.'
		}
	])
	let filterKeyword = $state('')
	let filterStatus = $state<IntegrationStatus | ''>('')
	let rowsPerPage = $state<(typeof ROWS_PER_PAGE_OPTIONS)[number]>(10)
	let currentPage = $state(1)
	let isCreateModalOpen = $state(false)
	let isEditModalOpen = $state(false)
	let editRowId = $state<string | null>(null)
	let createForm = $state<QueueForm>(createInitialForm())
	let editForm = $state<QueueForm>(createInitialForm())
	let modalForm = $state<QueueForm>(createInitialForm())

	const normalize = (value: string) => value.trim().toLowerCase()
	const formatDate = (value: string) => (value ? dateFormatter.format(new Date(`${value}T00:00:00`)) : '-')
	const formatNumber = (value: number) => numberFormatter.format(value)
	const getStatusBadgeClass = (status: IntegrationStatus) => statusBadgeClassMap[status]
	const filteredRows = $derived.by(() => {
		const query = normalize(filterKeyword)
		return rows.filter((row) => {
			if (filterStatus && row.status !== filterStatus) return false
			if (!query) return true
			return [row.no, row.instansi, row.kegiatan, row.jenis, row.status, row.posisi, row.keterangan].some((value) =>
				normalize(value).includes(query)
			)
		})
	})
	const sortedRows = $derived([...filteredRows].sort((left, right) => new Date(`${right.tanggalUpdate}T00:00:00`).getTime() - new Date(`${left.tanggalUpdate}T00:00:00`).getTime()))
	const totalPages = $derived(Math.max(1, Math.ceil(sortedRows.length / rowsPerPage)))
	const pageStartIndex = $derived((currentPage - 1) * rowsPerPage)
	const paginatedRows = $derived(sortedRows.slice(pageStartIndex, pageStartIndex + rowsPerPage))
	const statusMetrics = $derived.by(() => ({
		total: rows.length,
		selesai: rows.filter((row) => row.status === 'Selesai').length,
		diproses: rows.filter((row) => !['Selesai', 'Dikembalikan'].includes(row.status)).length,
		dikembalikan: rows.filter((row) => row.status === 'Dikembalikan').length
	}))

	const resetPage = () => {
		currentPage = 1
	}
	const openCreateModal = () => {
		createForm = createInitialForm()
		modalForm = createInitialForm()
		isCreateModalOpen = true
	}
	const submitCreate = () => {
		createForm = modalForm
		rows = [{ ...modalForm, id: `int-${Date.now()}` }, ...rows]
		isCreateModalOpen = false
		createForm = createInitialForm()
		modalForm = createInitialForm()
		resetPage()
	}
	const openEditModal = (row: QueueRow) => {
		editRowId = row.id
		modalForm = {
			no: row.no,
			instansi: row.instansi,
			kegiatan: row.kegiatan,
			jenis: row.jenis,
			status: row.status,
			posisi: row.posisi,
			tanggalUpdate: row.tanggalUpdate,
			keterangan: row.keterangan
		}
		editForm = modalForm
		isEditModalOpen = true
	}
	const submitEdit = () => {
		if (!editRowId) return
		editForm = modalForm
		rows = rows.map((row) => (row.id === editRowId ? { ...modalForm, id: row.id } : row))
		isEditModalOpen = false
		editRowId = null
	}
	const deleteRow = (rowId: string) => {
		rows = rows.filter((row) => row.id !== rowId)
		if (currentPage > totalPages) currentPage = totalPages
	}
</script>

<section class="w-full space-y-5">
	<header class="overflow-hidden rounded-3xl border border-[var(--line)] bg-[#64AD31] p-6 sm:p-7">
		<p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--surface)]">Admin Integrasi</p>
		<h1 class="mt-2 text-2xl font-semibold tracking-tight text-[var(--surface)] sm:text-[2rem]">Monitoring Integrasi</h1>
		<p class="mt-2 max-w-3xl text-sm text-[var(--surface)] sm:text-[0.96rem]">
			Kelola tampilan antrian monitoring integrasi. Data pada halaman ini masih sementara sampai koneksi Supabase disiapkan.
		</p>
	</header>

	<div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Total</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(statusMetrics.total)}</p>
		</article>
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Selesai</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(statusMetrics.selesai)}</p>
		</article>
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Diproses</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(statusMetrics.diproses)}</p>
		</article>
		<article class="rounded-xl border border-[#d7dee8] bg-white px-4 py-5 text-center">
			<p class="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-slate-500">Dikembalikan</p>
			<p class="mt-2 text-2xl font-semibold text-slate-900">{formatNumber(statusMetrics.dikembalikan)}</p>
		</article>
	</div>

	<div class="rounded-2xl border border-[#d7dee8] bg-white p-4 sm:p-5">
		<div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
			<div class="flex flex-col gap-2 sm:flex-row">
				<input
					type="text"
					bind:value={filterKeyword}
					oninput={resetPage}
					placeholder="Cari instansi, kegiatan, jenis, atau keterangan"
					class="h-10 w-full rounded-xl border border-[#cfd7e3] bg-white px-3 text-sm text-slate-700 focus:border-[#8fbd6d] focus:ring-0 sm:w-80"
				/>
				<select bind:value={filterStatus} onchange={resetPage} class="h-10 rounded-xl border border-[#cfd7e3] bg-white px-3 text-sm font-semibold text-slate-700 focus:border-[#8fbd6d] focus:ring-0">
					<option value="">Semua Status</option>
					{#each STATUS_OPTIONS as status}
						<option value={status}>{status}</option>
					{/each}
				</select>
			</div>
			<button type="button" onclick={openCreateModal} class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#64AD31] bg-[#64AD31] px-4 text-sm font-semibold !text-white transition hover:border-[#4f8925] hover:bg-[#4f8925]">
				<CirclePlus class="h-4 w-4 text-white" />
				Tambah
			</button>
		</div>
	</div>

	<section class="overflow-x-auto overflow-y-hidden rounded-2xl border-y border-[#d7dee8] bg-white">
		<table class="hidden w-full min-w-[1120px] border-collapse md:table">
			<thead class="bg-[#64AD31]">
				<tr>
					<th class="w-14 px-3 py-4 text-center text-sm font-semibold text-white">No</th>
					<th class="px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Instansi</th>
					<th class="px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Kegiatan</th>
					<th class="px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Jenis</th>
					<th class="w-40 px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Status</th>
					<th class="w-36 px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Posisi</th>
					<th class="w-44 px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Tanggal Update</th>
					<th class="px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Keterangan</th>
					<th class="w-28 px-4 py-4 text-center text-sm font-semibold tracking-[0.01em] text-white">Aksi</th>
				</tr>
			</thead>
			<tbody>
				{#if paginatedRows.length === 0}
					<tr>
						<td colspan="9" class="px-6 py-12 text-center">
							<p class="text-base font-semibold text-[var(--ink)]">Belum ada data integrasi.</p>
							<p class="mt-1 text-sm text-[var(--muted)]">Silakan tambah baris baru.</p>
						</td>
					</tr>
				{:else}
					{#each paginatedRows as row, index}
						<tr class="border-t border-[#edf1f5] align-top odd:bg-white even:bg-[#fbfcfd]">
							<td class="px-3 py-4 text-center text-sm text-[#20232A]">{pageStartIndex + index + 1}</td>
							<td class="px-4 py-4 text-sm font-semibold text-[#20232A]">{row.instansi}</td>
							<td class="px-4 py-4 text-sm leading-relaxed text-[#20232A]">{row.kegiatan}</td>
							<td class="px-4 py-4 text-sm text-[#20232A]">{row.jenis}</td>
							<td class="px-4 py-4 text-sm">
								<span class={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.72rem] leading-tight font-medium ${getStatusBadgeClass(row.status)}`}>{row.status}</span>
							</td>
							<td class="px-4 py-4 text-sm text-[#20232A]">{row.posisi}</td>
							<td class="px-4 py-4 text-sm text-[#20232A]">{formatDate(row.tanggalUpdate)}</td>
							<td class="px-4 py-4 text-sm leading-relaxed text-[#20232A]">{row.keterangan}</td>
							<td class="px-4 py-4">
								<div class="flex items-center justify-center gap-2">
									<button type="button" onclick={() => openEditModal(row)} class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#cfd7e3] text-slate-600 hover:bg-slate-50" aria-label="Edit data">
										<SquarePen class="h-4 w-4" />
									</button>
									<button type="button" onclick={() => deleteRow(row.id)} class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50" aria-label="Hapus data">
										<Trash class="h-4 w-4" />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>

		<div class="space-y-3 p-3 md:hidden">
			{#each paginatedRows as row, index}
				<article class="rounded-xl border border-[#d7dee8] bg-white p-4">
					<div class="flex items-start justify-between gap-3">
						<div>
							<p class="text-xs font-semibold text-slate-500">#{pageStartIndex + index + 1} · {row.no}</p>
							<h2 class="mt-1 text-sm font-semibold text-slate-900">{row.instansi}</h2>
							<p class="mt-1 text-sm text-slate-600">{row.kegiatan}</p>
						</div>
						<span class={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-[0.72rem] leading-tight font-medium ${getStatusBadgeClass(row.status)}`}>{row.status}</span>
					</div>
					<dl class="mt-3 grid grid-cols-2 gap-3 text-sm">
						<div>
							<dt class="text-xs font-semibold text-slate-500">Jenis</dt>
							<dd class="mt-1 text-slate-800">{row.jenis}</dd>
						</div>
						<div>
							<dt class="text-xs font-semibold text-slate-500">Posisi</dt>
							<dd class="mt-1 text-slate-800">{row.posisi}</dd>
						</div>
						<div class="col-span-2">
							<dt class="text-xs font-semibold text-slate-500">Keterangan</dt>
							<dd class="mt-1 text-slate-800">{row.keterangan}</dd>
						</div>
					</dl>
				</article>
			{/each}
		</div>
	</section>

	<div class="flex flex-col gap-3 rounded-2xl border border-[#d7dee8] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
		<label class="flex items-center justify-center gap-2 text-xs text-[#667085] sm:justify-start">
			Baris
			<select bind:value={rowsPerPage} onchange={resetPage} class="h-9 rounded-lg border border-[#cfd7e3] bg-white px-2 text-xs font-semibold text-[#20232A]">
				{#each ROWS_PER_PAGE_OPTIONS as option}
					<option value={option}>{option}</option>
				{/each}
			</select>
		</label>
		<nav aria-label="Navigasi halaman antrian integrasi" class="flex items-center justify-center gap-1.5">
			<button type="button" disabled={currentPage === 1} onclick={() => (currentPage = 1)} class="inline-flex h-9 items-center justify-center rounded-md px-2.5 text-xs font-semibold text-[#475467] hover:bg-[#f4f8f0] disabled:cursor-not-allowed disabled:opacity-40">Awal</button>
			<button type="button" disabled={currentPage === 1} onclick={() => (currentPage -= 1)} aria-label="Halaman sebelumnya" class="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#475467] hover:bg-[#f4f8f0] disabled:cursor-not-allowed disabled:opacity-40">
				<ChevronLeft class="h-4 w-4" strokeWidth={2.3} />
			</button>
			<span class="px-2 text-xs font-semibold text-slate-600">{formatNumber(currentPage)} / {formatNumber(totalPages)}</span>
			<button type="button" disabled={currentPage === totalPages} onclick={() => (currentPage += 1)} aria-label="Halaman berikutnya" class="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#475467] hover:bg-[#f4f8f0] disabled:cursor-not-allowed disabled:opacity-40">
				<ChevronRight class="h-4 w-4" strokeWidth={2.3} />
			</button>
			<button type="button" disabled={currentPage === totalPages} onclick={() => (currentPage = totalPages)} class="inline-flex h-9 items-center justify-center rounded-md px-2.5 text-xs font-semibold text-[#475467] hover:bg-[#f4f8f0] disabled:cursor-not-allowed disabled:opacity-40">Akhir</button>
		</nav>
	</div>
</section>

{#if isCreateModalOpen || isEditModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button type="button" class="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px]" onclick={() => { isCreateModalOpen = false; isEditModalOpen = false }} aria-label="Tutup modal"></button>
		<div class="relative w-full max-w-3xl rounded-2xl border border-[#d7dee8] bg-white shadow-[0_32px_68px_-42px_rgba(15,23,42,0.7)]">
			<div class="flex items-center justify-between border-b border-[#e6ebf2] px-5 py-4">
				<h2 class="text-xl font-semibold text-slate-900">{isCreateModalOpen ? 'Tambahkan Data Integrasi' : 'Edit Data Integrasi'}</h2>
				<button type="button" onclick={() => { isCreateModalOpen = false; isEditModalOpen = false }} class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d7dee8] text-slate-500 hover:bg-slate-50">
					<X class="h-4 w-4" />
				</button>
			</div>
			<div class="grid max-h-[70vh] gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2">
				<label class="grid gap-1.5">
					<span class="text-xs font-semibold text-slate-600">No</span>
					<input type="text" bind:value={modalForm.no} placeholder="Contoh: INT-2026-001" class="h-11 rounded-lg border border-[#c9dcb8] bg-white px-3 text-sm text-slate-700 focus:border-[#8fbd6d] focus:ring-0" />
				</label>
				<label class="grid gap-1.5">
					<span class="text-xs font-semibold text-slate-600">Status</span>
					<select bind:value={modalForm.status} class="h-11 rounded-lg border border-[#c9dcb8] bg-white px-3 text-sm text-slate-700 focus:border-[#8fbd6d] focus:ring-0">
						{#each STATUS_OPTIONS as status}
							<option value={status}>{status}</option>
						{/each}
					</select>
				</label>
				<label class="grid gap-1.5">
					<span class="text-xs font-semibold text-slate-600">Tanggal Update</span>
					<div class="relative">
						<input type="date" bind:value={modalForm.tanggalUpdate} class="h-11 w-full rounded-xl border border-[#c9dcb8] bg-white px-3 pr-12 text-sm text-slate-700 focus:border-[#8fbd6d] focus:ring-0" />
						<span class="pointer-events-none absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg border border-[#c7ddb7] bg-[#f2f9ea] text-[#4f6f3d]">
							<Calendar class="h-3.5 w-3.5" />
						</span>
					</div>
				</label>
				<label class="grid gap-1.5">
					<span class="text-xs font-semibold text-slate-600">Posisi</span>
					<input type="text" bind:value={modalForm.posisi} placeholder="Contoh: Sekretariat" class="h-11 rounded-lg border border-[#c9dcb8] bg-white px-3 text-sm text-slate-700 focus:border-[#8fbd6d] focus:ring-0" />
				</label>
				<label class="grid gap-1.5 sm:col-span-2">
					<span class="text-xs font-semibold text-slate-600">Instansi</span>
					<input type="text" bind:value={modalForm.instansi} placeholder="Contoh: Dinas Lingkungan Hidup Kalsel" class="h-11 rounded-lg border border-[#c9dcb8] bg-white px-3 text-sm text-slate-700 focus:border-[#8fbd6d] focus:ring-0" />
				</label>
				<label class="grid gap-1.5 sm:col-span-2">
					<span class="text-xs font-semibold text-slate-600">Kegiatan</span>
					<input type="text" bind:value={modalForm.kegiatan} placeholder="Contoh: Sinkronisasi dokumen lingkungan" class="h-11 rounded-lg border border-[#c9dcb8] bg-white px-3 text-sm text-slate-700 focus:border-[#8fbd6d] focus:ring-0" />
				</label>
				<label class="grid gap-1.5 sm:col-span-2">
					<span class="text-xs font-semibold text-slate-600">Jenis</span>
					<input type="text" bind:value={modalForm.jenis} placeholder="Contoh: Integrasi Perling-Pertek" class="h-11 rounded-lg border border-[#c9dcb8] bg-white px-3 text-sm text-slate-700 focus:border-[#8fbd6d] focus:ring-0" />
				</label>
				<label class="grid gap-1.5 sm:col-span-2">
					<span class="text-xs font-semibold text-slate-600">Keterangan</span>
					<textarea bind:value={modalForm.keterangan} rows="3" placeholder="Catatan atau tindak lanjut terbaru" class="rounded-lg border border-[#c9dcb8] bg-white px-3 py-2 text-sm text-slate-700 focus:border-[#8fbd6d] focus:ring-0"></textarea>
				</label>
			</div>
			<div class="flex flex-wrap justify-end gap-2 border-t border-[#e6ebf2] px-5 py-4">
				<button type="button" onclick={() => { isCreateModalOpen = false; isEditModalOpen = false }} class="inline-flex h-10 items-center rounded-lg border border-[#cfd7e3] bg-white px-4 text-sm font-semibold text-slate-700">Batal</button>
				<button type="button" onclick={isCreateModalOpen ? submitCreate : submitEdit} class="inline-flex h-10 items-center rounded-lg bg-[#64AD31] px-4 text-sm font-semibold !text-white transition hover:bg-[#4f8925]">
					Simpan
				</button>
			</div>
		</div>
	</div>
{/if}
