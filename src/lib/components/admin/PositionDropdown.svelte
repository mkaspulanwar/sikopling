<script lang="ts">
	import { cubicOut } from 'svelte/easing'
	import { fly } from 'svelte/transition'
	import Check from 'lucide-svelte/icons/check'
	import ChevronDown from 'lucide-svelte/icons/chevron-down'

	type Props = {
		value: string
		options: readonly string[]
		disabled?: boolean
		id?: string
		customLabel?: string
		placeholder?: string
	}

	let {
		value = $bindable<string>(),
		options,
		disabled = false,
		id,
		customLabel = 'Lainnya',
		placeholder = 'Contoh: Koordinator Tim'
	}: Props = $props()

	let isOpen = $state(false)
	let rootElement = $state<HTMLDivElement | null>(null)
	let mainInputElement = $state<HTMLInputElement | null>(null)
	const isPresetValue = (candidate: string) =>
		candidate !== customLabel && options.includes(candidate)

	const isCustomSelected = $derived.by(() => !isPresetValue(value.trim()))

	const displayValue = $derived.by(() => {
		if (isCustomSelected) {
			const customValue = value.trim()
			return customValue || customLabel
		}
		return value
	})

	const toggleDropdown = () => {
		if (disabled) return
		isOpen = !isOpen
	}

	const selectOption = (option: string) => {
		if (option === customLabel) {
			if (!isCustomSelected) {
				value = ''
			}
			isOpen = false
			queueMicrotask(() => mainInputElement?.focus())
			return
		}
		value = option
		isOpen = false
	}

	$effect(() => {
		if (!isOpen) return

		const handlePointerDown = (event: PointerEvent) => {
			const target = event.target
			if (target instanceof Node && rootElement && !rootElement.contains(target)) {
				isOpen = false
			}
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				isOpen = false
			}
		}

		window.addEventListener('pointerdown', handlePointerDown)
		window.addEventListener('keydown', handleKeyDown)

		return () => {
			window.removeEventListener('pointerdown', handlePointerDown)
			window.removeEventListener('keydown', handleKeyDown)
		}
	})
</script>

<div class="relative" bind:this={rootElement}>
	{#if isCustomSelected}
		<div class="relative">
			<input
				bind:this={mainInputElement}
				type="text"
				{id}
				bind:value
				placeholder={placeholder}
				class="h-11 w-full rounded-xl border border-[#c9dcb8] bg-white px-3 pr-12 text-sm text-slate-700 transition focus:border-[#8fbd6d] focus:outline-none focus:ring-0 focus:shadow-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
				{disabled}
			/>
			<button
				type="button"
				class="absolute right-2 top-1/2 -translate-y-1/2"
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				onclick={toggleDropdown}
				{disabled}
			>
				<span
					class={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[#4f6f3d] transition ${
						isOpen
							? 'border-[#89b866] bg-[#e8f4db] text-[#2f6b1f]'
							: 'border-[#c7ddb7] bg-[#f2f9ea]'
					}`}
				>
					<ChevronDown class={`h-4 w-4 transition-transform duration-200 ease-out ${isOpen ? 'rotate-180' : ''}`} />
				</span>
			</button>
		</div>
	{:else}
		<button
			type="button"
			{id}
			class="h-11 w-full rounded-xl border border-[#c9dcb8] bg-white px-3 py-2 text-left text-sm text-slate-700 transition focus-visible:border-[#8fbd6d] focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
			aria-haspopup="listbox"
			aria-expanded={isOpen}
			onclick={toggleDropdown}
			{disabled}
		>
			<span class="flex items-center justify-between gap-2">
				<span class="min-w-0 truncate">{displayValue}</span>
				<span
					class={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-[#4f6f3d] transition ${
						isOpen
							? 'border-[#89b866] bg-[#e8f4db] text-[#2f6b1f]'
							: 'border-[#c7ddb7] bg-[#f2f9ea]'
					}`}
				>
					<ChevronDown class={`h-4 w-4 transition-transform duration-200 ease-out ${isOpen ? 'rotate-180' : ''}`} />
				</span>
			</span>
		</button>
	{/if}

	{#if isOpen}
		<div
			role="listbox"
			aria-label="Pilih posisi"
			class="absolute bottom-full left-0 right-0 z-30 mb-2 max-h-64 overflow-y-auto rounded-xl border border-[#c9dcb8] bg-white p-1.5 shadow-[0_22px_40px_-22px_rgba(15,23,42,0.55)]"
			transition:fly={{ y: 6, duration: 180, easing: cubicOut }}
		>
			{#each options as option}
				<button
					type="button"
					role="option"
					aria-selected={option === customLabel ? isCustomSelected : value === option}
					class={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
						(option === customLabel ? isCustomSelected : value === option)
							? 'bg-[#edf7e6] text-[#2f6b1f]'
							: 'text-slate-700 hover:bg-[#f3f9ee] hover:text-slate-900'
					}`}
					onclick={() => selectOption(option)}
				>
					<span class="truncate">{option}</span>
					{#if option === customLabel ? isCustomSelected : value === option}
						<Check class="h-4 w-4 shrink-0 text-[#3f7f1f]" />
					{/if}
				</button>
			{/each}

		</div>
	{/if}
</div>
