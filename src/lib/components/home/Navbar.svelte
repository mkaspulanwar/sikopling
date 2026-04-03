<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/state';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import LogIn from 'lucide-svelte/icons/log-in';
	import Menu from 'lucide-svelte/icons/menu';
	import Search from 'lucide-svelte/icons/search';
	import X from 'lucide-svelte/icons/x';

	type LayananItem = {
		title: string;
		href?: string;
	};
	type SearchCategory = 'Halaman' | 'Bagian' | 'Layanan';
	type SearchRoute = {
		path: string;
		title: string;
		category: SearchCategory;
		priority: number;
	};
	type SearchDocument = {
		id: string;
		title: string;
		description: string;
		href: string;
		category: SearchCategory;
		priority: number;
		normalizedTitle: string;
		normalizedDescription: string;
		normalizedKeywords: string;
		normalizedContent: string;
	};

	const layananSectionIds = ['layanan-dashboard', 'layanan-dokumen'];

	const layananItems: LayananItem[] = [
		{
			title: 'Antrian Dokumen Lingkungan',
			href: '/layanan/dokling'
		},
		{
			title: 'Antrian Persetujuan Teknis',
			href: '/layanan/pertek'
		}
	];

	const showNavMenus = true;
	const searchableRoutes: SearchRoute[] = [
		{ path: '/', title: 'Beranda', category: 'Halaman', priority: 96 },
		{
			path: '/layanan/dokling',
			title: 'Antrian Dokumen Lingkungan',
			category: 'Layanan',
			priority: 99
		},
		{
			path: '/layanan/pertek',
			title: 'Antrian Persetujuan Teknis',
			category: 'Layanan',
			priority: 97
		},
		{ path: '/tentang', title: 'Tentang', category: 'Halaman', priority: 66 },
		{ path: '/kontak', title: 'Kontak', category: 'Halaman', priority: 64 },
		{ path: '/login', title: 'Login', category: 'Halaman', priority: 60 }
	];
	const fallbackSearchDocuments: SearchDocument[] = [
		buildSearchDocument({
			title: 'Antrian Dokumen Lingkungan',
			description: 'Layanan pemantauan progres pengajuan dokumen lingkungan.',
			href: '/layanan/dokling',
			category: 'Layanan',
			content:
				'Dokumen lingkungan, status antrian, pemrakarsa, progres layanan, persetujuan lingkungan.',
			keywords: ['dokumen', 'lingkungan', 'antrian', 'amdal', 'ukl-upl', 'delh', 'dplh'],
			priority: 99
		}),
		buildSearchDocument({
			title: 'Antrian Persetujuan Teknis',
			description: 'Layanan pencarian antrian persetujuan teknis lingkungan.',
			href: '/layanan/pertek',
			category: 'Layanan',
			content: 'Persetujuan teknis, air limbah, progres evaluasi dokumen dan penjadwalan rapat.',
			keywords: ['pertek', 'persetujuan teknis', 'air', 'limbah', 'lingkungan'],
			priority: 97
		}),
		buildSearchDocument({
			title: 'Capaian SI-KOPLING Secara Ringkas',
			description: 'Ringkasan statistik layanan konsultasi dan persetujuan lingkungan.',
			href: '/#layanan-dashboard',
			category: 'Bagian',
			content: 'Total konsultasi, dokumen disetujui, waktu pemrosesan, indeks kepuasan masyarakat.',
			keywords: ['statistik', 'layanan', 'lingkungan', 'konsultasi'],
			priority: 92
		}),
		buildSearchDocument({
			title: 'Jenis Dokumen yang Dapat Diproses',
			description: 'Daftar AMDAL, UKL-UPL, DELH, DPLH, Addendum, dan persetujuan teknis.',
			href: '/#layanan-dokumen',
			category: 'Bagian',
			content: 'Layanan dokumen lingkungan SI-KOPLING untuk berbagai jenis kegiatan.',
			keywords: ['dokumen', 'lingkungan', 'amdal', 'ukl-upl', 'delh', 'dplh', 'addendum'],
			priority: 91
		})
	];

	let isLayananOpen = $state(false);
	let isMobileOpen = $state(false);
	let isMobileLayananOpen = $state(false);
	let isSearchOpen = $state(false);
	let searchQuery = $state('');
	let searchInput = $state<HTMLInputElement | null>(null);
	let isSearchIndexing = $state(false);
	let hasHydratedSearchIndex = $state(false);
	let universalSearchDocuments = $state<SearchDocument[]>(fallbackSearchDocuments);
	let isScrolled = $state(typeof window !== 'undefined' ? window.scrollY > 18 : false);
	let currentHash = $state('');
	let layananDropdown = $state<HTMLDivElement | null>(null);
	let layananCloseTimer: ReturnType<typeof setTimeout> | null = null;

	function cleanText(value: string) {
		return value.replace(/\s+/g, ' ').trim();
	}
	function normalizeSearchText(value: string) {
		return cleanText(value)
			.toLocaleLowerCase('id-ID')
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '');
	}
	function makeSnippet(value: string, maxLength = 165) {
		const text = cleanText(value);
		if (text.length <= maxLength) return text;
		return `${text.slice(0, maxLength).trimEnd()}...`;
	}
	function createSearchId(value: string) {
		return normalizeSearchText(value)
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 92);
	}
	function resolveSearchHref(path: string, sectionId = '') {
		const normalizedSectionId = sectionId.replace(/^#/, '').trim();
		if (!normalizedSectionId) return path;
		return path === '/' ? `/#${normalizedSectionId}` : `${path}#${normalizedSectionId}`;
	}
	function buildSearchDocument(params: {
		title: string;
		description: string;
		href: string;
		category: SearchCategory;
		content?: string;
		keywords?: string[];
		priority?: number;
		id?: string;
	}): SearchDocument {
		return {
			id: params.id ?? createSearchId(`${params.href}-${params.title}`),
			title: params.title,
			description: params.description,
			href: params.href,
			category: params.category,
			priority: params.priority ?? 70,
			normalizedTitle: normalizeSearchText(params.title),
			normalizedDescription: normalizeSearchText(params.description),
			normalizedKeywords: normalizeSearchText((params.keywords ?? []).join(' ')),
			normalizedContent: normalizeSearchText(params.content ?? '')
		};
	}
	const dedupeSearchDocuments = (documents: SearchDocument[]) => {
		const documentMap = new Map<string, SearchDocument>();
		for (const document of documents) {
			const key = `${document.href}::${document.title}`;
			const previous = documentMap.get(key);
			if (!previous || document.priority > previous.priority) {
				documentMap.set(key, document);
			}
		}
		return [...documentMap.values()];
	};
	const searchCategoryBadgeClass = (category: SearchCategory) => {
		switch (category) {
			case 'Layanan':
				return 'border-[#b3db8d] bg-[#eff8e3] text-[#3f6e16]';
			case 'Bagian':
				return 'border-[#c8d0dd] bg-[#f3f6fb] text-[#3b4d65]';
			case 'Halaman':
			default:
				return 'border-[#cad2da] bg-[#f4f6f9] text-[#465364]';
		}
	};
	const extractSearchDocumentsFromHtml = (route: SearchRoute, html: string) => {
		const parser = new DOMParser();
		const parsedDocument = parser.parseFromString(html, 'text/html');
		const mainContent = parsedDocument.querySelector('main') ?? parsedDocument.body;
		const parsedPageTitle = cleanText(
			parsedDocument.querySelector('title')?.textContent?.replace(/\|\s*SIKOPLING\s*$/i, '') ?? ''
		);
		const pageDescription = cleanText(
			parsedDocument.querySelector('meta[name="description"]')?.getAttribute('content') ?? ''
		);
		const pageTextContent = cleanText(mainContent.textContent ?? '');
		const documents: SearchDocument[] = [];

		if (pageTextContent.length > 35) {
			documents.push(
				buildSearchDocument({
					title: parsedPageTitle || route.title,
					description: pageDescription || makeSnippet(pageTextContent, 150),
					href: route.path,
					category: route.category,
					content: pageTextContent,
					keywords: [route.title, route.category, 'SI-KOPLING', 'layanan lingkungan'],
					priority: route.priority
				})
			);
		}

		const sectionElements = Array.from(
			mainContent.querySelectorAll<HTMLElement>('section, article')
		);
		for (const [sectionIndex, sectionElement] of sectionElements.entries()) {
			const sectionTitle = cleanText(sectionElement.querySelector('h1,h2,h3')?.textContent ?? '');
			const sectionText = cleanText(sectionElement.textContent ?? '');
			if (!sectionTitle && sectionText.length < 65) continue;

			const sectionDescription = cleanText(sectionElement.querySelector('p')?.textContent ?? '');
			const sectionId = sectionElement.id;
			documents.push(
				buildSearchDocument({
					title: sectionTitle || `${route.title} ${sectionIndex + 1}`,
					description: makeSnippet(sectionDescription || sectionText),
					href: resolveSearchHref(route.path, sectionId),
					category: 'Bagian',
					content: sectionText,
					keywords: [route.title, route.category, sectionId.replace(/-/g, ' '), 'lingkungan'],
					priority: Math.max(route.priority - Math.min(sectionIndex * 4, 24), 38)
				})
			);
		}

		return dedupeSearchDocuments(documents);
	};
	const computeSearchScore = (document: SearchDocument, normalizedQuery: string) => {
		if (!normalizedQuery) return 0;
		let score = 0;
		const queryTokens = normalizedQuery.split(' ').filter((token) => token.length > 1);

		if (document.normalizedTitle.startsWith(normalizedQuery)) score += 140;
		else if (document.normalizedTitle.includes(normalizedQuery)) score += 108;
		if (document.normalizedKeywords.includes(normalizedQuery)) score += 78;
		if (document.normalizedDescription.includes(normalizedQuery)) score += 42;
		if (document.normalizedContent.includes(normalizedQuery)) score += 30;

		for (const queryToken of queryTokens) {
			if (document.normalizedTitle.includes(queryToken)) score += 22;
			if (document.normalizedKeywords.includes(queryToken)) score += 17;
			if (document.normalizedDescription.includes(queryToken)) score += 10;
			if (document.normalizedContent.includes(queryToken)) score += 6;
		}

		if (score === 0) return 0;
		return score + document.priority;
	};
	const hydrateUniversalSearchIndex = async () => {
		if (isSearchIndexing || hasHydratedSearchIndex || typeof window === 'undefined') return;
		isSearchIndexing = true;

		try {
			const dynamicDocuments: SearchDocument[] = [];
			for (const route of searchableRoutes) {
				const response = await fetch(route.path);
				if (!response.ok) continue;
				const html = await response.text();
				dynamicDocuments.push(...extractSearchDocumentsFromHtml(route, html));
			}

			if (dynamicDocuments.length > 0) {
				universalSearchDocuments = dedupeSearchDocuments([
					...fallbackSearchDocuments,
					...dynamicDocuments
				]);
				hasHydratedSearchIndex = true;
			}
		} catch (error) {
			console.error('Gagal memperbarui indeks pencarian universal.', error);
		} finally {
			isSearchIndexing = false;
		}
	};
	const openSearchModal = async () => {
		isSearchOpen = true;
		isMobileOpen = false;
		isMobileLayananOpen = false;
		isLayananOpen = false;
		if (!hasHydratedSearchIndex && !isSearchIndexing) {
			void hydrateUniversalSearchIndex();
		}
		await tick();
		searchInput?.focus();
		searchInput?.select();
	};
	const closeSearchModal = () => {
		isSearchOpen = false;
		searchQuery = '';
	};
	const handleSearchResultClick = () => {
		closeSearchModal();
	};
	const normalizedSearchQuery = $derived(normalizeSearchText(searchQuery));
	const suggestedSearchResults = $derived.by(() =>
		[...universalSearchDocuments].sort((left, right) => right.priority - left.priority).slice(0, 8)
	);
	const searchResults = $derived.by(() => {
		const query = normalizedSearchQuery;
		if (!query) return suggestedSearchResults;

		return universalSearchDocuments
			.map((document) => ({
				document,
				score: computeSearchScore(document, query)
			}))
			.filter((result) => result.score > 0)
			.sort(
				(left, right) =>
					right.score - left.score ||
					right.document.priority - left.document.priority ||
					left.document.title.localeCompare(right.document.title, 'id-ID')
			)
			.slice(0, 14)
			.map((result) => result.document);
	});

	const clearLayananCloseTimer = () => {
		if (!layananCloseTimer) return;
		clearTimeout(layananCloseTimer);
		layananCloseTimer = null;
	};

	const openLayananMenu = () => {
		clearLayananCloseTimer();
		isLayananOpen = true;
	};

	const closeLayananMenu = () => {
		clearLayananCloseTimer();
		isLayananOpen = false;
	};

	const scheduleCloseLayananMenu = () => {
		clearLayananCloseTimer();
		layananCloseTimer = setTimeout(() => {
			isLayananOpen = false;
			layananCloseTimer = null;
		}, 140);
	};

	const closeMenus = () => {
		closeLayananMenu();
		isMobileOpen = false;
		isMobileLayananOpen = false;
	};

	const toggleMobileMenu = () => {
		if (isSearchOpen) {
			closeSearchModal();
		}
		isMobileOpen = !isMobileOpen;
		isLayananOpen = false;
		if (!isMobileOpen) {
			isMobileLayananOpen = false;
		}
	};

	const handleWindowClick = (event: MouseEvent) => {
		const target = event.target as Node | null;
		if (layananDropdown && target && !layananDropdown.contains(target)) {
			closeLayananMenu();
		}
	};

	const handleWindowKeydown = (event: KeyboardEvent) => {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			if (isSearchOpen) {
				closeSearchModal();
			} else {
				void openSearchModal();
			}
			return;
		}

		if (event.key === 'Escape') {
			if (isSearchOpen) {
				closeSearchModal();
				return;
			}
			closeMenus();
		}
	};

	const updateScrollState = () => {
		if (typeof window === 'undefined') return;
		isScrolled = window.scrollY > 18;
	};

	const updateHashState = () => {
		if (typeof window === 'undefined') return;
		currentHash = window.location.hash.replace(/^#/, '');
	};

	onMount(() => {
		updateScrollState();
		updateHashState();
		void hydrateUniversalSearchIndex();
		const frameId = requestAnimationFrame(updateScrollState);
		return () => {
			cancelAnimationFrame(frameId);
			clearLayananCloseTimer();
		};
	});

	const isLandingPage = () => page.url.pathname === '/';
	const isLayananRoute = () => page.url.pathname.startsWith('/layanan');
	const isPathActive = (path: string) => page.url.pathname === path;
	const isLayananActive = () =>
		isLayananRoute() || (isLandingPage() && layananSectionIds.includes(currentHash));
	const useLightNav = () => isLandingPage() && !isScrolled;
	const navHref = (sectionId: string) =>
		sectionId === 'beranda' ? '/' : isLandingPage() ? `#${sectionId}` : `/#${sectionId}`;
	const scrollToBeranda = () => {
		if (typeof window === 'undefined') return;
		const berandaSection = document.getElementById('beranda');
		if (berandaSection) {
			berandaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
			return;
		}
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
	const handleBerandaClick = (event: MouseEvent) => {
		closeMenus();
		if (!isLandingPage()) return;
		event.preventDefault();
		scrollToBeranda();
		if (window.location.hash) {
			history.replaceState(
				history.state,
				'',
				`${window.location.pathname}${window.location.search}`
			);
		}
		currentHash = '';
	};
	const mapSectionHref = (href: string) => {
		if (href.startsWith('/')) return href;
		return isLandingPage() ? href : `/${href}`;
	};

	const handleLayananItemClick = () => {
		isLayananOpen = false;
		if (isMobileOpen) {
			closeMenus();
		}
	};

	$effect(() => {
		if (typeof document === 'undefined') return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = isMobileOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	});

	const navClass = () =>
		`fixed inset-x-0 top-0 z-40 [font-family:var(--font-body)] transition-[background-color,box-shadow,color] duration-300 ${
			useLightNav()
				? 'bg-transparent text-white shadow-none'
				: 'bg-[var(--surface)] text-[var(--ink)] shadow-none'
		}`;

	const desktopLinkClass = (isActive = false) => {
		const baseClass =
			'relative inline-flex items-center py-2.5 lg:py-2 text-base lg:text-[1rem] font-medium tracking-[0.002em] menu-item-static nav-menu-font transition-colors duration-200';
		if (useLightNav()) {
			return `${baseClass} ${isActive ? 'text-[#77D37F]' : 'text-white hover:text-[#77D37F]'}`;
		}
		return `${baseClass} ${isActive ? 'text-[#77D37F]' : 'text-black hover:text-[#77D37F]'}`;
	};

	const mobileNavBaseClass =
		'border-b border-transparent px-4 py-3.5 !text-[1.1875rem] !font-medium [font-weight:500] nav-menu-font leading-[1.2] tracking-[0.002em]';

	const mobileLinkClass = (isActive = false) =>
		`block menu-item-static ${mobileNavBaseClass} ${isActive ? 'text-[#77D37F]' : 'text-black'}`;

	const mobileLayananClass = (isActive = false) =>
		`flex w-full items-center justify-between menu-item-static ${mobileNavBaseClass} appearance-none border-0 bg-transparent text-left ${
			isActive ? 'text-[#77D37F]' : 'text-black'
		}`;

	const logoClass = () =>
		`h-[1.85rem] w-auto object-contain transition-[filter] duration-300 lg:h-[2.2rem] ${
			useLightNav() ? 'brightness-0 invert' : 'brightness-100 saturate-100'
		}`;

	const actionButtonClass = () =>
		`inline-flex h-9 w-9 lg:h-10 lg:w-10 items-center justify-center rounded-lg border transition-colors ${
			useLightNav()
				? 'border-white/25 bg-white/10 text-white'
				: 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]'
		}`;

	const loginButtonClass = () =>
		`hidden h-11 lg:h-10 items-center justify-center gap-2 rounded-lg border px-5 lg:px-4 text-base lg:text-[1rem] font-medium transition-colors lg:inline-flex ${
			useLightNav()
				? 'border-white/30 bg-white/10 text-white'
				: 'border-[#64AD31] bg-[#64AD31] text-white'
		}`;
</script>

<svelte:window
	onclick={handleWindowClick}
	onkeydown={handleWindowKeydown}
	onhashchange={updateHashState}
	onpopstate={updateHashState}
	onscroll={updateScrollState}
/>

<nav class={navClass()}>
	<div class="nav-shell py-3 lg:py-3.5">
		<div
			class="flex items-center justify-between gap-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-10"
		>
			<a href="/" class="flex min-w-0 items-center" onclick={handleBerandaClick}>
				<img
					src="/layout/logo_sikopling.svg"
					alt="Logo SIKOPLING DLH Prov Kalsel"
					class={logoClass()}
				/>
			</a>

			{#if showNavMenus}
				<ul class="hidden items-center gap-9 lg:flex lg:justify-self-center">
					<li>
						<a
							href={navHref('beranda')}
							class={desktopLinkClass(false)}
							onclick={handleBerandaClick}
						>
							Beranda
						</a>
					</li>

					<li>
						<div
							class="relative"
							role="presentation"
							bind:this={layananDropdown}
							onmouseenter={openLayananMenu}
							onmouseleave={scheduleCloseLayananMenu}
							onfocusin={openLayananMenu}
						>
							<button
								type="button"
								class={`${desktopLinkClass(isLayananActive())} appearance-none items-center gap-1.5 border-0 bg-transparent px-0 [line-height:1.2] !font-medium`}
								aria-expanded={isLayananOpen}
								aria-haspopup="true"
								onclick={() => (isLayananOpen ? closeLayananMenu() : openLayananMenu())}
							>
								<span>Layanan</span>
								<ChevronDown
									class={`h-4 w-4 transition-transform duration-200 ${isLayananOpen ? 'rotate-180' : ''}`}
									strokeWidth={2.2}
									aria-hidden="true"
								/>
							</button>

							{#if isLayananOpen}
								<div
									class="absolute top-[calc(100%+0.875rem)] left-1/2 w-[min(88vw,18.5rem)] -translate-x-1/2 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] p-2 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.32)]"
								>
									<div class="space-y-1">
										{#each layananItems as item}
											{#if item.href}
												<a
													href={mapSectionHref(item.href)}
													class="menu-item-static nav-menu-font block w-full rounded-lg px-3.5 py-2.5 text-left text-[0.9375rem] [font-weight:350] text-[var(--ink)] transition-colors duration-150 hover:bg-[#f8fbf4] hover:text-[#3EB14A]"
													onclick={handleLayananItemClick}
												>
													{item.title}
												</a>
											{:else}
												<button
													type="button"
													class="menu-item-static nav-menu-font block w-full appearance-none rounded-lg px-3.5 py-2.5 text-left text-[0.9375rem] [font-weight:350] text-[var(--ink)] transition-colors duration-150 hover:bg-[#f8fbf4] hover:text-[#3EB14A]"
												>
													{item.title}
												</button>
											{/if}
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</li>

					<li>
						<a
							href="/tentang"
							class={desktopLinkClass(isPathActive('/tentang'))}
							aria-current={isPathActive('/tentang') ? 'page' : undefined}
						>
							Tentang
						</a>
					</li>
					<li>
						<a
							href="/kontak"
							class={desktopLinkClass(isPathActive('/kontak'))}
							aria-current={isPathActive('/kontak') ? 'page' : undefined}
						>
							Kontak
						</a>
					</li>
				</ul>
			{/if}

			<div class="flex items-center gap-2 lg:justify-self-end">
				<button
					type="button"
					class={actionButtonClass()}
					aria-label="Buka universal search"
					aria-haspopup="dialog"
					aria-expanded={isSearchOpen}
					onclick={() => void openSearchModal()}
				>
					<Search class="h-4 w-4 lg:h-4.5 lg:w-4.5" strokeWidth={2} aria-hidden="true" />
				</button>

				<a href="/login" class={`${loginButtonClass()} nav-menu-font`}>
					<LogIn
						class="h-4 w-4 lg:h-[1.05rem] lg:w-[1.05rem]"
						strokeWidth={2.15}
						aria-hidden="true"
					/>
					<span>Login</span>
				</a>

				{#if showNavMenus}
					<button
						type="button"
						class={`${actionButtonClass()} lg:hidden`}
						aria-expanded={isMobileOpen}
						aria-label="Buka menu"
						onclick={toggleMobileMenu}
					>
						{#if isMobileOpen}
							<X class="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
						{:else}
							<Menu class="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
						{/if}
					</button>
				{/if}
			</div>
		</div>
	</div>
</nav>

{#if isSearchOpen}
	<button
		type="button"
		class="fixed inset-0 z-[82] bg-slate-950/34 backdrop-blur-sm backdrop-saturate-150 [-webkit-backdrop-filter:blur(8px)]"
		aria-label="Tutup universal search"
		onclick={closeSearchModal}
		transition:fade={{ duration: 140 }}
	></button>

	<div
		role="dialog"
		aria-modal="true"
		aria-labelledby="universal-search-heading"
		class="fixed inset-x-4 top-[4.55rem] z-[86] mx-auto w-auto max-w-3xl sm:inset-x-6 sm:top-[5.15rem] sm:w-full"
		transition:fly={{ y: -10, duration: 170 }}
	>
		<div
			class="flex max-h-[min(62svh,28rem)] flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[0_36px_80px_-34px_rgba(15,23,42,0.62)] sm:max-h-[min(66vh,31rem)] sm:p-4"
		>
			<div class="flex items-stretch gap-2 sm:gap-2.5">
				<div
					class="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-2.5 transition-colors focus-within:border-[#8ebf63] sm:px-3.5"
				>
					<span class="inline-flex text-[var(--muted)]">
						<Search class="h-4 w-4 sm:h-4.5 sm:w-4.5" strokeWidth={2.2} aria-hidden="true" />
					</span>
					<input
						bind:this={searchInput}
						bind:value={searchQuery}
						type="search"
						inputmode="search"
						autocomplete="off"
						placeholder="Cari halaman, layanan, atau dokumen"
						class="h-full w-full border-0 bg-transparent text-base text-[var(--ink)] placeholder:text-[var(--muted)] shadow-none outline-none ring-0 focus:border-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 sm:text-[0.98rem]"
						aria-label="Cari konten website"
					/>
				</div>
				<button
					type="button"
					class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
					aria-label="Tutup pencarian"
					onclick={closeSearchModal}
				>
					<X class="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
				</button>
			</div>

			<div class="mt-3 flex items-start justify-between gap-3 border-t border-[var(--line)] pt-3">
				<div class="min-w-0">
					<p id="universal-search-heading" class="text-[0.95rem] font-semibold text-[var(--ink)]">
						Pencarian Terpadu
					</p>
					{#if normalizedSearchQuery}
						<p class="mt-0.5 truncate text-xs text-[var(--muted)]">
							Hasil untuk "{searchQuery.trim()}"
						</p>
					{/if}
				</div>

				<div class="flex items-center gap-2">
					{#if isSearchIndexing}
						<span
							class="text-[0.71rem] font-medium tracking-[0.08em] text-[var(--muted)] uppercase"
						>
							Memuat indeks
						</span>
					{/if}
					<kbd
						class="hidden h-7 items-center rounded-md border border-[var(--line)] bg-[#f7f9fc] px-2 text-[0.7rem] font-medium tracking-[0.06em] text-[var(--muted)] uppercase sm:inline-flex"
					>
						Ctrl K
					</kbd>
				</div>
			</div>

			<div
				class="mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-xl border border-[var(--line)] bg-[var(--surface)]"
			>
				{#if searchResults.length > 0}
					<ul class="divide-y divide-[var(--line)]">
						{#each searchResults as result}
							<li>
								<a
									href={result.href}
									class="group flex items-start justify-between gap-2.5 px-3 py-3.5 transition-colors hover:bg-[#f8fbf4] sm:gap-3 sm:px-4"
									onclick={handleSearchResultClick}
								>
									<div class="min-w-0">
										<p
											class="truncate text-[0.97rem] font-medium text-[var(--ink)] group-hover:text-[#3EB14A]"
										>
											{result.title}
										</p>
										<p class="mt-1 line-clamp-2 text-[0.86rem] leading-relaxed text-[var(--muted)]">
											{result.description}
										</p>
									</div>
									<div class="flex shrink-0 items-center gap-1.5 sm:gap-2">
										<span
											class={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.6rem] font-semibold tracking-[0.07em] uppercase sm:text-[0.64rem] ${searchCategoryBadgeClass(result.category)}`}
										>
											{result.category}
										</span>
										<ChevronRight
											class="h-4 w-4 text-[var(--muted)] transition-colors group-hover:text-[#3EB14A]"
											strokeWidth={2}
											aria-hidden="true"
										/>
									</div>
								</a>
							</li>
						{/each}
					</ul>
				{:else}
					<div class="px-4 py-8 text-center">
						<p class="text-[0.95rem] font-medium text-[var(--ink)]">
							Tidak ada hasil untuk "{searchQuery.trim()}"
						</p>
						<p class="mt-1.5 text-[0.85rem] text-[var(--muted)]">
							Coba kata kunci seperti "lingkungan", "dokumen", atau "pertek".
						</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

{#if showNavMenus && isMobileOpen}
	<button
		type="button"
		class="fixed inset-0 z-[70] bg-slate-950/22 backdrop-blur-lg backdrop-saturate-150 [-webkit-backdrop-filter:blur(16px)] lg:hidden"
		aria-label="Tutup menu"
		onclick={closeMenus}
		transition:fade={{ duration: 120 }}
	></button>

	<aside
		class="fixed top-0 right-0 z-[75] flex h-dvh w-[min(76vw,18.75rem)] flex-col rounded-l-[1.4rem] border-l border-[var(--line)] bg-[var(--surface)] px-5 pt-5 pb-4 shadow-[0_28px_72px_-28px_rgba(15,23,42,0.52)] lg:hidden"
		transition:fly={{ x: 24, duration: 170 }}
	>
		<div class="flex items-center justify-between gap-3 border-b border-[var(--line)] pb-4">
			<p class="nav-menu-font text-[1.1875rem] font-medium text-[var(--ink)]">Menu</p>

			<button
				type="button"
				class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
				aria-label="Tutup menu"
				onclick={closeMenus}
			>
				<X class="h-5 w-5" strokeWidth={2.2} aria-hidden="true" />
			</button>
		</div>

		<div class="mt-5 space-y-1.5">
			<a href={navHref('beranda')} class={mobileLinkClass(false)} onclick={handleBerandaClick}>
				Beranda
			</a>

			<button
				type="button"
				class={mobileLayananClass(isMobileLayananOpen || isLayananActive())}
				aria-expanded={isMobileLayananOpen}
				onclick={() => (isMobileLayananOpen = !isMobileLayananOpen)}
			>
				<span class="nav-menu-font text-[1.1875rem] font-medium tracking-[0.002em]">Layanan</span>
				<ChevronDown
					class={`h-4 w-4 transition-transform ${isMobileLayananOpen ? 'rotate-180' : ''}`}
					strokeWidth={2.2}
					aria-hidden="true"
				/>
			</button>

			{#if isMobileLayananOpen}
				<div class="mt-1.5 space-y-1 pl-4" transition:fade={{ duration: 120 }}>
					{#each layananItems as item}
						{#if item.href}
							<a
								href={mapSectionHref(item.href)}
								class={`menu-item-static nav-menu-font block w-full rounded-md px-3 py-2 text-left text-[0.95rem] [font-weight:350] ${
									isPathActive(item.href) ? 'text-[#77D37F]' : 'text-black'
								}`}
								onclick={handleLayananItemClick}
							>
								{item.title}
							</a>
						{:else}
							<button
								type="button"
								class="menu-item-static nav-menu-font block w-full appearance-none rounded-md border-0 bg-transparent px-3 py-2 text-left text-[0.95rem] [font-weight:350] text-black"
							>
								{item.title}
							</button>
						{/if}
					{/each}
				</div>
			{/if}

			<a href="/tentang" class={mobileLinkClass(isPathActive('/tentang'))} onclick={closeMenus}>
				Tentang
			</a>
			<a href="/kontak" class={mobileLinkClass(isPathActive('/kontak'))} onclick={closeMenus}>
				Kontak
			</a>
		</div>

		<a
			href="/login"
			class="nav-menu-font mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#64AD31] bg-[#64AD31] px-4 py-3 text-[1.1875rem] font-medium text-white transition-colors"
			onclick={closeMenus}
		>
			<LogIn class="h-[1.2rem] w-[1.2rem]" strokeWidth={2.15} aria-hidden="true" />
			<span>Login</span>
		</a>
	</aside>
{/if}

<style>
	:global(.nav-menu-font) {
		font-family: 'Roboto', 'Segoe UI', sans-serif;
	}

	:global(.menu-item-static:hover),
	:global(.menu-item-static:focus),
	:global(.menu-item-static:focus-visible),
	:global(.menu-item-static:active) {
		background-color: transparent;
		text-decoration: none;
	}

	:global(.menu-item-static:visited) {
		text-decoration: none;
	}
</style>
