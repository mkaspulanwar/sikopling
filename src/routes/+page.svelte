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
			<h1
				class="font-hero-title text-[clamp(3rem,10vw,8rem)] font-black uppercase leading-[0.88] tracking-tight text-white drop-shadow-[0_10px_26px_rgba(2,6,23,0.52)]"
			>
				SIKOPLING
			</h1>
			<p
				class="font-hero-copy mt-4 text-[clamp(1rem,2.1vw,1.55rem)] font-medium leading-relaxed text-white/95 drop-shadow-[0_8px_22px_rgba(2,6,23,0.45)] sm:mt-5"
			>
				Saluran Interaktif Konsultasi Persetujuan Lingkungan Dinas Lingkungan Hidup Provinsi Kalimantan Selatan
			</p>
		</div>
	</div>
</section>

<section id="layanan-dashboard" class="scroll-mt-28 bg-[var(--canvas)] py-16 sm:py-20">
	<div class="page-shell">
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#A9B388]">Layanan Utama</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">Ruang Informasi Perizinan</h2>
			<p class="mt-3 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
				Bagian ini masih dummy untuk pengembangan berikutnya, dengan struktur konten yang siap diisi data layanan resmi.
			</p>
		</div>

		<div class="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<article class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
				<h3 class="text-base font-semibold text-[var(--ink)]">Status Pengajuan</h3>
				<p class="mt-2 text-sm leading-relaxed text-[var(--muted)]">Ringkasan alur dokumen dari tahap verifikasi hingga terbit persetujuan.</p>
			</article>
			<article class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
				<h3 class="text-base font-semibold text-[var(--ink)]">Jadwal Konsultasi</h3>
				<p class="mt-2 text-sm leading-relaxed text-[var(--muted)]">Informasi ketersediaan sesi konsultasi layanan untuk masyarakat dan pelaku usaha.</p>
			</article>
			<article class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:col-span-2 lg:col-span-1">
				<h3 class="text-base font-semibold text-[var(--ink)]">Panduan Dokumen</h3>
				<p class="mt-2 text-sm leading-relaxed text-[var(--muted)]">Template persyaratan administrasi dan teknis yang akan dilengkapi di tahap implementasi.</p>
			</article>
		</div>
	</div>
</section>

<section id="layanan-formulir" class="scroll-mt-28 bg-[#f8fafc] py-16 sm:py-20">
	<div class="page-shell">
		<div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#A9B388]">Formulir Online</p>
				<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">Area Formulir Digital (Dummy)</h2>
				<p class="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
					Blok ini disiapkan sebagai placeholder komponen formulir pengajuan dan pembaruan data untuk fase pengembangan selanjutnya.
				</p>
			</div>
			<div class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
				<p class="text-sm font-semibold text-[var(--ink)]">Preview Modul</p>
				<div class="mt-4 space-y-3">
					<div class="h-10 rounded-lg bg-[var(--accent-soft)]"></div>
					<div class="h-10 rounded-lg bg-[var(--accent-soft)]"></div>
					<div class="h-24 rounded-lg bg-[var(--accent-soft)]"></div>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="layanan-tracking" class="scroll-mt-28 bg-[var(--canvas)] py-16 sm:py-20">
	<div class="page-shell">
		<div class="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
			<p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#A9B388]">Tracking Dokumen</p>
			<h2 class="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">Timeline Status (Dummy)</h2>
			<div class="mt-6 grid gap-3 sm:grid-cols-3">
				<div class="rounded-xl bg-[var(--accent-soft)] p-4 text-sm text-[var(--muted)]">Diterima</div>
				<div class="rounded-xl bg-[var(--accent-soft)] p-4 text-sm text-[var(--muted)]">Verifikasi</div>
				<div class="rounded-xl bg-[var(--accent-soft)] p-4 text-sm text-[var(--muted)]">Selesai</div>
			</div>
		</div>
	</div>
</section>

<section id="layanan-bantuan" class="scroll-mt-28 bg-[#f8fafc] py-16 sm:py-20">
	<div class="page-shell">
		<div class="mx-auto max-w-4xl rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
			<p class="text-xs font-semibold uppercase tracking-[0.12em] text-[#A9B388]">Bantuan & FAQ</p>
			<h2 class="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">Pusat Bantuan (Dummy)</h2>
			<div class="mt-6 space-y-3">
				<div class="rounded-xl bg-[var(--accent-soft)] p-4 text-sm text-[var(--muted)]">
					Bagaimana alur konsultasi awal sebelum pengajuan dokumen?
				</div>
				<div class="rounded-xl bg-[var(--accent-soft)] p-4 text-sm text-[var(--muted)]">
					Dokumen apa saja yang perlu dipersiapkan untuk verifikasi?
				</div>
				<div class="rounded-xl bg-[var(--accent-soft)] p-4 text-sm text-[var(--muted)]">
					Ke mana menghubungi admin jika ada kendala data?
				</div>
			</div>
		</div>
	</div>
</section>
