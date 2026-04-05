<script lang="ts">
	type HomeFaqItem = {
		id: string;
		question: string;
		answer: string;
	};

	type HomeDocumentItem = {
		id: string;
		title: string;
		description: string;
		mascot: string;
		mascotScale?: number;
	};

	const homeDocumentItems: HomeDocumentItem[] = [
		{
			id: 'doc-amdal',
			title: 'AMDAL',
			description:
				'Kajian lingkungan untuk rencana usaha atau kegiatan yang berpotensi menimbulkan dampak penting terhadap lingkungan.',
			mascot: '/documents/amdal.svg',
			mascotScale: 0.88
		},
		{
			id: 'doc-addendum',
			title: 'Addendum',
			description:
				'Perubahan atau penyempurnaan dokumen AMDAL akibat adanya penyesuaian pada rencana usaha atau kegiatan.',
			mascot: '/documents/addendum.svg',
			mascotScale: 1
		},
		{
			id: 'doc-ukl-upl',
			title: 'UKL-UPL',
			description:
				'Dokumen pengelolaan dan pemantauan lingkungan untuk kegiatan yang tidak wajib AMDAL namun tetap berdampak pada lingkungan.',
			mascot: '/documents/ukl.svg',
			mascotScale: 1
		},
		{
			id: 'doc-delh-dplh',
			title: 'DELH / DPLH',
			description:
				'Dokumen evaluasi lingkungan untuk kegiatan yang sudah berjalan dan digunakan sebagai dasar penyesuaian kewajiban lingkungan.',
			mascot: '/documents/delh.svg',
			mascotScale: 1
		},
		{
			id: 'doc-pertek',
			title: 'Pertek',
			description:
				'Persetujuan teknis yang mengatur pemenuhan standar teknis pengelolaan lingkungan sesuai jenis kegiatan.',
			mascot: '/documents/pertek.svg',
			mascotScale: 1
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

	const HOME_DOCUMENT_SWIPE_THRESHOLD = 46;

	let activeHomeDocumentIndex = $state(0);
	let activeHomeFaqId = $state<string | null>(null);
	let homeDocumentSlideDirection = $state<'next' | 'prev'>('next');
	let homeDocumentTouchStartX = $state<number | null>(null);
	let homeDocumentTouchStartY = $state<number | null>(null);

	const activeHomeDocument = $derived(homeDocumentItems[activeHomeDocumentIndex]);

	const showPrevHomeDocument = () => {
		homeDocumentSlideDirection = 'prev';
		activeHomeDocumentIndex =
			(activeHomeDocumentIndex - 1 + homeDocumentItems.length) % homeDocumentItems.length;
	};

	const showNextHomeDocument = () => {
		homeDocumentSlideDirection = 'next';
		activeHomeDocumentIndex = (activeHomeDocumentIndex + 1) % homeDocumentItems.length;
	};

	const setActiveHomeDocument = (index: number) => {
		if (index === activeHomeDocumentIndex) return;
		homeDocumentSlideDirection = index > activeHomeDocumentIndex ? 'next' : 'prev';
		activeHomeDocumentIndex = index;
	};

	const handleHomeDocumentTouchStart = (event: TouchEvent) => {
		const touch = event.changedTouches[0];
		if (!touch) return;
		homeDocumentTouchStartX = touch.clientX;
		homeDocumentTouchStartY = touch.clientY;
	};

	const handleHomeDocumentTouchEnd = (event: TouchEvent) => {
		if (homeDocumentTouchStartX === null || homeDocumentTouchStartY === null) return;

		const touch = event.changedTouches[0];
		if (!touch) return;

		const deltaX = touch.clientX - homeDocumentTouchStartX;
		const deltaY = touch.clientY - homeDocumentTouchStartY;
		const horizontalDistance = Math.abs(deltaX);
		const verticalDistance = Math.abs(deltaY);

		if (horizontalDistance >= HOME_DOCUMENT_SWIPE_THRESHOLD && horizontalDistance > verticalDistance) {
			if (deltaX < 0) {
				showNextHomeDocument();
			} else {
				showPrevHomeDocument();
			}
		}

		homeDocumentTouchStartX = null;
		homeDocumentTouchStartY = null;
	};

	const toggleHomeFaq = (id: string) => {
		activeHomeFaqId = activeHomeFaqId === id ? null : id;
	};

	$effect(() => {
		for (const item of homeDocumentItems) {
			const image = new Image();
			image.src = item.mascot;
			image.decoding = 'async';
			image.decode().catch(() => {
				/* ignore decode errors; browser cache preload is still useful */
			});
		}
	});
</script>

<section
	id="beranda"
	class="relative isolate h-[100svh] min-h-[100svh] overflow-hidden rounded-none"
>
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
	<div class="absolute inset-0 bg-black/15" aria-hidden="true"></div>
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
	<div class="hero-scroll-indicator" aria-hidden="true">
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
	</div>
</section>

<section id="jenis-dokumen" class="scroll-mt-28 bg-white py-16 sm:py-20">
	<div class="nav-shell nav-shell-desktop-spacious">
		<div class="mx-auto max-w-5xl">
			<div class="mx-auto max-w-3xl text-center">
				<h2
					class="text-3xl font-semibold tracking-tight text-[#15243f] sm:text-4xl lg:text-[2.9rem]"
				>
					Jenis Dokumen
					<span class="block">yang Dapat Diproses</span>
				</h2>
				<p class="mx-auto mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-[#4b5b74] sm:text-[1.12rem]">
					Telusuri jenis dokumen yang dapat diproses melalui layanan SIKOPLING dan pahami fungsi
					utamanya secara ringkas.
				</p>
			</div>

			<div class="sr-only" aria-hidden="true">
				{#each homeDocumentItems as item}
					<img src={item.mascot} alt="" loading="eager" decoding="async" />
				{/each}
			</div>

			<div class="mt-10 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-3">
				<button
					type="button"
					class="hidden h-11 w-11 items-center justify-center rounded-full bg-[#64AD31] text-white transition-transform duration-200 hover:-translate-x-0.5 hover:bg-[#56972a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64AD31] focus-visible:ring-offset-2 lg:inline-flex"
					onclick={showPrevHomeDocument}
					aria-label="Tampilkan jenis dokumen sebelumnya"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						aria-hidden="true"
					>
						<path
							d="M14.5 6.5L9 12L14.5 17.5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>

				<div class="home-document-card-wrap relative mx-auto w-full max-w-4xl">
					{#key activeHomeDocument.id}
						<article
							class={`animate-document-swap mx-auto grid w-full gap-6 overflow-hidden rounded-[2rem] border border-[#e2e8f0] bg-white p-6 shadow-[0_20px_50px_rgba(20,36,63,0.1)] sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center lg:gap-10 ${
								homeDocumentSlideDirection === 'next'
									? 'home-document-slide-next'
									: 'home-document-slide-prev'
							}`}
							ontouchstart={handleHomeDocumentTouchStart}
							ontouchend={handleHomeDocumentTouchEnd}
						>
							<div
								class={`order-2 space-y-4 ${
									activeHomeDocumentIndex % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
								}`}
							>
								<p class="text-xs font-semibold tracking-[0.2em] text-[#5f7343] uppercase">
									Dokumen {activeHomeDocumentIndex + 1}/{homeDocumentItems.length}
								</p>
								<h3 class="text-4xl font-bold tracking-tight text-[#111b2d] sm:text-[2.85rem]">
									{activeHomeDocument.title}
								</h3>
								<p class="max-w-xl text-lg leading-relaxed text-[#2a344a] sm:text-xl">
									{activeHomeDocument.description}
								</p>
							</div>

							<div
								class={`home-document-mascot order-1 flex min-h-[16rem] items-center justify-center lg:min-h-[19rem] ${
									activeHomeDocumentIndex % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
								}`}
							>
								<img
									src={activeHomeDocument.mascot}
									alt={`Maskot dokumen ${activeHomeDocument.title}`}
									class="h-auto max-h-[18.5rem] w-auto max-w-[100%] object-contain sm:max-h-[21rem] lg:max-h-[22.5rem]"
									loading="eager"
									decoding="async"
									style={`transform: scale(${activeHomeDocument.mascotScale ?? 1}); transform-origin: center bottom;`}
								/>
							</div>
						</article>
					{/key}

					<button
						type="button"
						class="home-document-mobile-arrow home-document-mobile-arrow-left absolute top-1/2 -left-2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#64AD31] text-white shadow-[0_10px_24px_rgba(30,90,10,0.28)] transition-transform duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64AD31] focus-visible:ring-offset-2 lg:hidden"
						onclick={showPrevHomeDocument}
						aria-label="Tampilkan jenis dokumen sebelumnya"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							aria-hidden="true"
						>
							<path
								d="M14.5 6.5L9 12L14.5 17.5"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>

					<button
						type="button"
						class="home-document-mobile-arrow home-document-mobile-arrow-right absolute top-1/2 -right-2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#64AD31] text-white shadow-[0_10px_24px_rgba(30,90,10,0.28)] transition-transform duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64AD31] focus-visible:ring-offset-2 lg:hidden"
						onclick={showNextHomeDocument}
						aria-label="Tampilkan jenis dokumen berikutnya"
					>
						<svg
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							aria-hidden="true"
						>
							<path
								d="M9.5 6.5L15 12L9.5 17.5"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				</div>

				<button
					type="button"
					class="hidden h-11 w-11 items-center justify-center rounded-full bg-[#64AD31] text-white transition-transform duration-200 hover:translate-x-0.5 hover:bg-[#56972a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64AD31] focus-visible:ring-offset-2 lg:inline-flex"
					onclick={showNextHomeDocument}
					aria-label="Tampilkan jenis dokumen berikutnya"
				>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						aria-hidden="true"
					>
						<path
							d="M9.5 6.5L15 12L9.5 17.5"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
			</div>

			<div class="mt-5 flex items-center justify-center gap-3 lg:hidden">
				<div class="flex items-center justify-center gap-2.5">
					{#each homeDocumentItems as item, index}
						<button
							type="button"
							class={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
								index === activeHomeDocumentIndex
									? 'w-6 bg-[#64AD31]'
									: 'bg-[#ccd9c1] hover:bg-[#b8caa8]'
							}`}
							onclick={() => setActiveHomeDocument(index)}
							aria-label={`Tampilkan dokumen ${item.title}`}
							aria-current={index === activeHomeDocumentIndex ? 'true' : undefined}
						></button>
					{/each}
				</div>
			</div>

			<div class="mt-6 hidden items-center justify-center gap-2.5 sm:mt-7 lg:flex">
				{#each homeDocumentItems as item, index}
					<button
						type="button"
						class={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
							index === activeHomeDocumentIndex
								? 'w-6 bg-[#64AD31]'
								: 'bg-[#ccd9c1] hover:bg-[#b8caa8]'
						}`}
						onclick={() => setActiveHomeDocument(index)}
						aria-label={`Tampilkan dokumen ${item.title}`}
						aria-current={index === activeHomeDocumentIndex ? 'true' : undefined}
					></button>
				{/each}
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

