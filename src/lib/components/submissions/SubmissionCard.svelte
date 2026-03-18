<script lang="ts">
	import { resolve } from '$app/paths';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import type { PublicSubmission } from '$lib/data/public-model';

	interface Props {
		submission: PublicSubmission;
	}

	let { submission }: Props = $props();
</script>

<article
	class="submission-card surface-panel depth-lift p-4 sm:p-5 md:p-6"
	data-status={submission.status}
>
	<div class="submission-head">
		<div class="submission-ident">
			<p class="text-[0.71rem] font-medium tracking-wide text-[color:var(--muted)] sm:text-xs">
				{submission.registerId}
			</p>
			<h3
				class="text-[1.05rem] font-semibold tracking-tight text-[color:var(--ink)] sm:text-[1.2rem]"
			>
				{submission.companyName}
			</h3>
			<p class="text-[0.92rem] text-[color:var(--muted)] sm:text-sm">{submission.region}</p>
		</div>
		<div class="submission-status-wrap">
			<StatusBadge status={submission.status} />
		</div>
	</div>

	<div class="submission-meta-grid">
		<div>
			<p class="text-xs font-semibold tracking-wide text-[color:var(--muted)] uppercase">
				Jenis Kegiatan
			</p>
			<p class="mt-1 text-[color:var(--ink)]">{submission.activityType}</p>
		</div>
		<div>
			<p class="text-xs font-semibold tracking-wide text-[color:var(--muted)] uppercase">
				Jenis Dokumen
			</p>
			<p class="mt-1 text-[color:var(--ink)]">{submission.documentType}</p>
		</div>
		<div>
			<p class="text-xs font-semibold tracking-wide text-[color:var(--muted)] uppercase">
				Tahap Aktif
			</p>
			<p class="mt-1 text-[color:var(--ink)]">{submission.activeStage}</p>
		</div>
		<div>
			<p class="text-xs font-semibold tracking-wide text-[color:var(--muted)] uppercase">
				Pembaruan Terakhir
			</p>
			<p class="mt-1 text-[color:var(--ink)]">{submission.lastUpdated}</p>
		</div>
	</div>

	<p class="submission-summary">
		{submission.progressSummary}
	</p>
	<a
		href={resolve('/pengajuan/[id]', { id: submission.registerId })}
		class="submission-link group link-primary eased"
	>
		Lihat detail progres
		<span
			class="flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--bg-soft)] transition-transform duration-220 group-hover:translate-x-px"
		>
			<svg viewBox="0 0 24 24" class="h-3.5 w-3.5" aria-hidden="true">
				<path
					fill="currentColor"
					d="m13.53 6.47 5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06l3.72-3.72H6a.75.75 0 0 1 0-1.5h10.19l-3.72-3.72a.75.75 0 1 1 1.06-1.06"
				/>
			</svg>
		</span>
	</a>
</article>
