<script lang="ts">
	import ChevronDown from "lucide-svelte/icons/chevron-down";
	import ChevronLeft from "lucide-svelte/icons/chevron-left";
	import ChevronRight from "lucide-svelte/icons/chevron-right";
	import Download from "lucide-svelte/icons/download";
	import ListFilterPlus from "lucide-svelte/icons/list-filter-plus";
	import Search from "lucide-svelte/icons/search";
	import X from "lucide-svelte/icons/x";

	type PublishingRow = {
		agency: string;
		activity: string;
		skNumber: string;
		date: string;
	};
	type SortOption = "Terbaru" | "Terlama" | "Instansi A-Z" | "Instansi Z-A";
	type FilterChipKey = "search" | "sort";

	const { data }: { data: { publishingRows: PublishingRow[] } } = $props();
	const publishingRows = $derived(data.publishingRows);

	const formatIsoDate = (date: Date) => date.toISOString().slice(0, 10);
	const dateFormatter = new Intl.DateTimeFormat("id-ID", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
	const numberFormatter = new Intl.NumberFormat("id-ID");
	const agencyCollator = new Intl.Collator("id-ID", { sensitivity: "base" });

	let searchQuery = $state("");
	let sortOption = $state<SortOption>("Terbaru");
	let isFilterPanelOpen = $state(false);
	let filterToggleButton = $state<HTMLButtonElement | null>(null);
	let filterPanelElement = $state<HTMLDivElement | null>(null);
	let isSortDropdownOpen = $state(false);
	let isRowsDropdownOpen = $state(false);
	let sortDropdownElement = $state<HTMLDivElement | null>(null);
	let rowsDropdownElement = $state<HTMLDivElement | null>(null);
	let expandedRows = $state<string[]>([]);
	const rowsPerPageOptions = [5, 10, 20] as const;
	type RowsPerPage = (typeof rowsPerPageOptions)[number];
	let rowsPerPage = $state<RowsPerPage>(10);
	let currentPage = $state(1);
	const sortOptions: SortOption[] = ["Terbaru", "Terlama", "Instansi A-Z", "Instansi Z-A"];

	const toTimestamp = (value: string) => new Date(`${value}T00:00:00`).getTime();
	const formatDate = (value: string) => dateFormatter.format(new Date(`${value}T00:00:00`));
	const formatNumber = (value: number) => numberFormatter.format(value);
	const normalize = (value: string) => value.trim().toLowerCase();
	const escapeCsvValue = (value: string) => `"${value.replaceAll('"', '""')}"`;

	const filteredRows = $derived.by(() => {
		const query = normalize(searchQuery);
		if (!query) return publishingRows;

		return publishingRows.filter((row) =>
			[row.agency, row.activity, row.skNumber, row.date, formatDate(row.date)].some((value) =>
				normalize(value).includes(query),
			),
		);
	});
	const publishingRowsSearchIndexText = $derived.by(() =>
		publishingRows
			.map((row) => [row.agency, row.activity, row.skNumber, row.date, formatDate(row.date)].join(" "))
			.join(" "),
	);
	const sortedRows = $derived.by(() =>
		[...filteredRows].sort((left, right) => {
			switch (sortOption) {
				case "Terlama":
					return toTimestamp(left.date) - toTimestamp(right.date);
				case "Instansi A-Z":
					return agencyCollator.compare(left.agency, right.agency);
				case "Instansi Z-A":
					return agencyCollator.compare(right.agency, left.agency);
				case "Terbaru":
				default:
					return toTimestamp(right.date) - toTimestamp(left.date);
			}
		}),
	);
	const totalFilteredRows = $derived(sortedRows.length);
	const totalPages = $derived(Math.max(1, Math.ceil(totalFilteredRows / rowsPerPage)));
	const pageStartIndex = $derived((currentPage - 1) * rowsPerPage);
	const pageEndIndex = $derived(pageStartIndex + rowsPerPage);
	const paginatedRows = $derived(sortedRows.slice(pageStartIndex, pageEndIndex));
	const visibleRangeStart = $derived(totalFilteredRows === 0 ? 0 : pageStartIndex + 1);
	const visibleRangeEnd = $derived(Math.min(pageEndIndex, totalFilteredRows));
	const activeAdvancedFilterCount = $derived(sortOption !== "Terbaru" ? 1 : 0);
	const activeFilterChips = $derived.by(() => {
		const chips: Array<{ key: FilterChipKey; label: string; value: string }> = [];
		if (searchQuery.trim()) {
			chips.push({ key: "search", label: "Pencarian", value: searchQuery.trim() });
		}
		if (sortOption !== "Terbaru") {
			chips.push({ key: "sort", label: "Urutkan", value: sortOption });
		}
		return chips;
	});

	const getRowExpansionKey = (row: PublishingRow, rowIndex: number) =>
		JSON.stringify([rowIndex, row.agency, row.activity, row.skNumber, row.date]);
	const isRowExpanded = (rowKey: string) => expandedRows.includes(rowKey);
	const resetExpandedAndFirstPage = () => {
		expandedRows = [];
		currentPage = 1;
	};
	const closeAllDropdownMenus = () => {
		isSortDropdownOpen = false;
		isRowsDropdownOpen = false;
	};
	const toggleSortDropdown = () => {
		isSortDropdownOpen = !isSortDropdownOpen;
	};
	const toggleRowsDropdown = () => {
		isRowsDropdownOpen = !isRowsDropdownOpen;
	};
	const selectSortOption = (value: SortOption) => {
		sortOption = value;
		resetExpandedAndFirstPage();
		isSortDropdownOpen = false;
	};
	const selectRowsPerPage = (value: RowsPerPage) => {
		rowsPerPage = value;
		resetExpandedAndFirstPage();
		isRowsDropdownOpen = false;
	};
	const toggleRowExpanded = (rowKey: string) => {
		expandedRows = isRowExpanded(rowKey)
			? expandedRows.filter((item) => item !== rowKey)
			: [...expandedRows, rowKey];
	};
	const toggleFilterPanel = () => {
		isFilterPanelOpen = !isFilterPanelOpen;
		if (!isFilterPanelOpen) closeAllDropdownMenus();
	};
	const closeFilterPanel = () => {
		isFilterPanelOpen = false;
		closeAllDropdownMenus();
	};
	const clearFilterChip = (key: FilterChipKey) => {
		if (key === "search") searchQuery = "";
		if (key === "sort") sortOption = "Terbaru";
		resetExpandedAndFirstPage();
	};
	const handleWindowClick = (event: MouseEvent) => {
		const target = event.target as Node | null;
		if (!target) return;
		if (isSortDropdownOpen && !sortDropdownElement?.contains(target)) {
			isSortDropdownOpen = false;
		}
		if (isRowsDropdownOpen && !rowsDropdownElement?.contains(target)) {
			isRowsDropdownOpen = false;
		}
		if (!isFilterPanelOpen) return;
		if (filterPanelElement?.contains(target)) return;
		if (filterToggleButton?.contains(target)) return;
		closeFilterPanel();
	};
	const handleWindowKeydown = (event: KeyboardEvent) => {
		if (event.key !== "Escape") return;
		closeFilterPanel();
		closeAllDropdownMenus();
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

		const header = ["Instansi", "Kegiatan", "No SK", "Tanggal"];
		const lines = sortedRows.map((row) =>
			[row.agency, row.activity, row.skNumber, formatDate(row.date)].map(escapeCsvValue).join(","),
		);
		const csvContent = [`\uFEFF${header.map(escapeCsvValue).join(",")}`, ...lines].join("\r\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const objectUrl = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = objectUrl;
		anchor.download = `penerbitan-integrasi-${formatIsoDate(new Date())}.csv`;
		document.body.append(anchor);
		anchor.click();
		anchor.remove();
		URL.revokeObjectURL(objectUrl);
	};

	const resetAdvancedFilters = () => {
		sortOption = "Terbaru";
		closeAllDropdownMenus();
		resetExpandedAndFirstPage();
	};
</script>

<svelte:head>
	<meta
		name="description"
		content="Halaman pengumuman penerbitan integrasi berisi daftar instansi, kegiatan, nomor SK, dan tanggal penerbitan."
	/>
</svelte:head>

<svelte:window onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

<section class="relative overflow-hidden bg-(--canvas) pt-28 pb-16 sm:pt-32 sm:pb-20">
	<div class="nav-shell nav-shell-desktop-spacious relative">
		<div hidden data-universal-search-index="integration-publishing-rows">{publishingRowsSearchIndexText}</div>
		<header class="mb-5 sm:mb-6">
			<div class="max-w-3xl">
				<h1 class="text-[clamp(1.75rem,7.2vw,2.65rem)] leading-[1.12] font-semibold tracking-[-0.015em] text-(--ink)">
					Penerbitan Integrasi
				</h1>
			</div>
		</header>

		<div class="mt-0 space-y-4">
			<div class="space-y-2.5 border-b border-[#e6ebf2] pb-3.5">
				<div class="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
					<label for="search-penerbitan-integrasi" class="flex h-11 w-full items-center gap-3 rounded-lg border border-[#cfd7e3] bg-[#ffffff] px-3.5 md:max-w-120 md:px-4">
						<Search class="h-4.5 w-4.5 text-(--muted)" strokeWidth={2} aria-hidden="true" />
						<input
							id="search-penerbitan-integrasi"
							type="text"
							bind:value={searchQuery}
							oninput={resetExpandedAndFirstPage}
							placeholder="Cari instansi atau nomor SK"
							class="h-full w-full border-0 bg-transparent px-0 text-sm text-(--ink) placeholder:text-(--muted) focus:ring-0 focus:outline-none"
						/>
					</label>

					<div class="grid grid-cols-2 gap-2 sm:flex sm:items-center md:shrink-0">
						<button
							type="button"
							bind:this={filterToggleButton}
							onclick={toggleFilterPanel}
							aria-expanded={isFilterPanelOpen}
							aria-controls="penerbitan-integrasi-filter-panel"
							class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#cfd7e3] bg-[#ffffff] px-3 text-sm font-semibold text-[#20232A] transition-colors hover:bg-[#f4f8f0] focus:ring-2 focus:ring-[#e8f2de] focus:outline-none sm:w-auto sm:px-4"
						>
							<ListFilterPlus class="h-4 w-4" strokeWidth={2.1} />
							<span>Filter</span>
							{#if activeAdvancedFilterCount > 0}
								<span class="inline-flex min-w-5 items-center justify-center rounded-full bg-[#64AD31] px-1.5 py-0.5 text-[0.66rem] leading-none text-white">
									{activeAdvancedFilterCount}
								</span>
							{/if}
							<ChevronDown class={`h-4 w-4 text-(--muted) transition-transform ${isFilterPanelOpen ? "rotate-180" : ""}`} strokeWidth={2.1} />
						</button>

						<button
							type="button"
							onclick={exportFilteredRows}
							disabled={totalFilteredRows === 0}
							class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#cfd7e3] bg-[#ffffff] px-3 text-sm font-semibold text-[#20232A] transition-colors hover:bg-[#f4f8f0] focus:ring-2 focus:ring-[#e8f2de] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-4"
						>
							<Download class="h-4 w-4" strokeWidth={2.2} />
							Download
						</button>
					</div>
				</div>
			</div>

			{#if isFilterPanelOpen}
				<div id="penerbitan-integrasi-filter-panel" bind:this={filterPanelElement} class="rounded-lg border border-[#d7dee8] bg-[#ffffff] p-3 sm:p-4">
					<div class="grid gap-3 md:grid-cols-3">
						<div>
							<label for="sort-option" class="mb-1 block text-xs font-semibold text-(--muted)">Urutkan</label>
							<div class="relative" bind:this={sortDropdownElement}>
								<button
									id="sort-option"
									type="button"
									onclick={toggleSortDropdown}
									aria-haspopup="listbox"
									aria-expanded={isSortDropdownOpen}
									class="flex h-11 w-full items-center justify-between rounded-lg border border-[#cfd7e3] bg-[#ffffff] pr-3 pl-3 text-left text-sm font-medium text-(--ink) shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition-colors hover:border-[#bac6d8] focus:border-[#aeb8c7] focus:ring-2 focus:ring-[#e9edf3] focus:outline-none"
								>
									<span class="truncate">{sortOption}</span>
									<ChevronDown class={`h-4 w-4 shrink-0 text-(--muted) transition-transform ${isSortDropdownOpen ? "rotate-180" : ""}`} strokeWidth={2.2} />
								</button>
								{#if isSortDropdownOpen}
									<ul role="listbox" aria-labelledby="sort-option" class="absolute z-30 mt-1.5 max-h-56 w-full overflow-auto rounded-lg border border-[#d1d9e5] bg-white p-1 shadow-[0_16px_30px_-20px_rgba(15,23,42,0.45)]">
										{#each sortOptions as option}
											<li>
												<button
													type="button"
													role="option"
													aria-selected={sortOption === option}
													onclick={() => selectSortOption(option)}
													class={`flex w-full items-center rounded-md px-2.5 py-2 text-left text-sm transition-colors ${sortOption === option ? "bg-[#eef6e8] font-semibold text-[#1f4d1f]" : "text-[#20232A] hover:bg-[#f6f7f8]"}`}
												>
													{option}
												</button>
											</li>
										{/each}
									</ul>
								{/if}
							</div>
						</div>
					</div>

					<div class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#edf1f6] pt-3">
						<p class="text-xs text-(--muted)">
							Urutan aktif:
							<span class="font-semibold text-(--ink)">{sortOption}</span>
						</p>

						{#if activeAdvancedFilterCount > 0}
							<button
								type="button"
								class="inline-flex h-9 items-center justify-center rounded-md border border-[#d3dbe7] bg-[#ffffff] px-3 text-xs font-semibold text-(--muted) transition-colors hover:bg-[#f3f5f8] hover:text-(--ink)"
								onclick={resetAdvancedFilters}
							>
								Reset Filter
							</button>
						{/if}
					</div>
				</div>
			{/if}

			{#if activeFilterChips.length > 0}
				<div class="flex flex-wrap items-center gap-2">
					{#each activeFilterChips as chip}
						<span class="inline-flex items-center gap-1 rounded-md border border-[#d7dee8] bg-[#f8fafd] px-2 py-1 text-[0.72rem] text-[#334155]">
							<span class="font-medium text-[#64748b]">{chip.label}:</span>
							<span class="font-semibold text-[#0f172a]">{chip.value}</span>
							<button type="button" class="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full text-[#64748b] transition-colors hover:bg-[#e8edf5] hover:text-[#0f172a]" onclick={() => clearFilterChip(chip.key)} aria-label={`Hapus filter ${chip.label}`}>
								<X class="h-3 w-3" strokeWidth={2.3} />
							</button>
						</span>
					{/each}
				</div>
			{/if}

			<div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
				<div class="space-y-1">
					<p class="text-xs text-(--muted) md:hidden">
						Menampilkan
						<span class="font-semibold text-(--ink)">{formatNumber(visibleRangeStart)}-{formatNumber(visibleRangeEnd)}</span>
						dari
						<span class="font-semibold text-(--ink)">{formatNumber(totalFilteredRows)}</span>
						hasil
					</p>
					<p class="text-[0.72rem] text-(--muted) md:hidden">
						Total pengumuman:
						<span class="font-semibold text-(--ink)">{formatNumber(publishingRows.length)}</span>
					</p>
					<div class="hidden flex-wrap items-center gap-x-5 gap-y-1 text-xs text-(--muted) sm:text-sm md:flex">
						<p>
							Rentang
							<span class="font-semibold text-(--ink)">{formatNumber(visibleRangeStart)}-{formatNumber(visibleRangeEnd)}</span>
						</p>
						<p>
							Hasil Filter
							<span class="font-semibold text-(--ink)">{formatNumber(totalFilteredRows)}</span>
						</p>
						<p>
							Total Pengumuman
							<span class="font-semibold text-(--ink)">{formatNumber(publishingRows.length)}</span>
						</p>
					</div>
				</div>

				<div class="flex flex-wrap items-center gap-2 md:justify-end">
					<div class="inline-flex items-center gap-2 text-xs text-(--muted) sm:text-sm">
						<label for="rows-per-page" class="font-medium">Tampilkan:</label>
						<div class="relative" bind:this={rowsDropdownElement}>
							<button
								id="rows-per-page"
								type="button"
								onclick={toggleRowsDropdown}
								aria-haspopup="listbox"
								aria-expanded={isRowsDropdownOpen}
								class="flex h-8 w-[3.6rem] items-center justify-between rounded-lg border border-[#cfd7e3] bg-[#ffffff] pr-2 pl-2.5 text-xs font-semibold text-[#20232A] shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition-colors hover:border-[#bac6d8] focus:border-[#aeb8c7] focus:ring-2 focus:ring-[#e9edf3] focus:outline-none sm:h-9 sm:w-[3.9rem] sm:pr-2.5"
							>
								<span>{rowsPerPage}</span>
								<ChevronDown class={`h-3 w-3 text-(--muted) transition-transform sm:h-3.5 sm:w-3.5 ${isRowsDropdownOpen ? "rotate-180" : ""}`} strokeWidth={2.2} />
							</button>
							{#if isRowsDropdownOpen}
								<ul role="listbox" aria-labelledby="rows-per-page" class="absolute right-0 z-30 mt-1.5 w-[3.6rem] overflow-hidden rounded-lg border border-[#d1d9e5] bg-white p-1 shadow-[0_16px_30px_-20px_rgba(15,23,42,0.45)] sm:w-[3.9rem]">
									{#each rowsPerPageOptions as option}
										<li>
											<button
												type="button"
												role="option"
												aria-selected={rowsPerPage === option}
												onclick={() => selectRowsPerPage(option)}
												class={`flex w-full items-center justify-center rounded-md px-2 py-1.5 text-xs transition-colors ${rowsPerPage === option ? "bg-[#eef6e8] font-semibold text-[#1f4d1f]" : "text-[#20232A] hover:bg-[#f6f7f8]"}`}
											>
												{option}
											</button>
										</li>
									{/each}
								</ul>
							{/if}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-6 hidden md:block">
			<div class="overflow-x-auto rounded-xl border-y border-[#d7dee8] bg-transparent">
				<table class="w-full min-w-[920px] table-fixed border-collapse">
					<colgroup>
						<col style="width: 3.5rem;" />
						<col style="width: calc((100% - 3.5rem - 10rem) / 3);" />
						<col style="width: calc((100% - 3.5rem - 10rem) / 3);" />
						<col style="width: calc((100% - 3.5rem - 10rem) / 3);" />
						<col style="width: 10rem;" />
					</colgroup>
					<thead class="bg-[#64AD31]">
						<tr>
							<th class="w-14 border-b border-[#64AD31] px-3 py-4 text-center text-sm font-semibold tracking-[0.01em] text-white">No</th>
							<th class="border-b border-[#64AD31] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Instansi</th>
							<th class="border-b border-[#64AD31] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Kegiatan</th>
							<th class="border-b border-[#64AD31] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">No SK</th>
							<th class="border-b border-[#64AD31] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white">Tanggal</th>
						</tr>
					</thead>

					<tbody>
						{#if totalFilteredRows === 0}
							<tr>
								<td colspan="5" class="px-6 py-12 text-center">
									<p class="text-base font-semibold text-(--ink)">Data tidak ditemukan</p>
									<p class="mt-1 text-sm text-(--muted)">Coba ubah kata kunci pencarian atau hubungi kami</p>
								</td>
							</tr>
						{:else}
							{#each paginatedRows as row, index}
								<tr class="border-t border-[#e9edf3] align-top">
									<td class="w-14 px-3 py-4 text-center text-sm text-[#20232A]">{pageStartIndex + index + 1}</td>
									<td class="px-6 py-4 text-sm break-words text-[#20232A]">{row.agency}</td>
									<td class="px-6 py-4 text-sm leading-relaxed break-words text-[#20232A]">{row.activity}</td>
									<td class="px-6 py-4 text-sm break-words text-[#20232A]">{row.skNumber}</td>
									<td class="px-6 py-4 text-sm break-words text-[#20232A]">{formatDate(row.date)}</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>

		<div class="mt-6 overflow-hidden rounded-xl border-y border-[#d7dee8] bg-transparent md:hidden">
			<div class="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 border-b border-[#64AD31] bg-[#64AD31] px-3 py-4 text-[0.78rem] font-semibold tracking-[0.01em] text-white">
				<span class="text-center">No</span>
				<span class="text-sm">Detail Penerbitan</span>
			</div>

			{#if totalFilteredRows === 0}
				<div class="px-6 py-12 text-center">
					<p class="text-base font-semibold text-(--ink)">Data tidak ditemukan</p>
					<p class="mt-1 text-sm text-(--muted)">Coba ubah kata kunci pencarian atau hubungi kami</p>
				</div>
			{:else}
				<ul>
					{#each paginatedRows as row, index}
						{@const rowExpansionKey = getRowExpansionKey(row, pageStartIndex + index)}
						<li class="border-t border-[var(--line)] first:border-t-0">
							<button
								type="button"
								class="grid w-full grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-3 px-3 py-3.5 text-left"
								onclick={() => toggleRowExpanded(rowExpansionKey)}
								aria-expanded={isRowExpanded(rowExpansionKey)}
							>
								<p class="pt-0.5 text-center text-sm font-semibold text-[#20232A]">{pageStartIndex + index + 1}</p>

								<div class="min-w-0">
									<div class="flex items-start justify-between gap-2">
										<div class="min-w-0">
											<p class="pr-1 text-sm leading-snug font-semibold whitespace-normal break-words text-[#20232A]">{row.agency}</p>
											<p class="mt-1 text-[0.75rem] leading-tight break-all text-(--muted)">No SK: {row.skNumber}</p>
											<p class="mt-2 text-[0.75rem] leading-tight text-(--muted)">Tanggal: {formatDate(row.date)}</p>
										</div>
										<span class={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-transparent text-(--muted) transition-transform ${isRowExpanded(rowExpansionKey) ? "rotate-180" : ""}`} aria-hidden="true">
											<ChevronDown class="h-3 w-3" strokeWidth={2.2} />
										</span>
									</div>
								</div>
							</button>

							{#if isRowExpanded(rowExpansionKey)}
								<div class="border-t border-[var(--line)] bg-transparent px-4 py-4">
									<dl class="space-y-4">
										<div>
											<dt class="text-[0.76rem] font-semibold tracking-[0.01em] text-[#20232A]">Kegiatan</dt>
											<dd class="mt-1 text-sm leading-relaxed text-[#20232A]">{row.activity}</dd>
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
			<div class="mt-6 pt-2">
				<nav aria-label="Navigasi halaman penerbitan integrasi" class="mx-auto flex flex-wrap items-center justify-center gap-1.5">
					<button type="button" onclick={goToFirstPage} disabled={currentPage === 1} class="inline-flex h-9 items-center justify-center rounded-md px-2.5 text-xs font-semibold text-[#475467] transition-colors hover:bg-[#f4f8f0] hover:text-[#20232A] disabled:cursor-not-allowed disabled:opacity-40">
						Awal
					</button>

					<button type="button" onclick={goToPreviousPage} disabled={currentPage === 1} aria-label="Halaman sebelumnya" class="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#475467] transition-colors hover:bg-[#f4f8f0] hover:text-[#20232A] disabled:cursor-not-allowed disabled:opacity-40">
						<ChevronLeft class="h-4 w-4" strokeWidth={2.3} />
					</button>

					<div class="inline-flex h-9 min-w-[4.5rem] items-center justify-center px-1.5 text-xs font-semibold text-[#20232A] tabular-nums">
						{currentPage} / {totalPages}
					</div>

					<button type="button" onclick={goToNextPage} disabled={currentPage === totalPages} aria-label="Halaman berikutnya" class="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#475467] transition-colors hover:bg-[#f4f8f0] hover:text-[#20232A] disabled:cursor-not-allowed disabled:opacity-40">
						<ChevronRight class="h-4 w-4" strokeWidth={2.3} />
					</button>

					<button type="button" onclick={goToLastPage} disabled={currentPage === totalPages} class="inline-flex h-9 items-center justify-center rounded-md px-2.5 text-xs font-semibold text-[#475467] transition-colors hover:bg-[#f4f8f0] hover:text-[#20232A] disabled:cursor-not-allowed disabled:opacity-40">
						Akhir
					</button>
				</nav>
			</div>
		{/if}
	</div>
</section>
