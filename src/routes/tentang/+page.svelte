<script lang="ts">
	type Highlight = {
		title: string;
		description: string;
	};

	type Milestone = {
		year: string;
		title: string;
		description: string;
	};

	const highlights: Highlight[] = [
		{
			title: 'Pelayanan Terpadu',
			description:
				'SI-KOPLING mengintegrasikan alur konsultasi, verifikasi dokumen, dan pemantauan progres dalam satu kanal layanan.'
		},
		{
			title: 'Proses Transparan',
			description:
				'Setiap tahapan layanan dirancang terukur sehingga pemrakarsa dapat mengetahui status dokumen secara berkala.'
		},
		{
			title: 'Akses Mudah',
			description:
				'Platform dapat diakses oleh masyarakat dan pelaku usaha untuk mempercepat koordinasi layanan lingkungan.'
		}
	];

	const milestones: Milestone[] = [
		{
			year: '2023',
			title: 'Penguatan Kanal Digital',
			description: 'Penyempurnaan alur konsultasi daring dan pemantauan layanan berbasis web.'
		},
		{
			year: '2024',
			title: 'Standarisasi Layanan',
			description:
				'Penerapan format dokumen dan SLA agar proses penilaian lebih konsisten antar jenis layanan.'
		},
		{
			year: '2025',
			title: 'Kolaborasi Berkelanjutan',
			description:
				'Penguatan komunikasi antara tim teknis, pemrakarsa, dan masyarakat untuk peningkatan kualitas layanan.'
		}
	];
</script>

<svelte:head>
	<title>Tentang | SIKOPLING</title>
	<meta
		name="description"
		content="Halaman tentang SIKOPLING dengan informasi ringkas profil layanan dan arah pengembangan platform."
	/>
</svelte:head>

<section class="relative overflow-hidden bg-[var(--canvas)] pt-28 pb-14 sm:pt-32 sm:pb-20">
	<div
		class="pointer-events-none absolute top-[-9rem] left-[6%] h-[22rem] w-[22rem] rounded-full bg-[#d8e7c8]/45 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute right-[4%] bottom-[-8rem] h-[24rem] w-[24rem] rounded-full bg-[#d8e3f2]/35 blur-3xl"
	></div>

	<div class="page-shell relative">
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-xs font-semibold tracking-[0.12em] text-[#7f9662] uppercase">
				Tentang SIKOPLING
			</p>
			<h1
				class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl lg:text-5xl"
			>
				Layanan Digital untuk Persetujuan Lingkungan yang Lebih Responsif
			</h1>
			<p class="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
				SI-KOPLING merupakan kanal interaktif Dinas Lingkungan Hidup Provinsi Kalimantan Selatan
				yang membantu proses konsultasi dan pengelolaan informasi layanan persetujuan lingkungan
				secara lebih cepat, tertata, dan mudah dipahami.
			</p>
		</div>
	</div>
</section>

<section class="bg-[var(--canvas)] pb-16 sm:pb-20">
	<div class="page-shell">
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each highlights as item}
				<article
					class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_20px_50px_-34px_rgba(15,23,42,0.3)] sm:p-6"
				>
					<h2 class="text-lg font-semibold tracking-tight text-[var(--ink)]">{item.title}</h2>
					<p class="mt-2.5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
						{item.description}
					</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="border-y border-[var(--line)] bg-[#f8fafc] py-16 sm:py-20">
	<div class="page-shell">
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-xs font-semibold tracking-[0.12em] text-[#7f9662] uppercase">
				Perjalanan Platform
			</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
				Pengembangan Berkelanjutan dari Tahun ke Tahun
			</h2>
			<p class="mt-3 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
				Berikut contoh alur perkembangan SI-KOPLING sebagai gambaran arah layanan yang terus
				disempurnakan.
			</p>
		</div>

		<ol class="mx-auto mt-10 max-w-3xl space-y-5">
			{#each milestones as item}
				<li class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
					<p class="text-xs font-semibold tracking-[0.08em] text-[#5d7b33] uppercase">
						{item.year}
					</p>
					<h3 class="mt-2 text-lg font-semibold tracking-tight text-[var(--ink)]">{item.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
						{item.description}
					</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<section class="bg-[var(--canvas)] py-16 sm:py-20">
	<div class="page-shell">
		<div
			class="mx-auto max-w-3xl rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 text-center sm:p-8"
		>
			<h2 class="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
				Butuh Informasi Lebih Lanjut?
			</h2>
			<p class="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
				Tim layanan SI-KOPLING siap membantu kebutuhan informasi terkait konsultasi dan persetujuan
				lingkungan.
			</p>
			<a
				href="/kontak"
				class="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-[#96ad75] bg-[#a9b388] px-6 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[#9ea97f]"
			>
				Lihat Kontak Layanan
			</a>
		</div>
	</div>
</section>
