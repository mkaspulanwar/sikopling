<script lang="ts">
	import { onMount } from 'svelte';
	import MainHeader from '$lib/components/layout/MainHeader.svelte';
	import './layout.css';

	let { children } = $props();

	onMount(() => {
		let rafId = 0;
		let lenis: { raf: (time: number) => void; destroy: () => void } | null = null;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			return;
		}

		const setupLenis = async () => {
			const { default: Lenis } = await import('lenis');
			lenis = new Lenis({
				duration: 0.9,
				smoothWheel: true,
				syncTouch: false,
				wheelMultiplier: 0.9,
				touchMultiplier: 1
			});

			const loop = (time: number) => {
				lenis?.raf(time);
				rafId = window.requestAnimationFrame(loop);
			};

			rafId = window.requestAnimationFrame(loop);
		};

		void setupLenis();

		return () => {
			if (rafId) window.cancelAnimationFrame(rafId);
			lenis?.destroy();
		};
	});
</script>

<MainHeader />

{@render children()}
