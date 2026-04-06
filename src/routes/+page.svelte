<script lang="ts">
	import { onMount } from 'svelte';
	import { DotLottieSvelte } from '@lottiefiles/dotlottie-svelte';
	import type { DotLottie } from '@lottiefiles/dotlottie-svelte';
	import HorizontalScroll from "$lib/components/home/HorizontalScroll.svelte";

	type HomeFaqItem = {
		id: string;
		question: string;
		answer: string;
	};
	type StatItem = {
		key: string;
		label: string;
		target: number;
		suffix: string;
		description: string;
		note?: string;
	};

	type StepItem = {
		title: string;
		description: string;
	};

	type DesktopFlowStep = StepItem & {
		left: string;
		top: string;
	};

	const statItems: StatItem[] = [
		{
			key: 'konsultasi',
			label: 'Konsultasi Selesai',
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
			label: 'Rata-rata Waktu Proses',
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
	const homeFaqItems: HomeFaqItem[] = [
		{
			id: 'faq-layanan',
			question: 'Apa itu SIKOPLING dan layanan apa yang tersedia?',
			answer:
				'SIKOPLING adalah saluran interaktif konsultasi persetujuan lingkungan DLH Kalimantan Selatan. Layanan mencakup konsultasi dokumen AMDAL, UKL-UPL, DELH/DPLH, addendum, serta persetujuan teknis limbah B3, air limbah, dan emisi udara.'
		},
		{
			id: 'faq-proses',
			question: 'Apakah proses konsultasi harus tatap muka?',
			answer:
				'Tidak. Konsultasi, pembahasan teknis, dan rapat penilaian dilakukan secara daring. Pendekatan ini dirancang agar proses lebih efisien, terdokumentasi, dan mudah diakses oleh pemrakarsa dari berbagai lokasi.'
		},
		{
			id: 'faq-durasi',
			question: 'Berapa estimasi waktu pemrosesan dokumen?',
			answer:
				'Setelah persyaratan administrasi dinyatakan lengkap, estimasi proses adalah 10 hari kerja untuk AMDAL/DELH dan 5 hari kerja untuk UKL-UPL/DPLH, menyesuaikan jenis layanan yang diajukan.'
		},
		{
			id: 'faq-pantau',
			question: 'Bagaimana cara memantau progres dokumen?',
			answer:
				'Setiap pemrakarsa memperoleh tautan pemantauan untuk melihat tahapan dokumen secara berkala. Jika membutuhkan penjelasan lebih lanjut, Anda dapat menghubungi kanal Chatbot atau Customer Service SIKOPLING.'
		}
	];
	const statLeafLayout = {
		left: ['dokumen', 'kepuasan'],
		right: ['konsultasi', 'waktu']
	} as const;

	const statLeafSubtitles: Record<string, string> = {
		dokumen: 'Persetujuan',
		kepuasan: 'Tingkat Kepuasan',
		konsultasi: 'Per Pemrakarsa',
		waktu: 'Waktu Layanan'
	};

	const pickStatItem = (key: string) => statItems.find((item) => item.key === key);
	const leftLeafStats = statLeafLayout.left
		.map((key) => pickStatItem(key))
		.filter((item): item is StatItem => Boolean(item));
	const rightLeafStats = statLeafLayout.right
		.map((key) => pickStatItem(key))
		.filter((item): item is StatItem => Boolean(item));


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

	const desktopFlowSteps: DesktopFlowStep[] = [
		{ left: '17%', top: '18%', ...serviceSteps[0] },
		{ left: '58%', top: '18%', ...serviceSteps[1] },
		{ left: '17%', top: '39%', ...serviceSteps[3] },
		{ left: '58%', top: '39%', ...serviceSteps[2] },
		{ left: '17%', top: '60%', ...serviceSteps[4] },
		{ left: '58%', top: '60%', ...serviceSteps[5] },
		{ left: '17%', top: '81%', ...serviceSteps[7] },
		{ left: '58%', top: '81%', ...serviceSteps[6] }
	];
	let activeHomeFaqId = $state<string | null>(null);
	let statSection: HTMLElement | null = $state(null);
	let isCounterStarted = $state(false);
	let statValues = $state<Record<string, number>>(
		Object.fromEntries(statItems.map((item) => [item.key, 0]))
	);

	let animationFrameId = 0;

	let dotLottie: DotLottie | null = null;
	let isLottieLoaded = false;
	let isStatSectionVisible = false;
	let removeLottieListeners: (() => void) | null = null;

	const numberFormatter = new Intl.NumberFormat('id-ID');

	const getTargetValues = () =>
		Object.fromEntries(statItems.map((item) => [item.key, item.target])) as Record<string, number>;

	const syncLottiePlayback = () => {
		if (!dotLottie || !isLottieLoaded) return;
		if (isStatSectionVisible) {
			dotLottie.play();
			return;
		}
		dotLottie.pause();
	};

	const startCounterAnimation = () => {
		if (isCounterStarted) return;
		isCounterStarted = true;

		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			statValues = getTargetValues();
			return;
		}

		const startedAt = performance.now();
		const duration = 1800;
		const stagger = 140;

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

	const formatLeafStatValue = (item: StatItem) => {
		const roundedValue = Math.round(statValues[item.key] ?? 0);
		if (item.key === 'waktu') {
			return `${numberFormatter.format(roundedValue)} Hari`;
		}
		return `${numberFormatter.format(roundedValue)}${item.suffix}`;
	};

	const setDotLottieRef = (instance: DotLottie | null) => {
		removeLottieListeners?.();
		removeLottieListeners = null;

		dotLottie = instance;
		isLottieLoaded = false;

		if (!instance) return;

		instance.stop(); // pastikan dari awal tidak jalan duluan

		const handleLoad = () => {
			isLottieLoaded = true;
			syncLottiePlayback();
		};

		instance.addEventListener('load', handleLoad);

		removeLottieListeners = () => {
			instance.removeEventListener('load', handleLoad);
		};
	};

	const easeInOutCubic = (progress: number) =>
		progress < 0.5
			? 4 * Math.pow(progress, 3)
			: 1 - Math.pow(-2 * progress + 2, 3) / 2;

	const animateWindowScrollTo = (targetY: number, duration = 640) => {
		const startY = window.scrollY;
		const distanceY = targetY - startY;
		if (Math.abs(distanceY) < 1) {
			window.scrollTo({ top: targetY });
			return;
		}

		const startedAt = performance.now();

		const step = (currentTime: number) => {
			const elapsed = currentTime - startedAt;
			const progress = Math.min(elapsed / duration, 1);
			const easedProgress = easeInOutCubic(progress);

			window.scrollTo({ top: startY + distanceY * easedProgress });

			if (progress < 1) {
				requestAnimationFrame(step);
			}
		};

		requestAnimationFrame(step);
	};

	const scrollToDashboard = () => {
		const targetSection = document.getElementById('layanan-statistik');
		if (!targetSection) return;

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const navElement = document.querySelector('nav');
		const navHeight = navElement instanceof HTMLElement ? navElement.getBoundingClientRect().height : 0;
		const targetY = Math.max(
			0,
			window.scrollY + targetSection.getBoundingClientRect().top - navHeight - 16
		);

		if (prefersReducedMotion) {
			window.scrollTo({ top: targetY, behavior: 'auto' });
			return;
		}

		animateWindowScrollTo(targetY);
	};
	const toggleHomeFaq = (id: string) => {
		activeHomeFaqId = activeHomeFaqId === id ? null : id;
	};
	onMount(() => {
		if (!statSection) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				isStatSectionVisible = entry.isIntersecting;
				if (entry.isIntersecting) {
					startCounterAnimation();
				}
				syncLottiePlayback();
			},
			{ threshold: 0.01, rootMargin: '180px 0px -80px 0px' }
		);

		observer.observe(statSection);

		return () => {
			observer.disconnect();
			cancelAnimationFrame(animationFrameId);
			removeLottieListeners?.();
		};
	});
</script>

<svelte:head>
	<link rel="preload" href="/home/heading.svg" as="image" type="image/svg+xml" />
	<link rel="preload" href="/layout/daun-kiri.svg" as="image" type="image/svg+xml" />
	<link rel="preload" href="/layout/daun-kanan.svg" as="image" type="image/svg+xml" />
	<link rel="preload" href="/layout/line-number.svg" as="image" type="image/svg+xml" />
	<link rel="preload" href="/layout/daun-line-2.svg" as="image" type="image/svg+xml" />
	<link rel="preload" href="/layout/tree.lottie" as="fetch" type="application/octet-stream" />
</svelte:head>

<section id="beranda" class="relative isolate h-[31rem] overflow-hidden bg-black sm:h-[100svh] lg:h-[100dvh]">
	<div class="hero-media absolute inset-0" aria-hidden="true">
		<video
			class="hero-media-video"
			autoplay
			muted
			loop
			playsinline
			preload="metadata"
		>
			<source src="/home/hero-video-mobile.webm" type="video/webm" media="(max-width: 640px)" />
			<source src="/home/hero-video.webm" type="video/webm" />
		</video>
		<div class="absolute inset-0 bg-black/15"></div>
	</div>
	<div
		class="relative z-10 flex h-[31rem] items-center justify-center px-6 pt-24 pb-24 text-center sm:h-[100svh] sm:px-10 sm:pt-0 sm:pb-0 lg:h-[100dvh]"
	>
		<div class="mx-auto flex w-full max-w-5xl flex-col items-center">
			<img
				src="/home/heading.svg"
				alt="SIKOPLING"
				loading="eager"
				decoding="sync"
				fetchpriority="high"
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
	<button
		type="button"
		class="hero-scroll-indicator"
		aria-label="Scroll ke bagian Statistik Layanan"
		onclick={scrollToDashboard}
	>
		<span class="hero-scroll-label">Scroll to Explore</span>
		<span class="hero-scroll-arrow" aria-hidden="true">
			<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path
					d="M6 9L12 15L18 9"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</span>
	</button>
</section>

<style>
	.stat-tree-lottie {
		background-color: transparent;
	}

	.stat-tree-lottie :global(canvas),
	.stat-tree-lottie :global(svg),
	.stat-tree-lottie :global(dotlottie-player) {
		width: 100% !important;
		height: 100% !important;
		display: block;
		background-color: transparent !important;
	}
</style>

	<section id="layanan-dashboard" class="scroll-mt-28 bg-[var(--canvas)] py-7 sm:py-20">
		<div class="page-shell" bind:this={statSection}>
			<div class="mx-auto max-w-3xl text-center">
				<p class="text-xs font-semibold tracking-[0.12em] text-[#7f9662] uppercase">
					Statistik Layanan
				</p>
				<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
					Capaian SI-KOPLING Secara Ringkas
				</h2>
				<p id="layanan-statistik" class="mt-3 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
					Berdasarkan data SI-KOPLING, metrik berikut memperlihatkan performa layanan konsultasi dan
					persetujuan lingkungan yang semakin responsif.
				</p>
			</div>

			<div
				class="-mx-2 mt-3 grid grid-cols-[minmax(0,1fr)_minmax(7.2rem,8.6rem)_minmax(0,1fr)] items-start gap-x-1 gap-y-1.5 sm:mx-0 sm:mt-6 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,14rem)_minmax(0,1fr)] sm:gap-x-4 lg:grid-cols-[minmax(18rem,26rem)_minmax(26rem,34rem)_minmax(18rem,26rem)] lg:items-center lg:gap-x-2"
			>
				<div class="grid gap-1.5 sm:gap-3 lg:gap-6">
					{#each leftLeafStats as item}
						<article class="mx-auto grid w-full max-w-[12.8rem] bg-transparent text-center sm:max-w-[14rem] lg:max-w-[26rem]">
							<div class="flex min-h-[2rem] items-end justify-center px-1 py-0 sm:min-h-[4.75rem] sm:px-2 lg:min-h-[5.5rem]">
								<h3 class="text-[0.82rem] leading-[1.12] font-semibold tracking-tight text-[var(--ink)] uppercase sm:text-base lg:text-2xl">
									{item.label}
								</h3>
							</div>
							<div class="relative -mt-2 flex min-h-[4.6rem] items-center justify-center sm:-mt-1 lg:-mt-10 sm:min-h-[6.2rem] lg:min-h-[8.2rem]">
								<img
									src="/layout/daun-kiri.svg"
									alt=""
									aria-hidden="true"
									class="h-[5.95rem] w-full max-w-[12.4rem] object-contain sm:h-[6.8rem] sm:max-w-[13.6rem] lg:h-[8.8rem] lg:max-w-[25rem]"
								/>
								<div class="absolute inset-0 flex items-center justify-center px-1 sm:px-2 lg:px-4">
									<p class="font-hero-title text-[1.22rem] leading-none font-bold text-white sm:text-[1.85rem] lg:text-[3.2rem]">
										{formatLeafStatValue(item)}
									</p>
								</div>
							</div>
							<div class="flex min-h-[0.9rem] items-start justify-center px-1 pt-0 pb-0 sm:min-h-[1.2rem]">
								<p class="-mt-10 lg:-mt-20 text-[0.58rem] leading-tight font-semibold tracking-[0.06em] text-[var(--ink)] uppercase sm:text-[0.64rem] lg:text-sm">
									{statLeafSubtitles[item.key]}
								</p>
							</div>
						</article>
					{/each}
				</div>

				<div class="pointer-events-none relative z-20 mx-auto flex w-full self-center items-center justify-center overflow-visible">
					<div class="stat-tree-lottie aspect-square w-[clamp(12rem,58vw,20.5rem)] sm:w-[clamp(12rem,34vw,14rem)] lg:w-[clamp(20rem,28vw,34rem)]">
						<DotLottieSvelte 
							src="/layout/tree.lottie"
							autoplay={false}
							dotLottieRefCallback={setDotLottieRef}
						/>
					</div>
				</div>

				<div class="grid gap-1.5 sm:gap-3 lg:gap-6">
					{#each rightLeafStats as item}
						<article class="mx-auto grid w-full max-w-[12.8rem] bg-transparent text-center sm:max-w-[14rem] lg:max-w-[26rem]">
							<div class="flex min-h-[2rem] items-end justify-center px-1 py-0 sm:min-h-[4.75rem] sm:px-2 lg:min-h-[5.5rem]">
								<h3 class="text-[0.82rem] leading-[1.12] font-semibold tracking-tight text-[var(--ink)] uppercase sm:text-base lg:text-2xl">
									{item.label}
								</h3>
							</div>
							<div class="relative -mt-2 flex min-h-[4.6rem] items-center justify-center sm:-mt-1 lg:-mt-10 sm:min-h-[6.2rem] lg:min-h-[8.2rem]">
								<img
									src="/layout/daun-kanan.svg"
									alt=""
									aria-hidden="true"
									class="h-[5.95rem] w-full max-w-[12.4rem] object-contain sm:h-[6.8rem] sm:max-w-[13.6rem] lg:h-[8.8rem] lg:max-w-[25rem]"
								/>
								<div class="absolute inset-0 flex items-center justify-center px-1 sm:px-2 lg:px-4">
									<p class="font-hero-title text-[1.22rem] leading-none font-bold text-white sm:text-[1.85rem] lg:text-[3.2rem]">
										{formatLeafStatValue(item)}
									</p>
								</div>
							</div>
							<div class="flex min-h-[0.9rem] items-start justify-center px-1 pt-0 pb-0 sm:min-h-[1.2rem]">
								<p class="-mt-10 lg:-mt-20 text-[0.58rem] leading-tight font-semibold tracking-[0.06em] text-[var(--ink)] uppercase sm:text-[0.64rem] lg:text-sm">
									{statLeafSubtitles[item.key]}
								</p>
							</div>
						</article>
					{/each}
				</div>
			</div>
		</div>
	</section>

<section id="layanan-dokumen" class="border-t border-[#64AD31]/25 scroll-mt-28 bg-[#fff] py-6 sm:py-8">
	<div class="page-shell">
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-xs font-semibold tracking-[0.12em] text-[#7f9662] uppercase">
				Layanan Dokumen Lingkungan
			</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[--ink] sm:text-4xl">
				Jenis Dokumen yang Dapat Diproses
			</h2>
		</div>
	</div>
	<div class="-mt-20 relative w-full overflow-x-clip">
		<HorizontalScroll />
	</div>
</section>

<section id="alur-percepatan" class="scroll-mt-28 bg-[var(--canvas)] py-6 sm:py-14">
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

		<ol class="mt-8 space-y-3.5 lg:hidden">
			{#each serviceSteps as step, index}
				<li class="rounded-2xl border border-[var(--line)] bg-white p-4 sm:p-5">
					<span
						class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#43b556] text-lg font-bold text-white"
					>
						{index + 1}
					</span>
					<h3 class="mt-2.5 text-lg font-semibold tracking-tight text-[var(--ink)]">{step.title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
						{step.description}
					</p>
				</li>
			{/each}
		</ol>

			<div class="relative mt-12 hidden lg:block">
				<div class="relative mx-auto aspect-[1343/1954] max-w-[68rem] overflow-visible">
					<img
						src="/layout/line-number.svg"
						alt=""
						aria-hidden="true"
						class="absolute inset-0 h-full w-full object-contain"
					/>
					<img
						src="/layout/daun-line-2.svg"
						alt=""
						aria-hidden="true"
						class="absolute top-[-4%] right-[14%] w-[9.5rem] rotate-[10deg] opacity-95"
					/>
					<img
						src="/layout/daun-line-2.svg"
						alt=""
						aria-hidden="true"
						class="absolute top-[42%] right-[-9%] w-[10.5rem] -scale-x-100 rotate-[8deg] opacity-95"
					/>
					<img
						src="/layout/daun-line-2.svg"
						alt=""
						aria-hidden="true"
						class="absolute top-[57%] left-[-11%] w-[11.5rem] rotate-[186deg] opacity-95"
					/>
					<img
						src="/layout/daun-line-2.svg"
						alt=""
						aria-hidden="true"
						class="absolute right-[6%] bottom-[0%] w-[12.8rem] rotate-[278deg] opacity-95"
					/>
					<ol class="absolute inset-0">
						{#each desktopFlowSteps as step}
							<li
								class="absolute ml-25 w-[clamp(12rem,18vw,17rem)] -translate-x-1/2"
								style={`left:${step.left}; top:${step.top};`}
							>
								<h3 class="text-[2rem] leading-none font-semibold tracking-tight text-[var(--ink)]">
									{step.title}
								</h3>
								<p class="mt-2 text-[1rem] leading-snug text-[#2f3137]">
								{step.description}
							</p>
						</li>
					{/each}
				</ol>
			</div>
		</div>
	</div>
</section>
<section id="faq" class="scroll-mt-28 bg-white py-16 sm:py-20">
	<div class="nav-shell nav-shell-desktop-spacious">
		<div class="grid gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-12">
			<div class="lg:pt-2">
				<h2 class="max-w-md text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
					Pertanyaan yang Sering Diajukan
				</h2>
			</div>

			<div>
				<div class="space-y-3.5 sm:space-y-4">
				{#each homeFaqItems as item}
					<article class="overflow-hidden rounded-[1.55rem] border border-[#e4e7ec] bg-white">
						<h3>
							<button
								type="button"
								class="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left transition-colors hover:bg-[#f8faf6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6f864f] focus-visible:ring-inset sm:px-7 sm:py-5"
								onclick={() => toggleHomeFaq(item.id)}
								aria-expanded={activeHomeFaqId === item.id}
								aria-controls={`${item.id}-answer`}
							>
								<span
									class="text-[1.05rem] leading-snug font-semibold tracking-tight text-[var(--ink)] sm:text-[1.12rem]"
								>
									{item.question}
								</span>
								<span
									class={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-2xl leading-none transition-transform duration-300 ${
										activeHomeFaqId === item.id
											? 'rotate-45 border-[#c9d8b8] text-[#5d7b33]'
											: 'border-[#d8dde5] text-[#2f4f77]'
									}`}
									aria-hidden="true"
								>
									+
								</span>
							</button>
						</h3>
						{#if activeHomeFaqId === item.id}
							<div
								id={`${item.id}-answer`}
								class="border-t border-[#edf0f4] px-5 pt-3.5 pb-5 text-sm leading-relaxed text-[var(--muted)] sm:px-7 sm:pt-4 sm:pb-6 sm:text-base"
							>
								{item.answer}
							</div>
						{/if}
					</article>
				{/each}
				</div>
				<div class="mt-4 text-left sm:mt-5 sm:text-right">
					<a
						href="/kontak"
						class="inline-flex items-center text-sm font-semibold text-[#5d7b33] transition-colors hover:text-[#476028]"
					>
						Lihat selengkapnya
					</a>
				</div>
			</div>
		</div>
	</div>
</section>
