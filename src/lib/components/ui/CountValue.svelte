<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		value: string;
		duration?: number;
	}

	let { value, duration = 900 }: Props = $props();

	let container: HTMLSpanElement | null = null;
	let displayValue = $state('');

	const numberFormatter = new Intl.NumberFormat('id-ID');

	function extractNumericInfo(rawValue: string) {
		const matched = rawValue.match(/\d[\d.,]*/);
		if (!matched || matched.index === undefined) {
			return { hasNumber: false, prefix: '', suffix: '', target: 0 };
		}

		const prefix = rawValue.slice(0, matched.index);
		const suffix = rawValue.slice(matched.index + matched[0].length);
		const target = Number.parseInt(matched[0].replace(/\D/g, ''), 10);

		if (Number.isNaN(target)) {
			return { hasNumber: false, prefix: '', suffix: '', target: 0 };
		}

		return { hasNumber: true, prefix, suffix, target };
	}

	onMount(() => {
		if (!container) return;

		const { hasNumber, prefix, suffix, target } = extractNumericInfo(value);
		if (!hasNumber) {
			displayValue = value;
			return;
		}

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			displayValue = `${prefix}${numberFormatter.format(target)}${suffix}`;
			return;
		}

		displayValue = `${prefix}0${suffix}`;

		let frameId = 0;
		let started = false;

		const animate = () => {
			const startTime = performance.now();

			const step = (timestamp: number) => {
				const elapsed = timestamp - startTime;
				const progress = Math.min(elapsed / duration, 1);
				const eased = 1 - Math.pow(1 - progress, 3);
				const current = Math.round(target * eased);
				displayValue = `${prefix}${numberFormatter.format(current)}${suffix}`;

				if (progress < 1) {
					frameId = window.requestAnimationFrame(step);
				}
			};

			frameId = window.requestAnimationFrame(step);
		};

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (!entry.isIntersecting || started) return;
				started = true;
				animate();
				observer.disconnect();
			},
			{ threshold: 0.45 }
		);

		observer.observe(container);

		return () => {
			observer.disconnect();
			if (frameId) window.cancelAnimationFrame(frameId);
		};
	});

	$effect(() => {
		if (!displayValue) {
			displayValue = value;
		}
	});
</script>

<span bind:this={container} class="tabular-nums">
	{displayValue}
</span>
