<script lang="ts">
	import { getStatusDefinition, type PublicStatusKey } from '$lib/data/public-model';

	interface Props {
		status: PublicStatusKey;
	}

	const toneClasses = {
		neutral: 'border-[#B7C9B7] bg-[#E6EFE4] text-[#4F6453]',
		progress: 'border-[#D1C08C] bg-[#F1E7CA] text-[#7C6426]',
		success: 'border-[#A6C6A7] bg-[#E0ECDF] text-[#355E3E]',
		danger: 'border-[#D7AFA9] bg-[#F5E5E3] text-[#8A3F38]'
	} as const;

	let { status }: Props = $props();

	const definition = $derived(getStatusDefinition(status));
	const styleClass = $derived(toneClasses[definition.tone]);
</script>

<span
	class={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.04em] ${styleClass}`}
>
	{definition.label}
</span>
