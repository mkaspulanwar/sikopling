<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		delay?: number;
		duration?: number;
		distance?: number;
		threshold?: number;
		rootMargin?: string;
		class?: string;
		children?: import('svelte').Snippet;
	}

	let {
		delay = 0,
		duration = 650,
		distance = 16,
		threshold = 0.2,
		rootMargin = '0px 0px -8% 0px',
		class: className = '',
		children
	}: Props = $props();

	let container: HTMLElement | null = null;
	let isVisible = $state(false);

	onMount(() => {
		if (!container) return;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			isVisible = true;
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (!entry.isIntersecting) return;
				isVisible = true;
				observer.disconnect();
			},
			{ threshold, rootMargin }
		);

		observer.observe(container);

		return () => observer.disconnect();
	});
</script>

<div
	bind:this={container}
	class={`reveal ${isVisible ? 'is-visible' : ''} ${className}`}
	style={`--reveal-delay:${delay}ms;--reveal-duration:${duration}ms;--reveal-distance:${distance}px;`}
>
	{@render children?.()}
</div>

<style>
	.reveal {
		opacity: 0;
		transform: translate3d(0, var(--reveal-distance, 16px), 0);
		transition:
			opacity var(--reveal-duration, 650ms) cubic-bezier(0.22, 0.61, 0.36, 1)
				var(--reveal-delay, 0ms),
			transform var(--reveal-duration, 650ms) cubic-bezier(0.22, 0.61, 0.36, 1)
				var(--reveal-delay, 0ms);
		will-change: transform, opacity;
	}

	.reveal.is-visible {
		opacity: 1;
		transform: translate3d(0, 0, 0);
	}

	@media (prefers-reduced-motion: reduce) {
		.reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
