<script module lang="ts">
	let hasMapSessionLoaded = false;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import Clock3 from 'lucide-svelte/icons/clock-3';
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import MessageCircleMore from 'lucide-svelte/icons/message-circle-more';
	import PhoneCall from 'lucide-svelte/icons/phone-call';

	type ContactChannel = {
		id: string;
		name: string;
		value: string;
		description: string;
		href?: string;
		cta?: string;
	};

	type FaqItem = {
		id: string;
		question: string;
		answer: string;
	};

	const officeAddress =
		'Jl Bangun Praja Kawasan Perkantoran Pemerintah Provinsi Kalimantan Selatan, Palam, Kec. Cemp., Kota Banjar Baru, Kalimantan Selatan 70732';

	const mapsPlaceQuery =
		'Dinas Lingkungan Hidup Provinsi Kalimantan Selatan, Jl Bangun Praja, Banjarbaru';

	const mapsSearchUrl =
		'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(mapsPlaceQuery);

	const mapsEmbedUrl =
		'https://maps.google.com/maps?q=' +
		encodeURIComponent(mapsPlaceQuery) +
		'&t=&z=17&ie=UTF8&iwloc=B&output=embed';

	const contactChannels: ContactChannel[] = [
		{
			id: 'chatbot',
			name: 'Chatbot SIKOPLING',
			value: '+62 821-1831-4634',
			description:
				'Titik awal konsultasi untuk informasi layanan, alur dokumen, dan arahan kebutuhan administrasi.',
			href: 'https://wa.me/6282118314634',
			cta: 'Mulai Chat'
		},
		{
			id: 'cs',
			name: 'Customer Service SIKOPLING',
			value: '+62 882-0227-95669',
			description:
				'Pendampingan lanjutan saat Anda membutuhkan klarifikasi teknis atau bantuan proses yang lebih spesifik.',
			href: 'https://wa.me/62882022795669',
			cta: 'Hubungi CS'
		},
		{
			id: 'operasional',
			name: 'Jam Operasional',
			value: 'Senin s.d Jumat, 09.00 - 15.00 WITA',
			description: 'Layanan aktif pada hari kerja di luar hari libur nasional dan cuti bersama.'
		}
	];

	const faqItems: FaqItem[] = [
		{
			id: 'faq-01',
			question: 'Apa itu SIKOPLING?',
			answer:
				'SIKOPLING adalah Saluran Interaktif Konsultasi Persetujuan Lingkungan yang membantu pemrakarsa mendapatkan informasi, arahan, dan pendampingan proses persetujuan lingkungan.'
		},
		{
			id: 'faq-02',
			question: 'Layanan dokumen apa saja yang bisa dikonsultasikan?',
			answer:
				'Layanan mencakup AMDAL, UKL-UPL, DELH/DPLH, addendum dokumen lingkungan, serta persetujuan teknis limbah B3, air limbah, dan emisi udara sesuai kewenangan.'
		},
		{
			id: 'faq-03',
			question: 'Apakah konsultasi dilakukan tatap muka?',
			answer:
				'Pendekatan SIKOPLING mengutamakan konsultasi daring agar lebih efisien, terdokumentasi, dan mudah diakses dari berbagai lokasi.'
		},
		{
			id: 'faq-04',
			question: 'Berapa estimasi waktu proses setelah administrasi lengkap?',
			answer:
				'AMDAL/DELH diproses sekitar 10 hari kerja, sedangkan UKL-UPL/DPLH sekitar 5 hari kerja, menyesuaikan kebutuhan pembahasan teknis.'
		},
		{
			id: 'faq-05',
			question: 'Bagaimana cara memantau progres dokumen?',
			answer:
				'Pemrakarsa mendapatkan akses pemantauan progres dokumen. Untuk klarifikasi tahapan, silakan hubungi Chatbot atau Customer Service SIKOPLING.'
		},
		{
			id: 'faq-06',
			question: 'Apakah pengelolaan biaya rapat dilakukan tunai?',
			answer:
				'Tidak. Pengelolaan biaya rapat dilakukan secara non tunai (cashless) untuk mendukung transparansi dan akuntabilitas layanan.'
		},
		{
			id: 'faq-07',
			question: 'Bagaimana mekanisme pengiriman SK?',
			answer:
				'Dokumen fisik SK dikirimkan melalui ekspedisi oleh tim sekretariat berdasarkan data penerima yang disampaikan pemrakarsa.'
		},
		{
			id: 'faq-08',
			question: 'Jika pertanyaan saya belum terjawab, apa yang harus dilakukan?',
			answer:
				'Anda dapat menghubungi Customer Service agar konsultasi diteruskan ke petugas layanan sesuai topik dan tahapan proses dokumen Anda.'
		},
		{
			id: 'faq-09',
			question: 'Di mana lokasi kantor DLH Provinsi Kalimantan Selatan?',
			answer: officeAddress
		}
	];

	let activeFaqId = $state<string | null>(faqItems[0]?.id ?? null);
	let mapContainer: HTMLElement | null = $state(null);
	let shouldLoadMap = $state(hasMapSessionLoaded);
	let isMapFrameReady = $state(false);

	const loadMap = () => {
		if (shouldLoadMap) return;
		shouldLoadMap = true;
		hasMapSessionLoaded = true;
	};

	const toggleFaq = (id: string) => {
		activeFaqId = activeFaqId === id ? null : id;
	};

	onMount(() => {
		if (!mapContainer || shouldLoadMap) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting) return;
				loadMap();
				observer.disconnect();
			},
			{ rootMargin: '280px 0px', threshold: 0.01 }
		);

		observer.observe(mapContainer);

		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<meta
		name="description"
		content="Kontak resmi SIKOPLING: chatbot, customer service, jam operasional, peta lokasi kantor DLH Provinsi Kalimantan Selatan, dan FAQ lengkap."
	/>
	<link rel="dns-prefetch" href="//maps.google.com" />
	<link rel="dns-prefetch" href="//www.google.com" />
	{#if shouldLoadMap}
		<link rel="preconnect" href="https://maps.google.com" />
		<link rel="preconnect" href="https://www.google.com" />
	{/if}
</svelte:head>

<section id="kontak-hero" class="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-20">
	<div
		class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_12%,rgba(100,173,49,0.28),transparent_44%),radial-gradient(circle_at_86%_16%,rgba(64,124,194,0.21),transparent_38%)]"
	></div>
	<div class="absolute inset-0 -z-10 texture-overlay"></div>

	<div class="page-shell">
		<div class="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
			<div>
				<p class="text-xs font-semibold tracking-[0.12em] text-[#6d8e46] uppercase">Kontak SIKOPLING</p>
				<h1 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl lg:text-[3.25rem]">
					Mari Terhubung Dengan Tim Kami
				</h1>
				<p class="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
					Kami siap membantu kebutuhan konsultasi persetujuan lingkungan secara cepat, jelas, dan
					mudah diakses melalui kanal resmi SIKOPLING.
				</p>

				<div class="mt-6 rounded-2xl border border-[#d7e6cd] bg-[#f2f9ec] px-4 py-3 text-sm leading-relaxed text-[#335a17] sm:text-base">
					"Care for the environment today for a better life tomorrow"
				</div>

				<div class="mt-6 flex flex-wrap gap-3">
					<a
						href="https://wa.me/6282118314634"
						target="_blank"
						rel="noreferrer"
						class="inline-flex items-center justify-center rounded-full bg-[#64AD31] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4c8823]"
					>
						<MessageCircleMore class="mr-2 h-4 w-4" /> Chatbot SIKOPLING
					</a>
					<a
						href="#faq-lengkap"
						class="inline-flex items-center justify-center rounded-full border border-[#afc996] bg-white px-5 py-2.5 text-sm font-semibold text-[#3f6e1b] transition-colors hover:bg-[#f4f9ee]"
					>
						FAQ Lengkap
					</a>
				</div>
			</div>

			<figure class="relative">
				<div class="hero-card overflow-hidden rounded-[1.7rem] border border-[#d7e5ce] bg-white p-3 shadow-[0_34px_66px_-45px_rgba(15,23,42,0.56)] sm:p-4">
					<img
						src="/kontak/sikopling-nomor.png"
						alt="Informasi nomor layanan SIKOPLING"
						class="h-auto w-full rounded-[1rem]"
					/>
				</div>
				<figcaption
					class="absolute -left-1 -bottom-5 max-w-[15rem] rounded-2xl border border-[#d9e8d0] bg-white px-4 py-3 text-xs leading-relaxed text-[#3a611d] shadow-[0_16px_24px_-20px_rgba(15,23,42,0.55)] sm:max-w-[18rem] sm:text-sm"
				>
					Nomor resmi layanan untuk konsultasi cepat dan bantuan lanjutan.
				</figcaption>
			</figure>
		</div>
	</div>
</section>

<section id="kontak-kanal" class="bg-white py-16 sm:py-20">
	<div class="page-shell">
		<div class="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
			<div class="space-y-3.5">
				{#each contactChannels as channel, index}
					<article class="rounded-[1.4rem] border border-[var(--line)] bg-[#fbfdf9] p-5 sm:p-6">
						<div class="flex items-start gap-3.5">
							<span class="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf5e1] text-[#4b7f22]">
								{#if channel.id === 'chatbot'}
									<MessageCircleMore class="h-5 w-5" />
								{:else if channel.id === 'cs'}
									<PhoneCall class="h-5 w-5" />
								{:else}
									<Clock3 class="h-5 w-5" />
								{/if}
							</span>
							<div class="min-w-0">
								<p class="text-xs font-semibold tracking-[0.11em] text-[#68884a] uppercase">Kontak {index + 1}</p>
								<h2 class="mt-1 text-xl font-semibold tracking-tight text-[var(--ink)] sm:text-2xl">
									{channel.name}
								</h2>
								<p class="mt-1 text-base font-semibold text-[#2f5516] sm:text-lg">{channel.value}</p>
								<p class="mt-2 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
									{channel.description}
								</p>
								{#if channel.href && channel.cta}
									<a
										href={channel.href}
										target="_blank"
										rel="noreferrer"
										class="mt-3 inline-flex items-center text-sm font-semibold text-[#3e6e1a] transition-colors hover:text-[#2f5314]"
									>
										{channel.cta}
									</a>
								{/if}
							</div>
						</div>
					</article>
				{/each}
			</div>

			<aside class="rounded-[1.5rem] border border-[#dbe7d3] bg-[linear-gradient(155deg,#f3faec_0%,#ffffff_52%,#edf5ff_100%)] p-5 sm:p-6">
				<p class="text-xs font-semibold tracking-[0.11em] text-[#68884a] uppercase">Alamat Kantor</p>
				<h3 class="mt-2 text-2xl font-semibold tracking-tight text-[var(--ink)]">
					DLH Provinsi Kalimantan Selatan
				</h3>
				<p class="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{officeAddress}</p>

				<a
					href={mapsSearchUrl}
					target="_blank"
					rel="noreferrer"
					class="mt-4 inline-flex items-center text-sm font-semibold text-[#3e6e1a] transition-colors hover:text-[#2f5314]"
				>
					Buka di Google Maps <ExternalLink class="ml-1.5 h-4 w-4" />
				</a>

				<div class="mt-6 rounded-2xl border border-[#dbe7d3] bg-white p-4">
					<p class="text-xs font-semibold tracking-[0.11em] text-[#68884a] uppercase">Media Sosial</p>
					<ul class="mt-2.5 space-y-2 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
						<li><span class="font-semibold text-[var(--ink)]">Instagram:</span> @dlhkalselprov</li>
						<li><span class="font-semibold text-[var(--ink)]">Website:</span> dlh.kalselprov.go.id</li>
						<li><span class="font-semibold text-[var(--ink)]">X:</span> @dlhkalselprov</li>
					</ul>
				</div>
			</aside>
		</div>
	</div>
</section>

<section id="peta-lokasi" class="bg-[#f8fbf6] py-16 sm:py-20">
	<div class="page-shell">
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-xs font-semibold tracking-[0.12em] text-[#6d8e46] uppercase">Peta Lokasi</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
				Lokasi Gedung DLH Provinsi Kalimantan Selatan
			</h2>
			<p class="mt-3 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
				Pin lokasi ditandai pada peta untuk memudahkan Anda menemukan kantor layanan.
			</p>
		</div>

		<div class="mt-7 overflow-hidden rounded-[1.7rem] border border-[#d8e6d0] bg-white p-2.5 sm:p-3.5">
			<div class="map-frame relative overflow-hidden rounded-[1.2rem]" bind:this={mapContainer}>
				{#if shouldLoadMap}
					<iframe
						title="Peta lokasi DLH Provinsi Kalimantan Selatan"
						src={mapsEmbedUrl}
						loading="lazy"
						referrerpolicy="no-referrer-when-downgrade"
						class={`h-[24rem] w-full transition-opacity duration-500 sm:h-[30rem] ${
							isMapFrameReady ? 'opacity-100' : 'opacity-0'
						}`}
						onload={() => (isMapFrameReady = true)}
					></iframe>
					{#if !isMapFrameReady}
						<div
							class="absolute inset-0 grid place-items-center bg-[linear-gradient(165deg,#f8fbf6_0%,#eef6e8_55%,#edf5ff_100%)]"
						>
							<div class="px-4 text-center">
								<p class="text-sm font-semibold tracking-[0.08em] text-[#5f7e3f] uppercase">
									Memuat peta interaktif
								</p>
								<p class="mt-2 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
									Sedang menyiapkan Google Maps untuk Anda.
								</p>
							</div>
						</div>
					{/if}
				{:else}
					<div
						class="h-[24rem] bg-[linear-gradient(160deg,#f8fbf6_0%,#eef6e8_54%,#edf5ff_100%)] sm:h-[30rem]"
					>
						<div class="flex h-full flex-col items-center justify-center px-5 text-center">
							<MapPin class="h-9 w-9 text-[#4b7f22]" />
							<p class="mt-3 text-sm font-semibold tracking-[0.08em] text-[#5f7e3f] uppercase">
								Peta interaktif belum dimuat
							</p>
							<p class="mt-2 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
								Untuk menghemat bandwidth, peta baru dimuat saat dibutuhkan.
							</p>
							<button
								type="button"
								class="mt-4 inline-flex items-center justify-center rounded-full bg-[#64AD31] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4c8823]"
								onclick={loadMap}
							>
								Muat Peta Sekarang
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<div class="mx-auto mt-4 max-w-5xl rounded-2xl border border-[#dbe7d3] bg-white px-4 py-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
			<span class="font-semibold text-[var(--ink)]">Alamat:</span>
			{officeAddress}
		</div>
	</div>
</section>

<section id="faq-lengkap" class="bg-white py-16 sm:py-20">
	<div class="page-shell">
		<div class="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-10">
			<div>
				<p class="text-xs font-semibold tracking-[0.12em] text-[#6d8e46] uppercase">FAQ Lengkap</p>
				<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
					Pertanyaan yang Sering Ditanyakan
				</h2>
				<p class="mt-3 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
					Ringkasan jawaban cepat untuk membantu Anda memahami alur layanan SIKOPLING.
				</p>

				<div class="mt-6 rounded-2xl border border-[#dbe7d3] bg-[#f4faee] p-4 sm:p-5">
					<p class="text-sm leading-relaxed text-[#365f19] sm:text-base">
						Jika Anda belum menemukan jawaban yang sesuai, silakan hubungi Customer Service untuk
						pendampingan langsung.
					</p>
				</div>
			</div>

			<div class="space-y-3.5">
				{#each faqItems as item}
					<article class="overflow-hidden rounded-[1.45rem] border border-[#dde5ee] bg-white">
						<h3>
							<button
								type="button"
								class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#f8fbf4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6f864f] focus-visible:ring-inset sm:px-6 sm:py-5"
								onclick={() => toggleFaq(item.id)}
								aria-expanded={activeFaqId === item.id}
								aria-controls={`${item.id}-answer`}
							>
								<span class="text-[1.02rem] leading-snug font-semibold tracking-tight text-[var(--ink)] sm:text-[1.08rem]">
									{item.question}
								</span>
								<span
									class={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-2xl leading-none transition-transform duration-300 ${
										activeFaqId === item.id
											? 'rotate-45 border-[#c9d8b8] text-[#5d7b33]'
											: 'border-[#d8dde5] text-[#2f4f77]'
									}`}
									aria-hidden="true"
								>
									+
								</span>
							</button>
						</h3>
						{#if activeFaqId === item.id}
							<div
								id={`${item.id}-answer`}
								class="border-t border-[#edf0f4] px-5 pt-3.5 pb-5 text-sm leading-relaxed text-[var(--muted)] sm:px-6 sm:pt-4 sm:pb-6 sm:text-base"
							>
								{item.answer}
							</div>
						{/if}
					</article>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.texture-overlay {
		background-image:
			radial-gradient(circle at 1px 1px, rgba(21, 41, 15, 0.08) 1px, transparent 0),
			linear-gradient(120deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.56) 52%, rgba(255, 255, 255, 0) 100%);
		background-size: 16px 16px, 100% 100%;
		opacity: 0.36;
	}

	.hero-card {
		transform: rotate(0.9deg);
	}

	.map-frame {
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.65);
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-card {
			transform: none;
		}
	}
</style>

