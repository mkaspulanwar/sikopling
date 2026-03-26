<script lang="ts">
	const currentYear = new Date().getFullYear();
</script>

<footer id="kontak" class="border-t border-[var(--line)] bg-[var(--surface)]">
	<div class="nav-shell py-12 md:py-14">
		<div class="border-b border-[var(--line)] pb-7 md:pb-8">
			<p class="text-sm font-semibold tracking-[0.09em] text-[var(--ink)]">SIKOPLING</p>
			<p class="mt-2 text-sm leading-relaxed text-[var(--muted)]">
				Portal layanan informasi dan konsultasi persetujuan lingkungan Dinas Lingkungan Hidup Provinsi
				Kalimantan Selatan untuk pelayanan publik yang transparan, terukur, dan akuntabel.
			</p>
		</div>

		<div class="grid gap-7 pt-7 sm:grid-cols-2 lg:grid-cols-4">
			<section id="tentang">
				<h3 class="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--ink)]">Tentang</h3>
				<p class="mt-3 text-sm leading-relaxed text-[var(--muted)]">
					Kanal resmi informasi layanan persetujuan lingkungan pada DLH Provinsi Kalimantan Selatan.
				</p>
			</section>

			<section>
				<h3 class="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--ink)]">Akses Cepat</h3>
				<div class="mt-3 space-y-2 text-sm text-[var(--muted)]">
					<a href="#beranda" class="block transition-colors hover:text-[#A9B388]">Beranda</a>
					<a href="#tentang" class="block transition-colors hover:text-[#A9B388]">Tentang</a>
					<a href="#kontak" class="block transition-colors hover:text-[#A9B388]">Kontak</a>
				</div>
			</section>

			<section>
				<h3 class="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--ink)]">Layanan</h3>
				<div class="mt-3 space-y-2 text-sm text-[var(--muted)]">
					<a href="#layanan-dashboard" class="block transition-colors hover:text-[#A9B388]">Dashboard Layanan</a>
					<a href="#layanan-formulir" class="block transition-colors hover:text-[#A9B388]">Formulir Online</a>
					<a href="#layanan-tracking" class="block transition-colors hover:text-[#A9B388]">Tracking Dokumen</a>
				</div>
			</section>

			<section>
				<h3 class="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--ink)]">Kontak</h3>
				<div class="mt-3 space-y-2 text-sm text-[var(--muted)]">
					<p>(0511) 326-7711</p>
					<p>layanan.dlh@kalselprov.go.id</p>
					<p>Banjarbaru, Kalimantan Selatan</p>
				</div>
			</section>
		</div>

		<div class="mt-7 flex flex-col gap-2 border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)] md:flex-row md:items-center md:justify-between">
			<p>&copy; {currentYear} Dinas Lingkungan Hidup Provinsi Kalimantan Selatan. Seluruh hak cipta dilindungi.</p>
			<div class="flex items-center gap-4">
				<a href="/kebijakan-privasi" class="transition-colors hover:text-[#A9B388]">Kebijakan Privasi</a>
				<a href="/ketentuan-layanan" class="transition-colors hover:text-[#A9B388]">Ketentuan Layanan</a>
			</div>
		</div>
	</div>
</footer>
