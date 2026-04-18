<script lang="ts">
	type RuleBlock = {
		code: string;
		title: string;
		desc: string;
		items: string[];
	};

	const updatedAt = '18 April 2026';

	const allowedItems = [
		'Menggunakan platform untuk konsultasi dan pemantauan dokumen lingkungan.',
		'Menyampaikan data yang valid, relevan, dan dapat diverifikasi.',
		'Meminta bantuan petugas jika ada kendala proses atau informasi.',
		'Melaporkan bug atau perilaku mencurigakan demi keamanan layanan.'
	];

	const forbiddenItems = [
		'Menyalahgunakan akun pihak lain atau berbagi kredensial secara sembarangan.',
		'Mengunggah data palsu, menyesatkan, atau dokumen yang tidak berwenang.',
		'Mencoba mengganggu sistem, scraping agresif, atau akses tanpa izin.',
		'Menggunakan kanal layanan untuk promosi dan aktivitas non-layanan publik.'
	];

	const ruleBlocks: RuleBlock[] = [
		{
			code: 'Bab 01',
			title: 'Ruang Lingkup',
			desc: 'Mengatur batas dan fungsi penggunaan platform SIKOPLING.',
			items: [
				'SIKOPLING adalah kanal digital untuk informasi, konsultasi, dan monitoring progres layanan.',
				'Konten pada platform bersifat pendukung proses administratif, bukan pengganti keputusan resmi instansi.',
				'Fitur dapat diperbarui untuk peningkatan kualitas layanan.'
			]
		},
		{
			code: 'Bab 02',
			title: 'Akun dan Tanggung Jawab',
			desc: 'Menjelaskan peran pengguna dalam menjaga keamanan akses akun.',
			items: [
				'Pengguna bertanggung jawab atas aktivitas pada akun masing-masing.',
				'Kerusakan akibat kelalaian menjaga kredensial menjadi tanggung jawab pemilik akun.',
				'Indikasi penyalahgunaan akun harus segera dilaporkan ke kanal resmi.'
			]
		},
		{
			code: 'Bab 03',
			title: 'Penggunaan yang Diperbolehkan',
			desc: 'Prinsip etika pemanfaatan layanan untuk proses yang tertib.',
			items: [
				'Data dan komunikasi yang disampaikan wajib benar dan relevan.',
				'Pengguna menjaga etika berkomunikasi dengan petugas layanan.',
				'Penggunaan sistem harus mengikuti prosedur operasional yang berlaku.'
			]
		},
		{
			code: 'Bab 04',
			title: 'Pembatasan dan Sanksi',
			desc: 'Tindakan yang dilarang serta langkah mitigasi yang dapat diambil.',
			items: [
				'Pelanggaran kebijakan dapat berujung pembatasan akses sementara atau permanen.',
				'SIKOPLING dapat menonaktifkan akses untuk aktivitas berisiko terhadap keamanan sistem.',
				'Penanganan pelanggaran dilakukan sesuai ketentuan hukum yang berlaku.'
			]
		},
		{
			code: 'Bab 05',
			title: 'Ketersediaan Layanan',
			desc: 'Kondisi operasional normal, pemeliharaan, dan keadaan kahar.',
			items: [
				'Layanan dapat mengalami jeda untuk pemeliharaan terjadwal maupun insidental.',
				'Gangguan di luar kendali (force majeure) dapat memengaruhi waktu respons.',
				'Informasi gangguan penting akan diumumkan melalui kanal resmi.'
			]
		},
		{
			code: 'Bab 06',
			title: 'Perubahan Ketentuan',
			desc: 'Mekanisme pembaruan kebijakan ketentuan layanan.',
			items: [
				'Ketentuan dapat diperbarui mengikuti kebutuhan layanan dan regulasi.',
				'Versi terbaru berlaku sejak tanggal pembaruan yang ditampilkan di halaman ini.',
				'Penggunaan layanan setelah pembaruan berarti persetujuan atas ketentuan terbaru.'
			]
		}
	];
</script>

<svelte:head>
	<meta
		name="description"
		content="Ketentuan Layanan SIKOPLING: ruang lingkup layanan, tanggung jawab pengguna, penggunaan yang diperbolehkan, serta pembatasan dan pembaruan ketentuan."
	/>
</svelte:head>

<section class="terms-hero relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
	<div class="absolute inset-0 -z-20 hero-lights"></div>
	<div class="absolute inset-0 -z-10 hero-grid"></div>

	<div class="page-shell">
		<div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:items-end">
			<div>
				<p class="text-xs font-semibold tracking-[0.15em] text-[#2e7c2a] uppercase">Trust Center</p>
				<h1 class="mt-3 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-[var(--ink)] sm:text-4xl lg:text-[3.25rem]">
					Ketentuan Layanan
				</h1>
				<p class="mt-4 max-w-3xl text-base leading-relaxed text-[#455467] sm:text-lg">
					Ketentuan ini menjadi pedoman bersama agar penggunaan SIKOPLING tetap aman, tertib, dan
					berorientasi pada kualitas layanan publik. Ringkasan di bawah membantu Anda memahami hak,
					tanggung jawab, serta batas penggunaan platform secara jelas.
				</p>
				<div class="mt-5 flex flex-wrap gap-2.5">
					<span class="rounded-full border border-[#d6e6d0] bg-[#f5fbf1] px-3 py-1 text-xs font-semibold tracking-[0.09em] text-[#2d6b20] uppercase">
						Operasional Platform
					</span>
					<span class="rounded-full border border-[#d6e6d0] bg-[#f5fbf1] px-3 py-1 text-xs font-semibold tracking-[0.09em] text-[#2d6b20] uppercase">
						Keamanan Akses
					</span>
					<span class="rounded-full border border-[#d6e6d0] bg-[#f5fbf1] px-3 py-1 text-xs font-semibold tracking-[0.09em] text-[#2d6b20] uppercase">
						Kepatuhan Pengguna
					</span>
				</div>
			</div>

			<aside class="status-card rounded-[1.3rem] border border-[#cadac4] bg-white/92 p-5">
				<p class="text-[0.7rem] font-semibold tracking-[0.11em] text-[#2e7c2a] uppercase">
					Terakhir Diperbarui
				</p>
				<p class="mt-1 text-2xl font-semibold tracking-tight text-[var(--ink)]">{updatedAt}</p>
				<div class="mt-4 space-y-2.5 text-sm text-[#4b596a]">
					<p class="rounded-lg border border-[#d8e4d3] bg-[#f6fbf2] px-3 py-2">
						Penggunaan layanan setelah tanggal ini berarti persetujuan pada ketentuan terbaru.
					</p>
					<p class="rounded-lg border border-[#dde7f2] bg-[#f4f8ff] px-3 py-2">
						Pelajari pengelolaan data pengguna pada halaman kebijakan privasi.
					</p>
				</div>
				<a
					href="/kebijakan-privasi"
					class="mt-4 inline-flex items-center rounded-full border border-[#b8d1b3] bg-white px-4 py-2 text-sm font-semibold text-[#2f6f23] transition-colors hover:bg-[#f3f9ee]"
				>
					Lihat Kebijakan Privasi
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
						<a href="#penggunaan" class="toc-link">Prinsip Penggunaan</a>
						<a href="#bab-ketentuan" class="toc-link">Bab Ketentuan</a>
						<a href="#ketersediaan" class="toc-link">Ketersediaan Layanan</a>
						<a href="#klarifikasi" class="toc-link">Klarifikasi</a>
					</nav>
				</div>
			</aside>

			<div class="space-y-8 sm:space-y-10">
				<section id="penggunaan" class="rounded-[1.6rem] border border-[#d8e7d4] bg-white p-5 sm:p-7">
					<h2 class="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
						Prinsip Penggunaan Platform
					</h2>
					<p class="mt-2 max-w-3xl text-sm leading-relaxed text-[#4a596b] sm:text-base">
						Ringkasan ini memisahkan praktik yang direkomendasikan dan aktivitas yang harus dihindari
						agar proses layanan tetap aman dan tertib.
					</p>

					<div class="mt-5 grid gap-4 lg:grid-cols-2">
						<article class="usage-card rounded-2xl border border-[#d7e4d3] bg-[#f8fcf5] p-4 sm:p-5">
							<p class="text-xs font-semibold tracking-[0.12em] text-[#2b6b1f] uppercase">Yang Diperbolehkan</p>
							<ul class="mt-3 space-y-2.5">
								{#each allowedItems as item}
									<li class="flex items-start gap-2.5 text-sm leading-relaxed text-[#425268] sm:text-base">
										<span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#3eb14a]"></span>
										<span>{item}</span>
									</li>
								{/each}
							</ul>
						</article>

						<article class="usage-card rounded-2xl border border-[#f0d7cf] bg-[#fff9f7] p-4 sm:p-5">
							<p class="text-xs font-semibold tracking-[0.12em] text-[#a34b2d] uppercase">
								Yang Tidak Diperbolehkan
							</p>
							<ul class="mt-3 space-y-2.5">
								{#each forbiddenItems as item}
									<li class="flex items-start gap-2.5 text-sm leading-relaxed text-[#5d4d4a] sm:text-base">
										<span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#cf6d4a]"></span>
										<span>{item}</span>
									</li>
								{/each}
							</ul>
						</article>
					</div>
				</section>

				<section id="bab-ketentuan" class="rounded-[1.6rem] border border-[#d8e7d4] bg-white p-5 sm:p-7">
					<h2 class="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
						Bab Ketentuan Layanan
					</h2>
					<p class="mt-2 max-w-3xl text-sm leading-relaxed text-[#4a596b] sm:text-base">
						Setiap bab menjelaskan ruang lingkup penggunaan SIKOPLING, akuntabilitas akun, serta
						langkah penanganan pelanggaran.
					</p>

					<div class="mt-5 grid gap-3.5 md:grid-cols-2">
						{#each ruleBlocks as rule}
							<article class="rule-card rounded-2xl border border-[#dce8d8] bg-[#fbfdf9] p-4">
								<p class="text-[0.68rem] font-semibold tracking-[0.12em] text-[#2e7c2a] uppercase">
									{rule.code}
								</p>
								<h3 class="mt-1 text-lg font-semibold tracking-tight text-[var(--ink)]">{rule.title}</h3>
								<p class="mt-1.5 text-sm leading-relaxed text-[#4d5d6f]">{rule.desc}</p>
								<ul class="mt-3 space-y-2.5">
									{#each rule.items as item}
										<li class="flex items-start gap-2.5 rounded-xl border border-[#e2ebdf] bg-white px-3 py-2.5 text-sm leading-relaxed text-[#425267]">
											<span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#63ac31]"></span>
											<span>{item}</span>
										</li>
									{/each}
								</ul>
							</article>
						{/each}
					</div>
				</section>

				<section id="ketersediaan" class="rounded-[1.6rem] border border-[#d8e7d4] bg-white p-5 sm:p-7">
					<h2 class="text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
						Ketersediaan dan Pembaruan Layanan
					</h2>
					<div class="mt-4 grid gap-3.5 md:grid-cols-2">
						<article class="rounded-2xl border border-[#dce8d8] bg-[#f9fcf7] p-4">
							<h3 class="text-base font-semibold text-[var(--ink)] sm:text-lg">Pemeliharaan Sistem</h3>
							<p class="mt-1.5 text-sm leading-relaxed text-[#4d5d6f]">
								Layanan dapat mengalami jeda saat pemeliharaan terjadwal maupun insidental untuk
								menjaga kestabilan platform.
							</p>
						</article>
						<article class="rounded-2xl border border-[#d7e4f0] bg-[#f3f7ff] p-4">
							<h3 class="text-base font-semibold text-[var(--ink)] sm:text-lg">Perubahan Ketentuan</h3>
							<p class="mt-1.5 text-sm leading-relaxed text-[#4d5d6f]">
								Versi ketentuan dapat diperbarui mengikuti kebutuhan layanan dan regulasi, berlaku
								sejak tanggal pembaruan di halaman ini.
							</p>
						</article>
					</div>
				</section>

				<section id="klarifikasi" class="rounded-[1.6rem] border border-[#d9e4d6] bg-white p-6 sm:p-8">
					<div class="lg:flex lg:items-center lg:justify-between lg:gap-8">
						<div class="max-w-2xl">
							<p class="text-xs font-semibold tracking-[0.13em] text-[#2d6b20] uppercase">
								Klarifikasi Ketentuan
							</p>
							<h2 class="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
								Butuh Penjelasan Lebih Lanjut?
							</h2>
							<p class="mt-3 text-sm leading-relaxed text-[#495a6d] sm:text-base">
								Jika ada poin ketentuan yang perlu diperjelas, silakan hubungi kanal resmi SIKOPLING
								agar tim kami dapat membantu sesuai konteks layanan Anda.
							</p>
						</div>
						<div class="mt-5 flex flex-wrap gap-3 lg:mt-0">
							<a
								href="/kontak"
								class="inline-flex items-center justify-center rounded-full bg-[#64AD31] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4f8b26]"
							>
								Hubungi Tim
							</a>
							<a
								href="/kebijakan-privasi"
								class="inline-flex items-center justify-center rounded-full border border-[#bfd3bc] bg-white px-5 py-2.5 text-sm font-semibold text-[#2f6f23] transition-colors hover:bg-[#f4faef]"
							>
								Baca Kebijakan Privasi
							</a>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</section>

<style>
	.terms-hero {
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

	.usage-card {
		border-left: 4px solid rgba(99, 172, 49, 0.42);
	}

	.rule-card {
		animation: rule-rise 520ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	@keyframes rule-rise {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rule-card {
			animation: none;
		}
	}
</style>
