<script lang="ts">
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Search from 'lucide-svelte/icons/search';

	type ProgressStatus =
		| 'Menunggu Verifikasi'
		| 'Penilaian Teknis'
		| 'Perbaikan Dokumen'
		| 'Penerbitan Persetujuan'
		| 'Selesai';

	type QueueRow = {
		registrationNo: string;
		receivedDate: string;
		agency: string;
		activity: string;
		position: string;
		progressStatus: ProgressStatus;
		progressUpdatedDate: string;
	};

	type PositionFilter =
		| 'Semua Posisi'
		| 'AMDAL'
		| 'DELH'
		| 'Addendum'
		| 'UKL-UPL'
		| 'DPLH'
		| 'Pertek';

	const queueRows: QueueRow[] = [
		{
			registrationNo: 'REG-PL-2026-0312',
			receivedDate: '2026-03-12',
			agency: 'PT Mitra Agro Banua',
			activity: 'Pengembangan Kawasan Industri Pengolahan Hasil Pertanian',
			position: 'AMDAL',
			progressStatus: 'Penilaian Teknis',
			progressUpdatedDate: '2026-03-27'
		},
		{
			registrationNo: 'REG-PL-2026-0309',
			receivedDate: '2026-03-09',
			agency: 'Dinas PUPR Kab. Banjar',
			activity: 'Normalisasi Sungai dan Penguatan Tanggul',
			position: 'UKL-UPL',
			progressStatus: 'Perbaikan Dokumen',
			progressUpdatedDate: '2026-03-26'
		},
		{
			registrationNo: 'REG-PL-2026-0304',
			receivedDate: '2026-03-04',
			agency: 'PT Karya Borneo Energi',
			activity: 'Pembangunan Fasilitas Penyimpanan Limbah B3',
			position: 'Pertek Limbah B3',
			progressStatus: 'Penerbitan Persetujuan',
			progressUpdatedDate: '2026-03-25'
		},
		{
			registrationNo: 'REG-PL-2026-0228',
			receivedDate: '2026-02-28',
			agency: 'PT Sinar Khatulistiwa Mineral',
			activity: 'Perluasan Area Stockpile Batubara',
			position: 'AMDAL',
			progressStatus: 'Penilaian Teknis',
			progressUpdatedDate: '2026-03-24'
		},
		{
			registrationNo: 'REG-PL-2026-0221',
			receivedDate: '2026-02-21',
			agency: 'PT Tirta Kalimantan Sejahtera',
			activity: 'Instalasi Pengolahan Air Limbah Kawasan',
			position: 'Pertek Air Limbah Domestik',
			progressStatus: 'Selesai',
			progressUpdatedDate: '2026-03-23'
		},
		{
			registrationNo: 'REG-PL-2026-0219',
			receivedDate: '2026-02-19',
			agency: 'Pemkab Tanah Laut',
			activity: 'Revitalisasi TPA dan Sistem Pengelolaan Sampah Terpadu',
			position: 'DELH',
			progressStatus: 'Penerbitan Persetujuan',
			progressUpdatedDate: '2026-03-22'
		},
		{
			registrationNo: 'REG-PL-2026-0213',
			receivedDate: '2026-02-13',
			agency: 'PT Samudra Pangan Nusantara',
			activity: 'Pembangunan Pabrik Pengolahan Hasil Laut',
			position: 'UKL-UPL',
			progressStatus: 'Menunggu Verifikasi',
			progressUpdatedDate: '2026-03-20'
		},
		{
			registrationNo: 'REG-PL-2026-0208',
			receivedDate: '2026-02-08',
			agency: 'PT Angkasa Banua Logistik',
			activity: 'Pembangunan Gudang Logistik Terintegrasi',
			position: 'DPLH',
			progressStatus: 'Perbaikan Dokumen',
			progressUpdatedDate: '2026-03-18'
		},
		{
			registrationNo: 'REG-PL-2026-0203',
			receivedDate: '2026-02-03',
			agency: 'PT Borneo Kencana Pulp',
			activity: 'Penyesuaian Kapasitas Produksi dan Emisi Udara',
			position: 'Pertek Emisi',
			progressStatus: 'Penilaian Teknis',
			progressUpdatedDate: '2026-03-17'
		}
	];

	const statusToneClass: Record<ProgressStatus, string> = {
		'Menunggu Verifikasi': 'border-[#d8dee8] bg-[#f5f7fa] text-[#3f4b5d]',
		'Penilaian Teknis': 'border-[#cbdcf8] bg-[#edf4ff] text-[#1f4b8f]',
		'Perbaikan Dokumen': 'border-[#f7d7b3] bg-[#fff5e9] text-[#8f4e14]',
		'Penerbitan Persetujuan': 'border-[#cde7d3] bg-[#ecf8ef] text-[#22653a]',
		Selesai: 'border-[#b9d7b9] bg-[#e7f7e7] text-[#1f5f1f]'
	};

	const dateFormatter = new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	});

	let searchQuery = $state('');
	let statusFilter = $state<'Semua Status' | ProgressStatus>('Semua Status');
	let positionFilter = $state<PositionFilter>('Semua Posisi');
	let expandedRows = $state<string[]>([]);

	const toTimestamp = (value: string) => new Date(`${value}T00:00:00`).getTime();
	const formatDate = (value: string) => dateFormatter.format(new Date(`${value}T00:00:00`));
	const normalize = (value: string) => value.trim().toLowerCase();
	const resolvePositionCategory = (
		position: string
	): Exclude<PositionFilter, 'Semua Posisi'> | 'Lainnya' => {
		const value = normalize(position);
		if (value.includes('amdal')) return 'AMDAL';
		if (value.includes('delh')) return 'DELH';
		if (value.includes('addendum')) return 'Addendum';
		if (value.includes('ukl-upl') || value.includes('ukl upl')) return 'UKL-UPL';
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
				resolvePositionCategory(row.position) === positionFilter;
			if (!statusMatched) return false;
			if (!positionMatched) return false;
			if (!query) return true;

			return [
				row.registrationNo,
				row.agency,
				row.activity,
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

	const isRowExpanded = (registrationNo: string) => expandedRows.includes(registrationNo);
	const toggleRowExpanded = (registrationNo: string) => {
		expandedRows = isRowExpanded(registrationNo)
			? expandedRows.filter((item) => item !== registrationNo)
			: [...expandedRows, registrationNo];
	};

	const resetFilter = () => {
		searchQuery = '';
		statusFilter = 'Semua Status';
		positionFilter = 'Semua Posisi';
		expandedRows = [];
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
	<div
		class="pointer-events-none absolute top-[-9rem] left-[6%] h-[24rem] w-[24rem] rounded-full bg-[#d9e8cb]/45 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute right-[4%] bottom-[-7rem] h-[22rem] w-[22rem] rounded-full bg-[#dbe5f4]/40 blur-3xl"
	></div>

	<div class="nav-shell relative">
		<div class="mx-auto max-w-4xl text-center">
			<p class="text-xs font-semibold tracking-[0.12em] text-[#7f9662] uppercase">Layanan</p>
			<h1
				class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl lg:text-5xl"
			>
				Pemeriksaan Antrian Dokumen
			</h1>
			<p class="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
				Lacak status pengajuan dokumen secara real-time, mulai dari tanggal masuk hingga pembaruan
				progress terakhir.
			</p>
		</div>

		<div
			class="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_24px_55px_-40px_rgba(15,23,42,0.38)] sm:p-6"
		>
			<div class="grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem_14rem]">
				<label
					for="search-antrian"
					class="flex h-12 items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4"
				>
					<Search class="h-4.5 w-4.5 text-[var(--muted)]" strokeWidth={2} aria-hidden="true" />
					<input
						id="search-antrian"
						type="text"
						bind:value={searchQuery}
						placeholder="Cari no registrasi, instansi, kegiatan, atau status..."
						class="h-full w-full border-0 bg-transparent px-0 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:ring-0 focus:outline-none"
					/>
				</label>

				<label for="status-filter" class="sr-only">Filter status progress</label>
				<select
					id="status-filter"
					class="h-12 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--ink)] focus:border-[#9fb27d] focus:ring-0"
					bind:value={statusFilter}
				>
					<option value="Semua Status">Semua Status</option>
					<option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
					<option value="Penilaian Teknis">Penilaian Teknis</option>
					<option value="Perbaikan Dokumen">Perbaikan Dokumen</option>
					<option value="Penerbitan Persetujuan">Penerbitan Persetujuan</option>
					<option value="Selesai">Selesai</option>
				</select>

				<label for="position-filter" class="sr-only">Filter posisi</label>
				<select
					id="position-filter"
					class="h-12 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--ink)] focus:border-[#9fb27d] focus:ring-0"
					bind:value={positionFilter}
				>
					<option value="Semua Posisi">Semua Posisi</option>
					<option value="AMDAL">AMDAL</option>
					<option value="DELH">DELH</option>
					<option value="Addendum">Addendum</option>
					<option value="UKL-UPL">UKL-UPL</option>
					<option value="DPLH">DPLH</option>
					<option value="Pertek">Pertek</option>
				</select>
			</div>

			<div class="mt-3 flex flex-wrap items-center justify-between gap-2">
				<p class="text-xs font-medium text-[var(--muted)] sm:text-sm">
					Menampilkan <span class="font-semibold text-[var(--ink)]">{sortedRows.length}</span> dari
					<span class="font-semibold text-[var(--ink)]">{queueRows.length}</span> pengajuan dokumen
				</p>

				{#if searchQuery || statusFilter !== 'Semua Status' || positionFilter !== 'Semua Posisi'}
					<button
						type="button"
						class="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--line)] px-3 text-xs font-semibold text-[var(--muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]"
						onclick={resetFilter}
					>
						Reset Filter
					</button>
				{/if}
			</div>
		</div>

		<div
			class="mt-6 hidden overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] shadow-[0_24px_52px_-42px_rgba(15,23,42,0.42)] md:block"
		>
			<div class="overflow-x-auto">
				<table class="w-full min-w-[1100px] border-collapse">
					<thead class="bg-[#f7faf5]">
						<tr>
							<th
								class="px-5 py-4 text-left text-xs font-semibold tracking-[0.08em] text-[#61794a] uppercase"
							>
								No Registrasi
							</th>
							<th
								class="px-5 py-4 text-left text-xs font-semibold tracking-[0.08em] text-[#61794a] uppercase"
							>
								Tanggal Masuk
							</th>
							<th
								class="px-5 py-4 text-left text-xs font-semibold tracking-[0.08em] text-[#61794a] uppercase"
							>
								Instansi
							</th>
							<th
								class="px-5 py-4 text-left text-xs font-semibold tracking-[0.08em] text-[#61794a] uppercase"
							>
								Kegiatan
							</th>
							<th
								class="px-5 py-4 text-left text-xs font-semibold tracking-[0.08em] text-[#61794a] uppercase"
							>
								Posisi
							</th>
							<th
								class="px-5 py-4 text-left text-xs font-semibold tracking-[0.08em] text-[#61794a] uppercase"
							>
								Status Progress
							</th>
							<th
								class="px-5 py-4 text-left text-xs font-semibold tracking-[0.08em] text-[#61794a] uppercase"
							>
								Tanggal Update Progress
							</th>
						</tr>
					</thead>

					<tbody>
						{#if sortedRows.length === 0}
							<tr>
								<td colspan="7" class="px-6 py-12 text-center">
									<p class="text-base font-semibold text-[var(--ink)]">Data tidak ditemukan</p>
									<p class="mt-1 text-sm text-[var(--muted)]">
										Coba ubah kata kunci pencarian atau reset filter.
									</p>
								</td>
							</tr>
						{:else}
							{#each sortedRows as row}
								<tr class="border-t border-[var(--line)] align-top even:bg-[#fcfdfb]">
									<td class="px-5 py-4 text-sm font-semibold text-[var(--ink)]"
										>{row.registrationNo}</td
									>
									<td class="px-5 py-4 text-sm text-[var(--muted)]"
										>{formatDate(row.receivedDate)}</td
									>
									<td class="px-5 py-4 text-sm text-[var(--ink)]">{row.agency}</td>
									<td class="px-5 py-4 text-sm leading-relaxed text-[var(--muted)]"
										>{row.activity}</td
									>
									<td class="px-5 py-4 text-sm text-[var(--ink)]">{row.position}</td>
									<td class="px-5 py-4 text-sm">
										<span
											class={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusToneClass[row.progressStatus]}`}
											>{row.progressStatus}</span
										>
									</td>
									<td class="px-5 py-4 text-sm text-[var(--muted)]">
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
			class="mt-6 overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)] shadow-[0_24px_52px_-42px_rgba(15,23,42,0.42)] md:hidden"
		>
			<div
				class="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-3 border-b border-[var(--line)] bg-[#f7faf5] px-4 py-3 text-[0.64rem] font-semibold tracking-[0.08em] text-[#61794a] uppercase"
			>
				<span>No Registrasi</span>
				<span>Instansi</span>
			</div>

			{#if sortedRows.length === 0}
				<div class="px-6 py-12 text-center">
					<p class="text-base font-semibold text-[var(--ink)]">Data tidak ditemukan</p>
					<p class="mt-1 text-sm text-[var(--muted)]">
						Coba ubah kata kunci pencarian atau reset filter.
					</p>
				</div>
			{:else}
				<ul>
					{#each sortedRows as row}
						<li class="border-t border-[var(--line)] first:border-t-0">
							<button
								type="button"
								class="grid w-full grid-cols-[7.5rem_minmax(0,1fr)] items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#fcfdfb]"
								onclick={() => toggleRowExpanded(row.registrationNo)}
								aria-expanded={isRowExpanded(row.registrationNo)}
							>
								<p class="text-sm leading-snug font-semibold text-[var(--ink)]">
									{row.registrationNo}
								</p>

								<div class="min-w-0">
									<div class="flex items-start justify-between gap-2">
										<p class="text-sm leading-snug text-[var(--ink)]">{row.agency}</p>
										<span
											class={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] transition-transform ${isRowExpanded(row.registrationNo) ? 'rotate-180' : ''}`}
											aria-hidden="true"
										>
											<ChevronDown class="h-3.5 w-3.5" strokeWidth={2.2} />
										</span>
									</div>
								</div>
							</button>

							{#if isRowExpanded(row.registrationNo)}
								<div class="border-t border-[var(--line)] bg-[#fbfdf9] px-4 py-3">
									<dl class="space-y-3">
										<div>
											<dt
												class="text-[0.67rem] font-semibold tracking-[0.08em] text-[var(--muted)] uppercase"
											>
												Tanggal Masuk
											</dt>
											<dd class="mt-0.5 text-sm text-[var(--ink)]">
												{formatDate(row.receivedDate)}
											</dd>
										</div>
										<div>
											<dt
												class="text-[0.67rem] font-semibold tracking-[0.08em] text-[var(--muted)] uppercase"
											>
												Kegiatan
											</dt>
											<dd class="mt-0.5 text-sm leading-relaxed text-[var(--ink)]">
												{row.activity}
											</dd>
										</div>
										<div>
											<dt
												class="text-[0.67rem] font-semibold tracking-[0.08em] text-[var(--muted)] uppercase"
											>
												Posisi
											</dt>
											<dd class="mt-0.5 text-sm text-[var(--ink)]">{row.position}</dd>
										</div>
										<div>
											<dt
												class="text-[0.67rem] font-semibold tracking-[0.08em] text-[var(--muted)] uppercase"
											>
												Status Progress
											</dt>
											<dd class="mt-1">
												<span
													class={`inline-flex rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold ${statusToneClass[row.progressStatus]}`}
													>{row.progressStatus}</span
												>
											</dd>
										</div>
										<div>
											<dt
												class="text-[0.67rem] font-semibold tracking-[0.08em] text-[var(--muted)] uppercase"
											>
												Tanggal Update Progress
											</dt>
											<dd class="mt-0.5 text-sm text-[var(--ink)]">
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
	</div>
</section>
