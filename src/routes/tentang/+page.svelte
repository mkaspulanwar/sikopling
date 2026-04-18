<script lang="ts">
	type HistoryItem = {
		phase: string;
		title: string;
		description: string;
	};

	type FlowStep = {
		title: string;
		description: string;
	};

	type QuickInfo = {
		label: string;
		detail: string;
		href?: string;
		linkLabel?: string;
	};

	type AccelerationStep = {
		title: string;
		summary: string;
	};

	const historyItems: HistoryItem[] = [
		{
			phase: 'Fase 01',
			title: 'Awal Transformasi Layanan',
			description:
				'DLH Provinsi Kalimantan Selatan membangun pendekatan konsultasi yang lebih mudah diakses agar pemrakarsa tidak lagi bergantung pada proses manual.'
		},
		{
			phase: 'Fase 02',
			title: 'Lahirnya Kanal SI-KOPLING',
			description:
				'SI-KOPLING hadir sebagai saluran interaktif untuk mempercepat komunikasi, memberi jawaban awal, dan mengarahkan pengguna ke petugas yang tepat.'
		},
		{
			phase: 'Fase 03',
			title: 'Integrasi Dokumen & Progres',
			description:
				'Layanan berkembang dengan pemantauan progres dokumen, dukungan persetujuan teknis, serta alur pengiriman SK yang lebih terstruktur.'
		},
		{
			phase: 'Fase 04',
			title: 'Layanan Adaptif Berkelanjutan',
			description:
				'Saat ini SI-KOPLING terus diperkuat dengan prinsip cepat, transparan, non-tunai, anti gratifikasi, dan ramah lingkungan.'
		}
	];

	const flowSteps: FlowStep[] = [
		{
			title: 'Kenalan',
			description:
				'Saat memulai chat, SI-KOPLING menyapa dan mengenalkan topik layanan persetujuan lingkungan yang bisa dibantu.'
		},
		{
			title: 'Pilih Menu',
			description: 'Pengguna memilih kategori kebutuhan seperti dokumen lingkungan atau persetujuan teknis.'
		},
		{
			title: 'Dapat Jawaban',
			description: 'Sistem memberi jawaban cepat untuk kebutuhan informasi dasar dan alur proses.'
		},
		{
			title: 'Terhubung Petugas',
			description:
				'Jika perlu pendalaman, SI-KOPLING meneruskan konsultasi ke petugas layanan yang kompeten.'
		}
	];

	const documentTypes = [
		'AMDAL',
		'UKL - UPL',
		'DELH - DPLH',
		'Addendum',
		'Rincian Teknis Limbah B3',
		'Persetujuan Teknis Air Limbah',
		'Persetujuan Teknis Emisi Udara'
	];

	const quickInfos: QuickInfo[] = [
		{
			label: 'WhatsApp CS',
			detail: '0821-1831-4634',
			href: 'https://wa.me/6282118314634',
			linkLabel: 'Hubungi Sekarang'
		},
		{
			label: 'Jam Operasional',
			detail: 'Senin - Jumat, 09.00 - 15.00 WITA'
		},
		{
			label: 'Survei Kepuasan',
			detail: 'Bantu kami meningkatkan mutu layanan SI-KOPLING.',
			href: 'https://bit.ly/SurveyKepuasanMasyarakatDLHprovkalsel',
			linkLabel: 'Isi Survei'
		}
	];

	const deliveryFields = ['Nama penerima', 'Alamat lengkap', 'Nomor telepon'];

	const accelerationSteps: AccelerationStep[] = [
		{
			title: 'Media Interaktif',
			summary: 'Pemrakarsa masuk SI-KOPLING dan chat dengan petugas layanan.'
		},
		{
			title: 'Pertemuan Daring',
			summary: 'Konsultasi, verifikasi, dan pembahasan dilakukan secara online.'
		},
		{
			title: 'Pemantauan Progres',
			summary: 'Tersedia tautan untuk memantau perkembangan dokumen secara berkala.'
		},
		{
			title: 'Biaya Cashless',
			summary: 'Pengelolaan biaya rapat dilakukan non tunai sesuai ketentuan.'
		},
		{
			title: 'Waktu Terukur',
			summary: 'AMDAL/DELH 10 hari kerja, UKL-UPL/DPLH 5 hari kerja.'
		},
		{
			title: 'Pengiriman Dokumen',
			summary: 'Dokumen fisik dikirim langsung melalui ekspedisi ke pemrakarsa.'
		},
		{
			title: 'Bebas Gratifikasi',
			summary: 'Dilarang memberi atau menerima gratifikasi dalam bentuk apa pun.'
		},
		{
			title: 'Ramah Lingkungan',
			summary: 'Mendorong paperless, zero waste, hemat energi, dan rendah karbon.'
		}
	];
</script>

<svelte:head>
	<meta
		name="description"
		content="Tentang SI-KOPLING DLH Kalimantan Selatan: sejarah layanan, alur konsultasi, ruang lingkup dokumen, dan komitmen percepatan persetujuan lingkungan."
	/>
</svelte:head>

<section class="relative overflow-hidden pt-28 pb-14 sm:pt-32 sm:pb-20" id="tentang-hero">
	<div
		class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_14%_12%,rgba(103,191,70,0.2),transparent_42%),radial-gradient(circle_at_88%_20%,rgba(74,137,211,0.18),transparent_38%)]"
	></div>
	<div class="absolute inset-0 -z-10 grain-overlay"></div>

	<div class="page-shell">
		<div class="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
			<div>
				<p class="text-xs font-semibold tracking-[0.13em] text-[#6f8d46] uppercase">Tentang SI-KOPLING</p>
				<h1 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl lg:text-[3.15rem]">
					Layanan yang Dibangun untuk Mempermudah Pemrakarsa
				</h1>
				<p class="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
					SI-KOPLING (Saluran Interaktif Konsultasi Persetujuan Lingkungan) membantu akses
					informasi, mempercepat respons layanan, dan memperkuat kualitas pendampingan proses
					persetujuan lingkungan di Kalimantan Selatan.
				</p>

				<blockquote
					class="mt-6 rounded-2xl border border-[#d8e8cd] bg-[#f3faec] px-4 py-3 text-sm leading-relaxed text-[#355d18] sm:text-base"
				>
					"Care for the environment today for a better life tomorrow."
				</blockquote>

				<div class="mt-6 flex flex-wrap gap-3">
					<a
						href="https://wa.me/6282118314634"
						target="_blank"
						rel="noreferrer"
						class="inline-flex items-center justify-center rounded-full bg-[#64AD31] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4e8a24]"
					>
						Hubungi CS
					</a>
					<a
						href="#sejarah-sikopling"
						class="inline-flex items-center justify-center rounded-full border border-[#b8d39f] bg-white px-5 py-2.5 text-sm font-semibold text-[#426f1d] transition-colors hover:bg-[#f6fbf1]"
					>
						Lihat Sejarah
					</a>
				</div>
			</div>

			<figure class="relative">
				<div class="tilt-right overflow-hidden rounded-[1.75rem] border border-[#d6e5ce] bg-white p-3 shadow-[0_38px_70px_-46px_rgba(15,23,42,0.55)] sm:p-4">
					<img
						src="/tentang/gedung_dlh.jpeg"
						alt="Gedung Dinas Lingkungan Hidup Provinsi Kalimantan Selatan"
						class="h-auto w-full rounded-[1.05rem]"
					/>
				</div>
				<figcaption
					class="tilt-left absolute -bottom-6 -left-2 max-w-[14rem] rounded-2xl border border-[#d5e2f1] bg-white px-4 py-3 text-xs leading-relaxed text-[#35527a] shadow-[0_18px_28px_-20px_rgba(15,23,42,0.5)] sm:max-w-[17rem] sm:text-sm"
				>
					Pendekatan layanan yang lebih manusiawi: respons cepat, jelas, dan mudah dipahami.
				</figcaption>
			</figure>
		</div>
	</div>
</section>

<section id="sejarah-sikopling" class="bg-[#f8fbf6] py-16 sm:py-20">
	<div class="page-shell">
		<div class="grid items-start gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10">
			<div>
				<p class="text-xs font-semibold tracking-[0.13em] text-[#6f8d46] uppercase">Sejarah</p>
				<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
					Perjalanan SI-KOPLING
				</h2>
				<p class="mt-3 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
					Bagian ini merangkum evolusi layanan SI-KOPLING dari semangat awal transformasi hingga
					komitmen pelayanan yang terus ditingkatkan.
				</p>

				<div class="mt-6 overflow-hidden rounded-[1.6rem] border border-[#d8e8cd] bg-white p-3 sm:p-4">
					<img
						src="/tentang/0km_tower.jpg"
						alt="Pemandangan kawasan 0 Kilometer sebagai bagian narasi perjalanan layanan"
						class="h-auto w-full rounded-2xl"
					/>
				</div>
			</div>

			<ol class="relative space-y-4 border-l-2 border-[#d8e8cd] pl-5 sm:pl-6">
				{#each historyItems as item}
					<li class="story-card relative rounded-2xl border border-[#dce8d5] bg-white p-4 sm:p-5">
						<span class="absolute -left-[1.78rem] top-5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#64AD31]"></span>
						<p class="text-[0.68rem] font-semibold tracking-[0.13em] text-[#6f8d46] uppercase">{item.phase}</p>
						<h3 class="mt-1 text-xl font-semibold tracking-tight text-[var(--ink)]">{item.title}</h3>
						<p class="mt-2 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{item.description}</p>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>

<section id="cara-kerja" class="bg-white py-16 sm:py-20">
	<div class="page-shell">
		<div class="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
			<div>
				<p class="text-xs font-semibold tracking-[0.13em] text-[#6f8d46] uppercase">Cara Kerja</p>
				<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
					Interaksi yang Sederhana, Hasil yang Jelas
				</h2>
				<p class="mt-3 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
					Alur SI-KOPLING dirancang agar pengguna merasa dibimbing dari pertanyaan awal sampai
					penanganan teknis oleh petugas layanan.
				</p>

				<ol class="mt-7 space-y-3.5">
					{#each flowSteps as step, index}
						<li class="rounded-2xl border border-[var(--line)] bg-[#fbfdf9] p-4 sm:p-5">
							<div class="flex items-start gap-3">
								<span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#64AD31] text-sm font-bold text-white">
									{index + 1}
								</span>
								<div>
									<h3 class="text-xl font-semibold tracking-tight text-[var(--ink)]">{step.title}</h3>
									<p class="mt-1.5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">{step.description}</p>
								</div>
							</div>
						</li>
					{/each}
				</ol>
			</div>

			<div class="space-y-4">
				<figure class="tilt-right overflow-hidden rounded-[1.5rem] border border-[#dce8d5] bg-[#f8fbf6] p-4">
					<img src="/layout/maskot.svg" alt="Maskot SI-KOPLING" class="mx-auto h-[18rem] w-auto sm:h-[20rem]" />
				</figure>
				<div class="rounded-2xl border border-[#dce8d5] bg-[#f4faee] p-4 sm:p-5">
					<p class="text-xs font-semibold tracking-[0.1em] text-[#6f8d46] uppercase">Catatan Layanan</p>
					<p class="mt-2 text-sm leading-relaxed text-[#355d18] sm:text-base">
						Jika pertanyaan butuh klarifikasi lanjutan, pengguna akan langsung diarahkan ke petugas
						layanan untuk pendampingan yang lebih detail.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="ruang-lingkup" class="bg-[#f8fbf6] py-16 sm:py-20">
	<div class="page-shell">
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-xs font-semibold tracking-[0.13em] text-[#6f8d46] uppercase">Ruang Lingkup Layanan</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
				Dokumen, Kontak, dan Pengiriman SK
			</h2>
		</div>

		<div class="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
			<article class="rounded-3xl border border-[#dbe7d4] bg-white p-5 sm:p-6">
				<h3 class="text-2xl font-semibold tracking-tight text-[var(--ink)]">Jenis Dokumen yang Dilayani</h3>
				<div class="mt-4 flex flex-wrap gap-2.5">
					{#each documentTypes as doc}
						<span class="rounded-full border border-[#d8e6cf] bg-[#f5faef] px-3.5 py-1.5 text-xs font-semibold tracking-[0.05em] text-[#31591a] uppercase sm:text-sm">
							{doc}
						</span>
					{/each}
				</div>

				<div class="mt-6 rounded-2xl border border-[#dde8d7] bg-[#fbfdfa] p-4 sm:p-5">
					<h4 class="text-lg font-semibold tracking-tight text-[var(--ink)]">Pengiriman SK Persetujuan Lingkungan</h4>
					<p class="mt-2 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
						Pemrakarsa menyiapkan data penerima agar dokumen fisik dapat dikirimkan tepat sasaran.
					</p>
					<div class="mt-3 grid gap-2 sm:grid-cols-3">
						{#each deliveryFields as field}
							<div class="rounded-xl border border-[#e4ece0] bg-[#f8fbf5] px-3 py-2 text-sm font-semibold text-[var(--ink)]">
								{field}
							</div>
						{/each}
					</div>
					<p class="mt-3 text-xs leading-relaxed text-[var(--muted)] sm:text-sm">
						SK dikirimkan melalui ekspedisi oleh tim sekretariat.
					</p>
				</div>
			</article>

			<article class="rounded-3xl border border-[#dbe7d4] bg-white p-5 sm:p-6">
				<h3 class="text-2xl font-semibold tracking-tight text-[var(--ink)]">Info Cepat</h3>
				<div class="mt-4 space-y-3">
					{#each quickInfos as info}
						<div class="rounded-2xl border border-[#e2ebdc] bg-[#fbfdf9] p-4">
							<p class="text-xs font-semibold tracking-[0.1em] text-[#6f8d46] uppercase">{info.label}</p>
							<p class="mt-1 text-sm leading-relaxed font-semibold text-[var(--ink)] sm:text-base">{info.detail}</p>
							{#if info.href && info.linkLabel}
								<a
									href={info.href}
									target="_blank"
									rel="noreferrer"
									class="mt-2 inline-flex text-sm font-semibold text-[#3f6f1b] transition-colors hover:text-[#2f5314]"
								>
									{info.linkLabel}
								</a>
							{/if}
						</div>
					{/each}
				</div>
			</article>
		</div>
	</div>
</section>

<section id="langkah-percepatan" class="bg-white py-16 sm:py-20">
	<div class="page-shell">
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-xs font-semibold tracking-[0.13em] text-[#6f8d46] uppercase">8 Langkah Percepatan</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
				Komitmen Layanan yang Terukur
			</h2>
			<p class="mt-3 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
				Semua langkah dirancang untuk menjaga transparansi proses persetujuan lingkungan dari awal
				sampai dokumen diterima pemrakarsa.
			</p>
		</div>

		<ol class="mx-auto mt-8 grid max-w-5xl gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
			{#each accelerationSteps as step, index}
				<li class="rounded-2xl border border-[var(--line)] bg-[#fcfdfb] p-4">
					<span class="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#64AD31] text-xs font-bold text-white">
						{index + 1}
					</span>
					<h3 class="mt-2 text-base font-semibold tracking-tight text-[var(--ink)]">{step.title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-[var(--muted)]">{step.summary}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<section id="tentang-cta" class="pb-16 sm:pb-20">
	<div class="page-shell">
		<div
			class="rounded-[1.8rem] border border-[#dce9d3] bg-[linear-gradient(130deg,#f3faec_0%,#ffffff_48%,#eef5ff_100%)] p-6 sm:p-8 lg:flex lg:items-center lg:justify-between lg:gap-8"
		>
			<div class="max-w-2xl">
				<p class="text-xs font-semibold tracking-[0.13em] text-[#6f8d46] uppercase">Kolaborasi Layanan</p>
				<h2 class="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
					SI-KOPLING Siap Mendampingi Proses Anda
				</h2>
				<p class="mt-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
					Konsultasikan kebutuhan dokumen lingkungan Anda, pantau progresnya, dan dapatkan pendampingan
					langsung melalui kanal resmi SI-KOPLING.
				</p>
			</div>

			<div class="mt-5 flex flex-wrap gap-3 lg:mt-0">
				<a
					href="https://wa.me/6282118314634"
					target="_blank"
					rel="noreferrer"
					class="inline-flex items-center justify-center rounded-full bg-[#64AD31] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4e8a24]"
				>
					Chat WhatsApp
				</a>
				<a
					href="/kontak"
					class="inline-flex items-center justify-center rounded-full border border-[#a8c98f] bg-white px-5 py-2.5 text-sm font-semibold text-[#3f6f1b] transition-colors hover:bg-[#f3f9ec]"
				>
					Lihat Kontak
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.grain-overlay {
		background-image:
			radial-gradient(circle at 1px 1px, rgba(21, 41, 15, 0.08) 1px, transparent 0),
			linear-gradient(120deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.55) 52%, rgba(255, 255, 255, 0) 100%);
		background-size: 16px 16px, 100% 100%;
		opacity: 0.4;
	}

	.tilt-left {
		transform: rotate(-1.8deg);
	}

	.tilt-right {
		transform: rotate(1.2deg);
	}

	.story-card {
		animation: card-rise 620ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	@keyframes card-rise {
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
		.story-card {
			animation: none;
		}

		.tilt-left,
		.tilt-right {
			transform: none;
		}
	}
</style>
