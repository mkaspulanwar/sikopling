<script lang="ts">
	import { browser } from '$app/environment'
	import { fade } from 'svelte/transition'
	import type { Snippet } from 'svelte'

	type Props = {
		children: Snippet
		class?: string
		emoji?: string
		size?: number
		offsetX?: number
		offsetY?: number
		disableOnMobile?: boolean
		mobileBreakpoint?: number
	}

	let {
		children,
		class: className = '',
		emoji = '👀',
		size = 38,
		offsetX = 6,
		offsetY = 2,
		disableOnMobile = true,
		mobileBreakpoint = 1024
	}: Props = $props()

	let zoneEl = $state<HTMLElement | null>(null)
	let showEmojiCursor = $state(false)
	let inside = $state(false)
	let x = $state(0)
	let y = $state(0)
	let pendingX = 0
	let pendingY = 0
	let rafId: number | null = null

	const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

	const flushPosition = () => {
		rafId = null
		x = pendingX
		y = pendingY
	}

	const queuePositionFlush = () => {
		if (!browser || rafId !== null) return
		rafId = window.requestAnimationFrame(flushPosition)
	}

	const updatePosition = (event: PointerEvent) => {
		if (!zoneEl || !showEmojiCursor) return

		const rect = zoneEl.getBoundingClientRect()
		const halfSize = size / 2
		const localX = event.clientX - rect.left + offsetX
		const localY = event.clientY - rect.top + offsetY

		pendingX = clamp(localX, halfSize, rect.width - halfSize)
		pendingY = clamp(localY, halfSize, rect.height - halfSize)
		queuePositionFlush()
	}

	const onPointerEnter = (event: PointerEvent) => {
		if (!showEmojiCursor) return
		inside = true
		updatePosition(event)
	}

	const onPointerMove = (event: PointerEvent) => {
		if (!inside) return
		updatePosition(event)
	}

	const onPointerLeave = () => {
		inside = false
	}

	$effect(() => {
		if (!browser) return

		const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
		const mobileQuery = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`)

		const sync = () => {
			const allowByViewport = !disableOnMobile || !mobileQuery.matches
			showEmojiCursor = pointerQuery.matches && allowByViewport
			if (!showEmojiCursor) inside = false
		}

		sync()
		pointerQuery.addEventListener('change', sync)
		mobileQuery.addEventListener('change', sync)
		return () => {
			pointerQuery.removeEventListener('change', sync)
			mobileQuery.removeEventListener('change', sync)
			if (rafId !== null) {
				window.cancelAnimationFrame(rafId)
				rafId = null
			}
		}
	})
</script>

<div
	bind:this={zoneEl}
	class={`eye-cursor-zone ${className}`}
	role="none"
	data-hide-cursor={showEmojiCursor && inside}
	onpointerenter={onPointerEnter}
	onpointermove={onPointerMove}
	onpointerleave={onPointerLeave}
>
	{@render children()}

	{#if showEmojiCursor && inside}
		<span
			class="eye-cursor"
			style={`transform: translate3d(${x}px, ${y}px, 0); font-size: ${size}px;`}
			aria-hidden="true"
			transition:fade={{ duration: 120 }}
		>
			{emoji}
		</span>
	{/if}
</div>

<style>
	.eye-cursor-zone {
		position: relative;
	}

	.eye-cursor {
		position: absolute;
		left: 0;
		top: 0;
		line-height: 1;
		pointer-events: none;
		user-select: none;
		will-change: transform;
	}

	.eye-cursor-zone[data-hide-cursor='true'],
	.eye-cursor-zone[data-hide-cursor='true'] :global(*) {
		cursor: none !important;
	}
	/* Hide native cursor only while emoji cursor is active inside the zone. */
</style>
