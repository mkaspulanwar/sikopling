<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/state';

	type LayananItem = {
		title: string;
		description: string;
		href: string;
	};

	const layananItems: LayananItem[] = [
		{
			title: 'Dashboard Layanan',
			description: 'Halaman ringkasan untuk seluruh alur layanan.',
			href: '#layanan-dashboard'
		},
		{
			title: 'Formulir Online',
			description: 'Akses formulir pengajuan dan pembaruan data.',
			href: '#layanan-dokumen'
		},
		{
			title: 'Tracking Dokumen',
			description: 'Lacak status dokumen dan progres proses layanan.',
			href: '#alur-percepatan'
		},
		{
			title: 'Bantuan & FAQ',
			description: 'Panduan umum dan jawaban pertanyaan layanan.',
			href: '#kontak'
		}
	];

	const searchSuggestions = [
		{ label: 'Statistik Layanan SI-KOPLING', href: '#layanan-dashboard' },
		{ label: 'Dokumen AMDAL dan UKL-UPL', href: '#layanan-dokumen' },
		{ label: 'Persetujuan Teknis Air Limbah', href: '#layanan-dokumen' },
		{ label: '8 Langkah Percepatan Pelayanan', href: '#alur-percepatan' }
	];

	let isLayananOpen = $state(false);
	let isMobileOpen = $state(false);
	let isMobileLayananOpen = $state(false);
	let isSearchOpen = $state(false);
	let isScrolled = $state(typeof window !== 'undefined' ? window.scrollY > 18 : false);
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

	onMount(() => {
		updateScrollState();
		const frameId = requestAnimationFrame(updateScrollState);
		return () => {
			cancelAnimationFrame(frameId);
		};
	});

	const isLandingPage = () => page.url.pathname === '/';
	const useLightNav = () => isLandingPage() && !isScrolled;
	const navHref = (sectionId: string) => (isLandingPage() ? `#${sectionId}` : `/#${sectionId}`);
	const mapSectionHref = (href: string) => (isLandingPage() ? href : `/${href}`);

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

	const desktopLinkClass = () =>
		`relative inline-flex py-2.5 text-base font-medium transition-colors after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:transition-transform after:duration-200 hover:after:scale-x-100 ${
			useLightNav()
				? 'text-white/88 hover:text-white after:bg-white'
				: 'text-[var(--muted)] hover:text-[#A9B388] after:bg-[#A9B388]'
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
	onscroll={updateScrollState}
/>

<nav class={navClass()}>
	<div class="nav-shell py-4">
		<div
			class="flex items-center justify-between gap-4 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-10"
		>
			<a href="/#beranda" class="flex min-w-0 items-center" onclick={closeMenus}>
				<img
					src="/layout/logo_sikopling.svg"
					alt="Logo SIKOPLING DLH Prov Kalsel"
					class={logoClass()}
				/>
			</a>

			<ul class="hidden items-center gap-10 lg:flex">
				<li>
					<a href={navHref('beranda')} class={desktopLinkClass()}> Beranda </a>
				</li>

				<li>
					<div class="relative" role="presentation" bind:this={layananDropdown}>
						<button
							type="button"
							class={`${desktopLinkClass()} items-center gap-1`}
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
										<a
											href={mapSectionHref(item.href)}
											class="rounded-lg border border-transparent p-3 transition-all hover:border-[var(--line)] hover:bg-[var(--accent-soft)]"
											onclick={() => (isLayananOpen = false)}
										>
											<span class="block text-sm font-semibold text-[var(--ink)]">{item.title}</span
											>
											<span class="mt-1 block text-xs leading-relaxed text-[var(--muted)]"
												>{item.description}</span
											>
										</a>
									{/each}
								</div>
							</div>
						{/if}
					</div>
				</li>

				<li>
					<a href={navHref('tentang')} class={desktopLinkClass()}> Tentang </a>
				</li>
				<li>
					<a href={navHref('kontak')} class={desktopLinkClass()}> Kontak </a>
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
					class="block rounded-lg px-4 py-3.5 text-lg font-medium text-[var(--ink)] transition-colors hover:bg-[var(--accent-soft)]"
					onclick={closeMenus}
				>
					Beranda
				</a>

				<button
					type="button"
					class="flex w-full items-center justify-between rounded-lg px-4 py-3.5 text-left [font-family:inherit] !text-lg !font-medium text-[var(--ink)] transition-colors hover:bg-[var(--accent-soft)]"
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
						<a
							href={mapSectionHref(item.href)}
							class="group flex items-center gap-2 rounded-md px-2 py-2.5 text-base text-[var(--muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]"
							onclick={closeMenus}
						>
							<span
								class="h-1.5 w-1.5 rounded-full bg-[var(--line)] transition-colors group-hover:bg-[var(--ink)]"
							></span>
							{item.title}
						</a>
					{/each}
				</div>
			{/if}

				<a
					href={navHref('tentang')}
					class="block rounded-lg px-4 py-3.5 text-lg font-medium text-[var(--ink)] transition-colors hover:bg-[var(--accent-soft)]"
					onclick={closeMenus}
				>
					Tentang
				</a>
				<a
					href={navHref('kontak')}
					class="block rounded-lg px-4 py-3.5 text-lg font-medium text-[var(--ink)] transition-colors hover:bg-[var(--accent-soft)]"
					onclick={closeMenus}
				>
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
