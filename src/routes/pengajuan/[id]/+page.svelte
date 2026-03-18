<script lang="ts">
	let { params } = $props();
</script>

<svelte:head>
	<title>SIKOPLING | Detail Pengajuan</title>
</svelte:head>

<main class="page-shell py-12">
	<section class="surface-panel p-6">
		<h1 class="text-3xl font-semibold tracking-tight text-[color:var(--ink)]">Detail Pengajuan</h1>
		<p class="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
			Halaman detail untuk register <span class="font-semibold text-[color:var(--ink)]"
				>{params.id}</span
			> sedang disiapkan pada tahap berikutnya.
		</p>
	</section>
</main>
