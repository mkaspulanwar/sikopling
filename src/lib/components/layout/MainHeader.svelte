<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	const menuItems = [
		{ label: 'Beranda', href: '/' },
		{ label: 'Daftar Pengajuan', href: '/pengajuan' },
		{ label: 'Penjelasan Proses', href: '/proses-persetujuan' },
		{ label: 'Tentang Data', href: '/tentang-data' }
	] as const;

	let mobileMenuOpen = $state(false);

	function isMenuActive(href: string): boolean {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}

	function toggleMobileMenu(): void {
		mobileMenuOpen = !mobileMenuOpen;
	}
</script>

<header class="site-navbar enter-navbar">
	<div class="page-shell site-navbar-shell">
		<div class="site-navbar-brand-wrap">
			<a href={resolve('/')} class="site-navbar-brand">
				<div class="site-navbar-logo">
					<img
						src="/media/logo-dlh.png"
						alt="Logo Dinas Lingkungan Hidup"
						class="h-8 w-8 rounded-lg object-cover"
						loading="eager"
						decoding="async"
					/>
				</div>
				<div class="site-navbar-brand-copy">
					<p class="site-navbar-brand-title">Dinas Lingkungan Hidup</p>
					<p class="site-navbar-brand-subtitle">SIKOPLING Provinsi Kalimantan Selatan</p>
				</div>
			</a>
		</div>

		<nav class="site-navbar-desktop" aria-label="Navigasi utama">
			{#each menuItems as item (item.href)}
				<a
					href={resolve(item.href)}
					class={`site-navbar-link eased ${isMenuActive(item.href) ? 'site-navbar-link-active' : ''}`}
				>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="site-navbar-actions">
			<a href={resolve('/pengajuan')} class="site-navbar-cta eased">Login</a>
			<button
				type="button"
				class="site-navbar-toggle eased"
				onclick={toggleMobileMenu}
				aria-expanded={mobileMenuOpen}
				aria-controls="mobile-main-nav"
				aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
			>
				<span class={`site-navbar-toggle-line ${mobileMenuOpen ? 'line-top-open' : ''}`}></span>
				<span class={`site-navbar-toggle-line ${mobileMenuOpen ? 'line-mid-open' : ''}`}></span>
				<span class={`site-navbar-toggle-line ${mobileMenuOpen ? 'line-bottom-open' : ''}`}></span>
			</button>
		</div>
	</div>
	<nav
		id="mobile-main-nav"
		class={`site-navbar-mobile eased ${mobileMenuOpen ? 'is-open' : ''}`}
		aria-label="Navigasi utama mobile"
		hidden={!mobileMenuOpen}
	>
		<div class="page-shell site-navbar-mobile-inner">
			{#each menuItems as item (item.href)}
				<a
					href={resolve(item.href)}
					class={`site-navbar-mobile-link eased ${isMenuActive(item.href) ? 'site-navbar-mobile-link-active' : ''}`}
					onclick={() => (mobileMenuOpen = false)}
				>
					{item.label}
				</a>
			{/each}
		</div>
	</nav>
</header>
