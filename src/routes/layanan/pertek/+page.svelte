<script lang="ts">
	import ChevronDown from "lucide-svelte/icons/chevron-down";
	import ChevronLeft from "lucide-svelte/icons/chevron-left";
	import ChevronRight from "lucide-svelte/icons/chevron-right";
	import Download from "lucide-svelte/icons/download";
	import ListFilterPlus from "lucide-svelte/icons/list-filter-plus";
	import Search from "lucide-svelte/icons/search";
	import X from "lucide-svelte/icons/x";

	type ProgressStatus =
		| "Evaluasi Dokumen"
		| "Perbaikan Uji Administrasi"
		| "Penjadwalan Rapat"
		| "Dikembalikan"
		| "Submit";
	type QueuePosition = string;

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

	type PositionFilter = "Semua Jenis" | "Air";
	type SortOption =
		| "Terbaru"
		| "Terlama"
		| "Update terbaru"
		| "Update terlama"
		| "Instansi A-Z"
		| "Instansi Z-A";
	type FilterChipKey = "search" | "sort" | "status" | "perlingType";

	const { data }: { data: { queueRows: QueueRow[] } } = $props();
	const queueRows = $derived(data.queueRows);
	const formatIsoDate = (date: Date) => date.toISOString().slice(0, 10);

	const dateFormatter = new Intl.DateTimeFormat("id-ID", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
	const numberFormatter = new Intl.NumberFormat("id-ID");

	let searchQuery = $state("");
	let sortOption = $state<SortOption>("Terbaru");
	let statusFilter = $state<"Semua Status" | ProgressStatus>("Semua Status");
	let positionFilter = $state<PositionFilter>("Semua Jenis");
	let isFilterPanelOpen = $state(false);
	let filterToggleButton = $state<HTMLButtonElement | null>(null);
	let filterPanelElement = $state<HTMLDivElement | null>(null);
	let isSortDropdownOpen = $state(false);
	let isStatusDropdownOpen = $state(false);
	let isPositionDropdownOpen = $state(false);
	let isRowsDropdownOpen = $state(false);
	let sortDropdownElement = $state<HTMLDivElement | null>(null);
	let statusDropdownElement = $state<HTMLDivElement | null>(null);
	let positionDropdownElement = $state<HTMLDivElement | null>(null);
	let rowsDropdownElement = $state<HTMLDivElement | null>(null);
	let expandedRows = $state<string[]>([]);
	const rowsPerPageOptions = [5, 10, 20] as const;
	type RowsPerPage = (typeof rowsPerPageOptions)[number];
	let rowsPerPage = $state<RowsPerPage>(10);
	let currentPage = $state(1);
	const sortOptions: SortOption[] = [
		"Terbaru",
		"Terlama",
		"Update terbaru",
		"Update terlama",
		"Instansi A-Z",
		"Instansi Z-A",
	];
	const statusOptions: Array<"Semua Status" | ProgressStatus> = [
		"Semua Status",
		"Evaluasi Dokumen",
		"Perbaikan Uji Administrasi",
		"Penjadwalan Rapat",
		"Dikembalikan",
		"Submit",
	];
	const positionFilterOptions: Array<{
		label: string;
		value: PositionFilter;
	}> = [
		{ label: "Semua Jenis", value: "Semua Jenis" },
		{ label: "Air", value: "Air" },
	];

	const toTimestamp = (value: string) =>
		new Date(`${value}T00:00:00`).getTime();
	const formatDate = (value: string) =>
		dateFormatter.format(new Date(`${value}T00:00:00`));
	const formatNumber = (value: number) => numberFormatter.format(value);
	const normalize = (value: string) => value.trim().toLowerCase();
	const escapeCsvValue = (value: string) =>
		`"${value.replaceAll('"', '""')}"`;
	const statusBadgeClassMap: Record<ProgressStatus, string> = {
		"Evaluasi Dokumen": "border-[#9cb6de] bg-[#edf4ff] text-[#1f4e8c]",
		"Perbaikan Uji Administrasi":
			"border-[#e3b985] bg-[#fff4e5] text-[#8a5a1e]",
		"Penjadwalan Rapat": "border-[#9bcfd5] bg-[#eaf8fa] text-[#1f5f69]",
		Dikembalikan: "border-[#d9a98a] bg-[#fff1e8] text-[#8a4522]",
		Submit: "border-[#bfc8d7] bg-[#f4f6f9] text-[#364152]",
	};
	const getStatusBadgeClass = (status: ProgressStatus) =>
		statusBadgeClassMap[status];
	const resolvePositionCategory = (documentType: string): PositionFilter => {
		const value = normalize(documentType);
		return value.includes("air") ? "Air" : "Semua Jenis";
	};

	const filteredRows = $derived.by(() => {
		const query = normalize(searchQuery);
		return queueRows.filter((row) => {
			const statusMatched =
				statusFilter === "Semua Status" ||
				row.progressStatus === statusFilter;
			const positionMatched =
				positionFilter === "Semua Jenis" ||
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
				formatDate(row.progressUpdatedDate),
			].some((value) => normalize(value).includes(query));
		});
	});
	const queueRowsSearchIndexText = $derived.by(() =>
		queueRows
			.map((row) =>
				[
					row.registrationNo,
					row.agency,
					row.activity,
					row.documentType,
					row.position,
					row.progressStatus,
					row.receivedDate,
					row.progressUpdatedDate,
					formatDate(row.receivedDate),
					formatDate(row.progressUpdatedDate)
				].join(' ')
			)
			.join(' ')
	);

	const agencyCollator = new Intl.Collator("id-ID", { sensitivity: "base" });
	const sortedRows = $derived.by(() =>
		[...filteredRows].sort((left, right) => {
			switch (sortOption) {
				case "Terbaru":
					return (
						toTimestamp(right.receivedDate) -
						toTimestamp(left.receivedDate)
					);
				case "Terlama":
					return (
						toTimestamp(left.receivedDate) -
						toTimestamp(right.receivedDate)
					);
				case "Update terlama":
					return (
						toTimestamp(left.progressUpdatedDate) -
						toTimestamp(right.progressUpdatedDate)
					);
				case "Instansi A-Z":
					return agencyCollator.compare(left.agency, right.agency);
				case "Instansi Z-A":
					return agencyCollator.compare(right.agency, left.agency);
				case "Update terbaru":
				default:
					return (
						toTimestamp(right.progressUpdatedDate) -
						toTimestamp(left.progressUpdatedDate)
					);
			}
		}),
	);
	const totalFilteredRows = $derived(sortedRows.length);
	const totalPages = $derived(
		Math.max(1, Math.ceil(totalFilteredRows / rowsPerPage)),
	);
	const pageStartIndex = $derived((currentPage - 1) * rowsPerPage);
	const pageEndIndex = $derived(pageStartIndex + rowsPerPage);
	const paginatedRows = $derived(
		sortedRows.slice(pageStartIndex, pageEndIndex),
	);
	const visibleRangeStart = $derived(
		totalFilteredRows === 0 ? 0 : pageStartIndex + 1,
	);
	const visibleRangeEnd = $derived(Math.min(pageEndIndex, totalFilteredRows));
	const activeAdvancedFilterCount = $derived(
		(sortOption !== "Terbaru" ? 1 : 0) +
			(statusFilter !== "Semua Status" ? 1 : 0) +
			(positionFilter !== "Semua Jenis" ? 1 : 0),
	);
	const activeFilterChips = $derived.by(() => {
		const chips: Array<{
			key: FilterChipKey;
			label: string;
			value: string;
		}> = [];
		if (searchQuery.trim()) {
			chips.push({
				key: "search",
				label: "Pencarian",
				value: searchQuery.trim(),
			});
		}
		if (sortOption !== "Terbaru") {
			chips.push({ key: "sort", label: "Urutkan", value: sortOption });
		}
		if (statusFilter !== "Semua Status") {
			chips.push({ key: "status", label: "Status", value: statusFilter });
		}
		if (positionFilter !== "Semua Jenis") {
			chips.push({
				key: "perlingType",
				label: "Jenis Perling",
				value: positionFilter,
			});
		}
		return chips;
	});

	const isRowExpanded = (registrationNo: string) =>
		expandedRows.includes(registrationNo);
	const resetExpandedAndFirstPage = () => {
		expandedRows = [];
		currentPage = 1;
	};
	const closeAllDropdownMenus = () => {
		isSortDropdownOpen = false;
		isStatusDropdownOpen = false;
		isPositionDropdownOpen = false;
		isRowsDropdownOpen = false;
	};
	const toggleSortDropdown = () => {
		isSortDropdownOpen = !isSortDropdownOpen;
		isStatusDropdownOpen = false;
		isPositionDropdownOpen = false;
	};
	const toggleStatusDropdown = () => {
		isStatusDropdownOpen = !isStatusDropdownOpen;
		isSortDropdownOpen = false;
		isPositionDropdownOpen = false;
	};
	const togglePositionDropdown = () => {
		isPositionDropdownOpen = !isPositionDropdownOpen;
		isSortDropdownOpen = false;
		isStatusDropdownOpen = false;
	};
	const toggleRowsDropdown = () => {
		isRowsDropdownOpen = !isRowsDropdownOpen;
	};
	const selectSortOption = (value: SortOption) => {
		sortOption = value;
		resetExpandedAndFirstPage();
		isSortDropdownOpen = false;
	};
	const selectStatusFilter = (value: "Semua Status" | ProgressStatus) => {
		statusFilter = value;
		resetExpandedAndFirstPage();
		isStatusDropdownOpen = false;
	};
	const selectPositionFilter = (value: PositionFilter) => {
		positionFilter = value;
		resetExpandedAndFirstPage();
		isPositionDropdownOpen = false;
	};
	const selectRowsPerPage = (value: RowsPerPage) => {
		rowsPerPage = value;
		resetExpandedAndFirstPage();
		isRowsDropdownOpen = false;
	};
	const toggleRowExpanded = (registrationNo: string) => {
		expandedRows = isRowExpanded(registrationNo)
			? expandedRows.filter((item) => item !== registrationNo)
			: [...expandedRows, registrationNo];
	};
	const toggleFilterPanel = () => {
		isFilterPanelOpen = !isFilterPanelOpen;
		if (!isFilterPanelOpen) {
			closeAllDropdownMenus();
		}
	};
	const closeFilterPanel = () => {
		isFilterPanelOpen = false;
		closeAllDropdownMenus();
	};
	const clearFilterChip = (key: FilterChipKey) => {
		switch (key) {
			case "search":
				searchQuery = "";
				break;
			case "sort":
				sortOption = "Terbaru";
				break;
			case "status":
				statusFilter = "Semua Status";
				break;
			case "perlingType":
				positionFilter = "Semua Jenis";
				break;
		}
		resetExpandedAndFirstPage();
	};
	const handleWindowClick = (event: MouseEvent) => {
		const target = event.target as Node | null;
		if (!target) return;
		if (isSortDropdownOpen && !sortDropdownElement?.contains(target)) {
			isSortDropdownOpen = false;
		}
		if (isStatusDropdownOpen && !statusDropdownElement?.contains(target)) {
			isStatusDropdownOpen = false;
		}
		if (
			isPositionDropdownOpen &&
			!positionDropdownElement?.contains(target)
		) {
			isPositionDropdownOpen = false;
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

		const header = [
			"No Registrasi",
			"Tanggal Masuk",
			"Instansi",
			"Kegiatan",
			"Jenis Perling",
			"Posisi",
			"Status",
			"Tanggal Update",
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
				formatDate(row.progressUpdatedDate),
			]
				.map(escapeCsvValue)
				.join(","),
		);

		const csvContent = [
			`\uFEFF${header.map(escapeCsvValue).join(",")}`,
			...lines,
		].join("\r\n");
		const blob = new Blob([csvContent], {
			type: "text/csv;charset=utf-8;",
		});
		const objectUrl = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = objectUrl;
		anchor.download = `antrian-persetujuan-teknis-${formatIsoDate(new Date())}.csv`;
		document.body.append(anchor);
		anchor.click();
		anchor.remove();
		URL.revokeObjectURL(objectUrl);
	};

	const resetFilter = () => {
		searchQuery = "";
		sortOption = "Terbaru";
		statusFilter = "Semua Status";
		positionFilter = "Semua Jenis";
		isFilterPanelOpen = false;
		closeAllDropdownMenus();
		expandedRows = [];
		currentPage = 1;
	};
	const resetAdvancedFilters = () => {
		sortOption = "Terbaru";
		statusFilter = "Semua Status";
		positionFilter = "Semua Jenis";
		closeAllDropdownMenus();
		resetExpandedAndFirstPage();
	};
</script>

<svelte:head>
	<meta
		name="description"
		content="Halaman pelacakan antrian persetujuan teknis untuk memantau status progress pengajuan."
	/>
</svelte:head>

<svelte:window onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

<section
	class="relative overflow-hidden bg-(--canvas) pt-28 pb-16 sm:pt-32 sm:pb-20"
>
	<div class="nav-shell nav-shell-desktop-spacious relative">
		<div hidden data-universal-search-index="queue-rows">{queueRowsSearchIndexText}</div>
		<header class="mb-5 sm:mb-6">
			<div class="max-w-3xl">
				<h1
					class="text-[clamp(1.75rem,7.2vw,2.65rem)] leading-[1.12] font-semibold tracking-[-0.015em] text-(--ink)"
				>
					Antrian Persetujuan Teknis
				</h1>
			</div>
		</header>

		<div class="mt-0 space-y-4">
			<div class="space-y-2.5 border-b border-[#e6ebf2] pb-3.5">
				<div
					class="flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between"
				>
					<label
						for="search-antrian"
						class="flex h-11 w-full items-center gap-3 rounded-lg border border-[#cfd7e3] bg-[#ffffff] px-3.5 md:max-w-[30rem] md:px-4"
					>
						<Search
							class="h-4.5 w-4.5 text-(--muted)"
							strokeWidth={2}
							aria-hidden="true"
						/>
						<input
							id="search-antrian"
							type="text"
							bind:value={searchQuery}
							oninput={resetExpandedAndFirstPage}
							placeholder="Cari instansi atau kegiatan"
							class="h-full w-full border-0 bg-transparent px-0 text-sm text-(--ink) placeholder:text-(--muted) focus:ring-0 focus:outline-none"
						/>
					</label>

					<div
						class="grid grid-cols-2 gap-2 sm:flex sm:items-center md:shrink-0"
					>
						<button
							type="button"
							bind:this={filterToggleButton}
							onclick={toggleFilterPanel}
							aria-expanded={isFilterPanelOpen}
							aria-controls="pertek-filter-panel"
							class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#cfd7e3] bg-[#ffffff] px-3 text-sm font-semibold text-[#20232A] transition-colors hover:bg-[#f4f8f0] focus:ring-2 focus:ring-[#e8f2de] focus:outline-none sm:w-auto sm:px-4"
						>
							<ListFilterPlus class="h-4 w-4" strokeWidth={2.1} />
							<span>Filter</span>
							{#if activeAdvancedFilterCount > 0}
								<span
									class="inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[#64AD31] px-1.5 py-0.5 text-[0.66rem] leading-none text-white"
								>
									{activeAdvancedFilterCount}
								</span>
							{/if}
							<ChevronDown
								class={`h-4 w-4 text-(--muted) transition-transform ${isFilterPanelOpen ? "rotate-180" : ""}`}
								strokeWidth={2.1}
							/>
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
				<div
					id="pertek-filter-panel"
					bind:this={filterPanelElement}
					class="rounded-lg border border-[#d7dee8] bg-[#ffffff] p-3 sm:p-4"
				>
					<div class="grid gap-3 md:grid-cols-3">
						<div>
							<label
								for="sort-option"
								class="mb-1 block text-xs font-semibold text-(--muted)"
							>
								Urutkan
							</label>
							<div
								class="relative"
								bind:this={sortDropdownElement}
							>
								<button
									id="sort-option"
									type="button"
									onclick={toggleSortDropdown}
									aria-haspopup="listbox"
									aria-expanded={isSortDropdownOpen}
									class="flex h-11 w-full items-center justify-between rounded-lg border border-[#cfd7e3] bg-[#ffffff] pr-3 pl-3 text-left text-sm font-medium text-(--ink) shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition-colors hover:border-[#bac6d8] focus:border-[#aeb8c7] focus:ring-2 focus:ring-[#e9edf3] focus:outline-none"
								>
									<span class="truncate">{sortOption}</span>
									<ChevronDown
										class={`h-4 w-4 shrink-0 text-(--muted) transition-transform ${isSortDropdownOpen ? "rotate-180" : ""}`}
										strokeWidth={2.2}
									/>
								</button>
								{#if isSortDropdownOpen}
									<ul
										role="listbox"
										aria-labelledby="sort-option"
										class="absolute z-30 mt-1.5 max-h-56 w-full overflow-auto rounded-lg border border-[#d1d9e5] bg-white p-1 shadow-[0_16px_30px_-20px_rgba(15,23,42,0.45)]"
									>
										{#each sortOptions as option}
											<li>
												<button
													type="button"
													role="option"
													aria-selected={sortOption ===
														option}
													onclick={() =>
														selectSortOption(
															option,
														)}
													class={`flex w-full items-center rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
														sortOption === option
															? "bg-[#eef6e8] font-semibold text-[#1f4d1f]"
															: "text-[#20232A] hover:bg-[#f6f7f8]"
													}`}
												>
													{option}
												</button>
											</li>
										{/each}
									</ul>
								{/if}
							</div>
						</div>

						<div>
							<label
								for="status-filter"
								class="mb-1 block text-xs font-semibold text-(--muted)"
							>
								Status Progress
							</label>
							<div
								class="relative"
								bind:this={statusDropdownElement}
							>
								<button
									id="status-filter"
									type="button"
									onclick={toggleStatusDropdown}
									aria-haspopup="listbox"
									aria-expanded={isStatusDropdownOpen}
									class="flex h-11 w-full items-center justify-between rounded-lg border border-[#cfd7e3] bg-[#ffffff] pr-3 pl-3 text-left text-sm font-medium text-(--ink) shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition-colors hover:border-[#bac6d8] focus:border-[#aeb8c7] focus:ring-2 focus:ring-[#e9edf3] focus:outline-none"
								>
									<span class="truncate">{statusFilter}</span>
									<ChevronDown
										class={`h-4 w-4 shrink-0 text-(--muted) transition-transform ${isStatusDropdownOpen ? "rotate-180" : ""}`}
										strokeWidth={2.2}
									/>
								</button>
								{#if isStatusDropdownOpen}
									<ul
										role="listbox"
										aria-labelledby="status-filter"
										class="absolute z-30 mt-1.5 max-h-56 w-full overflow-auto rounded-lg border border-[#d1d9e5] bg-white p-1 shadow-[0_16px_30px_-20px_rgba(15,23,42,0.45)]"
									>
										{#each statusOptions as option}
											<li>
												<button
													type="button"
													role="option"
													aria-selected={statusFilter ===
														option}
													onclick={() =>
														selectStatusFilter(
															option,
														)}
													class={`flex w-full items-center rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
														statusFilter === option
															? "bg-[#eef6e8] font-semibold text-[#1f4d1f]"
															: "text-[#20232A] hover:bg-[#f6f7f8]"
													}`}
												>
													{option}
												</button>
											</li>
										{/each}
									</ul>
								{/if}
							</div>
						</div>

						<div>
							<label
								for="position-filter"
								class="mb-1 block text-xs font-semibold text-(--muted)"
							>
								Jenis Perling
							</label>
							<div
								class="relative"
								bind:this={positionDropdownElement}
							>
								<button
									id="position-filter"
									type="button"
									onclick={togglePositionDropdown}
									aria-haspopup="listbox"
									aria-expanded={isPositionDropdownOpen}
									class="flex h-11 w-full items-center justify-between rounded-lg border border-[#cfd7e3] bg-[#ffffff] pr-3 pl-3 text-left text-sm font-medium text-(--ink) shadow-[0_1px_1px_rgba(15,23,42,0.03)] transition-colors hover:border-[#bac6d8] focus:border-[#aeb8c7] focus:ring-2 focus:ring-[#e9edf3] focus:outline-none"
								>
									<span class="truncate"
										>{positionFilter}</span
									>
									<ChevronDown
										class={`h-4 w-4 shrink-0 text-(--muted) transition-transform ${isPositionDropdownOpen ? "rotate-180" : ""}`}
										strokeWidth={2.2}
									/>
								</button>
								{#if isPositionDropdownOpen}
									<ul
										role="listbox"
										aria-labelledby="position-filter"
										class="absolute z-30 mt-1.5 max-h-56 w-full overflow-auto rounded-lg border border-[#d1d9e5] bg-white p-1 shadow-[0_16px_30px_-20px_rgba(15,23,42,0.45)]"
									>
										{#each positionFilterOptions as option}
											<li>
												<button
													type="button"
													role="option"
													aria-selected={positionFilter ===
														option.value}
													onclick={() =>
														selectPositionFilter(
															option.value,
														)}
													class={`flex w-full items-center rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
														positionFilter ===
														option.value
															? "bg-[#eef6e8] font-semibold text-[#1f4d1f]"
															: "text-[#20232A] hover:bg-[#f6f7f8]"
													}`}
												>
													{option.label}
												</button>
											</li>
										{/each}
									</ul>
								{/if}
							</div>
						</div>
					</div>

					<div
						class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#edf1f6] pt-3"
					>
						<p class="text-xs text-(--muted)">
							Urutan aktif:
							<span class="font-semibold text-(--ink)"
								>{sortOption}</span
							>
						</p>

						<div class="flex flex-wrap items-center gap-2">
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
				</div>
			{/if}

			{#if activeFilterChips.length > 0}
				<div class="flex flex-wrap items-center gap-2">
					{#each activeFilterChips as chip}
						<span
							class="inline-flex items-center gap-1 rounded-md border border-[#d7dee8] bg-[#f8fafd] px-2 py-1 text-[0.72rem] text-[#334155]"
						>
							<span class="font-medium text-[#64748b]"
								>{chip.label}:</span
							>
							<span class="font-semibold text-[#0f172a]"
								>{chip.value}</span
							>
							<button
								type="button"
								class="inline-flex h-4.5 w-4.5 items-center justify-center rounded-full text-[#64748b] transition-colors hover:bg-[#e8edf5] hover:text-[#0f172a]"
								onclick={() => clearFilterChip(chip.key)}
								aria-label={`Hapus filter ${chip.label}`}
							>
								<X class="h-3 w-3" strokeWidth={2.3} />
							</button>
						</span>
					{/each}
				</div>
			{/if}

			<div
				class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
			>
				<div class="space-y-1">
					<p class="text-xs text-(--muted) md:hidden">
						Menampilkan
						<span class="font-semibold text-(--ink)"
							>{formatNumber(visibleRangeStart)}-{formatNumber(
								visibleRangeEnd,
							)}</span
						>
						dari
						<span class="font-semibold text-(--ink)"
							>{formatNumber(totalFilteredRows)}</span
						>
						hasil
					</p>
					<p class="text-[0.72rem] text-(--muted) md:hidden">
						Total pengajuan:
						<span class="font-semibold text-(--ink)"
							>{formatNumber(queueRows.length)}</span
						>
					</p>
					<div
						class="hidden flex-wrap items-center gap-x-5 gap-y-1 text-xs text-(--muted) sm:text-sm md:flex"
					>
						<p>
							Rentang
							<span class="font-semibold text-(--ink)"
								>{formatNumber(
									visibleRangeStart,
								)}-{formatNumber(visibleRangeEnd)}</span
							>
						</p>
						<p>
							Hasil Filter
							<span class="font-semibold text-(--ink)"
								>{formatNumber(totalFilteredRows)}</span
							>
						</p>
						<p>
							Total Pengajuan
							<span class="font-semibold text-(--ink)"
								>{formatNumber(queueRows.length)}</span
							>
						</p>
					</div>
				</div>

				<div class="flex flex-wrap items-center gap-2 md:justify-end">
					<div
						class="inline-flex items-center gap-2 text-xs text-(--muted) sm:text-sm"
					>
						<label for="rows-per-page" class="font-medium"
							>Tampilkan:</label
						>
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
								<ChevronDown
									class={`h-3 w-3 text-(--muted) transition-transform sm:h-3.5 sm:w-3.5 ${isRowsDropdownOpen ? "rotate-180" : ""}`}
									strokeWidth={2.2}
								/>
							</button>
							{#if isRowsDropdownOpen}
								<ul
									role="listbox"
									aria-labelledby="rows-per-page"
									class="absolute right-0 z-30 mt-1.5 w-[3.6rem] overflow-hidden rounded-lg border border-[#d1d9e5] bg-white p-1 shadow-[0_16px_30px_-20px_rgba(15,23,42,0.45)] sm:w-[3.9rem]"
								>
									{#each rowsPerPageOptions as option}
										<li>
											<button
												type="button"
												role="option"
												aria-selected={rowsPerPage ===
													option}
												onclick={() =>
													selectRowsPerPage(option)}
												class={`flex w-full items-center justify-center rounded-md px-2 py-1.5 text-xs transition-colors ${
													rowsPerPage === option
														? "bg-[#eef6e8] font-semibold text-[#1f4d1f]"
														: "text-[#20232A] hover:bg-[#f6f7f8]"
												}`}
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
			<div
				class="overflow-x-auto rounded-xl border-y border-[#d7dee8] bg-transparent"
			>
				<table class="w-full min-w-[1180px] border-collapse">
					<thead class="bg-[#64AD31]">
						<tr>
							<th
								class="w-14 border-b border-[#64AD31] px-3 py-4 text-center text-sm font-semibold tracking-[0.01em] text-white"
							>
								No
							</th>
							<th
								class="border-b border-[#64AD31] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								No Registrasi
							</th>
							<th
								class="border-b border-[#64AD31] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								Tanggal Masuk
							</th>
							<th
								class="border-b border-[#64AD31] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								Instansi
							</th>
							<th
								class="border-b border-[#64AD31] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								Kegiatan
							</th>
							<th
								class="border-b border-[#64AD31] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								Jenis Perling
							</th>
							<th
								class="w-28 border-b border-[#64AD31] px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								Posisi
							</th>
							<th
								class="w-32 border-b border-[#64AD31] px-4 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								Status
							</th>
							<th
								class="border-b border-[#64AD31] px-6 py-4 text-left text-sm font-semibold tracking-[0.01em] text-white"
							>
								Tanggal Update
							</th>
						</tr>
					</thead>

					<tbody>
						{#if totalFilteredRows === 0}
							<tr>
								<td colspan="9" class="px-6 py-12 text-center">
									<p
										class="text-base font-semibold text-(--ink)"
									>
										Data tidak ditemukan
									</p>
									<p class="mt-1 text-sm text-(--muted)">
										Coba ubah kata kunci pencarian atau
										reset filter.
									</p>
								</td>
							</tr>
						{:else}
							{#each paginatedRows as row, index}
								<tr class="border-t border-[#e9edf3] align-top">
									<td
										class="w-14 px-3 py-4 text-center text-sm text-[#20232A]"
									>
										{pageStartIndex + index + 1}
									</td>
									<td class="px-6 py-4 text-sm text-[#20232A]"
										>{row.registrationNo}</td
									>
									<td class="px-6 py-4 text-sm text-[#20232A]"
										>{formatDate(row.receivedDate)}</td
									>
									<td class="px-6 py-4 text-sm text-[#20232A]"
										>{row.agency}</td
									>
									<td
										class="px-6 py-4 text-sm leading-relaxed text-[#20232A]"
										>{row.activity}</td
									>
									<td class="px-6 py-4 text-sm text-[#20232A]"
										>{row.documentType}</td
									>
									<td
										class="w-28 px-4 py-4 text-sm text-[#20232A]"
										>{row.position}</td
									>
									<td
										class="w-32 px-4 py-4 text-sm leading-snug text-[#20232A]"
									>
										<span
											class={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.72rem] leading-tight font-medium ${getStatusBadgeClass(row.progressStatus)}`}
										>
											{row.progressStatus}
										</span>
									</td>
									<td
										class="px-6 py-4 text-sm text-[#20232A]"
									>
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
			class="mt-6 overflow-hidden rounded-xl border-y border-[#d7dee8] bg-transparent md:hidden"
		>
			<div
				class="grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 border-b border-[#64AD31] bg-[#64AD31] px-3 py-4 text-[0.78rem] font-semibold tracking-[0.01em] text-white"
			>
				<span class="text-center">No</span>
				<span class="text-sm">Detail Dokumen</span>
			</div>

			{#if totalFilteredRows === 0}
				<div class="px-6 py-12 text-center">
					<p class="text-base font-semibold text-(--ink)">
						Data tidak ditemukan
					</p>
					<p class="mt-1 text-sm text-(--muted)">
						Coba ubah kata kunci pencarian atau reset filter.
					</p>
				</div>
			{:else}
				<ul>
					{#each paginatedRows as row, index}
						<li
							class="border-t border-(--line) first:border-t-0"
						>
							<button
								type="button"
								class="grid w-full grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-3 px-3 py-3.5 text-left"
								onclick={() =>
									toggleRowExpanded(row.registrationNo)}
								aria-expanded={isRowExpanded(
									row.registrationNo,
								)}
							>
								<p
									class="pt-0.5 text-center text-sm font-semibold text-[#20232A]"
								>
									{pageStartIndex + index + 1}
								</p>

								<div class="min-w-0">
									<div
										class="flex items-start justify-between gap-2"
									>
										<div class="min-w-0">
											<p
												class="truncate pr-1 text-sm leading-snug font-semibold text-[#20232A]"
											>
												{row.agency}
											</p>
											<p
												class="mt-1 text-[0.75rem] leading-tight break-all text-(--muted)"
											>
												{row.registrationNo}
											</p>
											<div
												class="mt-2 flex flex-wrap items-center gap-1.5"
											>
												<span
													class="text-[0.75rem] leading-tight text-(--muted)"
												>
													{row.documentType}
												</span>
												<span
													class={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.75rem] leading-tight ${getStatusBadgeClass(row.progressStatus)}`}
												>
													{row.progressStatus}
												</span>
											</div>
										</div>
										<span
											class={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-(--line) bg-transparent text-(--muted) transition-transform ${isRowExpanded(row.registrationNo) ? "rotate-180" : ""}`}
											aria-hidden="true"
										>
											<ChevronDown
												class="h-3 w-3"
												strokeWidth={2.2}
											/>
										</span>
									</div>
								</div>
							</button>

							{#if isRowExpanded(row.registrationNo)}
								<div
									class="border-t border-(--line) bg-transparent px-4 py-4"
								>
									<dl class="space-y-4">
										<div>
											<dt
												class="text-[0.76rem] font-semibold tracking-[0.01em] text-[#20232A]"
											>
												Tanggal Masuk
											</dt>
											<dd
												class="mt-1 text-sm text-[#20232A]"
											>
												{formatDate(row.receivedDate)}
											</dd>
										</div>
										<div>
											<dt
												class="text-[0.76rem] font-semibold tracking-[0.01em] text-[#20232A]"
											>
												Kegiatan
											</dt>
											<dd
												class="mt-1 text-sm leading-relaxed text-[#20232A]"
											>
												{row.activity}
											</dd>
										</div>
										<div>
											<dt
												class="text-[0.76rem] font-semibold tracking-[0.01em] text-[#20232A]"
											>
												Posisi
											</dt>
											<dd
												class="mt-1 text-sm text-[#20232A]"
											>
												{row.position}
											</dd>
										</div>
										<div>
											<dt
												class="text-[0.76rem] font-semibold tracking-[0.01em] text-[#20232A]"
											>
												Tanggal Update
											</dt>
											<dd
												class="mt-1 text-sm text-[#20232A]"
											>
												{formatDate(
													row.progressUpdatedDate,
												)}
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
			<div class="mt-6 pt-2">
				<nav
					aria-label="Navigasi halaman antrian persetujuan teknis"
					class="mx-auto flex flex-wrap items-center justify-center gap-1.5"
				>
					<button
						type="button"
						onclick={goToFirstPage}
						disabled={currentPage === 1}
						class="inline-flex h-9 items-center justify-center rounded-md px-2.5 text-xs font-semibold text-[#475467] transition-colors hover:bg-[#f4f8f0] hover:text-[#20232A] disabled:cursor-not-allowed disabled:opacity-40"
					>
						Awal
					</button>

					<button
						type="button"
						onclick={goToPreviousPage}
						disabled={currentPage === 1}
						aria-label="Halaman sebelumnya"
						class="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#475467] transition-colors hover:bg-[#f4f8f0] hover:text-[#20232A] disabled:cursor-not-allowed disabled:opacity-40"
					>
						<ChevronLeft class="h-4 w-4" strokeWidth={2.3} />
					</button>

					<div
						class="inline-flex h-9 min-w-[4.5rem] items-center justify-center px-1.5 text-xs font-semibold text-[#20232A] tabular-nums"
					>
						{currentPage} / {totalPages}
					</div>

					<button
						type="button"
						onclick={goToNextPage}
						disabled={currentPage === totalPages}
						aria-label="Halaman berikutnya"
						class="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#475467] transition-colors hover:bg-[#f4f8f0] hover:text-[#20232A] disabled:cursor-not-allowed disabled:opacity-40"
					>
						<ChevronRight class="h-4 w-4" strokeWidth={2.3} />
					</button>

					<button
						type="button"
						onclick={goToLastPage}
						disabled={currentPage === totalPages}
						class="inline-flex h-9 items-center justify-center rounded-md px-2.5 text-xs font-semibold text-[#475467] transition-colors hover:bg-[#f4f8f0] hover:text-[#20232A] disabled:cursor-not-allowed disabled:opacity-40"
					>
						Akhir
					</button>
				</nav>
			</div>
		{/if}
	</div>
</section>
