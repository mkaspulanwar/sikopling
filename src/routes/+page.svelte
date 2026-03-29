<script lang="ts">
	import { onMount } from 'svelte';

	type StatItem = {
		key: string;
		label: string;
		target: number;
		suffix: string;
		description: string;
		note?: string;
	};

	type DocumentService = {
		title: string;
		description: string;
	};

	type StepItem = {
		title: string;
		description: string;
	};

	const statItems: StatItem[] = [
		{
			key: 'konsultasi',
			label: 'Total Konsultasi Selesai',
			target: 1248,
			suffix: '+',
			description: 'Pemrakarsa yang telah dibantu melalui kanal konsultasi interaktif SI-KOPLING.'
		},
		{
			key: 'dokumen',
			label: 'Dokumen Disetujui',
			target: 836,
			suffix: '+',
			description: 'Persetujuan lingkungan terbit dari berbagai jenis dokumen layanan.'
		},
		{
			key: 'waktu',
			label: 'Rata-rata Waktu Pemrosesan',
			target: 7,
			suffix: ' Hari Kerja',
			description: 'Kecepatan layanan untuk mendukung proses pengajuan yang mudah dan cepat.',
			note: 'Rentang SLA: 5-10 hari kerja sesuai jenis dokumen.'
		},
		{
			key: 'kepuasan',
			label: 'Indeks Kepuasan Masyarakat',
			target: 98,
			suffix: '%',
			description: 'Persentase tingkat kepuasan pemrakarsa berdasarkan survei layanan SI-KOPLING.'
		}
	];

	const documentServices: DocumentService[] = [
		{
			title: 'AMDAL',
			description: 'Penyusunan dan penilaian dokumen Analisis Mengenai Dampak Lingkungan.'
		},
		{
			title: 'UKL-UPL',
			description: 'Pengelolaan dan pemantauan lingkungan untuk kegiatan non-AMDAL.'
		},
		{
			title: 'DELH / DPLH',
			description: 'Dokumen evaluasi atau pengelolaan lingkungan bagi kegiatan eksisting.'
		},
		{
			title: 'ADDENDUM',
			description: 'Perubahan dokumen lingkungan sesuai pembaruan kegiatan dan ketentuan.'
		},
		{
			title: 'Rincian Teknis Limbah B3',
			description: 'Pemenuhan persyaratan teknis pengelolaan limbah B3 secara terukur.'
		},
		{
			title: 'Persetujuan Teknis Air Limbah',
			description: 'Verifikasi teknis pembuangan dan pengelolaan air limbah kegiatan usaha.'
		},
		{
			title: 'Persetujuan Teknis Emisi Udara',
			description: 'Penilaian pemenuhan baku mutu emisi udara pada sumber kegiatan.'
		}
	];

	const serviceSteps: StepItem[] = [
		{
			title: 'Media Interaktif',
			description:
				'Pemrakarsa wajib masuk dan melakukan konsultasi melalui chat CS SI-KOPLING sebelum proses lanjutan.'
		},
		{
			title: 'Pertemuan Daring',
			description:
				'Seluruh konsultasi dan rapat, termasuk penilaian AMDAL dan pembahasan Pertek, dilakukan secara online tanpa tatap muka.'
		},
		{
			title: 'Pantau Progres',
			description:
				'Tersedia tautan pemantauan untuk melihat perkembangan dokumen pemrakarsa secara berkala.'
		},
		{
			title: 'Biaya Cashless',
			description:
				'Pembayaran kegiatan rapat dikelola menggunakan metode non-tunai untuk transparansi.'
		},
		{
			title: 'Waktu Terukur',
			description:
				'Proses selesai dalam 10 hari kerja untuk AMDAL/DELH dan 5 hari kerja untuk UKL-UPL/DPLH setelah administrasi lengkap.'
		},
		{
			title: 'Pengiriman Langsung',
			description:
				'Dokumen fisik SK dikirimkan langsung kepada pemrakarsa melalui layanan ekspedisi resmi.'
		},
		{
			title: 'Bebas Gratifikasi',
			description:
				'Diterapkan larangan keras memberi atau menerima gratifikasi dalam bentuk apa pun selama proses layanan.'
		},
		{
			title: 'Ramah Lingkungan',
			description:
				'Pelayanan mengedepankan prinsip paperless, zero waste, hemat energi, dan rendah karbon.'
		}
	];

	let statSection: HTMLElement | null = $state(null);
	let isCounterStarted = $state(false);
	let animationFrameId = 0;
	let statValues = $state<Record<string, number>>(
		Object.fromEntries(statItems.map((item) => [item.key, 0]))
	);

	const numberFormatter = new Intl.NumberFormat('id-ID');

	const getTargetValues = () =>
		Object.fromEntries(statItems.map((item) => [item.key, item.target])) as Record<string, number>;

	const startCounterAnimation = () => {
		if (isCounterStarted) return;
		isCounterStarted = true;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			statValues = getTargetValues();
			return;
		}

		const startedAt = performance.now();
		const duration = 3400;
		const stagger = 280;

		const tick = (now: number) => {
			const nextValues: Record<string, number> = {};
			let isCompleted = true;

			for (const [index, item] of statItems.entries()) {
				const localElapsed = now - startedAt - index * stagger;
				const progress = Math.min(Math.max(localElapsed / duration, 0), 1);
				const easedProgress = 1 - Math.pow(1 - progress, 4);
				nextValues[item.key] = item.target * easedProgress;
				if (progress < 1) {
					isCompleted = false;
				}
			}

			statValues = nextValues;

			if (!isCompleted) {
				animationFrameId = requestAnimationFrame(tick);
			}
		};

		animationFrameId = requestAnimationFrame(tick);
	};

	const formatStatValue = (item: StatItem) => {
		const roundedValue = Math.round(statValues[item.key] ?? 0);
		return `${numberFormatter.format(roundedValue)}${item.suffix}`;
	};

	onMount(() => {
		if (!statSection) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				startCounterAnimation();
				observer.disconnect();
			},
			{
				threshold: 0.35
			}
		);

		observer.observe(statSection);

		return () => {
			observer.disconnect();
			cancelAnimationFrame(animationFrameId);
		};
	});
</script>

<section id="beranda" class="relative isolate h-[100svh] min-h-[100svh] overflow-hidden">
	<video
		class="absolute inset-0 h-full w-full object-cover"
		autoplay
		muted
		loop
		playsinline
		preload="metadata"
	>
		<source src="/home/hero-video.webm" type="video/webm" />
	</video>
	<div
		class="relative z-10 flex min-h-[100svh] items-center justify-center px-6 text-center sm:px-10"
	>
		<div class="mx-auto flex w-full max-w-5xl flex-col items-center">
			<img
				src="/home/heading.svg"
				alt="SIKOPLING"
				class="w-full max-w-[20rem] object-contain sm:max-w-[30rem] lg:max-w-[33rem]"
			/>

			<p
				class="font-hero-copy mx-auto mt-4 max-w-[22rem] text-[clamp(0.98rem,2.1vw,1.55rem)] leading-relaxed font-medium text-white/95 drop-shadow-[0_8px_22px_rgba(2,6,23,0.45)] sm:mt-5 sm:max-w-4xl"
			>
				Saluran Interaktif Konsultasi Persetujuan Lingkungan Dinas Lingkungan Hidup Provinsi
				Kalimantan Selatan
			</p>
		</div>
	</div>
</section>

<section id="layanan-dashboard" class="scroll-mt-28 bg-[var(--canvas)] py-16 sm:py-20">
	<div class="page-shell" bind:this={statSection}>
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-xs font-semibold tracking-[0.12em] text-[#7f9662] uppercase">
				Statistik Layanan
			</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
				Capaian SI-KOPLING Secara Ringkas
			</h2>
			<p class="mt-3 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
				Berdasarkan data SI-KOPLING, metrik berikut memperlihatkan performa layanan konsultasi dan
				persetujuan lingkungan yang semakin responsif.
			</p>
		</div>

		<dl
			class="mt-10 grid gap-x-8 gap-y-8 border-y border-[var(--line)] py-8 sm:grid-cols-2 xl:grid-cols-4"
		>
			{#each statItems as item}
				<div>
					<dt class="text-xs font-semibold tracking-[0.08em] text-[var(--muted)] uppercase">
						{item.label}
					</dt>
					<dd
						class="font-hero-title mt-2 text-[clamp(2rem,4.3vw,2.9rem)] leading-none font-bold text-[var(--ink)]"
					>
						{formatStatValue(item)}
					</dd>
					<p class="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.description}</p>
					{#if item.note}
						<p class="mt-2 text-xs font-medium text-[#5d7b33]">{item.note}</p>
					{/if}
				</div>
			{/each}
		</dl>
	</div>
</section>

<section id="layanan-dokumen" class="scroll-mt-28 bg-[#f8fafc] py-16 sm:py-20">
	<div class="page-shell">
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-xs font-semibold tracking-[0.12em] text-[#7f9662] uppercase">
				Layanan Dokumen Lingkungan
			</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
				Jenis Dokumen yang Dapat Diproses
			</h2>
			<p class="mt-3 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
				Pilih jenis dokumen sesuai kebutuhan kegiatan untuk memulai konsultasi dan proses
				persetujuan lingkungan.
			</p>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each documentServices as service}
				<article
					class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 transition-colors hover:border-[#c9d8b8] hover:bg-[#fbfdf9] sm:p-6"
				>
					<h3 class="text-lg font-semibold tracking-tight text-[var(--ink)]">{service.title}</h3>
					<p class="mt-2.5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
						{service.description}
					</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<section id="alur-percepatan" class="scroll-mt-28 bg-[var(--canvas)] py-16 sm:py-20">
	<div class="page-shell">
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-xs font-semibold tracking-[0.12em] text-[#7f9662] uppercase">
				8 Langkah Percepatan
			</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
				Alur Kerja Pelayanan Persetujuan Lingkungan
			</h2>
			<p class="mt-3 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
				Alur ini dirancang agar proses layanan lebih transparan, terukur, dan efisien bagi
				pemrakarsa.
			</p>
		</div>

		<ol class="mt-10 space-y-6">
			{#each serviceSteps as step, index}
				<li class="relative pl-14 sm:pl-16">
					<div
						class="absolute top-0 left-0 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#b9cca3] bg-[#eef5e7] text-sm font-semibold text-[#58703a]"
					>
						{index + 1}
					</div>
					{#if index < serviceSteps.length - 1}
						<span class="absolute top-10 bottom-0 left-5 w-px bg-[var(--line)]"></span>
					{/if}
					<h3 class="text-lg font-semibold tracking-tight text-[var(--ink)]">{step.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
						{step.description}
					</p>
				</li>
			{/each}
		</ol>
	</div>
</section>
