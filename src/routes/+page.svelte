<script lang="ts">
	import { browser } from "$app/environment";
	import ArrowRight from "lucide-svelte/icons/arrow-right";
	import Plus from "lucide-svelte/icons/plus";
	import { onMount } from "svelte";
	import { cubicOut } from "svelte/easing";
	import { slide } from "svelte/transition";
	import type { DotLottie } from "@lottiefiles/dotlottie-svelte";
	import type { PageData } from "./$types";
	import HorizontalScroll from "$lib/components/home/HorizontalScroll.svelte";
	import StackedCard from "$lib/components/home/StackedCard.svelte";

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

	let { data }: { data: PageData } = $props();

	const statItems: StatItem[] = [
		{
			key: "total",
			label: "Total Pengajuan",
			target: data.summary.total,
			suffix: "+",
			description:
				"Total pengajuan dokumen yang tercatat pada dashboard admin SIKOPLING.",
		},
		{
			key: "selesai",
			label: "Pengajuan Selesai",
			target: data.summary.selesai,
			suffix: "+",
			description:
				"Jumlah dokumen pengajuan yang sudah selesai berdasarkan dashboard admin SIKOPLING.",
		},
		{
			key: "waktu",
			label: "Rata-rata Waktu Proses",
			target: 7,
			suffix: " Hari Kerja",
			description:
				"Kecepatan layanan untuk mendukung proses pengajuan yang mudah dan cepat.",
			note: "Rentang SLA: 5-10 hari kerja sesuai jenis dokumen.",
		},
		{
			key: "kepuasan",
			label: "Index Kepuasan",
			target: 98,
			suffix: "%",
			description:
				"Persentase tingkat kepuasan pemrakarsa berdasarkan survei layanan SIKOPLING.",
		},
	];
	const homeFaqItems: HomeFaqItem[] = [
		{
			id: "faq-layanan",
			question: "Apa itu SIKOPLING dan layanan apa yang tersedia?",
			answer: "SIKOPLING adalah saluran interaktif konsultasi persetujuan lingkungan DLH Kalimantan Selatan. Layanan mencakup konsultasi dokumen AMDAL, UKL-UPL, DELH/DPLH, addendum, serta persetujuan teknis limbah B3, air limbah, dan emisi udara.",
		},
		{
			id: "faq-proses",
			question: "Apakah proses konsultasi harus tatap muka?",
			answer: "Tidak. Konsultasi, pembahasan teknis, dan rapat penilaian dilakukan secara daring. Pendekatan ini dirancang agar proses lebih efisien, terdokumentasi, dan mudah diakses oleh pemrakarsa dari berbagai lokasi.",
		},
		{
			id: "faq-durasi",
			question: "Berapa estimasi waktu pemrosesan dokumen?",
			answer: "Setelah persyaratan administrasi dinyatakan lengkap, estimasi proses adalah 10 hari kerja untuk AMDAL/DELH dan 5 hari kerja untuk UKL-UPL/DPLH, menyesuaikan jenis layanan yang diajukan.",
		},
		{
			id: "faq-pantau",
			question: "Bagaimana cara memantau progres dokumen?",
			answer: "Setiap pemrakarsa memperoleh tautan pemantauan untuk melihat tahapan dokumen secara berkala. Jika membutuhkan penjelasan lebih lanjut, Anda dapat menghubungi kanal Chatbot atau Customer Service SIKOPLING.",
		},
	];
	const statLeafLayout = {
		left: ["total", "kepuasan"],
		right: ["selesai", "waktu"],
	} as const;

	const statLeafSubtitles: Record<string, string> = {
		total: "Total Dokumen",
		kepuasan: "Tingkat Kepuasan",
		selesai: "Surat Keputusan Terbit",
		waktu: "Waktu Layanan",
	};

	const pickStatItem = (key: string) =>
		statItems.find((item) => item.key === key);
	const leftLeafStats = statLeafLayout.left
		.map((key) => pickStatItem(key))
		.filter((item): item is StatItem => Boolean(item));
	const rightLeafStats = statLeafLayout.right
		.map((key) => pickStatItem(key))
		.filter((item): item is StatItem => Boolean(item));

	const serviceSteps: StepItem[] = [
		{
			title: "Media Interaktif",
			description:
				"Pemrakarsa wajib masuk dan melakukan konsultasi melalui chat CS SIKOPLING sebelum proses lanjutan.",
		},
		{
			title: "Pertemuan Daring",
			description:
				"Seluruh konsultasi dan rapat, termasuk penilaian AMDAL dan pembahasan Pertek, dilakukan secara online tanpa tatap muka.",
		},
		{
			title: "Pantau Progres",
			description:
				"Tersedia tautan pemantauan untuk melihat perkembangan dokumen pemrakarsa secara berkala.",
		},
		{
			title: "Biaya Cashless",
			description:
				"Pembayaran kegiatan rapat dikelola menggunakan metode non-tunai untuk transparansi.",
		},
		{
			title: "Waktu Terukur",
			description:
				"Proses selesai dalam 10 hari kerja untuk AMDAL/DELH dan 5 hari kerja untuk UKL-UPL/DPLH setelah administrasi lengkap.",
		},
		{
			title: "Pengiriman Langsung",
			description:
				"Dokumen fisik SK dikirimkan langsung kepada pemrakarsa melalui layanan ekspedisi resmi.",
		},
		{
			title: "Bebas Gratifikasi",
			description:
				"Diterapkan larangan keras memberi atau menerima gratifikasi dalam bentuk apa pun selama proses layanan.",
		},
		{
			title: "Ramah Lingkungan",
			description:
				"Pelayanan mengedepankan prinsip paperless, zero waste, hemat energi, dan rendah karbon.",
		},
	];

	const desktopFlowSteps: DesktopFlowStep[] = [
		{ left: "27%", top: "18%", ...serviceSteps[0] },
		{ left: "75%", top: "18%", ...serviceSteps[1] },
		{ left: "27%", top: "39%", ...serviceSteps[3] },
		{ left: "75%", top: "39%", ...serviceSteps[2] },
		{ left: "27%", top: "61%", ...serviceSteps[4] },
		{ left: "76%", top: "61%", ...serviceSteps[5] },
		{ left: "27%", top: "82%", ...serviceSteps[7] },
		{ left: "76%", top: "82%", ...serviceSteps[6] },
	];
	let activeHomeFaqId = $state<string | null>(null);
	let heroSection: HTMLElement | null = $state(null);
	let statSection: HTMLElement | null = $state(null);
	let isHeroScrollIndicatorVisible = $state(true);
	let isCounterStarted = $state(false);
	let statValues = $state<Record<string, number>>(
		Object.fromEntries(statItems.map((item) => [item.key, 0])),
	);

	let animationFrameId = 0;

	let dotLottie: DotLottie | null = null;
	let DotLottieComponent = $state<any>(null);
	let isLottieLoaded = false;
	let isStatSectionVisible = false;
	let removeLottieListeners: (() => void) | null = null;

	const numberFormatter = new Intl.NumberFormat("id-ID");

	const getTargetValues = () =>
		Object.fromEntries(
			statItems.map((item) => [item.key, item.target]),
		) as Record<string, number>;

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

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
				const progress = Math.min(
					Math.max(localElapsed / duration, 0),
					1,
				);
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
		if (item.key === "waktu") {
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

		instance.addEventListener("load", handleLoad);

		removeLottieListeners = () => {
			instance.removeEventListener("load", handleLoad);
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
		const targetSection = document.getElementById("overview-section");
		if (!targetSection) return;

		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		const navElement = document.querySelector("nav");
		const navHeight =
			navElement instanceof HTMLElement
				? navElement.getBoundingClientRect().height
				: 0;
		const targetY = Math.max(
			0,
			window.scrollY +
				targetSection.getBoundingClientRect().top -
				navHeight -
				16,
		);

		if (prefersReducedMotion) {
			window.scrollTo({ top: targetY, behavior: "auto" });
			return;
		}

		animateWindowScrollTo(targetY);
	};
	const toggleHomeFaq = (id: string) => {
		activeHomeFaqId = activeHomeFaqId === id ? null : id;
	};
	onMount(() => {
		let isUnmounted = false;
		let heroObserver: IntersectionObserver | null = null;
		let statObserver: IntersectionObserver | null = null;

		if (browser) {
			void import("@lottiefiles/dotlottie-svelte").then((module) => {
				if (!isUnmounted) {
					DotLottieComponent = module.DotLottieSvelte;
				}
			});
		}

		if (heroSection) {
			heroObserver = new IntersectionObserver(
				([entry]) => {
					isHeroScrollIndicatorVisible = entry.isIntersecting;
				},
				{ threshold: 0, rootMargin: "0px 0px -60% 0px" },
			);

			heroObserver.observe(heroSection);
		}

		if (statSection) {
			statObserver = new IntersectionObserver(
				([entry]) => {
					isStatSectionVisible = entry.isIntersecting;
					if (entry.isIntersecting) {
						startCounterAnimation();
					}
					syncLottiePlayback();
				},
				{ threshold: 0.4, rootMargin: "100px 0px -80px 0px" },
			);

			statObserver.observe(statSection);
		}

		return () => {
			isUnmounted = true;
			heroObserver?.disconnect();
			statObserver?.disconnect();
			cancelAnimationFrame(animationFrameId);
			removeLottieListeners?.();
		};
	});
</script>

<svelte:head>
	<link
		rel="preload"
		href="/home/heading.svg"
		as="image"
		type="image/svg+xml"
	/>
	<link
		rel="preload"
		href="/layout/daun-kiri.svg"
		as="image"
		type="image/svg+xml"
	/>
	<link
		rel="preload"
		href="/layout/daun-kanan.svg"
		as="image"
		type="image/svg+xml"
	/>
	<link
		rel="preload"
		href="/layout/line-number.svg"
		as="image"
		type="image/svg+xml"
	/>
	<link
		rel="preload"
		href="/layout/daun-line.svg"
		as="image"
		type="image/svg+xml"
	/>
	<link
		rel="preload"
		href="/layout/tree.lottie"
		as="fetch"
		type="application/octet-stream"
	/>
	<link
		rel="preload"
		href="/home/video-hero.webm?v=20260418"
		as="video"
		type="video/webm"
	/>
</svelte:head>

<section
	id="beranda"
	class="hero-parallax relative isolate min-h-[100svh] overflow-hidden bg-black lg:min-h-[100dvh]"
	bind:this={heroSection}
>
	<div class="hero-media absolute inset-0" aria-hidden="true">
		<video
			class="hero-media-video"
			autoplay
			muted
			loop
			playsinline
			preload="metadata"
		>
			<source
				src="/home/video-hero.webm?v=20260418"
				type="video/webm"
			/>
			<source
				src="/home/video-hero.mp4?v=20260418"
				type="video/mp4"
			/>
		</video>
		<div class="absolute inset-0 bg-black/15"></div>
	</div>
	<div
		class="hero-parallax-copy relative z-10 flex min-h-[100svh] items-center justify-center px-6 pt-[max(6rem,calc(env(safe-area-inset-top)+3.75rem))] pb-[max(5.25rem,calc(env(safe-area-inset-bottom)+1.75rem))] text-center sm:px-10 sm:pt-0 sm:pb-0 lg:min-h-[100dvh]"
	>
		<div class="mx-auto flex w-full max-w-5xl flex-col items-center">
			<img
				src="/home/heading.svg"
				alt="SIKOPLING"
				loading="eager"
				decoding="sync"
				fetchpriority="high"
				class="mx-auto w-[min(90vw,19rem)] object-contain sm:w-[min(74vw,23rem)] lg:w-[45rem] xl:w-[48rem]"
			/>
			<p
				class="font-hero-copy mx-auto mt-4 max-w-[21.5rem] text-[0.98rem] leading-relaxed font-medium text-white/95 drop-shadow-[0_8px_22px_rgba(2,6,23,0.45)] sm:mt-5 sm:max-w-[38rem] sm:text-[1.08rem] lg:max-w-[47rem] lg:text-[1.24rem] xl:max-w-[50rem] xl:text-[1.3rem]"
			>
				Saluran Interaktif Konsultasi Persetujuan Lingkungan Dinas
				Lingkungan Hidup Provinsi Kalimantan Selatan
			</p>
		</div>
	</div>
	<button
		type="button"
		class="hero-scroll-indicator"
		class:hero-scroll-indicator-hidden={!isHeroScrollIndicatorVisible}
		aria-label="Scroll ke bagian Statistik Layanan"
		onclick={scrollToDashboard}
	>
		<span class="hero-scroll-label">Scroll to Explore</span>
		<span class="hero-scroll-arrow" aria-hidden="true">
			<svg
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
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
<section
	id="product-demo-loop"
	class="relative overflow-hidden bg-[#060a12] bg-cover bg-center py-14 sm:py-20 lg:py-24"
	style="background-image: url('/home/gradient-texture.png');"
>
	<div class="absolute inset-0 -z-10 bg-black/24"></div>
	<div
		class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(107,232,122,0.24),transparent_46%),radial-gradient(circle_at_86%_88%,rgba(73,141,214,0.22),transparent_44%)]"
	></div>

	<div class="page-shell">
		<div class="mx-auto max-w-3xl text-center text-white">
			<p
				class="text-xs font-semibold tracking-[0.12em] text-[#c8ffc6] uppercase"
			>
				Antrian Dokumen & Persetujuan
			</p>
			<h2 id="overview-section"
				class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.7rem]"
			>
				LAYANAN SIKOPLING 
			</h2>
		</div>

		<div
			class="demo-stage relative mx-auto mt-8 w-full max-w-[76rem] sm:mt-10 lg:mt-12"
		>
			<div
				class="demo-stage-glow absolute top-[18%] left-1/2 h-[24%] w-[84%] -translate-x-1/2 rounded-full bg-[rgba(88,192,103,0.44)]"
				aria-hidden="true"
			></div>
			<div
				class="demo-frame-ring pointer-events-none absolute inset-[2.8%] rounded-[1.7rem] border border-white/20"
				aria-hidden="true"
			></div>
			<div class="demo-browser-shell relative aspect-[1345/772] w-full">
				<div
					class="demo-browser-viewport absolute z-10 overflow-hidden"
				>
					<video
						class="demo-loop-video h-full w-full object-cover"
						autoplay
						muted
						loop
						playsinline
						preload="metadata"
					>
						<source src="/home/overview-layanan.webm" type="video/webm" />
						<source src="/home/overview-layanan.mp4" type="video/mp4" />
					</video>
				</div>

				<img
					src="/home/safari-big-sur-light-cutout-clean.png"
					alt="Frame browser Safari untuk menampilkan demo produk SIKOPLING"
					loading="lazy"
					decoding="async"
					class="demo-frame-overlay pointer-events-none absolute inset-0 z-20 h-full w-full select-none object-contain rounded-5"
				/>
			</div>
		</div>

		<div
			class="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-[0.72rem] font-semibold tracking-[0.08em] text-white/76 uppercase sm:text-xs"
		>
			<span
				class="rounded-full border border-white/24 bg-white/8 px-3 py-1.5"
				>Antrian Dokumen</span
			>
			<span
				class="rounded-full border border-white/24 bg-white/8 px-3 py-1.5"
				>Persetujuan Teknis</span
			>
			<span
				class="rounded-full border border-white/24 bg-white/8 px-3 py-1.5"
				>Universal Search</span
			>
			<span
				class="rounded-full border border-white/24 bg-white/8 px-3 py-1.5"
				>WhatsApp Assist</span
			>
		</div>
	</div>
</section>
<section class=" scroll-mt-28">
	<StackedCard />
</section>
<section
	id="layanan-dashboard"
	class="scroll-mt-28 bg-[var(--canvas)] py-12 sm:py-30"
>
	<div class="page-shell" bind:this={statSection}>
		<div class="mx-auto max-w-4xl text-center">
			<p
				class="text-xs font-semibold tracking-[0.12em] text-[var(--secondary)] uppercase"
			>
				Statistik Layanan
			</p>
			<h2
				class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl"
			>
				Capaian SIKOPLING Secara Ringkas
			</h2>
			<p
				class="mt-3 hidden sm:block text-base leading-relaxed text-[var(--muted)] sm:text-lg"
			>
				Metrik performa layanan konsultasi dan persetujuan lingkungan.
			</p>
		</div>

		<div
			class="-mx-2 mt-3 grid grid-cols-[minmax(0,1fr)_minmax(7.2rem,8.6rem)_minmax(0,1fr)] items-start gap-x-1 gap-y-1.5 sm:mx-0 sm:mt-6 sm:grid-cols-[minmax(0,1fr)_minmax(10rem,14rem)_minmax(0,1fr)] sm:gap-x-4 lg:grid-cols-[minmax(18rem,26rem)_minmax(26rem,34rem)_minmax(18rem,26rem)] lg:items-center lg:gap-x-2"
		>
			<div class="grid gap-1.5 sm:gap-3 lg:gap-6">
				{#each leftLeafStats as item, index}
					<article
						class="stat-leaf-card mx-auto grid w-full max-w-[12.8rem] bg-transparent text-center sm:max-w-[14rem] lg:max-w-[26rem]"
						class:stat-leaf-card-visible={isCounterStarted}
						style={`--stat-delay: ${index * 110}ms;`}
					>
						<div
							class="flex min-h-[2rem] items-end justify-center px-1 py-0 sm:min-h-[4.75rem] sm:px-2 lg:min-h-[5.5rem]"
						>
							<h3
								class="text-[0.82rem] leading-[1.12] font-semibold tracking-tight text-[var(--ink)] uppercase sm:text-base lg:text-2xl"
							>
								{item.label}
							</h3>
						</div>
						<div
							class="relative -mt-4 flex min-h-[4.6rem] items-center justify-center sm:-mt-1 lg:-mt-10 sm:min-h-[6.2rem] lg:min-h-[8.2rem]"
						>
							<img
								src="/layout/daun-kiri.svg"
								alt=""
								aria-hidden="true"
								class="h-[8.4rem] w-full max-w-[14.2rem] object-contain sm:h-[6.8rem] sm:max-w-[13.6rem] lg:h-[8.8rem] lg:max-w-[25rem]"
							/>
							<div
								class="absolute inset-0 flex items-center justify-center px-1 sm:px-2 lg:px-4"
							>
								<p
									class="font-hero-title text-[1rem] leading-none font-bold text-white sm:text-[1.85rem] lg:text-[3.2rem]"
								>
									{formatLeafStatValue(item)}
								</p>
							</div>
						</div>
						<div
							class="flex min-h-[0.9rem] items-start justify-center px-1 pt-0 pb-0 sm:min-h-[1.2rem]"
						>
							<p
								class="-mt-8 lg:-mt-20 text-[0.58rem] leading-tight font-semibold tracking-[0.06em] text-[var(--ink)] uppercase sm:text-[0.64rem] lg:text-sm"
							>
								{statLeafSubtitles[item.key]}
							</p>
						</div>
					</article>
				{/each}
			</div>

			<div
				class="pointer-events-none relative z-20 mx-auto flex w-full self-center items-center justify-center overflow-visible"
			>
				<div
					class="stat-tree-lottie aspect-square w-[clamp(12rem,58vw,20.5rem)] sm:w-[clamp(12rem,34vw,14rem)] lg:w-[clamp(20rem,28vw,34rem)]"
				>
					{#if DotLottieComponent}
						<DotLottieComponent
							src="/layout/tree.lottie"
							autoplay={false}
							dotLottieRefCallback={setDotLottieRef}
						/>
					{/if}
				</div>
			</div>

			<div class="grid gap-1.5 sm:gap-3 lg:gap-6">
				{#each rightLeafStats as item, index}
					<article
						class="stat-leaf-card mx-auto grid w-full max-w-[12.8rem] bg-transparent text-center sm:max-w-[14rem] lg:max-w-[26rem]"
						class:stat-leaf-card-visible={isCounterStarted}
						style={`--stat-delay: ${(index + leftLeafStats.length) * 110}ms;`}
					>
						<div
							class="flex min-h-[2rem] items-end justify-center px-1 py-0 sm:min-h-[4.75rem] sm:px-2 lg:min-h-[5.5rem]"
						>
							<h3
								class="text-[0.82rem] leading-[1.12] font-semibold tracking-tight text-[var(--ink)] uppercase sm:text-base lg:text-2xl"
							>
								{item.label}
							</h3>
						</div>
						<div
							class="relative -mt-4 flex min-h-[4.6rem] items-center justify-center sm:-mt-1 lg:-mt-10 sm:min-h-[6.2rem] lg:min-h-[8.2rem]"
						>
							<img
								src="/layout/daun-kanan.svg"
								alt=""
								aria-hidden="true"
								class="h-[8.4rem] w-full max-w-[14.2rem] object-contain sm:h-[6.8rem] sm:max-w-[13.6rem] lg:h-[8.8rem] lg:max-w-[25rem]"
							/>
							<div
								class="absolute inset-0 flex items-center justify-center px-1 sm:px-2 lg:px-4"
							>
								<p
									class="font-hero-title text-[1rem] leading-none font-bold text-white sm:text-[1.85rem] lg:text-[3.2rem]"
								>
									{formatLeafStatValue(item)}
								</p>
							</div>
						</div>
						<div
							class="flex min-h-[0.9rem] items-start justify-center px-1 pt-0 pb-0 sm:min-h-[1.2rem]"
						>
							<p
								class="-mt-8 lg:-mt-20 text-[0.58rem] leading-tight font-semibold tracking-[0.06em] text-[var(--ink)] uppercase sm:text-[0.64rem] lg:text-sm"
							>
								{statLeafSubtitles[item.key]}
							</p>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</div>
</section>

<section id="layanan-dokumen" class=" scroll-mt-28">
	<HorizontalScroll>
		{#snippet header()}
			<div class="pt-6 sm:pt-8">
				<div class="mx-auto max-w-5xl text-center">
					<p
							class="mt-1 text-xs font-semibold tracking-[0.12em] text-[#c8ffc6] uppercase"
					>
						Layanan Dokumen Lingkungan
					</p>
					<h2
						class="mt-2 sm:mt-6 text-[clamp(1rem,3vw,4rem)] font-semibold leading-tight tracking-tight text-white"
					>
						JENIS JENIS SIKOPLING
					</h2>
				</div>
			</div>
		{/snippet}
	</HorizontalScroll>
</section>

	<section
		id="alur-percepatan"
		class="scroll-mt-28 bg-(--canvas) py-6 sm:py-14">
		<div class="page-shell">
			<div
				class="mx-auto max-w-3xl rounded-2xl border border-[var(--line)] bg-white/65 p-5 text-center backdrop-blur-[1px] sm:p-6"
			>
				<p
					class="text-xs font-semibold tracking-[0.12em] text-[var(--secondary)] uppercase"
				>
					8 Langkah Percepatan
				</p>
				<h2
					class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl"
				>
					Alur Persetujuan Lingkungan
				</h2>
				<p
					class="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-lg"
				>
					Alur ini dirancang agar proses layanan lebih transparan,
					terukur, dan efisien bagi pemrakarsa.
				</p>
			</div>

		<ol class="mt-8 space-y-3.5 lg:hidden">
			{#each serviceSteps as step, index}
				<li
					class="rounded-2xl border border-[var(--line)] bg-white p-4 sm:p-5"
				>
					<span
						class="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#43b556] text-lg font-bold text-white"
					>
						{index + 1}
					</span>
					<h3
						class="mt-2.5 text-lg font-semibold tracking-tight text-[var(--ink)]"
					>
						{step.title}
					</h3>
					<p
						class="mt-1.5 text-sm leading-relaxed text-[var(--muted)] sm:text-base"
					>
						{step.description}
					</p>
				</li>
			{/each}
		</ol>

		<div class="relative mt-12 hidden lg:block">
			<div
				class="relative mx-auto aspect-[1343/1954] max-w-[68rem] overflow-visible"
			>
				<img
					src="/layout/line-number.svg"
					alt=""
					aria-hidden="true"
					class="absolute inset-0 h-full w-full object-contain"
				/>
				<img
					src="/layout/daun-line.svg"
					alt=""
					aria-hidden="true"
					class="absolute top-[-5%] right-[14%] w-[7.5rem] rotate-[60deg] opacity-95"
				/>
				<img
					src="/layout/daun-line.svg"
					alt=""
					aria-hidden="true"
					class="absolute top-[42%] right-[-9%] w-[10rem] -scale-x-100 rotate-[8deg] opacity-95"
				/>
				<img
					src="/layout/daun-line.svg"
					alt=""
					aria-hidden="true"
					class="absolute top-[57%] left-[-11%] w-[11.9rem] rotate-[26deg] opacity-95"
				/>
				<img
					src="/layout/daun-line.svg"
					alt=""
					aria-hidden="true"
					class="absolute right-[7%] bottom-[0%] w-[12.8rem] rotate-[278deg] opacity-95"
				/>
				<ol class="absolute inset-0">
					{#each desktopFlowSteps as step}
						<li
							class="absolute mt-2 w-[clamp(12rem,18vw,17rem)] -translate-x-1/2"
							style={`left:${step.left}; top:${step.top};`}
						>
							<h3
								class="text-[2rem] leading-none font-semibold tracking-tight text-[var(--ink)]"
							>
								{step.title}
							</h3>
							<p
								class="mt-2 text-[1rem] leading-snug text-[#2f3137]"
							>
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
		<div
			class="grid gap-8 lg:grid-cols-[minmax(16rem,0.78fr)_minmax(0,1fr)] lg:gap-14 xl:gap-16"
		>
			<div class="max-w-xl lg:pt-2 sm:text-center md:text-left">
				<div
					class="mb-4 flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-[var(--secondary)] md:justify-start"
				>
					<span
						class="inline-flex h-8 items-center rounded-full bg-[var(--secondary-soft)] px-3"
					>
						FAQ SIKOPLING
					</span>
					<span class="hidden h-px w-10 bg-[var(--secondary)] sm:block" aria-hidden="true"></span>
					<span>{homeFaqItems.length} pertanyaan populer</span>
				</div>
				<h2
					class="max-w-md text-3xl leading-tight font-semibold tracking-tight text-[var(--ink)] sm:text-4xl"
				>
					Pertanyaan yang Sering Diajukan
				</h2>
				<p class="mt-4 max-w-sm text-base leading-relaxed text-[var(--muted)]">
					FAQ untuk pertanyaan paling umum seputar layanan,
					proses konsultasi, dan pemantauan dokumen.
				</p>
			</div>

			<div class="w-full max-w-[58rem] justify-self-end">
				<div class="space-y-3 sm:space-y-3.5">
					{#each homeFaqItems as item}
						<article
							class={`overflow-hidden rounded-2xl border transition-all duration-300 ${
								activeHomeFaqId === item.id
									? "border-[var(--secondary)] bg-[var(--secondary-soft)] shadow-[0_16px_38px_rgba(62,177,74,0.12)]"
									: "border-[#e0e5ed] bg-white shadow-[0_1px_0_rgba(16,24,40,0.02)] hover:border-[var(--secondary)] hover:bg-[var(--secondary-soft)] hover:shadow-[0_10px_26px_rgba(62,177,74,0.08)]"
							}`}
						>
							<h3>
								<button
									type="button"
									class="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)] focus-visible:ring-inset sm:px-6 sm:py-5"
									onclick={() => toggleHomeFaq(item.id)}
									aria-expanded={activeHomeFaqId === item.id}
									aria-controls={`${item.id}-answer`}
								>
									<span
										class="max-w-[44rem] text-[1rem] leading-snug font-semibold tracking-tight text-[var(--ink)] sm:text-[1.08rem]"
									>
										{item.question}
									</span>
									<span
										class={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
											activeHomeFaqId === item.id
												? "rotate-45 border-[var(--secondary)] bg-[var(--secondary)] text-white shadow-sm"
												: "border-[#d8dde5] bg-white text-[var(--secondary)]"
										}`}
										aria-hidden="true"
									>
										<Plus class="h-5 w-5" strokeWidth={2.3} />
									</span>
								</button>
							</h3>
							{#if activeHomeFaqId === item.id}
								<div
									id={`${item.id}-answer`}
									class="border-t border-[var(--secondary)]/20 px-5 pt-3.5 pb-5 text-sm leading-relaxed text-[var(--muted)] sm:px-6 sm:pt-4 sm:pb-6 sm:text-base"
									transition:slide={{ duration: 220, easing: cubicOut }}
								>
									{item.answer}
								</div>
							{/if}
						</article>
					{/each}
				</div>
				<div class="mt-5 flex justify-start sm:justify-end">
					<a
						href="/kontak"
						class="group inline-flex items-center gap-2 rounded-full border border-[var(--secondary)] px-4 py-2 text-sm font-semibold text-[var(--secondary)] transition-colors hover:bg-[var(--secondary-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--secondary)]"
					>
						Lihat selengkapnya
						<ArrowRight
							class="h-4 w-4 transition-transform group-hover:translate-x-0.5"
							strokeWidth={2.2}
							aria-hidden="true"
						/>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.hero-parallax {
		background-color: #000;
	}

	.hero-media {
		pointer-events: none;
	}

	.hero-media-video {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}

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

	.demo-stage {
		isolation: isolate;
	}

	.demo-stage-glow {
		filter: blur(72px);
		animation: demo-glow-pulse 7.2s ease-in-out infinite;
	}

	.demo-loop-video {
		transform-origin: center top;
		transform: translateZ(0) scale(1.075);
	}

	.demo-browser-shell {
		will-change: transform;
		animation: demo-frame-float 8.6s ease-in-out infinite;
	}

	.demo-browser-viewport {
		inset: 11.49% 3.79% 7.94% 3.79%;
		border-radius: 0.4rem;
		background: #f4f5f7;
	}

	.demo-frame-overlay {
		will-change: transform;
	}

	@keyframes demo-glow-pulse {
		0%,
		100% {
			opacity: 0.5;
			transform: translateX(-50%) scale(0.95);
		}
		50% {
			opacity: 0.88;
			transform: translateX(-50%) scale(1.03);
		}
	}

	@keyframes demo-frame-float {
		0%,
		100% {
			transform: translate3d(0, 0, 0);
		}
		50% {
			transform: translate3d(0, -5px, 0);
		}
	}

	@keyframes stat-leaf-reveal {
		0% {
			opacity: 0;
			transform: translate3d(0, 22px, 0) scale(0.97);
			filter: blur(8px);
		}
		100% {
			opacity: 1;
			transform: translate3d(0, 0, 0) scale(1);
			filter: blur(0);
		}
	}

	@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
		.stat-leaf-card {
			opacity: 0;
			transform: translate3d(0, 22px, 0) scale(0.97);
			filter: blur(8px);
			will-change: transform, opacity, filter;
		}

		.stat-leaf-card-visible {
			animation: stat-leaf-reveal 720ms cubic-bezier(0.22, 1, 0.36, 1)
				var(--stat-delay, 0ms) both;
		}
	}

	@media (max-width: 640px) {
		.demo-stage-glow {
			filter: blur(48px);
		}

		.demo-browser-viewport {
			inset: 11.49% 3.79% 7.94% 3.79%;
			border-radius: 0.25rem;
		}

		.demo-loop-video {
			transform: translateZ(0) scale(1.065);
		}
	}

	@media (min-width: 1024px) and (prefers-reduced-motion: no-preference) {
		.hero-parallax {
			clip-path: inset(0);
		}

		.hero-parallax .hero-media {
			position: fixed;
			inset: 0;
		}

		.hero-parallax .hero-parallax-copy {
			position: fixed;
			inset: 0;
			pointer-events: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.demo-stage-glow,
		.demo-browser-shell {
			animation: none;
		}
	}
</style>
