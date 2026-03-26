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
		class="absolute inset-0 h-full w-full object-cover sm:hidden"
		autoplay
		muted
		loop
		playsinline
		preload="metadata"
	>
		<source src="/hero-mobile.mp4" type="video/mp4" />
	</video>

	<video
		class="absolute inset-0 hidden h-full w-full object-cover sm:block"
		autoplay
		muted
		loop
		playsinline
		preload="metadata"
	>
		<source src="/hero-desktop.webm" type="video/webm" />
	</video>

	<div class="relative z-10 flex min-h-[100svh] items-center justify-center px-6 text-center sm:px-10">
    <div class="mx-auto max-w-5xl">
        
        <span class="flex justify-center text-white drop-shadow-[0_10px_26px_rgba(2,6,23,0.52)]">
		<svg width="533" height="116" viewBox="0 0 533 116" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_73_788)">
<path d="M125.946 35.75V104H110.664V35.75H125.946ZM166.727 35.75L140.008 69.875L124.446 86.75L121.68 72.5469L131.946 57.8281L147.977 35.75H166.727ZM149.008 104L130.164 72.8281L141.789 63.7812L167.102 104H149.008ZM230.169 68.375V71.4219C230.169 76.6094 229.451 81.2656 228.013 85.3906C226.607 89.5156 224.591 93.0312 221.966 95.9375C219.372 98.8438 216.279 101.078 212.685 102.641C209.122 104.172 205.169 104.938 200.826 104.938C196.482 104.938 192.513 104.172 188.919 102.641C185.326 101.078 182.201 98.8438 179.544 95.9375C176.919 93.0312 174.888 89.5156 173.451 85.3906C172.013 81.2656 171.294 76.6094 171.294 71.4219V68.375C171.294 63.1875 172.013 58.5312 173.451 54.4062C174.888 50.25 176.904 46.7188 179.497 43.8125C182.122 40.9062 185.232 38.6875 188.826 37.1562C192.419 35.5938 196.388 34.8125 200.732 34.8125C205.076 34.8125 209.044 35.5938 212.638 37.1562C216.232 38.6875 219.326 40.9062 221.919 43.8125C224.544 46.7188 226.576 50.25 228.013 54.4062C229.451 58.5312 230.169 63.1875 230.169 68.375ZM214.747 71.4219V68.2812C214.747 64.8125 214.435 61.75 213.81 59.0938C213.185 56.4062 212.279 54.1562 211.091 52.3438C209.904 50.5312 208.435 49.1719 206.685 48.2656C204.935 47.3281 202.951 46.8594 200.732 46.8594C198.419 46.8594 196.404 47.3281 194.685 48.2656C192.966 49.1719 191.513 50.5312 190.326 52.3438C189.169 54.1562 188.279 56.4062 187.654 59.0938C187.06 61.75 186.763 64.8125 186.763 68.2812V71.4219C186.763 74.8594 187.06 77.9219 187.654 80.6094C188.279 83.2656 189.185 85.5156 190.372 87.3594C191.56 89.2031 193.013 90.5938 194.732 91.5312C196.482 92.4688 198.513 92.9375 200.826 92.9375C203.044 92.9375 205.013 92.4688 206.732 91.5312C208.482 90.5938 209.951 89.2031 211.138 87.3594C212.326 85.5156 213.216 83.2656 213.81 80.6094C214.435 77.9219 214.747 74.8594 214.747 71.4219ZM269.331 80.2812H252.174V68.4219H269.331C271.862 68.4219 273.893 68 275.424 67.1562C276.987 66.3125 278.128 65.1562 278.846 63.6875C279.596 62.1875 279.971 60.5 279.971 58.625C279.971 56.6875 279.596 54.8906 278.846 53.2344C278.128 51.5469 276.987 50.1875 275.424 49.1562C273.893 48.125 271.862 47.6094 269.331 47.6094H257.706V104H242.424V35.75H269.331C274.768 35.75 279.424 36.7344 283.299 38.7031C287.206 40.6719 290.19 43.375 292.253 46.8125C294.346 50.2188 295.393 54.125 295.393 58.5312C295.393 62.9375 294.346 66.7656 292.253 70.0156C290.19 73.2656 287.206 75.7969 283.299 77.6094C279.424 79.3906 274.768 80.2812 269.331 80.2812ZM352.086 92.1875V104H317.633V92.1875H352.086ZM322.836 35.75V104H307.554V35.75H322.836Z" fill="white"/>
<path d="M447.966 35.75V104H432.732L406.951 59.8906V104H391.669V35.75H406.951L432.779 79.8594V35.75H447.966ZM517.128 67.9531V95.4688C516.003 96.75 514.284 98.125 511.971 99.5938C509.69 101.062 506.768 102.328 503.206 103.391C499.643 104.422 495.393 104.938 490.456 104.938C485.987 104.938 481.924 104.219 478.268 102.781C474.612 101.312 471.471 99.1719 468.846 96.3594C466.221 93.5156 464.19 90.0469 462.753 85.9531C461.346 81.8594 460.643 77.1719 460.643 71.8906V67.8594C460.643 62.5781 461.346 57.8906 462.753 53.7969C464.159 49.7031 466.143 46.25 468.706 43.4375C471.268 40.5938 474.315 38.4375 477.846 36.9688C481.378 35.5 485.284 34.7656 489.565 34.7656C495.659 34.7656 500.643 35.75 504.518 37.7188C508.393 39.6562 511.331 42.3438 513.331 45.7812C515.362 49.2188 516.612 53.1719 517.081 57.6406H502.362C502.049 55.3594 501.424 53.3906 500.487 51.7344C499.581 50.0781 498.284 48.8125 496.596 47.9375C494.909 47.0312 492.721 46.5781 490.034 46.5781C487.878 46.5781 485.924 47.0312 484.174 47.9375C482.456 48.8125 481.003 50.1406 479.815 51.9219C478.628 53.7031 477.721 55.9219 477.096 58.5781C476.471 61.2031 476.159 64.2656 476.159 67.7656V71.8906C476.159 75.3906 476.471 78.4688 477.096 81.125C477.753 83.7812 478.706 86 479.956 87.7812C481.206 89.5312 482.784 90.8594 484.69 91.7656C486.628 92.6719 488.878 93.125 491.44 93.125C493.44 93.125 495.128 92.9688 496.503 92.6562C497.878 92.3125 499.003 91.8906 499.878 91.3906C500.753 90.8594 501.409 90.375 501.846 89.9375V78.5938H489.706V67.9531H517.128Z" fill="white"/>
<path d="M40.7031 86C40.7031 84.8438 40.5312 83.8125 40.1875 82.9062C39.8438 81.9688 39.2188 81.1094 38.3125 80.3281C37.4062 79.5469 36.125 78.7656 34.4688 77.9844C32.8125 77.1719 30.6406 76.3438 27.9531 75.5C24.8906 74.5 21.9688 73.375 19.1875 72.125C16.4375 70.8438 13.9844 69.3594 11.8281 67.6719C9.67188 65.9844 7.96875 64.0156 6.71875 61.7656C5.5 59.5156 4.89062 56.8906 4.89062 53.8906C4.89062 50.9844 5.53125 48.3594 6.8125 46.0156C8.09375 43.6719 9.89062 41.6719 12.2031 40.0156C14.5156 38.3281 17.2344 37.0469 20.3594 36.1719C23.4844 35.2656 26.9219 34.8125 30.6719 34.8125C35.6719 34.8125 40.0625 35.7031 43.8438 37.4844C47.6562 39.2344 50.625 41.7031 52.75 44.8906C54.875 48.0469 55.9375 51.7188 55.9375 55.9062H40.75C40.75 54.0625 40.3594 52.4375 39.5781 51.0312C38.8281 49.5938 37.6719 48.4688 36.1094 47.6562C34.5781 46.8438 32.6562 46.4375 30.3438 46.4375C28.0938 46.4375 26.2031 46.7812 24.6719 47.4688C23.1719 48.125 22.0312 49.0312 21.25 50.1875C20.5 51.3438 20.125 52.6094 20.125 53.9844C20.125 55.0781 20.4062 56.0781 20.9688 56.9844C21.5625 57.8594 22.4062 58.6875 23.5 59.4688C24.625 60.2188 26 60.9375 27.625 61.625C29.25 62.3125 31.1094 62.9688 33.2031 63.5938C36.8594 64.75 40.0938 66.0312 42.9062 67.4375C45.75 68.8438 48.1406 70.4375 50.0781 72.2188C52.0156 74 53.4688 76.0156 54.4375 78.2656C55.4375 80.5156 55.9375 83.0625 55.9375 85.9062C55.9375 88.9375 55.3438 91.625 54.1562 93.9688C53 96.3125 51.3125 98.3125 49.0938 99.9688C46.9062 101.594 44.2812 102.828 41.2188 103.672C38.1562 104.516 34.7344 104.938 30.9531 104.938C27.5156 104.938 24.125 104.5 20.7812 103.625C17.4375 102.719 14.4062 101.344 11.6875 99.5C9 97.6562 6.84375 95.3125 5.21875 92.4688C3.625 89.5938 2.82812 86.1875 2.82812 82.25H18.1094C18.1094 84.3125 18.4062 86.0625 19 87.5C19.5938 88.9062 20.4375 90.0469 21.5312 90.9219C22.6562 91.7969 24.0156 92.4219 25.6094 92.7969C27.2031 93.1719 28.9844 93.3594 30.9531 93.3594C33.2344 93.3594 35.0781 93.0469 36.4844 92.4219C37.9219 91.7656 38.9844 90.875 39.6719 89.75C40.3594 88.625 40.7031 87.375 40.7031 86Z" fill="white"/>
<line x1="82.9111" y1="36" x2="82.9111" y2="104" stroke="white" stroke-width="16"/>
<path d="M81.7554 13L97.3823 40H66.1284L81.7554 13Z" fill="#32C51C"/>
<path d="M82.3777 24L103.932 60H60.8232L82.3777 24Z" fill="#32C51C"/>
<path d="M83 45L107.249 85.5H58.7513L83 45Z" fill="#32C51C"/>
<path d="M227.632 100.988C230.012 101.824 231.165 102.756 230.981 103.695C230.797 104.634 229.281 105.549 226.579 106.352C223.877 107.156 220.078 107.821 215.545 108.284C211.012 108.748 205.896 108.994 200.685 109C195.474 109.006 190.342 108.77 185.779 108.317C181.215 107.863 177.371 107.206 174.615 106.409C171.859 105.612 170.282 104.7 170.034 103.761C169.787 102.823 170.877 101.888 173.201 101.047L186.253 102.22C185.04 102.659 184.471 103.147 184.6 103.636C184.729 104.126 185.552 104.602 186.991 105.018C188.429 105.434 190.435 105.777 192.817 106.014C195.199 106.251 197.877 106.373 200.597 106.37C203.316 106.367 205.986 106.239 208.352 105.997C210.718 105.755 212.7 105.408 214.11 104.989C215.521 104.569 216.312 104.092 216.408 103.602C216.504 103.111 215.902 102.625 214.66 102.189L227.632 100.988Z" fill="#32C51C"/>
<path d="M488.563 52.2125C487.107 51.1452 485.052 51.8416 485.005 53.6457C484.997 53.9281 484.999 54.2115 485.009 54.495C485.065 56.0304 485.383 57.5184 485.932 58.8173C486.481 60.1161 487.242 61.1825 488.143 61.9145C489.045 62.6466 490.056 63.02 491.081 62.9992C492.106 62.9783 493.111 62.5639 493.999 61.7954C494.887 61.0269 495.628 59.93 496.153 58.6093C496.678 57.2886 496.969 55.7881 496.998 54.251C497.002 53.9961 497 53.7416 496.99 53.4881C496.921 51.6588 494.819 51.0039 493.379 52.1339L492.462 52.8528C492.113 53.127 491.999 53.5973 491.99 54.0415V54.0415C491.986 54.2953 491.938 54.5431 491.851 54.7612C491.764 54.9793 491.642 55.1604 491.495 55.2873C491.349 55.4142 491.183 55.4826 491.013 55.4861C490.844 55.4895 490.677 55.4279 490.528 55.307C490.379 55.1861 490.254 55.01 490.163 54.7955C490.072 54.581 490.02 54.3353 490.011 54.0817V54.0817C489.994 53.6375 489.868 53.1695 489.509 52.9066L488.563 52.2125Z" fill="#32C51C"/>
<line x1="371" y1="51" x2="371" y2="104" stroke="white" stroke-width="16"/>
<path d="M368.59 26.5201C369.116 24.3548 372.202 24.3548 372.728 26.5201V26.5201C373.062 27.8973 374.633 28.5651 375.853 27.845L376.242 27.6159C378.083 26.5296 380.116 28.6984 378.925 30.474V30.474C378.137 31.6485 378.783 33.2501 380.166 33.5455V33.5455C382.274 33.9959 382.274 37.0051 380.166 37.4555V37.4555C378.783 37.7509 378.137 39.3525 378.925 40.527V40.527C380.116 42.3026 378.083 44.4714 376.242 43.3851L375.853 43.156C374.633 42.4359 373.062 43.1036 372.728 44.4808V44.4808C372.202 46.6461 369.116 46.6461 368.59 44.4808V44.4808C368.256 43.1036 366.685 42.4359 365.464 43.156L365.076 43.3851C363.235 44.4714 361.202 42.3026 362.393 40.527V40.527C363.181 39.3525 362.535 37.7509 361.152 37.4555V37.4555C359.044 37.0051 359.044 33.9959 361.152 33.5455V33.5455C362.535 33.2501 363.181 31.6485 362.393 30.474V30.474C361.202 28.6984 363.235 26.5296 365.076 27.6159L365.464 27.845C366.685 28.5651 368.256 27.8973 368.59 26.5201V26.5201Z" fill="#32C51C"/>
<ellipse cx="370.981" cy="35.5005" rx="4.82559" ry="4.44928" fill="white"/>
</g>
<defs>
<clipPath id="clip0_73_788">
<rect width="533" height="116" fill="white"/>
</clipPath>
</defs>
</svg>
</span>

        <p class="font-hero-copy mt-4 text-[clamp(1rem,2.1vw,1.55rem)] leading-relaxed font-medium text-white/95 drop-shadow-[0_8px_22px_rgba(2,6,23,0.45)] sm:mt-5">
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
