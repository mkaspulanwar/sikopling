<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/home/Navbar.svelte';
	import SiteFooter from '$lib/components/home/SiteFooter.svelte';
	import ChatbotWidget from '$lib/components/home/ChatbotWidget.svelte';

	let { children } = $props();

	injectAnalytics();

	onMount(() => {
		if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		}
		window.scrollTo(0, 0);
	});

	const pageTitle = $derived.by(() => {
		const pathname = page.url.pathname.replace(/\/+$/, '') || '/';

		switch (pathname) {
			case '/':
				return 'Sikopling Kalsel';
			case '/layanan/dokling':
				return 'Antrian Dokumen Lingkungan';
			case '/layanan/pertek':
				return 'Antrian Persetujuan Teknis';
			case '/tentang':
				return 'Tentang Sikopling';
			case '/kontak':
				return 'Kontak Sikopling';
			case '/login':
				return 'Login Sikopling';
			default:
				return 'Sikopling Kalsel';
		}
	});

	const isLoginPage = $derived.by(() => {
		const pathname = page.url.pathname.replace(/\/+$/, '') || '/';
		return pathname === '/login';
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{pageTitle}</title>
	<meta
		name="description"
		content="Portal informasi antrean pengajuan perizinan lingkungan Provinsi Kalimantan Selatan oleh Dinas Lingkungan Hidup."
	/>
</svelte:head>

<div class="min-h-[100dvh] bg-[var(--canvas)] text-[var(--ink)]">
	{#if !isLoginPage}
		<Navbar />
	{/if}
	<main class={isLoginPage ? 'min-h-[100dvh]' : 'min-h-[40dvh]'}>
		{@render children()}
	</main>
	{#if !isLoginPage}
		<SiteFooter />
		<ChatbotWidget />
	{/if}
</div>
