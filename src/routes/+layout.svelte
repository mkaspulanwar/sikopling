<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/home/Navbar.svelte';
	import SiteFooter from '$lib/components/home/SiteFooter.svelte';
	import ChatbotWidget from '$lib/components/home/ChatbotWidget.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>SIKOPLING KALSEL | Informasi Antrean Perizinan Lingkungan</title>
	<meta
		name="description"
		content="Portal informasi antrean pengajuan perizinan lingkungan Provinsi Kalimantan Selatan oleh Dinas Lingkungan Hidup."
	/>
</svelte:head>

<div class="min-h-[100dvh] bg-[var(--canvas)] text-[var(--ink)]">
	<Navbar />
	<main class="min-h-[40dvh]">
		{@render children()}
	</main>
	<SiteFooter />
	<ChatbotWidget />
</div>
