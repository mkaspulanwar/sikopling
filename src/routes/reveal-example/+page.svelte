<script lang="ts">
	import { onMount } from 'svelte';
	import Reveal from '$lib/components/ui/Reveal.svelte';

	let dynamicItems = $state([
		{ id: 'item-1', title: 'Tahap Administrasi', text: 'Berkas masuk dan diverifikasi awal.' },
		{ id: 'item-2', title: 'Tahap Penilaian', text: 'Dokumen ditelaah oleh tim teknis.' }
	]);

	onMount(() => {
		const timer = window.setTimeout(() => {
			dynamicItems = [
				...dynamicItems,
				{
					id: 'item-3',
					title: 'Tahap Keputusan',
					text: 'Status akhir diterbitkan dan diumumkan.'
				}
			];
		}, 900);

		return () => window.clearTimeout(timer);
	});
</script>

<svelte:head>
	<title>Reveal Example | SIKOPLING</title>
</svelte:head>

<main class="page-shell py-12">
	<Reveal delay={40} duration={700}>
		<h1 class="text-4xl font-semibold tracking-tight text-[color:var(--ink)]">
			Reusable Reveal Example
		</h1>
	</Reveal>

	<Reveal delay={120} duration={700}>
		<p class="mt-4 max-w-[70ch] text-[1rem] leading-relaxed text-[color:var(--muted)]">
			Komponen ini memakai Intersection Observer, animasi `fade + slide up`, configurable
			delay/duration, serta hanya berjalan satu kali saat elemen masuk viewport.
		</p>
	</Reveal>

	<section class="mt-8 grid gap-4 md:grid-cols-2">
		{#each dynamicItems as item, index (item.id)}
			<Reveal delay={180 + index * 90} duration={650}>
				<article class="surface-panel p-5">
					<h2 class="text-lg font-semibold text-[color:var(--ink)]">{item.title}</h2>
					<p class="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">{item.text}</p>
				</article>
			</Reveal>
		{/each}
	</section>
</main>
