<script lang="ts">
	type Pillar = {
		title: string;
		desc: string;
	};

	type MatrixRow = {
		scope: string;
		source: string;
		purpose: string;
		retention: string;
	};

	type LifecycleStep = {
		phase: string;
		title: string;
		desc: string;
	};

	type UserRight = {
		label: string;
		detail: string;
	};

	const updatedAt = '18 April 2026';

	const pillars: Pillar[] = [
		{
			title: 'Minim Data',
			desc: 'Kami hanya meminta data yang memang diperlukan untuk menjalankan layanan.'
		},
		{
			title: 'Tujuan Jelas',
			desc: 'Setiap data diproses untuk tujuan yang dijelaskan secara spesifik dan terukur.'
		},
		{
			title: 'Akses Terbatas',
			desc: 'Akses internal dibatasi berdasarkan kewenangan kerja dan kebutuhan operasional.'
		},
		{
			title: 'Evaluasi Berkala',
			desc: 'Kebijakan dan kontrol keamanan ditinjau berkala mengikuti kebutuhan layanan.'
		}
	];

	const matrixRows: MatrixRow[] = [
		{
			scope: 'Identitas Pengguna',
			source: 'Form pengajuan dan akun',
			purpose: 'Verifikasi identitas serta validasi pemilik dokumen',
			retention: 'Selama akun aktif atau sesuai ketentuan arsip layanan'
		},
		{
			scope: 'Riwayat Layanan',
			source: 'Interaksi konsultasi dan proses dokumen',
			purpose: 'Pendampingan proses, pelacakan progres, dan riwayat komunikasi',
			retention: 'Mengikuti masa retensi administrasi pemerintahan'
		},
		{
			scope: 'Data Teknis Akses',
			source: 'Aktivitas penggunaan situs',
			purpose: 'Audit keamanan, pencegahan penyalahgunaan, dan peningkatan performa',
			retention: 'Disimpan terbatas sesuai kebutuhan keamanan sistem'
		}
	];

	const lifecycleSteps: LifecycleStep[] = [
		{
			phase: '01',
			title: 'Pengumpulan',
			desc: 'Data diterima dari input pengguna atau aktivitas layanan yang relevan.'
		},
		{
			phase: '02',
			title: 'Pemrosesan',
			desc: 'Data dipakai untuk verifikasi, konsultasi, dan pengelolaan alur dokumen.'
		},
		{
			phase: '03',
			title: 'Penyimpanan',
			desc: 'Data disimpan pada sistem dengan kontrol akses dan jejak audit internal.'
		},
		{
			phase: '04',
			title: 'Pembaruan / Penghapusan',
			desc: 'Data diperbarui atau dihapus sesuai kebutuhan layanan dan aturan retensi.'
		}
	];

	const userRights: UserRight[] = [
		{
			label: 'Meminta ringkasan data pribadi',
			detail: 'Anda dapat meminta informasi kategori data yang dikelola melalui kanal resmi.'
		},
		{
			label: 'Mengoreksi data yang tidak tepat',
			detail: 'Jika ditemukan ketidaksesuaian, Anda dapat mengajukan pembaruan data.'
		},
		{
			label: 'Menyampaikan keberatan pemrosesan tertentu',
			detail: 'Permintaan akan ditinjau berdasarkan dasar hukum dan kebutuhan layanan publik.'
		},
		{
			label: 'Menyampaikan aduan',
			detail: 'Aduan privasi dapat disampaikan melalui kontak resmi SIKOPLING.'
		}
	];
</script>

<svelte:head>
	<meta
		name="description"
		content="Kebijakan Privasi SIKOPLING: prinsip pengelolaan data, matriks data yang diproses, hak pengguna, dan mekanisme perlindungan privasi."
	/>
</svelte:head>

<section class="privacy-hero relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
	<div class="absolute inset-0 -z-20 hero-lights"></div>
	<div class="absolute inset-0 -z-10 hero-grid"></div>

	<div class="page-shell">
		<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:items-end">
			<div>
				<p class="text-xs font-semibold tracking-[0.15em] text-[#2e7c2a] uppercase">Trust Center</p>
				<h1 class="mt-3 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl lg:text-[3.25rem]">
					Kebijakan Privasi
				</h1>
				<p class="mt-4 max-w-3xl text-base leading-relaxed text-[#455467] sm:text-lg">
					Halaman ini menjelaskan cara SIKOPLING mengelola data pribadi secara bertanggung jawab:
					apa yang dikumpulkan, untuk apa digunakan, berapa lama disimpan, dan bagaimana hak pengguna
					dihormati dalam proses layanan.
				</p>
			</div>

			<aside class="status-card rounded-[1.3rem] border border-[#cadac4] bg-white/92 p-5">
				<p class="text-[0.7rem] font-semibold tracking-[0.11em] text-[#2e7c2a] uppercase">
					Terakhir Diperbarui
				</p>
				<p class="mt-1 text-2xl font-semibold tracking-tight text-[var(--ink)]">{updatedAt}</p>
				<div class="mt-4 space-y-2.5 text-sm text-[#4b596a]">
					<p class="rounded-lg border border-[#d8e4d3] bg-[#f6fbf2] px-3 py-2">
						Referensi utama: prinsip perlindungan data pribadi di Indonesia.
					</p>
					<p class="rounded-lg border border-[#dde7f2] bg-[#f4f8ff] px-3 py-2">
						Untuk hak dan kewajiban penggunaan platform, lihat ketentuan layanan.
					</p>
				</div>
				<a
					href="/ketentuan-layanan"
					class="mt-4 inline-flex items-center rounded-full border border-[#b8d1b3] bg-white px-4 py-2 text-sm font-semibold text-[#2f6f23] transition-colors hover:bg-[#f3f9ee]"
				>
					Ke Ketentuan Layanan
				</a>
			</aside>
		</div>
	</div>
</section>

<section class="pb-16 sm:pb-20">
	<div class="page-shell">
		<div class="grid gap-7 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
			<aside class="lg:sticky lg:top-28 lg:self-start">
				<div class="rounded-2xl border border-[#dce8d8] bg-white p-4">
					<p class="text-[0.7rem] font-semibold tracking-[0.11em] text-[#2e7c2a] uppercase">Daftar Isi</p>
					<nav class="mt-3 space-y-1.5 text-sm">
						<a href="#prinsip-utama" class="toc-link">Prinsip Utama</a>
						<a href="#matriks-data" class="toc-link">Matriks Data</a>
						<a href="#siklus-data" class="toc-link">Siklus Pengelolaan</a>
						<a href="#hak-pengguna" class="toc-link">Hak Pengguna</a>
					</nav>
				</div>
			</aside>

			<div class="space-y-8 sm:space-y-10">
				<section id="prinsip-utama" class="rounded-[1.6rem] border border-[#d8e7d4] bg-white p-5 sm:p-7">
					<h2 class="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">Prinsip Utama</h2>
					<p class="mt-2 max-w-3xl text-sm leading-relaxed text-[#4a596b] sm:text-base">
						Pondasi kebijakan privasi kami dirancang agar dapat dipahami pengguna dan mudah ditelusuri
						dalam praktik operasional harian.
					</p>
					<div class="mt-5 grid gap-3 sm:grid-cols-2">
						{#each pillars as pillar}
							<article class="pillar-card rounded-2xl border border-[#dce9d7] bg-[#fbfdf9] p-4">
								<h3 class="text-lg font-semibold tracking-tight text-[var(--ink)]">{pillar.title}</h3>
								<p class="mt-1.5 text-sm leading-relaxed text-[#4d5d6f]">{pillar.desc}</p>
							</article>
						{/each}
					</div>
				</section>

				<section id="matriks-data" class="rounded-[1.6rem] border border-[#d8e7d4] bg-white p-5 sm:p-7">
					<h2 class="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">Matriks Data</h2>
					<p class="mt-2 max-w-3xl text-sm leading-relaxed text-[#4a596b] sm:text-base">
						Ringkasan berikut membantu Anda melihat hubungan antara kategori data, sumber, tujuan, dan
						masa retensi.
					</p>

					<div class="mt-4 space-y-3 md:hidden">
						{#each matrixRows as row}
							<article class="rounded-2xl border border-[#dce8d8] bg-[#fbfdf9] p-4">
								<p class="text-[0.68rem] font-semibold tracking-[0.12em] text-[#2e7c2a] uppercase">
									{row.scope}
								</p>
								<dl class="mt-2 space-y-2">
									<div class="rounded-xl border border-[#e4ece2] bg-white px-3 py-2.5">
										<dt class="text-[0.68rem] font-semibold tracking-[0.08em] text-[#4d6a43] uppercase">
											Sumber
										</dt>
										<dd class="mt-1 text-sm leading-relaxed text-[#495a6d]">{row.source}</dd>
									</div>
									<div class="rounded-xl border border-[#e4ece2] bg-white px-3 py-2.5">
										<dt class="text-[0.68rem] font-semibold tracking-[0.08em] text-[#4d6a43] uppercase">
											Tujuan Pemrosesan
										</dt>
										<dd class="mt-1 text-sm leading-relaxed text-[#495a6d]">{row.purpose}</dd>
									</div>
									<div class="rounded-xl border border-[#e4ece2] bg-white px-3 py-2.5">
										<dt class="text-[0.68rem] font-semibold tracking-[0.08em] text-[#4d6a43] uppercase">
											Retensi
										</dt>
										<dd class="mt-1 text-sm leading-relaxed text-[#495a6d]">{row.retention}</dd>
									</div>
								</dl>
							</article>
						{/each}
					</div>

					<div class="mt-4 hidden overflow-hidden rounded-2xl border border-[#dce8d8] md:block">
						<div class="overflow-x-auto">
							<table class="w-full min-w-[44rem] border-collapse text-left">
								<thead class="bg-[#f3f9ef]">
									<tr class="text-xs uppercase tracking-[0.09em] text-[#2e6d24]">
										<th class="px-4 py-3 font-semibold">Kategori</th>
										<th class="px-4 py-3 font-semibold">Sumber</th>
										<th class="px-4 py-3 font-semibold">Tujuan Pemrosesan</th>
										<th class="px-4 py-3 font-semibold">Retensi</th>
									</tr>
								</thead>
								<tbody>
									{#each matrixRows as row}
										<tr class="border-t border-[#e4ece2] align-top">
											<td class="px-4 py-3 text-sm font-semibold text-[#1f2d3e]">{row.scope}</td>
											<td class="px-4 py-3 text-sm text-[#495a6d]">{row.source}</td>
											<td class="px-4 py-3 text-sm text-[#495a6d]">{row.purpose}</td>
											<td class="px-4 py-3 text-sm text-[#495a6d]">{row.retention}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</div>
				</section>

				<section id="siklus-data" class="rounded-[1.6rem] border border-[#d8e7d4] bg-white p-5 sm:p-7">
					<h2 class="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
						Siklus Pengelolaan Data
					</h2>
					<div class="mt-5 grid gap-3.5 md:grid-cols-2">
						{#each lifecycleSteps as step}
							<article class="lifecycle-card rounded-2xl border border-[#dce8d8] bg-[#f9fcf7] p-4">
								<p class="text-[0.68rem] font-semibold tracking-[0.12em] text-[#2e7c2a] uppercase">
									Fase {step.phase}
								</p>
								<h3 class="mt-1 text-lg font-semibold tracking-tight text-[var(--ink)]">{step.title}</h3>
								<p class="mt-1.5 text-sm leading-relaxed text-[#4d5d6f]">{step.desc}</p>
							</article>
						{/each}
					</div>
				</section>

				<section id="hak-pengguna" class="rounded-[1.6rem] border border-[#d8e7d4] bg-white p-5 sm:p-7">
					<h2 class="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">Hak Pengguna</h2>
					<ul class="mt-4 space-y-3.5">
						{#each userRights as right}
							<li class="flex gap-3 rounded-2xl border border-[#dbe7d8] bg-[#fbfdf9] px-4 py-3">
								<span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#3eb14a]"></span>
								<div>
									<p class="text-sm font-semibold text-[#1f2d3e] sm:text-base">{right.label}</p>
									<p class="mt-0.5 text-sm leading-relaxed text-[#4d5d6f]">{right.detail}</p>
								</div>
							</li>
						{/each}
					</ul>
					<div class="mt-5 rounded-2xl border border-[#d7e4f0] bg-[#f3f7ff] px-4 py-3 text-sm leading-relaxed text-[#3b4d66]">
						Pengajuan terkait privasi dapat disampaikan melalui halaman <a href="/kontak" class="font-semibold hover:underline">Kontak</a>.
					</div>
				</section>
			</div>
		</div>
	</div>
</section>

<style>
	.privacy-hero {
		background:
			linear-gradient(180deg, #f7fbf2 0%, #ffffff 48%),
			linear-gradient(120deg, rgba(66, 137, 188, 0.06), rgba(62, 177, 74, 0.08));
	}

	.hero-lights {
		background:
			radial-gradient(circle at 8% 18%, rgba(100, 173, 49, 0.2), transparent 42%),
			radial-gradient(circle at 92% 10%, rgba(62, 120, 176, 0.2), transparent 36%);
	}

	.hero-grid {
		background-image:
			linear-gradient(rgba(45, 78, 31, 0.08) 1px, transparent 1px),
			linear-gradient(90deg, rgba(45, 78, 31, 0.08) 1px, transparent 1px);
		background-size: 32px 32px;
		mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.3), transparent 72%);
	}

	.status-card {
		box-shadow: 0 34px 58px -42px rgba(18, 33, 56, 0.56);
	}

	.toc-link {
		display: block;
		border-radius: 0.72rem;
		padding: 0.55rem 0.7rem;
		color: #405166;
		transition: background-color 180ms ease, color 180ms ease;
	}

	.toc-link:hover {
		background: #f1f8ec;
		color: #274f1c;
	}

	.pillar-card {
		border-left: 4px solid #7ac44b;
	}

	.lifecycle-card {
		animation: card-rise 460ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	@keyframes card-rise {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.lifecycle-card {
			animation: none;
		}
	}
</style>
