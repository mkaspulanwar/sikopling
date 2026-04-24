<script lang="ts">
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import Mail from 'lucide-svelte/icons/mail';
	import MapPin from 'lucide-svelte/icons/map-pin';
	import Phone from 'lucide-svelte/icons/phone';
	import { siFacebook, siInstagram, siX, siYoutube } from 'simple-icons';

	const currentYear = new Date().getFullYear();
	const mapsUrl =
		'https://maps.app.goo.gl/ZPrZHfffRjQU6cUA9';
</script>

<footer id="kontak" class="mt-16 bg-white">
		<div class="nav-shell nav-shell-desktop-spacious pb-4">
			<div
				class="site-footer-shell relative overflow-visible rounded-[1.5rem] bg-[#64AD31] pt-6 pr-0 pb-6 pl-4 sm:pt-10 sm:pr-0 sm:pl-8 xl:h-110 xl:px-10"
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

					<div class="footer-action-row mt-5 grid gap-2.5 sm:grid-cols-2">
						<a
							href="https://www.gmail.com"
							class="footer-action-link footer-action-link-primary"
						>
							<Mail class="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
							Email Kami
						</a>
						<a
							href="https://wa.me/6282155667788"
							class="footer-action-link footer-action-link-secondary"
						>
							<Phone class="h-4 w-4" strokeWidth={2.1} aria-hidden="true" />
							Hubungi CS
						</a>
					</div>

					<div class="mt-5">
						<h3 class="text-base font-semibold tracking-[0.09em] uppercase sm:text-lg">Sosial Media</h3>
						<div class="footer-social-links mt-2.5 flex items-center gap-2.5">
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
									<span class="footer-contact-icon">
										<Phone class="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
									</span>
									<span>
										<span class="footer-contact-label block">Layanan Pelanggan</span>
										<a href="https://wa.me/6282155667788" class="footer-contact-link mt-1 block">
											+62 821-5566-7788
										</a>
									</span>
								</p>
								<p class="footer-contact-item footer-contact-item-chat flex items-start gap-2">
									<span class="footer-contact-icon">
										<Mail class="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
									</span>
									<span>
										<span class="footer-contact-label block">ChatBot</span>
										<a href="https://wa.me/6282155667799" class="footer-contact-link mt-1 block">
											+62 821-5566-7799
										</a>
									</span>
								</p>
								<p class="footer-contact-item footer-contact-item-address flex items-start gap-2">
									<span class="footer-contact-icon">
										<MapPin class="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
									</span>
									<span>
										<span class="footer-contact-label block">Alamat</span>
										<span class="footer-address-copy mt-1 block">
											Jl Bangun Praja, Kawasan Perkantoran Pemerintah Provinsi Kalimantan
											Selatan<br />
											Palam, Cempaka, Banjarbaru, Kalimantan Selatan 70732
										</span>
										<a
											href={mapsUrl}
											target="_blank"
											rel="noreferrer"
											class="footer-map-link mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:-translate-y-0.5 hover:border-white/55 hover:bg-white/18"
										>
											Lihat Maps
											<ArrowUpRight class="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
										</a>
								</span>
							</p>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>

	<div class="footer-legal border-t border-[#64AD31]/18 bg-white">
		<div
			class="footer-legal-bar nav-shell nav-shell-desktop-spacious pt-4 pb-9 text-left text-xs text-[#334129] sm:flex sm:items-center sm:justify-between sm:py-4"
		>
			<p class="footer-copyright">&copy; {currentYear} Dinas Lingkungan Hidup Kalimantan Selatan</p>
			<div class="footer-legal-links mt-3 flex items-center justify-start gap-2 text-[11px] sm:mt-0 sm:justify-end sm:text-xs">
				<a href="/ketentuan-layanan" class="footer-legal-link">Ketentuan Layanan</a>
				<a href="/kebijakan-privasi" class="footer-legal-link">Kebijakan Privasi</a>
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
			border: 1px solid rgba(255, 255, 255, 0.2);
			background:
				linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0) 42%),
				#64ad31;
			box-shadow: 0 22px 55px rgba(39, 93, 18, 0.18);
		}

		.site-footer-shell::before {
			content: 'SIKOPLING';
			position: absolute;
			right: clamp(1rem, 4vw, 3rem);
			bottom: -0.55rem;
			z-index: 0;
			color: rgba(255, 255, 255, 0.11);
			font-size: clamp(4.25rem, 12vw, 10.5rem);
			font-weight: 800;
			line-height: 0.78;
			pointer-events: none;
			white-space: nowrap;
			transform: none;
			transform-origin: right;
		}

		.site-footer-grid {
			position: relative;
			z-index: 1;
		}

		.site-footer-shell h2 {
			line-height: 1;
		}

		.site-footer-shell h3 {
			display: flex;
			align-items: center;
			gap: 0.8rem;
			line-height: 1;
		}

		.site-footer-shell h3::after {
			content: '';
			height: 1px;
			flex: 1;
			background: linear-gradient(90deg, rgba(255, 255, 255, 0.38), rgba(255, 255, 255, 0));
		}

		.site-footer-shell p,
		.footer-contact-item {
			text-wrap: pretty;
		}

		.site-footer-shell a,
		.footer-legal-link {
			-webkit-tap-highlight-color: transparent;
		}

		.site-footer-shell a:focus-visible,
		.footer-legal-link:focus-visible {
			outline: 2px solid rgba(255, 255, 255, 0.92);
			outline-offset: 3px;
		}

		.footer-social-links {
			display: grid;
			width: 100%;
			grid-template-columns: repeat(4, minmax(0, 1fr));
			gap: 0.7rem;
		}

		.footer-social-links a {
			height: 2.65rem;
			width: 100%;
			border-radius: 999px;
			color: rgba(255, 255, 255, 0.92);
			box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
			transition:
				background-color 180ms ease,
				border-color 180ms ease,
				box-shadow 180ms ease,
				color 180ms ease,
				transform 180ms ease;
		}

		.footer-social-links a:hover {
			border-color: rgba(255, 255, 255, 0.6);
			background-color: rgba(255, 255, 255, 0.18);
			color: #fff;
			box-shadow:
				inset 0 1px 0 rgba(255, 255, 255, 0.22),
				0 10px 22px rgba(37, 82, 17, 0.14);
		}

		.footer-social-links svg {
			transition: transform 180ms ease;
		}

		.footer-social-links a:hover svg {
			transform: scale(1.08);
		}

		.footer-social-links a:active,
		.footer-action-link:active,
		.footer-map-link:active,
		.footer-legal-link:active {
			transform: translateY(0);
		}

		.footer-action-row {
			max-width: 28rem;
		}

		.footer-action-link {
			position: relative;
			overflow: hidden;
			display: inline-flex;
			min-height: 2.55rem;
			align-items: center;
			justify-content: center;
			gap: 0.55rem;
			border-radius: 999px;
			padding: 0.72rem 1rem;
			font-size: 0.86rem;
			font-weight: 700;
			line-height: 1;
			text-decoration: none;
			transition:
				background-color 180ms ease,
				border-color 180ms ease,
				color 180ms ease,
				transform 180ms ease;
		}

		.footer-action-link:hover {
			transform: translateY(-1px);
		}

		.footer-action-link::after {
			content: '';
			position: absolute;
			inset: 0;
			background: linear-gradient(110deg, transparent 0%, rgba(255, 255, 255, 0.26) 45%, transparent 70%);
			opacity: 0;
			transform: translateX(-80%);
			transition:
				opacity 180ms ease,
				transform 360ms ease;
		}

		.footer-action-link:hover::after {
			opacity: 1;
			transform: translateX(80%);
		}

		.footer-action-link > :global(svg),
		.footer-action-link {
			isolation: isolate;
		}

		.footer-action-link-primary {
			border: 1px solid rgba(255, 255, 255, 0.82);
			background: rgba(255, 255, 255, 0.96);
			color: #3d7b1f;
			box-shadow: 0 10px 24px rgba(39, 93, 18, 0.18);
		}

		.footer-action-link-primary:hover {
			background: #fff;
			color: #2d5f18;
		}

		.footer-action-link-secondary {
			border: 1px solid rgba(255, 255, 255, 0.24);
			background: rgba(255, 255, 255, 0.1);
			color: #fff;
			box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
		}

		.footer-action-link-secondary:hover {
			border-color: rgba(255, 255, 255, 0.48);
			background: rgba(255, 255, 255, 0.16);
		}

		.footer-map-link {
			box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
			transition:
				background-color 180ms ease,
				border-color 180ms ease,
				box-shadow 180ms ease,
				transform 180ms ease;
		}

		.footer-map-link:hover {
			box-shadow:
				inset 0 1px 0 rgba(255, 255, 255, 0.18),
				0 8px 18px rgba(37, 82, 17, 0.14);
		}

		.footer-contact-icon {
			margin-top: 0.08rem;
			display: inline-flex;
			height: 1.55rem;
			width: 1.55rem;
			flex-shrink: 0;
			align-items: center;
			justify-content: center;
			border: 1px solid rgba(255, 255, 255, 0.22);
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.1);
			color: rgba(255, 255, 255, 0.96);
			box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
		}

		.footer-contact-item {
			border: 1px solid rgba(255, 255, 255, 0.1);
			border-radius: 0.9rem;
			background: rgba(255, 255, 255, 0.055);
			padding: 0.58rem 0.62rem;
			box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
			transition:
				background-color 180ms ease,
				border-color 180ms ease,
				transform 180ms ease;
		}

		.footer-contact-item:hover {
			border-color: rgba(255, 255, 255, 0.18);
			background: rgba(255, 255, 255, 0.085);
			transform: translateY(-1px);
		}

		.footer-contact-label {
			color: #fff;
			font-size: 0.88rem;
			font-weight: 700;
			line-height: 1.25;
		}

		.footer-contact-link {
			width: fit-content;
			color: rgba(255, 255, 255, 0.9);
			font-size: 0.9rem;
			font-weight: 500;
			line-height: 1.35;
			text-decoration: none;
			text-underline-offset: 0.24rem;
			transition:
				color 180ms ease,
				text-decoration-color 180ms ease;
		}

		.footer-contact-link:hover {
			color: #fff;
			text-decoration: underline;
			text-decoration-color: rgba(255, 255, 255, 0.72);
		}

		.footer-contact-link:focus-visible {
			border-radius: 0.25rem;
		}

		.footer-address-copy {
			max-width: 38rem;
			color: rgba(255, 255, 255, 0.92);
			line-height: 1.65;
		}

		.footer-legal {
			background: linear-gradient(180deg, rgba(100, 173, 49, 0.04), rgba(255, 255, 255, 0));
		}

		.footer-legal-bar {
			letter-spacing: 0.01em;
		}

		.footer-copyright {
			color: rgba(51, 65, 41, 0.74);
		}

		.footer-legal-link {
			display: inline-flex;
			align-items: center;
			border-radius: 999px;
			padding: 0.42rem 0.72rem;
			color: rgba(51, 65, 41, 0.82);
			font-weight: 600;
			text-decoration: none;
			transition:
				background-color 180ms ease,
				color 180ms ease,
				transform 180ms ease;
		}

		.footer-legal-link:hover {
			background-color: rgba(100, 173, 49, 0.1);
			color: #2d5f18;
			transform: translateY(-1px);
		}

		.footer-legal-link:focus-visible {
			outline-color: rgba(100, 173, 49, 0.86);
		}

		@media (max-width: 639px) {
			.site-footer-shell {
				padding: 1.55rem 1.25rem 1.65rem;
				border-radius: 1.35rem;
			}

			.site-footer-grid {
				display: block;
			}

			.site-footer-shell::before {
				display: block;
				right: -0.25rem;
				bottom: 0.35rem;
				color: rgba(255, 255, 255, 0.07);
				font-size: clamp(3.2rem, 17vw, 5.4rem);
				line-height: 0.78;
				transform: rotate(8deg);
				transform-origin: right bottom;
			}

			.maskot-figure {
				display: none;
			}

			.footer-social-links {
				width: 100%;
				gap: 0.75rem;
			}

			.site-footer-shell h2 {
				margin-top: 0.9rem;
				font-size: clamp(2rem, 11vw, 2.25rem);
				line-height: 1;
			}

			.site-footer-shell p {
				line-height: 1.7;
			}

			.site-footer-shell h3 {
				font-size: 0.95rem;
				letter-spacing: 0.06em;
			}

			.site-footer-contact {
				margin-top: 1.65rem;
			}

			.site-footer-contact > div {
				padding-top: 0;
			}

			.footer-contact-list {
				margin-top: 0.9rem;
				display: grid;
				gap: 0.95rem;
			}

			.footer-action-row {
				max-width: none;
			}

			.footer-contact-item {
				gap: 0.7rem;
				margin: 0;
			}

			.footer-address-copy {
				line-height: 1.72;
			}

			.footer-legal-links {
				flex-wrap: wrap;
			}

			.footer-legal-link {
				margin-left: -0.72rem;
			}
		}

		@media (min-width: 640px) and (max-width: 1279px) {
			.site-footer-shell {
				padding: 2rem clamp(2rem, 5vw, 3rem) 2.25rem;
			}

			.site-footer-shell::before {
				right: -0.5rem;
				bottom: -0.25rem;
				color: rgba(255, 255, 255, 0.08);
				font-size: clamp(5.8rem, 14vw, 8.5rem);
				transform: rotate(10deg);
				transform-origin: right bottom;
			}

			.site-footer-grid {
				grid-template-columns: minmax(0, 1fr);
				gap: 2rem;
			}

			.maskot-figure {
				display: none;
			}

			.site-footer-shell h2 {
				font-size: clamp(2.35rem, 4.4vw, 2.75rem);
				line-height: 1;
			}

			.site-footer-shell p {
				line-height: 1.75;
			}

			.site-footer-contact {
				margin-top: 0;
			}

			.site-footer-contact > div {
				max-width: 46rem;
			}

			.footer-contact-list {
				display: grid;
				grid-template-columns: repeat(2, minmax(0, 15rem));
				column-gap: 1.5rem;
				row-gap: 1.05rem;
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
				grid-column: 2;
				grid-row: 1;
			}

			.footer-contact-item-address {
				grid-column: 1 / -1;
				grid-row: 2;
				max-width: 42rem;
			}

			.footer-social-links {
				max-width: 34rem;
			}

			.footer-action-row {
				max-width: 34rem;
			}

		}

		@media (min-width: 1280px) {
			.site-footer-grid {
				grid-template-columns: minmax(0, 1fr) minmax(16.5rem, 24.75rem) minmax(0, 1fr);
				column-gap: clamp(1.5rem, 2.5vw, 2rem);
			}

			.site-footer-grid > section {
				position: relative;
				z-index: 3;
			}

			.maskot-figure {
				position: relative;
				grid-column: 2;
				grid-row: 1;
				z-index: 2;
				align-self: end;
				justify-self: center;
				bottom: auto;
				width: 26rem;
				height: 32rem;
				pointer-events: none;
				transform: translateY(-1.65rem);
			}

			.maskot-image {
				height: 100%;
				width: 100%;
				transform: translateY(-4rem);
			}

			.site-footer-contact {
				padding-left: 0;
			}

			.footer-contact-list {
				display: grid;
				gap: 0.95rem;
			}

			.footer-social-links {
				max-width: 30rem;
			}
		}

		.tagline-badge {
			will-change: border-radius, transform;
			transform-origin: left center;
			border-color: rgba(255, 255, 255, 0.48);
			background: rgba(255, 255, 255, 0.12);
			box-shadow:
				inset 0 1px 0 rgba(255, 255, 255, 0.22),
				0 8px 22px rgba(32, 85, 14, 0.16);
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
		font-size: clamp(0.68rem, 1.15vw, 0.9rem);
		line-height: 1;
		font-weight: 500;
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
			border-radius: 999px;
			transform: scale(1);
		}
		12%,
		40% {
			border-radius: 999px;
			transform: scale(1.015);
		}
		52%,
		88% {
			border-radius: 999px;
			transform: scale(0.992);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.tagline-badge {
			animation: none;
		}

		.footer-action-link,
		.footer-action-link::after,
		.footer-contact-item,
		.footer-contact-link,
		.footer-legal-link,
		.footer-map-link,
		.footer-social-links a,
		.footer-social-links svg {
			transition: none;
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
