<script lang="ts">
	import Mail from 'lucide-svelte/icons/mail';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import Phone from 'lucide-svelte/icons/phone';
	import { siFacebook, siInstagram, siX, siYoutube } from 'simple-icons';

	const currentYear = new Date().getFullYear();
</script>

<footer id="kontak" class="mt-16 bg-white">
		<div class="nav-shell nav-shell-desktop-spacious pb-4">
			<div
				class="site-footer-shell relative overflow-visible rounded-[1.5rem] bg-[#64AD31] pt-6 pr-0 pb-6 pl-4 sm:pt-10 sm:pr-0 sm:pl-8 xl:h-[400px] xl:px-10"
			>
				<div
					class="site-footer-grid grid items-start gap-5 sm:gap-7 xl:h-full xl:grid-cols-[minmax(0,1fr)_minmax(16.5rem,24.75rem)_minmax(0,1fr)] xl:items-start xl:gap-8"
				>
				<section class="order-1 col-start-1 row-start-1 text-white xl:order-1 xl:col-start-1 xl:row-start-1">
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
						class="maskot-figure order-3 col-start-2 row-start-1 row-span-2 w-full justify-self-stretch self-center xl:absolute xl:-bottom-6 xl:left-1/2 xl:z-20 xl:h-[25rem] xl:w-[20rem] xl:-translate-x-1/2"
					>
						<div
							class="maskot-panel flex items-end justify-center rounded-l-[1.75rem] rounded-r-none bg-[#676767] pt-3 sm:px-3 xl:h-full xl:min-h-0 xl:rounded-none xl:bg-transparent xl:p-0"
						>
							<img
								src="/layout/maskot.svg"
								alt="Maskot Sikopling"
								class="maskot-image block h-auto w-full object-contain xl:h-full xl:w-full xl:max-w-none xl:-translate-y-6 xl:object-contain"
							/>
						</div>
					</figure>

					<section class="site-footer-contact order-2 col-start-1 row-start-2 mt-5 text-white xl:order-3 xl:col-start-3 xl:row-start-1 xl:mt-0 xl:self-start">
					<div class="pt-4 text-sm leading-relaxed sm:border-0 sm:pt-0 sm:text-[0.95rem]">
						<h3 class="text-base font-semibold tracking-[0.09em] uppercase sm:text-lg">Kontak Kami</h3>
							<div class="footer-contact-list mt-2.5 space-y-2.5">
								<p class="footer-contact-item footer-contact-item-main flex items-start gap-2">
									<Phone class="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
									<span>
										<span class="block font-semibold">Layanan Pelanggan</span>
										<a href="https://wa.me/6282155667788" class="mt-0.5 block hover:underline">
											+62 821-5566-7788
										</a>
									</span>
								</p>
								<p class="footer-contact-item footer-contact-item-chat flex items-start gap-2">
									<Mail class="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2} aria-hidden="true" />
									<span>
										<span class="block font-semibold">ChatBot</span>
										<a href="https://wa.me/6282155667799" class="mt-0.5 block hover:underline">
											+62 821-5566-7799
										</a>
									</span>
								</p>
								<p class="footer-contact-item footer-contact-item-address flex items-start gap-2">
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
			class="nav-shell nav-shell-desktop-spacious pt-5 pb-10 text-left text-xs text-black sm:flex sm:items-center sm:justify-between sm:py-5"
		>
			<p>&copy; 2026 Dinas Lingkungan Hidup Kalimantan Selatan</p>
			<div class="mt-2 flex items-center justify-start gap-4 text-[11px] sm:mt-0 sm:justify-end sm:text-xs">
				<a href="/ketentuan-layanan" class="font-medium text-black hover:underline">Term</a>
				<a href="/kebijakan-privasi" class="font-medium text-black hover:underline">Privacy</a>
			</div>
		</div>
	</div>
</footer>

	<style>
		.site-footer-shell {
			--maskot-zone-w-mobile: 10rem;
			--maskot-zone-h-mobile: 8rem;
			--maskot-img-w-mobile: 8.5rem;
			--maskot-zone-raise-mobile: 5.25rem;
			--maskot-zone-w-sm: 22rem;
			--maskot-zone-h-sm: 16rem;
			--maskot-img-w-sm: 12rem;
		}

		@media (max-width: 639px) {
			.site-footer-grid {
				display: block;
			}

			.site-footer-grid::after {
				content: '';
				display: block;
				clear: both;
			}

			.maskot-figure {
				float: right;
				width: var(--maskot-zone-w-mobile);
				margin: calc(var(--maskot-zone-raise-mobile) * -1) 0 0.85rem 0.85rem;
			}

			.maskot-panel {
				min-height: var(--maskot-zone-h-mobile);
			}

			.maskot-image {
				max-width: var(--maskot-img-w-mobile);
			}

			.site-footer-contact > div {
				padding-top: 0;
			}
		}

		@media (min-width: 640px) and (max-width: 1279px) {
			.site-footer-grid {
				grid-template-columns: minmax(0, 1fr) var(--maskot-zone-w-sm);
			}

			.maskot-panel {
				min-height: var(--maskot-zone-h-sm);
			}

			.maskot-image {
				max-width: var(--maskot-img-w-sm);
			}

			.footer-contact-list {
				display: grid;
				grid-template-columns: minmax(0, 13rem) minmax(0, 1fr);
				column-gap: 1rem;
				row-gap: 0.7rem;
				align-items: start;
			}

			.footer-contact-item {
				margin: 0;
			}

			.footer-contact-item-main {
				grid-column: 1;
				grid-row: 1;
			}

			.footer-contact-item-chat {
				grid-column: 1;
				grid-row: 2;
			}

			.footer-contact-item-address {
				grid-column: 2;
				grid-row: 1 / span 2;
			}
		}

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
