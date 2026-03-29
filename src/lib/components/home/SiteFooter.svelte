<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer id="kontak" class="mt-16 bg-white">
	<div class="nav-shell pb-4">
		<div
			class="relative overflow-visible rounded-[1.5rem] bg-[#3EB14A] px-4 pt-6 pb-6 sm:px-8 sm:pt-10 lg:h-[400px] lg:px-10"
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
								<svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
									<path
										d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9Zm9.4 1.3a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Z"
									></path>
								</svg>
							</a>
							<a
								href="https://facebook.com/sikopling.kalsel"
								target="_blank"
								rel="noreferrer"
								aria-label="Facebook Sikopling"
								class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"
							>
								<svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
									<path
										d="M13.5 22v-8h2.7l.5-3h-3.2V9.1c0-.9.3-1.5 1.6-1.5h1.7V5c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.6V11H7v3h2.6v8h3.9Z"
									></path>
								</svg>
							</a>
							<a
								href="https://x.com/sikoplingkalsel"
								target="_blank"
								rel="noreferrer"
								aria-label="X Sikopling"
								class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"
							>
								<svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
									<path
										d="M18.2 3H21l-6.1 7 7.2 11h-5.6l-4.4-6.8L6.2 21H3.4l6.5-7.4L3 3h5.7l4 6.2L18.2 3Zm-1 16.2h1.6L7.9 4.7H6.2l11 14.5Z"
									></path>
								</svg>
							</a>
							<a
								href="https://youtube.com/@sikoplingkalsel"
								target="_blank"
								rel="noreferrer"
								aria-label="YouTube Sikopling"
								class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-white/10 transition hover:-translate-y-0.5 hover:bg-white/20"
							>
								<svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true">
									<path
										d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5a3 3 0 0 0-2.1 2.1A31.8 31.8 0 0 0 2 12a31.8 31.8 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31.8 31.8 0 0 0 22 12a31.8 31.8 0 0 0-.4-4.8ZM10.1 15.5v-7L16 12l-5.9 3.5Z"
									></path>
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
								<svg
									viewBox="0 0 24 24"
									class="mt-0.5 h-4 w-4 shrink-0"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M7.5 8.5A8 8 0 0 0 15.5 16.5L17.6 14.4a1.5 1.5 0 0 1 1.4-.4l2.3.8a1.5 1.5 0 0 1 1 1.4V20a1.5 1.5 0 0 1-1.5 1.5C11.4 21.5 2.5 12.6 2.5 1.5A1.5 1.5 0 0 1 4 0h3.8a1.5 1.5 0 0 1 1.4 1l.8 2.3a1.5 1.5 0 0 1-.4 1.4L7.5 8.5Z"
									></path>
								</svg>
								<span>
									<span class="block font-semibold">Layanan Pelanggan</span>
									<a href="https://wa.me/6282155667788" class="mt-0.5 block hover:underline">
										+62 821-5566-7788
									</a>
								</span>
							</p>
							<p class="flex items-start gap-2">
								<svg
									viewBox="0 0 24 24"
									class="mt-0.5 h-4 w-4 shrink-0"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
									aria-hidden="true"
								>
									<rect x="3.5" y="4.5" width="17" height="15" rx="2"></rect>
									<path stroke-linecap="round" stroke-linejoin="round" d="m5 7.5 7 5 7-5"></path>
								</svg>
								<span>
									<span class="block font-semibold">ChatBot</span>
									<a href="https://wa.me/6282155667799" class="mt-0.5 block hover:underline">
										+62 821-5566-7799
									</a>
								</span>
							</p>
							<p class="flex items-start gap-2">
								<svg
									viewBox="0 0 24 24"
									class="mt-0.5 h-4 w-4 shrink-0"
									fill="none"
									stroke="currentColor"
									stroke-width="1.8"
									aria-hidden="true"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z"
									></path>
									<circle cx="12" cy="10" r="2.2"></circle>
								</svg>
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
