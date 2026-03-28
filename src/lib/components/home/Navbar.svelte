<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/state';

	type LayananItem = {
		title: string;
		description: string;
		href?: string;
	};

	const layananSectionIds = ['layanan-dashboard', 'layanan-dokumen', 'alur-percepatan'];

	const layananItems: LayananItem[] = [
		{
			title: 'Pemeriksaan Antrian Dokumen',
			description: 'Pantau urutan pemeriksaan dan progres dokumen layanan secara berkala.',
			href: '/layanan/pemeriksaan-antrian-dokumen'
		},
		{
			title: 'Lorem Ipsum Dolor',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
		},
		{
			title: 'Sit Amet Consectetur',
			description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
		},
		{
			title: 'Dummy Layanan',
			description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
		}
	];

	const searchSuggestions = [
		{ label: 'Pemeriksaan Antrian Dokumen', href: '/layanan/pemeriksaan-antrian-dokumen' },
		{ label: 'Lorem ipsum dolor sit amet', href: '#layanan-dokumen' },
		{ label: 'Consectetur adipiscing elit', href: '#layanan-dokumen' },
		{ label: 'Sed do eiusmod tempor', href: '#alur-percepatan' }
	];

	let isLayananOpen = $state(false);
	let isMobileOpen = $state(false);
	let isMobileLayananOpen = $state(false);
	let isSearchOpen = $state(false);
	let isScrolled = $state(typeof window !== 'undefined' ? window.scrollY > 18 : false);
	let currentHash = $state('');
	let searchQuery = $state('');
	let layananDropdown: HTMLDivElement | null = null;
	let searchInputEl = $state<HTMLInputElement | null>(null);

	const closeMenus = () => {
		isLayananOpen = false;
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
			isLayananOpen = false;
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
		};
	});

	const isLandingPage = () => page.url.pathname === '/';
	const isLayananRoute = () => page.url.pathname.startsWith('/layanan');
	const isPathActive = (path: string) => page.url.pathname === path;
	const isLayananActive = () =>
		isLayananRoute() || (isLandingPage() && layananSectionIds.includes(currentHash));
	const isBerandaActive = () => isLandingPage() && !isLayananActive();
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
		`fixed inset-x-0 top-0 z-40 border-b [font-family:var(--font-display)] transition-[background-color,border-color,box-shadow] duration-300 ${
			useLightNav()
				? 'border-transparent bg-transparent shadow-none'
				: 'border-[var(--line)] bg-[var(--surface)] shadow-none'
		}`;

	const desktopLinkClass = (isActive = false) => {
		const baseClass =
			'relative inline-flex items-center py-2.5 text-[1.03rem] font-semibold tracking-[0.002em] transition-colors';
		if (useLightNav()) {
			return `${baseClass} ${isActive ? 'text-white' : 'text-white/86 hover:text-white'}`;
		}
		return `${baseClass} ${
			isActive ? 'text-[#4f6b30]' : 'text-[var(--muted)] hover:text-[#294a2f]'
		}`;
	};

	const mobileNavBaseClass =
		'border-b border-transparent px-4 py-3.5 text-lg !font-semibold [font-weight:600] [font-family:var(--font-display)] leading-[1.2] tracking-[0.002em] text-[var(--ink)]';

	const mobileLinkClass = (isActive = false) =>
		`block ${mobileNavBaseClass} ${isActive ? '' : 'transition-colors hover:text-[#3f5a2f]'}`;

	const mobileLayananClass = (isActive = false) =>
		`flex w-full items-center justify-between ${mobileNavBaseClass} appearance-none border-0 bg-transparent text-left ${
			isActive ? '' : 'transition-colors hover:text-[#3f5a2f]'
		}`;

	const logoClass = () =>
		`h-9 w-auto object-contain transition-[filter] duration-300 lg:h-11 ${
			useLightNav() ? 'brightness-0 invert' : 'brightness-100 saturate-100'
		}`;

	const actionButtonClass = () =>
		`inline-flex h-11 w-11 items-center justify-center rounded-lg border transition-colors ${
			useLightNav()
				? 'border-white/25 bg-white/10 text-white hover:bg-white/16'
				: 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--accent-soft)]'
		}`;

	const loginButtonClass = () =>
		`hidden h-11 items-center rounded-lg border px-5 text-base font-semibold transition-colors lg:inline-flex ${
			useLightNav()
				? 'border-white/30 bg-white/10 text-white hover:bg-white/16'
				: 'border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:bg-[var(--accent-soft)]'
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
	<div class="nav-shell py-4">
		<div
			class="flex items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-10"
		>
			<a href="/" class="flex min-w-0 items-center" onclick={handleBerandaClick}>
				<img
					src="/layout/logo_sikopling.svg"
					alt="Logo SIKOPLING DLH Prov Kalsel"
					class={logoClass()}
				/>
			</a>

			<ul class="hidden items-center gap-10 lg:flex">
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
					<div class="relative" role="presentation" bind:this={layananDropdown}>
						<button
							type="button"
							class={`${desktopLinkClass(isLayananActive() || isLayananOpen)} appearance-none items-center gap-1.5 border-0 bg-transparent px-0 [font-family:var(--font-display)] [line-height:1.2] !font-semibold`}
							aria-expanded={isLayananOpen}
							aria-haspopup="true"
							onclick={() => (isLayananOpen = !isLayananOpen)}
						>
							Layanan
							<svg
								viewBox="0 0 20 20"
								class={`h-4 w-4 transition-transform ${isLayananOpen ? 'rotate-180' : ''}`}
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

						{#if isLayananOpen}
							<div
								class="absolute top-[calc(100%+0.9rem)] left-1/2 w-[min(92vw,34rem)] -translate-x-1/2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[0_20px_45px_-25px_rgba(15,23,42,0.32)]"
							>
								<p
									class="px-2 text-xs font-semibold tracking-[0.08em] text-[var(--muted)] uppercase"
								>
									Menu Layanan
								</p>
								<div class="mt-3 grid gap-2 sm:grid-cols-2">
									{#each layananItems as item}
										{#if item.href}
											<a
												href={item.href}
												class="group block w-full rounded-xl border border-transparent p-3.5 text-left transition-all duration-200 hover:border-[#d8e2cb] hover:bg-[#f8fbf4]"
												onclick={handleLayananItemClick}
											>
												<span
													class="block text-[0.98rem] font-semibold text-[var(--ink)] group-hover:text-[#35572f]"
													>{item.title}</span
												>
												<span class="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
													>{item.description}</span
												>
											</a>
										{:else}
											<button
												type="button"
												class="group w-full appearance-none rounded-xl border border-transparent bg-transparent p-3.5 text-left transition-all duration-200 hover:border-[#d8e2cb] hover:bg-[#f8fbf4]"
											>
												<span
													class="block text-[0.98rem] font-semibold text-[var(--ink)] group-hover:text-[#35572f]"
													>{item.title}</span
												>
												<span class="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
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
						href="/kontak"
						class={desktopLinkClass(isPathActive('/kontak'))}
						aria-current={isPathActive('/kontak') ? 'page' : undefined}
					>
						Kontak
					</a>
				</li>
			</ul>

			<div class="flex items-center gap-2 lg:justify-self-end">
				<button
					type="button"
					class={actionButtonClass()}
					aria-label="Buka pencarian"
					onclick={openSearch}
				>
					<svg viewBox="0 0 20 20" class="h-4.5 w-4.5" aria-hidden="true">
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

				<button
					type="button"
					class={`${actionButtonClass()} lg:hidden`}
					aria-expanded={isMobileOpen}
					aria-label="Buka menu"
					onclick={toggleMobileMenu}
				>
					<svg viewBox="0 0 20 20" class="h-5 w-5" aria-hidden="true">
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
			</div>
		</div>
	</div>
</nav>

{#if isMobileOpen}
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
				Layanan
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
				<div class="mt-1 space-y-0.5 pl-2" transition:fade={{ duration: 120 }}>
					{#each layananItems as item}
						{#if item.href}
							<a
								href={item.href}
								class="group flex w-full items-center gap-2 px-2 py-2.5 text-left text-base text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
								onclick={handleLayananItemClick}
							>
								<span
									class="h-1.5 w-1.5 rounded-full bg-[var(--line)] transition-colors group-hover:bg-[var(--ink)]"
								></span>
								{item.title}
							</a>
						{:else}
							<button
								type="button"
								class="group flex w-full items-center gap-2 border-0 bg-transparent px-2 py-2.5 text-left text-base text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
							>
								<span
									class="h-1.5 w-1.5 rounded-full bg-[var(--line)] transition-colors group-hover:bg-[var(--ink)]"
								></span>
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
			class="mt-auto inline-flex w-full items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-base font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--accent-soft)]"
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
					class="rounded-lg border border-[var(--line)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--ink)] sm:text-sm"
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
						<a
							href={mapSectionHref(suggestion.href)}
							class="flex items-center justify-between rounded-lg px-2.5 py-2.5 text-sm text-[var(--ink)] transition-colors hover:bg-[var(--accent-soft)]"
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
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}
