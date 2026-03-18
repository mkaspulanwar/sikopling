<script lang="ts">
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import SubmissionCard from '$lib/components/submissions/SubmissionCard.svelte';
	import {
		PUBLIC_SUBMISSIONS_CATALOG,
		SHEET_LAST_SYNC,
		SHEET_SOURCE_LABEL
	} from '$lib/data/submissions-catalog';
	import {
		PUBLIC_STATUS_DEFINITIONS,
		type PublicStatusKey,
		type PublicSubmission
	} from '$lib/data/public-model';

	type StatusFilter = 'semua' | PublicStatusKey;

	let searchQuery = $state('');
	let selectedStatus = $state<StatusFilter>('semua');
	let selectedRegion = $state('semua');
	let selectedActivityCategory = $state('semua');

	const regionOptions = $derived(
		Array.from(new Set(PUBLIC_SUBMISSIONS_CATALOG.map((item) => item.region))).sort()
	);
	const activityCategoryOptions = $derived(
		Array.from(new Set(PUBLIC_SUBMISSIONS_CATALOG.map((item) => item.activityCategory))).sort()
	);

	function normalizeText(text: string): string {
		return text.toLowerCase().trim().replace(/\s+/g, ' ');
	}

	const filteredSubmissions = $derived(
		PUBLIC_SUBMISSIONS_CATALOG.filter((item) => {
			const normalizedQuery = normalizeText(searchQuery);
			const searchableContent = normalizeText(
				[
					item.registerId,
					item.companyName,
					item.activityType,
					item.documentType,
					item.region,
					item.internalStatus
				].join(' ')
			);

			const matchSearch = normalizedQuery === '' || searchableContent.includes(normalizedQuery);
			const matchStatus = selectedStatus === 'semua' || item.status === selectedStatus;
			const matchRegion = selectedRegion === 'semua' || item.region === selectedRegion;
			const matchCategory =
				selectedActivityCategory === 'semua' || item.activityCategory === selectedActivityCategory;

			return matchSearch && matchStatus && matchRegion && matchCategory;
		})
	);

	const totalDataCount = PUBLIC_SUBMISSIONS_CATALOG.length;
	const visibleDataCount = $derived(filteredSubmissions.length);

	const statusSummary = $derived(
		PUBLIC_STATUS_DEFINITIONS.map((definition) => ({
			...definition,
			count: PUBLIC_SUBMISSIONS_CATALOG.filter((item) => item.status === definition.key).length
		}))
	);

	function resetFilters(): void {
		searchQuery = '';
		selectedStatus = 'semua';
		selectedRegion = 'semua';
		selectedActivityCategory = 'semua';
	}

	const sourceSubmission = PUBLIC_SUBMISSIONS_CATALOG[0] as PublicSubmission;
</script>

<svelte:head>
	<title>SIKOPLING | Daftar Pengajuan Perusahaan</title>
	<meta
		name="description"
		content="Daftar pengajuan persetujuan lingkungan dengan pencarian dan filter status, wilayah, dan jenis usaha."
	/>
</svelte:head>

<main class="page-shell py-10 md:py-12">
	<section>
		<SectionHeading
			eyebrow="Daftar Pengajuan"
			title="Pantau Status Pengajuan Perusahaan"
			description="Cari nama perusahaan, nomor registrasi, dan gunakan filter untuk melihat progres persetujuan lingkungan secara cepat."
		/>
		<div
			class="mt-4 grid gap-3 text-sm text-[color:var(--muted)] md:grid-cols-[auto_auto_1fr] md:items-center"
		>
			<p>
				Sumber data: <span class="font-semibold text-[color:var(--ink)]">{SHEET_SOURCE_LABEL}</span>
			</p>
			<p>
				Sinkron terakhir: <span class="font-semibold text-[color:var(--ink)]"
					>{SHEET_LAST_SYNC}</span
				>
			</p>
			<p class="md:text-right">
				Contoh data terbaru:
				<span class="font-semibold text-[color:var(--ink)]">{sourceSubmission.companyName}</span>
			</p>
		</div>
	</section>

	<section class="surface-panel depth-lift mt-7 p-5 md:p-6">
		<div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
			<label class="space-y-2 text-sm font-semibold text-[color:var(--ink)]">
				Pencarian
				<input
					type="search"
					bind:value={searchQuery}
					placeholder="Nama perusahaan, registrasi, kegiatan..."
					class="focus-ring h-11 w-full rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-soft)] px-4 text-sm font-normal text-[color:var(--ink)] placeholder:text-slate-400"
				/>
			</label>

			<label class="space-y-2 text-sm font-semibold text-[color:var(--ink)]">
				Status
				<select
					bind:value={selectedStatus}
					class="focus-ring h-11 w-full rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-soft)] px-3 text-sm font-normal text-[color:var(--ink)]"
				>
					<option value="semua">Semua status</option>
					{#each PUBLIC_STATUS_DEFINITIONS as status (status.key)}
						<option value={status.key}>{status.label}</option>
					{/each}
				</select>
			</label>

			<label class="space-y-2 text-sm font-semibold text-[color:var(--ink)]">
				Wilayah
				<select
					bind:value={selectedRegion}
					class="focus-ring h-11 w-full rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-soft)] px-3 text-sm font-normal text-[color:var(--ink)]"
				>
					<option value="semua">Semua wilayah</option>
					{#each regionOptions as region (region)}
						<option value={region}>{region}</option>
					{/each}
				</select>
			</label>

			<label class="space-y-2 text-sm font-semibold text-[color:var(--ink)]">
				Jenis usaha
				<select
					bind:value={selectedActivityCategory}
					class="focus-ring h-11 w-full rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-soft)] px-3 text-sm font-normal text-[color:var(--ink)]"
				>
					<option value="semua">Semua jenis usaha</option>
					{#each activityCategoryOptions as category (category)}
						<option value={category}>{category}</option>
					{/each}
				</select>
			</label>
		</div>

		<div
			class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--line)] pt-4"
		>
			<p class="text-sm text-[color:var(--muted)]">
				Menampilkan <span class="font-semibold text-[color:var(--ink)]">{visibleDataCount}</span>
				dari
				<span class="font-semibold text-[color:var(--ink)]">{totalDataCount}</span> pengajuan.
			</p>
			<button
				type="button"
				onclick={resetFilters}
				class="eased rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-2 text-sm font-semibold text-[color:var(--ink)] hover:bg-[color:var(--bg-soft)] active:scale-[0.98]"
			>
				Reset filter
			</button>
		</div>
	</section>

	<section class="mt-6">
		<div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
			{#each statusSummary as item (item.key)}
				<div class="surface-panel depth-lift p-4">
					<div class="mb-2">
						<StatusBadge status={item.key} />
					</div>
					<p class="text-2xl font-semibold tracking-tight text-[color:var(--ink)]">{item.count}</p>
					<p class="mt-1 text-xs leading-relaxed text-[color:var(--muted)]">{item.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="mt-7">
		{#if filteredSubmissions.length === 0}
			<div class="surface-panel depth-lift p-6">
				<h2 class="text-xl font-semibold tracking-tight text-[color:var(--ink)]">
					Data tidak ditemukan
				</h2>
				<p class="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
					Tidak ada pengajuan yang sesuai dengan kombinasi pencarian dan filter saat ini.
				</p>
			</div>
		{:else}
			<div class="space-y-4">
				{#each filteredSubmissions as submission (submission.registerId)}
					<SubmissionCard {submission} />
				{/each}
			</div>
		{/if}
	</section>
</main>
