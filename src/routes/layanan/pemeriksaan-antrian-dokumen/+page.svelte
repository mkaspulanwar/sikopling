<script lang="ts">
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Download from 'lucide-svelte/icons/download';
	import Search from 'lucide-svelte/icons/search';

	type ProgressStatus =
		| 'Menunggu Verifikasi'
		| 'Penilaian Teknis'
		| 'Perbaikan Dokumen'
		| 'Penerbitan Persetujuan'
		| 'Selesai';
	type QueuePosition = 'Penyusun' | 'Pemrakarsa' | 'Sekretariat TU';

	type QueueRow = {
		registrationNo: string;
		receivedDate: string;
		agency: string;
		activity: string;
		documentType: string;
		position: QueuePosition;
		progressStatus: ProgressStatus;
		progressUpdatedDate: string;
	};

	type PositionFilter =
		| 'Semua Posisi'
		| 'Andal'
		| 'DELH'
		| 'Addendum'
		| 'UKP-UPL'
		| 'DPLH'
		| 'Pertek'
		;

	const queueTemplates: Array<
		Omit<QueueRow, 'registrationNo' | 'receivedDate' | 'progressUpdatedDate' | 'position'>
	> = [
		{
			agency: 'PT Mitra Agro Banua',
			activity: 'Pengembangan Kawasan Industri Pengolahan Hasil Pertanian',
			documentType: 'Andal',
			progressStatus: 'Penilaian Teknis'
		},
		{
			agency: 'Dinas PUPR Kab. Banjar',
			activity: 'Normalisasi Sungai dan Penguatan Tanggul',
			documentType: 'UKP-UPL',
			progressStatus: 'Perbaikan Dokumen'
		},
		{
			agency: 'PT Karya Borneo Energi',
			activity: 'Pembangunan Fasilitas Penyimpanan Limbah B3',
			documentType: 'Pertek',
			progressStatus: 'Penerbitan Persetujuan'
		},
		{
			agency: 'PT Sinar Khatulistiwa Mineral',
			activity: 'Perluasan Area Stockpile Batubara',
			documentType: 'Andal',
			progressStatus: 'Penilaian Teknis'
		},
		{
			agency: 'PT Tirta Kalimantan Sejahtera',
			activity: 'Instalasi Pengolahan Air Limbah Kawasan',
			documentType: 'UKP-UPL',
			progressStatus: 'Selesai'
		},
		{
			agency: 'Pemkab Tanah Laut',
			activity: 'Revitalisasi TPA dan Sistem Pengelolaan Sampah Terpadu',
			documentType: 'DELH',
			progressStatus: 'Penerbitan Persetujuan'
		},
		{
			agency: 'PT Samudra Pangan Nusantara',
			activity: 'Pembangunan Pabrik Pengolahan Hasil Laut',
			documentType: 'UKP-UPL',
			progressStatus: 'Menunggu Verifikasi'
		},
		{
			agency: 'PT Angkasa Banua Logistik',
			activity: 'Pembangunan Gudang Logistik Terintegrasi',
			documentType: 'DPLH',
			progressStatus: 'Perbaikan Dokumen'
		},
		{
			agency: 'PT Borneo Kencana Pulp',
			activity: 'Penyesuaian Kapasitas Produksi dan Emisi Udara',
			documentType: 'DELH',
			progressStatus: 'Penilaian Teknis'
		},
		{
			agency: 'PT Nusantara Konstruksi Raya',
			activity: 'Addendum Dokumen Pengelolaan Lingkungan Kawasan Komersial',
			documentType: 'Addendum',
			progressStatus: 'Menunggu Verifikasi'
		}
	];

	const formatIsoDate = (date: Date) => date.toISOString().slice(0, 10);
	const addDaysUtc = (isoDate: string, offsetDays: number) => {
		const [year, month, day] = isoDate.split('-').map(Number);
		const baseDate = new Date(Date.UTC(year, month - 1, day));
		baseDate.setUTCDate(baseDate.getUTCDate() + offsetDays);
		return formatIsoDate(baseDate);
	};
	const registrationSeed = Number.parseInt('681195DAEA4DD', 16);
	const queuePositions: QueuePosition[] = ['Penyusun', 'Pemrakarsa', 'Sekretariat TU'];

	const queueRows: QueueRow[] = Array.from({ length: 1000 }, (_, index) => {
		const template = queueTemplates[index % queueTemplates.length];
		const receivedDate = addDaysUtc('2026-01-06', index * 2);
		const progressUpdatedDate = addDaysUtc(receivedDate, (index % 6) + 1);
		return {
			registrationNo: (registrationSeed + index).toString(16).toUpperCase(),
			receivedDate,
			progressUpdatedDate,
			position: queuePositions[index % queuePositions.length],
			...template
		};
	});

	const dateFormatter = new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	});

	let searchQuery = $state('');
	let statusFilter = $state<'Semua Status' | ProgressStatus>('Semua Status');
	let positionFilter = $state<PositionFilter>('Semua Posisi');
	let expandedRows = $state<string[]>([]);
	const rowsPerPageOptions = [5, 10, 20] as const;
	type RowsPerPage = (typeof rowsPerPageOptions)[number];
	let rowsPerPage = $state<RowsPerPage>(10);
	let currentPage = $state(1);

	const toTimestamp = (value: string) => new Date(`${value}T00:00:00`).getTime();
	const formatDate = (value: string) => dateFormatter.format(new Date(`${value}T00:00:00`));
	const normalize = (value: string) => value.trim().toLowerCase();
	const escapeCsvValue = (value: string) => `"${value.replaceAll('"', '""')}"`;
	const resolvePositionCategory = (
		documentType: string
	): Exclude<PositionFilter, 'Semua Posisi'> | 'Lainnya' => {
		const value = normalize(documentType);
		if (value.includes('andal') || value.includes('amdal')) return 'Andal';
		if (value.includes('delh')) return 'DELH';
		if (value.includes('addendum')) return 'Addendum';
		if (
			value.includes('ukp-upl') ||
			value.includes('ukp upl') ||
			value.includes('ukl-upl') ||
			value.includes('ukl upl')
		)
			return 'UKP-UPL';
		if (value.includes('dplh')) return 'DPLH';
		if (value.includes('pertek')) return 'Pertek';
		return 'Lainnya';
	};

	const filteredRows = $derived.by(() => {
		const query = normalize(searchQuery);
		return queueRows.filter((row) => {
			const statusMatched = statusFilter === 'Semua Status' || row.progressStatus === statusFilter;
			const positionMatched =
				positionFilter === 'Semua Posisi' ||
				resolvePositionCategory(row.documentType) === positionFilter;
			if (!statusMatched) return false;
			if (!positionMatched) return false;
			if (!query) return true;

			return [
				row.registrationNo,
				row.agency,
				row.activity,
				row.documentType,
				row.position,
				row.progressStatus,
				formatDate(row.receivedDate),
				formatDate(row.progressUpdatedDate)
			].some((value) => normalize(value).includes(query));
		});
	});

	const sortedRows = $derived.by(() =>
		[...filteredRows].sort(
			(left, right) =>
				toTimestamp(right.progressUpdatedDate) - toTimestamp(left.progressUpdatedDate)
		)
	);
	const totalFilteredRows = $derived(sortedRows.length);
	const totalPages = $derived(Math.max(1, Math.ceil(totalFilteredRows / rowsPerPage)));
	const pageStartIndex = $derived((currentPage - 1) * rowsPerPage);
	const pageEndIndex = $derived(pageStartIndex + rowsPerPage);
	const paginatedRows = $derived(sortedRows.slice(pageStartIndex, pageEndIndex));
	const visibleRangeStart = $derived(totalFilteredRows === 0 ? 0 : pageStartIndex + 1);
	const visibleRangeEnd = $derived(Math.min(pageEndIndex, totalFilteredRows));

	const isRowExpanded = (registrationNo: string) => expandedRows.includes(registrationNo);
	const resetExpandedAndFirstPage = () => {
		expandedRows = [];
		currentPage = 1;
	};
	const handleRowsPerPageChange = (event: Event) => {
		const target = event.currentTarget as HTMLSelectElement;
		rowsPerPage = Number(target.value) as RowsPerPage;
		resetExpandedAndFirstPage();
	};
	const toggleRowExpanded = (registrationNo: string) => {
		expandedRows = isRowExpanded(registrationNo)
			? expandedRows.filter((item) => item !== registrationNo)
			: [...expandedRows, registrationNo];
	};
	const goToPreviousPage = () => {
		if (currentPage === 1) return;
		currentPage -= 1;
		expandedRows = [];
	};
	const goToFirstPage = () => {
		if (currentPage === 1) return;
		currentPage = 1;
		expandedRows = [];
	};
	const goToNextPage = () => {
		if (currentPage === totalPages) return;
		currentPage += 1;
		expandedRows = [];
	};
	const goToLastPage = () => {
		if (currentPage === totalPages) return;
		currentPage = totalPages;
		expandedRows = [];
	};

	$effect(() => {
		if (currentPage > totalPages) {
			currentPage = totalPages;
			expandedRows = [];
		}
	});

	const exportFilteredRows = () => {
		if (sortedRows.length === 0) return;

		const header = [
			'No Registrasi',
			'Tanggal Masuk',
			'Instansi',
			'Kegiatan',
			'Jenis Dokumen',
			'Posisi',
			'Status',
			'Tanggal Update'
		];

		const lines = sortedRows.map((row) =>
			[
				row.registrationNo,
				formatDate(row.receivedDate),
				row.agency,
				row.activity,
				row.documentType,
				row.position,
				row.progressStatus,
				formatDate(row.progressUpdatedDate)
			]
				.map(escapeCsvValue)
				.join(',')
		);

		const csvContent = [`\uFEFF${header.map(escapeCsvValue).join(',')}`, ...lines].join('\r\n');
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const objectUrl = URL.createObjectURL(blob);
		const anchor = document.createElement('a');
		anchor.href = objectUrl;
		anchor.download = `antrian-dokumen-${formatIsoDate(new Date())}.csv`;
		document.body.append(anchor);
		anchor.click();
		anchor.remove();
		URL.revokeObjectURL(objectUrl);
	};

	const resetFilter = () => {
		searchQuery = '';
		statusFilter = 'Semua Status';
		positionFilter = 'Semua Posisi';
		expandedRows = [];
		currentPage = 1;
	};
</script>

<svelte:head>
	<title>Pemeriksaan Antrian Dokumen | SIKOPLING</title>
	<meta
		name="description"
		content="Halaman pelacakan antrian dokumen layanan untuk memantau status progress pengajuan persetujuan lingkungan."
	/>
</svelte:head>

<section class="relative overflow-hidden bg-[var(--canvas)] pt-28 pb-16 sm:pt-32 sm:pb-20">
	<div class="nav-shell relative">
		<div class="mt-0">
			<div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem_14rem]">
				<label
					for="search-antrian"
					class="flex h-12 items-center gap-3 rounded-md border border-[#c9d1dd] bg-[#ffffff] px-4"
				>
					<Search class="h-4.5 w-4.5 text-[var(--muted)]" strokeWidth={2} aria-hidden="true" />
					<input
						id="search-antrian"
						type="text"
						bind:value={searchQuery}
						oninput={resetExpandedAndFirstPage}
						placeholder="Cari no registrasi, instansi, kegiatan, atau status..."
						class="h-full w-full border-0 bg-transparent px-0 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:ring-0 focus:outline-none"
					/>
				</label>

				<label for="status-filter" class="sr-only">Filter status progress</label>
				<select
					id="status-filter"
					class="h-12 rounded-md border border-[#c9d1dd] bg-[#ffffff] px-4 text-sm font-medium text-[var(--ink)] focus:border-[#8ea26d] focus:ring-0"
					bind:value={statusFilter}
					onchange={resetExpandedAndFirstPage}
				>
					<option value="Semua Status">Semua Status</option>
					<option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
					<option value="Penilaian Teknis">Penilaian Teknis</option>
					<option value="Perbaikan Dokumen">Perbaikan Dokumen</option>
					<option value="Penerbitan Persetujuan">Penerbitan Persetujuan</option>
					<option value="Selesai">Selesai</option>
				</select>

				<label for="position-filter" class="sr-only">Filter jenis dokumen</label>
				<select
					id="position-filter"
					class="h-12 rounded-md border border-[#c9d1dd] bg-[#ffffff] px-4 text-sm font-medium text-[var(--ink)] focus:border-[#8ea26d] focus:ring-0"
					bind:value={positionFilter}
					onchange={resetExpandedAndFirstPage}
				>
					<option value="Semua Posisi">Semua Jenis Dokumen</option>
					<option value="Andal">Andal</option>
					<option value="DELH">DELH</option>
					<option value="Addendum">Addendum</option>
					<option value="UKP-UPL">UKP-UPL</option>
					<option value="DPLH">DPLH</option>
					<option value="Pertek">Pertek</option>
				</select>
			</div>

			<div class="mt-3 flex flex-wrap items-center justify-between gap-3 pb-3">
				<p class="text-xs font-medium text-[var(--muted)] sm:text-sm">
					Menampilkan
					<span class="font-semibold text-[var(--ink)]">{visibleRangeStart}</span>
					-
					<span class="font-semibold text-[var(--ink)]">{visibleRangeEnd}</span>
					dari
					<span class="font-semibold text-[var(--ink)]">{totalFilteredRows}</span>
					hasil filter, total
					<span class="font-semibold text-[var(--ink)]">{queueRows.length}</span> pengajuan dokumen
				</p>

				<div class="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:justify-end">
					<div
						class="inline-flex h-9 items-center gap-2 rounded-md border border-[#d3dbe7] bg-[#ffffff] pr-2 pl-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
					>
						<span class="text-xs font-semibold text-[var(--muted)]">Baris</span>
						<label for="rows-per-page" class="sr-only">Jumlah baris</label>
						<div class="relative">
							<select
								id="rows-per-page"
								class="h-8 min-w-[4.25rem] appearance-none rounded-md border-0 bg-transparent bg-none py-0 pr-7 pl-2 text-xs font-semibold text-[#20232A] [background-image:none] focus:ring-0 focus:outline-none"
								value={rowsPerPage}
								onchange={handleRowsPerPageChange}
							>
								{#each rowsPerPageOptions as option}
									<option value={option}>{option}</option>
								{/each}
							</select>
							<span
								class="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[var(--muted)]"
								aria-hidden="true"
							>
								<ChevronDown class="h-3.5 w-3.5" strokeWidth={2.2} />
							</span>
						</div>
					</div>

					<button
						type="button"
						onclick={exportFilteredRows}
						disabled={totalFilteredRows === 0}
						class="inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-[#d3dbe7] bg-[#ffffff] px-3 text-xs font-semibold text-[#20232A] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:bg-[#f3f5f8] disabled:cursor-not-allowed disabled:opacity-50"
					>
						<Download class="h-3.5 w-3.5" strokeWidth={2.2} />
						Export CSV
					</button>

					{#if searchQuery || statusFilter !== 'Semua Status' || positionFilter !== 'Semua Posisi'}
						<button
							type="button"
							class="inline-flex h-9 items-center justify-center rounded-md border border-[#d3dbe7] bg-[#ffffff] px-3 text-xs font-semibold text-[var(--muted)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:bg-[#f3f5f8] hover:text-[var(--ink)]"
							onclick={resetFilter}
						>
							Reset Filter
						</button>
					{/if}
				</div>
			</div>
		</div>

		<div class="mt-6 hidden md:block">
			<div
				class="overflow-x-auto rounded-2xl border-y border-[#d7dee8] bg-transparent"
			>
				<table class="w-full min-w-[1180px] border-collapse">
					<thead class="bg-[#20232A]">
						<tr>
							<th
								class="w-14 border-b border-[#323944] px-3 py-4 text-center text-sm font-semibold tracking-[0.01em] text-white"
							>
								No
							</th>
							<th
								class="border-b border-[#323944] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								No Registrasi
							</th>
							<th
								class="border-b border-[#323944] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								Tanggal Masuk
							</th>
							<th
								class="border-b border-[#323944] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								Instansi
							</th>
							<th
								class="border-b border-[#323944] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								Kegiatan
							</th>
							<th
								class="border-b border-[#323944] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								Jenis Dokumen
							</th>
							<th
								class="w-28 border-b border-[#323944] px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								Posisi
							</th>
							<th
								class="w-32 border-b border-[#323944] px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								Status
							</th>
							<th
								class="border-b border-[#323944] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								Tanggal Update
							</th>
						</tr>
					</thead>

					<tbody>
						{#if totalFilteredRows === 0}
							<tr>
								<td colspan="9" class="px-6 py-12 text-center">
									<p class="text-base font-semibold text-[var(--ink)]">Data tidak ditemukan</p>
									<p class="mt-1 text-sm text-[var(--muted)]">
										Coba ubah kata kunci pencarian atau reset filter.
									</p>
								</td>
							</tr>
						{:else}
							{#each paginatedRows as row, index}
								<tr class="border-t border-[#e9edf3] align-top">
									<td class="w-14 px-3 py-4 text-center text-sm font-semibold text-[#20232A]">
										{pageStartIndex + index + 1}
									</td>
									<td class="px-6 py-4 text-sm font-semibold text-[#20232A]"
										>{row.registrationNo}</td
									>
									<td class="px-6 py-4 text-sm text-[#20232A]"
										>{formatDate(row.receivedDate)}</td
									>
									<td class="px-6 py-4 text-sm text-[#20232A]">{row.agency}</td>
									<td class="px-6 py-4 text-sm leading-relaxed text-[#20232A]"
										>{row.activity}</td
									>
									<td class="px-6 py-4 text-sm text-[#20232A]">{row.documentType}</td>
									<td class="w-28 px-4 py-4 text-sm text-[#20232A]">{row.position}</td>
									<td class="w-32 px-4 py-4 text-sm leading-snug text-[#20232A]">
										{row.progressStatus}
									</td>
									<td class="px-6 py-4 text-sm text-[#20232A]">
										{formatDate(row.progressUpdatedDate)}
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>

		<div
			class="mt-6 overflow-hidden rounded-2xl border-y border-[#d7dee8] bg-transparent md:hidden"
		>
			<div
				class="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3 border-b border-[#323944] bg-[#20232A] px-4 py-3.5 text-[0.78rem] font-semibold tracking-[0.01em] text-white"
			>
				<span>No Registrasi</span>
				<span>Instansi</span>
			</div>

			{#if totalFilteredRows === 0}
				<div class="px-6 py-12 text-center">
					<p class="text-base font-semibold text-[var(--ink)]">Data tidak ditemukan</p>
					<p class="mt-1 text-sm text-[var(--muted)]">
						Coba ubah kata kunci pencarian atau reset filter.
					</p>
				</div>
			{:else}
				<ul>
					{#each paginatedRows as row}
						<li class="border-t border-[var(--line)] first:border-t-0">
							<button
								type="button"
								class="grid w-full grid-cols-[7.5rem_minmax(0,1fr)] items-start gap-4 px-4 py-4 text-left"
								onclick={() => toggleRowExpanded(row.registrationNo)}
								aria-expanded={isRowExpanded(row.registrationNo)}
							>
								<p class="text-sm leading-relaxed font-semibold text-[#20232A]">
									{row.registrationNo}
								</p>

								<div class="min-w-0">
									<div class="flex items-start justify-between gap-2">
										<p class="text-sm leading-relaxed text-[#20232A]">{row.agency}</p>
										<span
											class={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-transparent text-[var(--muted)] transition-transform ${isRowExpanded(row.registrationNo) ? 'rotate-180' : ''}`}
											aria-hidden="true"
										>
											<ChevronDown class="h-3.5 w-3.5" strokeWidth={2.2} />
										</span>
									</div>
								</div>
							</button>

							{#if isRowExpanded(row.registrationNo)}
								<div class="border-t border-[var(--line)] bg-transparent px-4 py-4">
									<dl class="space-y-4">
										<div>
											<dt
												class="text-[0.76rem] font-semibold tracking-[0.01em] text-[#20232A]"
											>
												Tanggal Masuk
											</dt>
											<dd class="mt-1 text-sm text-[#20232A]">
												{formatDate(row.receivedDate)}
											</dd>
										</div>
										<div>
											<dt
												class="text-[0.76rem] font-semibold tracking-[0.01em] text-[#20232A]"
											>
												Kegiatan
											</dt>
											<dd class="mt-1 text-sm leading-relaxed text-[#20232A]">
												{row.activity}
											</dd>
										</div>
										<div>
											<dt
												class="text-[0.76rem] font-semibold tracking-[0.01em] text-[#20232A]"
											>
												Jenis Dokumen
											</dt>
											<dd class="mt-1 text-sm text-[#20232A]">{row.documentType}</dd>
										</div>
										<div>
											<dt
												class="text-[0.76rem] font-semibold tracking-[0.01em] text-[#20232A]"
											>
												Posisi
											</dt>
											<dd class="mt-1 text-sm text-[#20232A]">{row.position}</dd>
										</div>
										<div>
											<dt
												class="text-[0.76rem] font-semibold tracking-[0.01em] text-[#20232A]"
											>
												Status
											</dt>
											<dd class="mt-1 text-sm text-[#20232A]">{row.progressStatus}</dd>
										</div>
										<div>
											<dt
												class="text-[0.76rem] font-semibold tracking-[0.01em] text-[#20232A]"
											>
												Tanggal Update
											</dt>
											<dd class="mt-1 text-sm text-[#20232A]">
												{formatDate(row.progressUpdatedDate)}
											</dd>
										</div>
									</dl>
								</div>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		{#if totalFilteredRows > 0}
			<div
				class="mt-5 flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between"
			>
				<p class="text-xs font-medium text-[var(--muted)] sm:text-sm">
					Halaman <span class="font-semibold text-[var(--ink)]">{currentPage}</span> dari
					<span class="font-semibold text-[var(--ink)]">{totalPages}</span>
				</p>

				<div class="inline-flex w-full items-center justify-between gap-1.5 sm:w-auto sm:justify-end">
					<button
						type="button"
						onclick={goToFirstPage}
						disabled={currentPage === 1}
						class="inline-flex h-9 items-center justify-center rounded-lg border border-[#d3dbe7] bg-[#ffffff] px-3 text-xs font-semibold text-[#20232A] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:bg-[#f3f5f8] disabled:cursor-not-allowed disabled:opacity-45"
					>
						Awal
					</button>

					<button
						type="button"
						onclick={goToPreviousPage}
						disabled={currentPage === 1}
						aria-label="Halaman sebelumnya"
						class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d3dbe7] bg-[#ffffff] text-[#20232A] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:bg-[#f3f5f8] disabled:cursor-not-allowed disabled:opacity-45"
					>
						<ChevronLeft class="h-4 w-4" strokeWidth={2.3} />
					</button>

					<div
						class="inline-flex h-9 min-w-[5.75rem] items-center justify-center rounded-lg border border-[#d3dbe7] bg-[#f8fafc] px-3 text-xs font-semibold text-[#20232A]"
					>
						{currentPage} / {totalPages}
					</div>

					<button
						type="button"
						onclick={goToNextPage}
						disabled={currentPage === totalPages}
						aria-label="Halaman berikutnya"
						class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d3dbe7] bg-[#ffffff] text-[#20232A] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:bg-[#f3f5f8] disabled:cursor-not-allowed disabled:opacity-45"
					>
						<ChevronRight class="h-4 w-4" strokeWidth={2.3} />
					</button>

					<button
						type="button"
						onclick={goToLastPage}
						disabled={currentPage === totalPages}
						class="inline-flex h-9 items-center justify-center rounded-lg border border-[#d3dbe7] bg-[#ffffff] px-3 text-xs font-semibold text-[#20232A] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:bg-[#f3f5f8] disabled:cursor-not-allowed disabled:opacity-45"
					>
						Akhir
					</button>
				</div>
			</div>
		{/if}
	</div>
</section>
