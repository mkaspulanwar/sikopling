<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/state';

	type LayananItem = {
		title: string;
		description: string;
		href?: string;
	};

	type SearchSuggestion = {
		label: string;
		href?: string;
	};

	const layananSectionIds = ['layanan-dashboard', 'layanan-dokumen'];

	const layananItems: LayananItem[] = [
		{
			title: 'Ajukan Permohonan',
			description: 'Mulai pengajuan dokumen layanan persetujuan lingkungan secara terarah.'
		},
		{
			title: 'Antrian Dokumen',
			description: 'Pantau urutan pemeriksaan dan progres dokumen layanan secara berkala.',
			href: '/layanan/pemeriksaan-antrian-dokumen'
		},
		{
			title: 'Unduhan Formulir',
			description: 'Akses formulir administratif yang dibutuhkan sebelum proses konsultasi.'
		},
		{
			title: 'Bantuan & FAQ',
			description: 'Temukan jawaban cepat dan bantuan umum terkait layanan SI-KOPLING.'
		}
	];

	const searchSuggestions: SearchSuggestion[] = [
		{ label: 'Ajukan Permohonan' },
		{ label: 'Antrian Dokumen', href: '/layanan/pemeriksaan-antrian-dokumen' },
		{ label: 'Unduhan Formulir' },
		{ label: 'Bantuan & FAQ' }
	];
	const showNavMenus = true;

	let isLayananOpen = $state(false);
	let isMobileOpen = $state(false);
	let isMobileLayananOpen = $state(false);
	let isSearchOpen = $state(false);
	let isScrolled = $state(typeof window !== 'undefined' ? window.scrollY > 18 : false);
	let currentHash = $state('');
	let searchQuery = $state('');
	let layananDropdown = $state<HTMLDivElement | null>(null);
	let searchInputEl = $state<HTMLInputElement | null>(null);
	let layananCloseTimer: ReturnType<typeof setTimeout> | null = null;

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

	const openSearch = async () => {
		closeMenus();
		isSearchOpen = true;
		await tick();
		searchInputEl?.focus();
	};

	const closeSearch = () => {
		isSearchOpen = false;
	};

	const toggleMobileMenu = () => {
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
		if (event.key === 'Escape') {
			closeMenus();
			closeSearch();
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
	const isBerandaActive = () => isLandingPage() && currentHash === '';
	const isPanduanActive = () => isPathActive('/panduan');
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
		closeSearch();
		if (isMobileOpen) {
			closeMenus();
		}
	};

	$effect(() => {
		if (typeof document === 'undefined') return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = isMobileOpen || isSearchOpen ? 'hidden' : '';
		return () => {
			document.body.style.overflow = previousOverflow;
		};
	});

	const navClass = () =>
		`fixed inset-x-0 top-0 z-40 border-b [font-family:var(--font-body)] transition-[background-color,border-color,box-shadow,color] duration-300 ${
			useLightNav()
				? 'border-transparent bg-transparent text-white shadow-none'
				: 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] shadow-none'
		}`;

	const desktopLinkClass = (isActive = false) => {
		const baseClass =
			'relative inline-flex items-center py-2.5 lg:py-2 text-[1.01rem] lg:text-[0.98rem] font-semibold tracking-[0.002em] menu-item-static nav-menu-font transition-colors duration-200';
		if (useLightNav()) {
			return `${baseClass} ${isActive ? 'text-white' : 'text-white/85 hover:text-[#3EB14A]'}`;
		}
		return `${baseClass} ${
			isActive ? 'text-[var(--ink)]' : 'text-[#334155] hover:text-[#3EB14A]'
		}`;
	};

	const mobileNavBaseClass =
		'border-b border-transparent px-4 py-3.5 !text-lg !font-semibold [font-weight:600] nav-menu-font leading-[1.2] tracking-[0.002em] text-[var(--ink)]';

	const mobileLinkClass = (isActive = false) =>
		`block menu-item-static ${mobileNavBaseClass} ${
			isActive ? 'text-[var(--ink)]' : 'transition-colors hover:text-[#3EB14A]'
		}`;

	const mobileLayananClass = (isActive = false) =>
		`flex w-full items-center justify-between menu-item-static ${mobileNavBaseClass} appearance-none border-0 bg-transparent text-left ${
			isActive ? 'text-[var(--ink)]' : 'transition-colors hover:text-[#3EB14A]'
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
		`hidden h-11 lg:h-10 items-center rounded-lg border px-5 lg:px-4 text-base lg:text-[1rem] font-semibold transition-colors lg:inline-flex ${
			useLightNav()
				? 'border-white/30 bg-white/10 text-white'
				: 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]'
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
	<div class="nav-shell py-3 lg:py-3">
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
							class={desktopLinkClass(isBerandaActive())}
							aria-current={isBerandaActive() ? 'page' : undefined}
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
								class={`${desktopLinkClass(isLayananActive())} appearance-none items-center gap-1.5 border-0 bg-transparent px-0 [line-height:1.2] !font-semibold`}
								aria-expanded={isLayananOpen}
								aria-haspopup="true"
								onclick={() => (isLayananOpen ? closeLayananMenu() : openLayananMenu())}
							>
								Layanan
							</button>

							{#if isLayananOpen}
								<div
									class="absolute top-[calc(100%+1.25rem)] left-1/2 w-[min(92vw,34rem)] -translate-x-1/2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2.5 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.32)]"
								>
									<div class="grid gap-1.5 sm:grid-cols-2">
										{#each layananItems as item}
											{#if item.href}
												<a
													href={mapSectionHref(item.href)}
													class="group menu-item-static block w-full rounded-lg px-3.5 py-3 text-left transition-colors duration-150 hover:bg-[#f8fbf4]"
													onclick={handleLayananItemClick}
												>
													<span
														class="block text-[0.96rem] font-semibold text-[var(--ink)] transition-colors group-hover:text-[#3EB14A]"
														>{item.title}</span
													>
													<span
														class="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
														>{item.description}</span
													>
												</a>
											{:else}
												<button
													type="button"
													class="group menu-item-static w-full appearance-none rounded-lg px-3.5 py-3 text-left transition-colors duration-150 hover:bg-[#f8fbf4]"
												>
													<span
														class="block text-[0.96rem] font-semibold text-[var(--ink)] transition-colors group-hover:text-[#3EB14A]"
														>{item.title}</span
													>
													<span
														class="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
														>{item.description}</span
													>
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
							href="/panduan"
							class={desktopLinkClass(isPanduanActive())}
							aria-current={isPanduanActive() ? 'page' : undefined}
						>
							Panduan
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
					aria-label="Buka pencarian"
					onclick={openSearch}
				>
					<svg viewBox="0 0 20 20" class="h-4 w-4 lg:h-4.5 lg:w-4.5" aria-hidden="true">
						<circle cx="9" cy="9" r="5.4" fill="none" stroke="currentColor" stroke-width="1.7" />
						<path
							d="M13 13L16.4 16.4"
							stroke="currentColor"
							stroke-width="1.7"
							stroke-linecap="round"
						/>
					</svg>
				</button>

				<a href="/login" class={loginButtonClass()}> Login </a>

				{#if showNavMenus}
					<button
						type="button"
						class={`${actionButtonClass()} lg:hidden`}
						aria-expanded={isMobileOpen}
						aria-label="Buka menu"
						onclick={toggleMobileMenu}
					>
						<svg viewBox="0 0 20 20" class="h-4 w-4" aria-hidden="true">
							{#if isMobileOpen}
								<path
									d="M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5"
									stroke="currentColor"
									stroke-width="1.8"
								/>
							{:else}
								<path
									d="M3.5 6.5H16.5M3.5 10H16.5M3.5 13.5H16.5"
									stroke="currentColor"
									stroke-width="1.8"
								/>
							{/if}
						</svg>
					</button>
				{/if}
			</div>
		</div>
	</div>
</nav>

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
			<p class="text-lg font-semibold text-[var(--ink)]">Menu</p>

			<button
				type="button"
				class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]"
				aria-label="Tutup menu"
				onclick={closeMenus}
			>
				<svg viewBox="0 0 20 20" class="h-5 w-5" aria-hidden="true">
					<path d="M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5" stroke="currentColor" stroke-width="1.8" />
				</svg>
			</button>
		</div>

		<div class="mt-5 space-y-1.5">
			<a
				href={navHref('beranda')}
				class={mobileLinkClass(isBerandaActive())}
				onclick={handleBerandaClick}
			>
				Beranda
			</a>

			<button
				type="button"
				class={mobileLayananClass(isMobileLayananOpen || isLayananActive())}
				aria-expanded={isMobileLayananOpen}
				onclick={() => (isMobileLayananOpen = !isMobileLayananOpen)}
			>
				<span class="nav-menu-font text-lg font-semibold tracking-[0.002em]">Layanan</span>
				<svg
					viewBox="0 0 20 20"
					class={`h-4 w-4 transition-transform ${isMobileLayananOpen ? 'rotate-180' : ''}`}
					aria-hidden="true"
				>
					<path
						d="M5.5 7.75L10 12.25L14.5 7.75"
						fill="none"
						stroke="currentColor"
						stroke-width="1.7"
					/>
				</svg>
			</button>

			{#if isMobileLayananOpen}
				<div class="mt-1.5 space-y-1 pl-4" transition:fade={{ duration: 120 }}>
					{#each layananItems as item}
						{#if item.href}
							<a
								href={mapSectionHref(item.href)}
								class="menu-item-static nav-menu-font block w-full rounded-md px-3 py-2 text-left text-[0.95rem] font-semibold text-[#475467] transition-colors hover:bg-[#f8fafc] hover:text-[#3EB14A]"
								onclick={handleLayananItemClick}
							>
								{item.title}
							</a>
						{:else}
							<button
								type="button"
								class="menu-item-static nav-menu-font block w-full appearance-none rounded-md border-0 bg-transparent px-3 py-2 text-left text-[0.95rem] font-semibold text-[#475467] transition-colors hover:bg-[#f8fafc] hover:text-[#3EB14A]"
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
			<a
				href="/panduan"
				class={mobileLinkClass(isPanduanActive())}
				onclick={closeMenus}
			>
				Panduan
			</a>
			<a href="/kontak" class={mobileLinkClass(isPathActive('/kontak'))} onclick={closeMenus}>
				Kontak
			</a>
		</div>

		<a
			href="/login"
			class="mt-auto inline-flex w-full items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-base font-semibold text-[var(--ink)] transition-colors"
			onclick={closeMenus}
		>
			Login
		</a>
	</aside>
{/if}

{#if isSearchOpen}
	<button
		type="button"
		class="fixed inset-0 z-[80] bg-slate-900/30 backdrop-blur-[1px]"
		aria-label="Tutup pencarian"
		onclick={closeSearch}
		transition:fade={{ duration: 120 }}
	></button>

	<div class="fixed inset-0 z-[85] flex items-start justify-center px-4 pt-[15vh] sm:pt-[18vh]">
		<div
			class="w-full max-w-2xl rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-[0_22px_60px_-30px_rgba(15,23,42,0.38)]"
			transition:fly={{ y: -10, duration: 150 }}
		>
			<form class="flex items-center gap-3 p-3 sm:p-4" onsubmit={(event) => event.preventDefault()}>
				<svg viewBox="0 0 20 20" class="h-5 w-5 text-[var(--muted)]" aria-hidden="true">
					<circle cx="9" cy="9" r="5.4" fill="none" stroke="currentColor" stroke-width="1.7" />
					<path
						d="M13 13L16.4 16.4"
						stroke="currentColor"
						stroke-width="1.7"
						stroke-linecap="round"
					/>
				</svg>
				<input
					bind:this={searchInputEl}
					bind:value={searchQuery}
					type="text"
					placeholder="Cari layanan, dokumen, atau informasi..."
					class="w-full border-0 bg-transparent px-0 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:ring-0 focus:outline-none sm:text-base"
				/>
				<button
					type="button"
					class="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors sm:text-sm"
					onclick={closeSearch}
				>
					Tutup
				</button>
			</form>

			<div class="border-t border-[var(--line)] px-3 pt-2 pb-3 sm:px-4 sm:pb-4">
				<p class="text-xs font-semibold tracking-[0.08em] text-[var(--muted)] uppercase">
					Disarankan
				</p>
				<div class="mt-2.5 grid gap-1.5">
					{#each searchSuggestions as suggestion}
						{#if suggestion.href}
							<a
								href={mapSectionHref(suggestion.href)}
								class="flex items-center justify-between rounded-lg px-2.5 py-2.5 text-sm text-[var(--ink)] transition-colors"
								onclick={closeSearch}
							>
								<span>{suggestion.label}</span>
								<svg viewBox="0 0 20 20" class="h-4 w-4 text-[var(--muted)]" aria-hidden="true">
									<path
										d="M7 5L13 10L7 15"
										fill="none"
										stroke="currentColor"
										stroke-width="1.6"
										stroke-linecap="round"
									/>
								</svg>
							</a>
						{:else}
							<button
								type="button"
								class="flex w-full items-center justify-between rounded-lg px-2.5 py-2.5 text-left text-sm text-[var(--ink)] transition-colors"
							>
								<span>{suggestion.label}</span>
							</button>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(.nav-menu-font) {
		font-family: 'Open Sans', 'Segoe UI', sans-serif;
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
