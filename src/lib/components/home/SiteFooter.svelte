<script lang="ts">
	import { page } from '$app/state';

	const currentYear = new Date().getFullYear();
	const isLandingPage = () => page.url.pathname === '/';
	const sectionHref = (sectionId: string) =>
		sectionId === 'beranda' ? '/' : isLandingPage() ? `#${sectionId}` : `/#${sectionId}`;
	const handleBerandaClick = (event: MouseEvent) => {
		if (!isLandingPage()) return;
		event.preventDefault();
		const berandaSection = document.getElementById('beranda');
		if (berandaSection) {
			berandaSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
		} else {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
		if (window.location.hash) {
			history.replaceState(history.state, '', `${window.location.pathname}${window.location.search}`);
		}
	};
</script>

<footer id="kontak" class="border-t border-[var(--line)] bg-[var(--surface)]">
	<div class="nav-shell py-12 md:py-14">
		<div class="border-b border-[var(--line)] pb-7 md:pb-8">
			<p class="text-sm font-semibold tracking-[0.09em] text-[var(--ink)]">SIKOPLING</p>
			<p class="mt-2 text-sm leading-relaxed text-[var(--muted)]">
				Portal layanan informasi dan konsultasi persetujuan lingkungan Dinas Lingkungan Hidup
				Provinsi Kalimantan Selatan untuk pelayanan publik yang transparan, terukur, dan akuntabel.
			</p>
		</div>

		<div class="grid gap-7 pt-7 sm:grid-cols-2 lg:grid-cols-4">
			<section id="tentang">
				<h3 class="text-sm font-semibold tracking-[0.08em] text-[var(--ink)] uppercase">Tentang</h3>
				<p class="mt-3 text-sm leading-relaxed text-[var(--muted)]">
					Kanal resmi informasi layanan persetujuan lingkungan pada DLH Provinsi Kalimantan Selatan.
				</p>
			</section>

			<section>
				<h3 class="text-sm font-semibold tracking-[0.08em] text-[var(--ink)] uppercase">
					Akses Cepat
				</h3>
				<div class="mt-3 space-y-2 text-sm text-[var(--muted)]">
					<a
						href={sectionHref('beranda')}
						class="block transition-colors"
						onclick={handleBerandaClick}
						>Beranda</a
					>
					<a href="/tentang" class="block transition-colors">Tentang</a>
					<a href="/kontak" class="block transition-colors">Kontak</a>
				</div>
			</section>

			<section>
				<h3 class="text-sm font-semibold tracking-[0.08em] text-[var(--ink)] uppercase">Layanan</h3>
				<div class="mt-3 space-y-2 text-sm text-[var(--muted)]">
					<a
						href={sectionHref('layanan-dashboard')}
						class="block transition-colors">Statistik Layanan</a
					>
					<a
						href={sectionHref('layanan-dokumen')}
						class="block transition-colors">Layanan Dokumen</a
					>
					<a
						href={sectionHref('alur-percepatan')}
						class="block transition-colors">8 Langkah Percepatan</a
					>
				</div>
			</section>

			<section>
				<h3 class="text-sm font-semibold tracking-[0.08em] text-[var(--ink)] uppercase">Kontak</h3>
				<div class="mt-3 space-y-2 text-sm text-[var(--muted)]">
					<p>(0511) 326-7711</p>
					<p>layanan.dlh@kalselprov.go.id</p>
					<p>Banjarbaru, Kalimantan Selatan</p>
				</div>
			</section>
		</div>

		<div
			class="mt-7 flex flex-col gap-2 border-t border-[var(--line)] pt-4 text-xs text-[var(--muted)] md:flex-row md:items-center md:justify-between"
		>
			<p>
				&copy; {currentYear} Dinas Lingkungan Hidup Provinsi Kalimantan Selatan. Seluruh hak cipta dilindungi.
			</p>
			<div class="flex items-center gap-4">
				<a href="/kebijakan-privasi" class="transition-colors">Kebijakan Privasi</a>
				<a href="/ketentuan-layanan" class="transition-colors">Ketentuan Layanan</a>
			</div>
		</div>
	</div>
</footer>
