<section id="beranda" class="pb-16 pt-8 md:pt-10">
	<div class="page-shell">
		<div
			class="relative min-h-[74dvh] overflow-hidden rounded-[2.5rem] border border-[rgb(255_255_255/0.45)] bg-[linear-gradient(180deg,#647a57_0%,#a8b489_45%,#ebe8d4_100%)] px-6 py-12 shadow-[0_30px_80px_-55px_rgba(36,49,40,0.7)] md:px-12 md:py-16"
		>
			<div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,249,232,0.45),transparent_52%)]"></div>
			<div class="absolute bottom-0 left-0 right-0 h-48 bg-[linear-gradient(180deg,rgba(90,108,79,0)_0%,rgba(66,84,58,0.45)_100%)]"></div>
			<div class="absolute -bottom-14 -left-10 h-44 w-[56%] rounded-[100%] bg-[rgb(70_90_61/0.36)] blur-md"></div>
			<div class="absolute -bottom-20 right-0 h-52 w-[50%] rounded-[100%] bg-[rgb(59_78_51/0.42)] blur-md"></div>

			<div class="relative mx-auto max-w-3xl text-center text-[var(--ink)]">
				<p
					class="inline-flex items-center rounded-full border border-[rgb(255_255_255/0.56)] bg-[rgb(250_247_236/0.58)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]"
				>
					Layanan Perizinan Lingkungan Provinsi Kalimantan Selatan
				</p>
				<h1 class="mt-6 text-4xl font-semibold leading-tight tracking-tight text-[var(--ink)] md:text-[3.75rem]">
					Cek antrean pengajuan perizinan lingkungan dalam satu pencarian.
				</h1>
				<p class="mx-auto mt-4 max-w-[58ch] text-base leading-relaxed text-[rgb(30_42_34/0.85)]">
					Masukkan nomor registrasi atau nama usaha untuk melihat posisi antrean, status verifikasi, dan
					estimasi layanan terbaru.
				</p>

				<form id="hero-search" class="mx-auto mt-8 max-w-3xl" action="#informasi" method="get">
					<label for="search-antrean" class="block text-left text-sm font-medium text-[rgb(27_38_31/0.92)]">
						Cari nomor registrasi atau nama usaha
					</label>
					<div class="mt-2 flex flex-col gap-2 rounded-full border border-[rgb(245_241_229/0.85)] bg-[rgb(255_253_246/0.94)] p-2 shadow-[0_16px_34px_-28px_rgba(17,24,39,0.65)] sm:flex-row sm:items-center">
						<input
							id="search-antrean"
							name="q"
							type="search"
							placeholder="Contoh: A-058 atau PT Borneo Hijau"
							class="h-12 w-full rounded-full border-0 bg-transparent px-5 text-sm text-[var(--ink)] placeholder:text-[rgb(79_96_87/0.78)] focus:ring-0"
						/>
						<button
							type="submit"
							class="inline-flex h-12 shrink-0 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-7 text-sm font-semibold text-[var(--accent-ink)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 active:-translate-y-[1px] active:scale-[0.98]"
						>
							Cari Sekarang
						</button>
					</div>
				</form>

				<div class="mx-auto mt-7 grid max-w-4xl gap-3 text-left sm:grid-cols-3">
					<div class="rounded-2xl border border-[rgb(255_255_255/0.46)] bg-[rgb(250_247_236/0.74)] px-4 py-3 backdrop-blur-[1px]">
						<p class="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Antrean aktif</p>
						<p class="mt-1 text-2xl font-semibold text-[var(--ink)]">142 berkas</p>
					</div>
					<div class="rounded-2xl border border-[rgb(255_255_255/0.46)] bg-[rgb(250_247_236/0.74)] px-4 py-3 backdrop-blur-[1px]">
						<p class="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Sedang diverifikasi</p>
						<p class="mt-1 text-2xl font-semibold text-[var(--ink)]">58 berkas</p>
					</div>
					<div class="rounded-2xl border border-[rgb(255_255_255/0.46)] bg-[rgb(250_247_236/0.74)] px-4 py-3 backdrop-blur-[1px]">
						<p class="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Rata-rata layanan</p>
						<p class="mt-1 text-2xl font-semibold text-[var(--ink)]">2.4 hari</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
