<script lang="ts">
	import Navbar from '$lib/components/home/Navbar.svelte';
	import LandingSection from '$lib/components/home/LandingSection.svelte';
	import InformationSection from '$lib/components/home/InformationSection.svelte';
	import SiteFooter from '$lib/components/home/SiteFooter.svelte';
</script>

<svelte:head>
	<title>SIKOPLING KALSEL | Informasi Antrean Perizinan Lingkungan</title>
	<meta
		name="description"
		content="Portal informasi antrean pengajuan perizinan lingkungan Provinsi Kalimantan Selatan oleh Dinas Lingkungan Hidup."
	/>
</svelte:head>

<div class="min-h-[100dvh] bg-[var(--canvas)] text-[var(--ink)]">
	<Navbar />
	<main>
		<LandingSection />
		<InformationSection />
	</main>
	<SiteFooter />
</div>
