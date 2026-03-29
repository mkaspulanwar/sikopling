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
			class="relative overflow-visible rounded-[1.5rem] bg-[#64AD31] px-4 pt-6 pb-6 sm:px-8 sm:pt-10 lg:h-[400px] lg:px-10"
		>
			<div
				class="grid items-start gap-5 sm:gap-7 lg:h-full lg:grid-cols-[minmax(0,1fr)_minmax(220px,300px)_minmax(0,1fr)] lg:gap-8"
			>
				<section class="order-2 text-white lg:order-1">
					<h2 class="text-[2.35rem] font-semibold tracking-[0.02em] sm:text-[2.8rem] lg:text-[2.5rem]">
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

				<figure class="order-1 mx-auto -mt-20 w-48 sm:-mt-20 sm:w-52 lg:order-2 lg:-mt-32 lg:w-72 lg:self-end">
					<img
						src="/layout/maskot.svg"
						alt="Maskot Sikopling"
						class="block h-auto w-full object-contain"
					/>
				</figure>

				<section class="order-3 text-white lg:self-start">
					<div
						class="border-t border-white/25 pt-4 text-sm leading-relaxed sm:border-0 sm:pt-0 sm:text-[0.95rem]"
					>
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

	<div class="border-t border-[#3EB14A]/25 bg-white">
		<div
			class="nav-shell flex flex-col items-center gap-2 py-5 text-center text-sm text-black sm:flex-row sm:items-center sm:justify-between sm:text-left"
		>
			<p>&copy; {currentYear} Dinas Lingkungan Hidup Provinsi Kalimantan Selatan</p>
			<div class="flex items-center justify-center gap-5">
				<a href="/kebijakan-privasi" class="font-medium text-black hover:underline">Kebijakan Privasi</a>
				<a href="/ketentuan-layanan" class="font-medium text-black hover:underline">Ketentuan Layanan</a>
			</div>
		</div>
	</div>
</footer>
