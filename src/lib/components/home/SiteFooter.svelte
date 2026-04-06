<script lang="ts">
	import Mail from 'lucide-svelte/icons/mail';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import Phone from 'lucide-svelte/icons/phone';
	import { siFacebook, siInstagram, siX, siYoutube } from 'simple-icons';

	const currentYear = new Date().getFullYear();
</script>

<footer id="kontak" class="mt-16 bg-white">
	<div class="nav-shell pb-4">
		<div
			class="relative overflow-visible rounded-[1.5rem] bg-[#64AD31] pt-6 pr-0 pb-6 pl-4 sm:pt-10 sm:pr-0 sm:pl-8 lg:h-[400px] lg:px-10"
		>
			<div
				class="grid grid-cols-[minmax(0,1fr)_15rem] items-start gap-5 sm:grid-cols-[minmax(0,1fr)_17rem] sm:gap-7 lg:h-full lg:grid-cols-[minmax(0,1fr)_minmax(16.5rem,24.75rem)_minmax(0,1fr)] lg:items-start lg:gap-8"
			>
				<section class="order-1 col-start-1 row-start-1 text-white lg:order-1 lg:col-start-1 lg:row-start-1">
					<div
						class="tagline-badge inline-flex items-center rounded-[0.72rem] border-2 border-[#bce96a] bg-linear-to-b from-[#16ce22] to-[#f39d2c] px-3 py-1 shadow-[0_3px_0_rgba(20,88,190,0.45)]"
					>
						<span class="tagline-rotator" aria-live="polite">
							<span
								class="tagline-item tagline-item-a text-[0.62rem] leading-none tracking-[0.05em] text-[#fff] italic sm:text-[1.24rem]"
								>Care for the environment today</span
							>
							<span
								class="tagline-item tagline-item-b text-[0.62rem] leading-none tracking-[0.05em] text-[#fff] italic sm:text-[1.24rem]"
								>for a better life tomorrow</span
							>
						</span>
					</div>
					<h2 class="mt-3 text-[2.35rem] font-semibold tracking-[0.02em] sm:text-[2.8rem] lg:text-[2.5rem]">
						SIKOPLING
					</h2>
					<p class="mt-3 max-w-md text-sm leading-relaxed text-white/95 sm:text-base">
						Portal informasi dan konsultasi persetujuan lingkungan yang dirancang cepat, transparan,
						dan ramah pengguna untuk masyarakat Kalimantan Selatan.
					</p>

					<div class="mt-5">
						<h3 class="text-base font-semibold tracking-[0.09em] uppercase sm:text-lg">Sosial Media</h3>
						<div class="mt-2.5 flex items-center gap-2.5">
							<a
								href="https://instagram.com/sikopling.kalsel"
								target="_blank"
								rel="noreferrer"
								aria-label="Instagram Sikopling"
								class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"
							>
								<svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
									<path d={siInstagram.path} fill="currentColor"></path>
								</svg>
							</a>
							<a
								href="https://facebook.com/sikopling.kalsel"
								target="_blank"
								rel="noreferrer"
								aria-label="Facebook Sikopling"
								class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"
							>
								<svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
									<path d={siFacebook.path} fill="currentColor"></path>
								</svg>
							</a>
							<a
								href="https://x.com/sikoplingkalsel"
								target="_blank"
								rel="noreferrer"
								aria-label="X Sikopling"
								class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"
							>
								<svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
									<path d={siX.path} fill="currentColor"></path>
								</svg>
							</a>
							<a
								href="https://youtube.com/@sikoplingkalsel"
								target="_blank"
								rel="noreferrer"
								aria-label="YouTube Sikopling"
								class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"
							>
								<svg viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
									<path d={siYoutube.path} fill="currentColor"></path>
								</svg>
							</a>
						</div>
					</div>
				</section>

				<figure
					class="order-3 col-start-2 row-start-1 row-span-2 w-full justify-self-stretch self-center lg:absolute lg:-bottom-6 lg:left-1/2 lg:z-20 lg:h-[25rem] lg:w-[20rem] lg:-translate-x-1/2"
				>
					<div
						class="flex min-h-68 items-end justify-center rounded-l-[1.75rem] rounded-r-none bg-[#676767] pt-3 sm:min-h-[18rem] sm:px-3 lg:h-full lg:min-h-0 lg:rounded-none lg:bg-transparent lg:p-0"
					>
						<img
							src="/layout/maskot.svg"
							alt="Maskot Sikopling"
							class="block h-auto w-full max-w-[10.5rem] object-contain sm:max-w-[12rem] lg:h-full lg:w-full lg:max-w-none lg:-translate-y-6 lg:object-contain"
						/>
					</div>
				</figure>

				<section class="order-2 col-start-1 row-start-2 text-white lg:order-3 lg:col-start-3 lg:row-start-1 lg:self-start">
					<div class="pt-4 text-sm leading-relaxed sm:border-0 sm:pt-0 sm:text-[0.95rem]">
						<h3 class="text-base font-semibold tracking-[0.09em] uppercase sm:text-lg">Kontak Kami</h3>
						<div class="mt-2.5 space-y-2.5">
							<p class="flex items-start gap-2">
								<Phone class="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
								<span>
									<span class="block font-semibold">Layanan Pelanggan</span>
									<a href="https://wa.me/6282155667788" class="mt-0.5 block hover:underline">
										+62 821-5566-7788
									</a>
								</span>
							</p>
							<p class="flex items-start gap-2">
								<Mail class="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
								<span>
									<span class="block font-semibold">ChatBot</span>
									<a href="https://wa.me/6282155667799" class="mt-0.5 block hover:underline">
										+62 821-5566-7799
									</a>
								</span>
							</p>
							<p class="flex items-start gap-2">
								<MapPin class="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
								<span>
									<span class="block font-semibold">Alamat</span>
									<span class="mt-0.5 block">
										Jl Bangun Praja Kawasan Perkantoran PemerintahProvinsi Kalimantan Selatan,
										Palam, Kec. Cemp., Kota Banjar Baru, Kalimantan Selatan 70732
									</span>
								</span>
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>

	<div class="border-t border-[#64AD31]/25 bg-white">
		<div
			class="nav-shell pt-5 pb-10 text-left text-xs text-black sm:flex sm:items-center sm:justify-between sm:py-5"
		>
			<p>&copy; {currentYear} Dinas Lingkungan Hidup Provinsi Kalimantan Selatan</p>
			<div class="mt-2 flex items-center justify-start gap-4 text-[11px] sm:mt-0 sm:justify-end sm:text-xs">
				<a href="/ketentuan-layanan" class="font-medium text-black hover:underline">Term</a>
				<a href="/kebijakan-privasi" class="font-medium text-black hover:underline">Privacy</a>
			</div>
		</div>
	</div>
</footer>

<style>
	.tagline-badge {
		will-change: border-radius, transform;
		transform-origin: left center;
		animation: tagline-badge-morph 3s ease-in-out infinite;
	}
	.tagline-rotator {
		display: inline-grid;
		align-items: center;
	}

	.tagline-item {
		grid-area: 1 / 1;
		white-space: nowrap;
		opacity: 0;
		transform: translateY(0.2em);
		animation: footer-tagline-loop 3s ease-in-out infinite;
	}

	.tagline-item-a {
		animation-delay: 0s;
	}

	.tagline-item-b {
		animation-delay: 1.5s;
	}

	@keyframes footer-tagline-loop {
		0% {
			opacity: 0;
			transform: translateY(0.2em);
		}
		10%,
		40% {
			opacity: 1;
			transform: translateY(0);
		}
		50%,
		100% {
			opacity: 0;
			transform: translateY(-0.2em);
		}
	}

		@keyframes tagline-badge-morph {
		0%,
		100% {
			border-radius: 0.72rem;
			transform: scale(1);
		}
		12%,
		40% {
			border-radius: 1.05rem 0.68rem 1rem 0.8rem;
			transform: scale(1.015);
		}
		52%,
		88% {
			border-radius: 0.68rem 1.05rem 0.8rem 1rem;
			transform: scale(0.992);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tagline-badge {
			animation: none;
		}

		.tagline-item {
			animation: none;
			opacity: 0;
			transform: none;
		}

		.tagline-item-a {
			opacity: 1;
		}
	}
</style>
