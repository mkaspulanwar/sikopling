<script lang="ts">
	import { fade } from 'svelte/transition'

	type Props = {
		active?: boolean
		delayMs?: number
		minVisibleMs?: number
	}

	let {
		active = false,
		delayMs = 120,
		minVisibleMs = 220
	}: Props = $props()

	let isVisible = $state(false)
	let visibleSince = 0
	let showTimeout: ReturnType<typeof setTimeout> | null = null
	let hideTimeout: ReturnType<typeof setTimeout> | null = null

	const clearShowTimeout = () => {
		if (!showTimeout) return
		clearTimeout(showTimeout)
		showTimeout = null
	}

	const clearHideTimeout = () => {
		if (!hideTimeout) return
		clearTimeout(hideTimeout)
		hideTimeout = null
	}

	$effect(() => {
		if (active) {
			clearHideTimeout()
			if (isVisible || showTimeout) return

			showTimeout = setTimeout(() => {
				showTimeout = null
				visibleSince = Date.now()
				isVisible = true
			}, delayMs)

			return () => {
				clearShowTimeout()
			}
		}

		clearShowTimeout()
		if (!isVisible) return

		const elapsed = Date.now() - visibleSince
		const remaining = Math.max(minVisibleMs - elapsed, 0)

		hideTimeout = setTimeout(() => {
			hideTimeout = null
			isVisible = false
		}, remaining)

		return () => {
			clearHideTimeout()
		}
	})
</script>

{#if isVisible}
	<div
		class="top-progress-shell pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px] overflow-hidden"
		aria-hidden="true"
		transition:fade={{ duration: 140 }}
	>
		<div class="top-progress-track"></div>
		<div class="top-progress-bar"></div>
		<div class="top-progress-bar top-progress-bar--secondary"></div>
	</div>
{/if}

<style>
	.top-progress-shell {
		backdrop-filter: saturate(120%) blur(3px);
	}

	.top-progress-track {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(90deg, rgba(93, 170, 53, 0.08), rgba(93, 170, 53, 0.2), rgba(93, 170, 53, 0.08));
	}

	.top-progress-bar,
	.top-progress-bar--secondary {
		position: absolute;
		inset-block: 0;
		left: -32%;
		width: 32%;
		border-radius: 999px;
		background: linear-gradient(90deg, #5da935, #7ac94f, #5da935);
		box-shadow: 0 0 14px rgba(93, 169, 53, 0.35);
		will-change: transform;
	}

	.top-progress-bar {
		animation: admin-top-progress 1.18s cubic-bezier(0.22, 1, 0.36, 1) infinite;
	}

	.top-progress-bar--secondary {
		width: 20%;
		opacity: 0.68;
		animation: admin-top-progress-secondary 1.18s cubic-bezier(0.22, 1, 0.36, 1) infinite;
	}

	@keyframes admin-top-progress {
		0% {
			transform: translateX(0) scaleX(0.78);
		}
		65% {
			transform: translateX(240%) scaleX(1.08);
		}
		100% {
			transform: translateX(410%) scaleX(0.92);
		}
	}

	@keyframes admin-top-progress-secondary {
		0% {
			transform: translateX(-40%) scaleX(0.72);
		}
		60% {
			transform: translateX(280%) scaleX(1);
		}
		100% {
			transform: translateX(470%) scaleX(0.86);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.top-progress-bar,
		.top-progress-bar--secondary {
			animation-duration: 2.2s;
		}
	}
</style>
