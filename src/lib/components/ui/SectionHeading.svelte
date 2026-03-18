<script lang="ts">
	interface Props {
		eyebrow?: string;
		title: string;
		description?: string;
		align?: 'left' | 'center';
		serifTitle?: boolean;
		serifDescription?: boolean;
	}

	let {
		eyebrow = '',
		title,
		description = '',
		align = 'left',
		serifTitle = false,
		serifDescription = false
	}: Props = $props();
</script>

<header class={align === 'center' ? 'text-center' : 'text-left'}>
	{#if eyebrow}
		<p class="eyebrow-pill">
			{eyebrow}
		</p>
	{/if}
	<h2
		class={`mt-2.5 text-[1.68rem] leading-[1.14] tracking-tight text-[color:var(--ink)] sm:text-[2rem] md:text-[2.45rem] lg:text-[2.8rem] ${serifTitle ? 'font-editorial text-[1.02em] font-normal italic' : 'font-semibold'}`}
	>
		{title}
	</h2>
	{#if description}
		<p
			class={`mt-2.5 max-w-[66ch] text-[0.99rem] leading-relaxed text-[color:var(--muted)] sm:text-[1.05rem] md:text-[1.08rem] ${serifDescription ? 'font-editorial text-[1.1rem] sm:text-[1.13rem]' : ''}`}
		>
			{description}
		</p>
	{/if}
</header>
