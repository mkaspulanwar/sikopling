<script lang="ts">
	import { resolve } from '$app/paths';
	import SubmissionCard from '$lib/components/submissions/SubmissionCard.svelte';
	import CountValue from '$lib/components/ui/CountValue.svelte';
	import SectionHeading from '$lib/components/ui/SectionHeading.svelte';
	import {
		FAQ_ITEMS,
		HOMEPAGE_AS_OF,
		HOMEPAGE_STATS,
		LATEST_SUBMISSIONS,
		QUICK_FILTERS
	} from '$lib/data/homepage-data';
	import {
		APPROVAL_STAGES,
		getStatusDefinition,
		type PublicStatusKey
	} from '$lib/data/public-model';

	function getStatusLabel(status?: PublicStatusKey): string {
		return status ? getStatusDefinition(status).label : '';
	}
</script>

<svelte:head>
	<title>SIKOPLING | DLH KALSEL</title>
	<meta
		name="description"
		content="Portal publik untuk melihat progres dokumen persetujuan lingkungan secara ringkas, jelas, dan transparan."
	/>
</svelte:head>

<main class="home-page">
	<section class="hero-fullscreen-section">
		<div class="hero-center-field hero-fullscreen-canvas">
			<video
				class="hero-video-layer"
				autoplay
				muted
				loop
				playsinline
				preload="auto"
				aria-hidden="true"
			>
				<source src="/media/hero-background2.mp4" type="video/mp4" />
			</video>
			<div class="hero-video-overlay" aria-hidden="true"></div>

			<div class="page-shell hero-page-shell">
				<div class="hero-fullscreen-content">
					<p class="hero-eyebrow eyebrow-pill enter-hero-copy enter-delay-1">
						Portal Informasi Publik
					</p>
					<div class="hero-logo-circle-wrap enter-hero-logo enter-delay-2">
						<div class="hero-logo-circle">
							<img
								src="/media/logo-dlh.png"
								alt="Logo Dinas Lingkungan Hidup"
								class="h-[4rem] w-[4rem] rounded-full bg-white object-contain md:h-[4.8rem] md:w-[4.8rem]"
								loading="eager"
								decoding="async"
							/>
						</div>
					</div>
					<h1 class="hero-title enter-hero-copy enter-delay-3">
						SISTEM
						<span
							class="font-editorial text-[0.95em] font-normal text-[color:var(--status-success)] italic"
						>
							INFORMASI
						</span>
						KONSULTASI
						<span
							class="font-editorial text-[0.95em] font-normal text-[color:var(--status-success)] italic"
						>
							PERSETUJUAN LINGKUNGAN
						</span>
					</h1>
					<p class="hero-lead enter-hero-copy enter-delay-3">
						SIKOPLING membantu masyarakat dan perusahaan memantau tahapan pengajuan dokumen
						persetujuan lingkungan dengan tampilan yang jelas, ringkas, dan terpercaya.
					</p>
					<div class="hero-search-wrap enter-hero-copy enter-delay-4">
						<form
							class="surface-panel depth-lift space-y-4 p-4 md:p-5"
							role="search"
							onsubmit={(event) => event.preventDefault()}
						>
							<label for="portal-search" class="block text-sm font-semibold text-[color:var(--ink)]">
								Cari progres pengajuan
							</label>
							<div class="flex flex-col gap-3 md:flex-row">
								<input
									id="portal-search"
									name="portal-search"
									type="search"
									placeholder="Cari nama perusahaan, nomor register, atau wilayah"
									class="focus-ring h-12 w-full rounded-xl border-[color:var(--line-strong)] bg-[color:var(--surface-soft)] px-4 text-sm text-[color:var(--ink)] placeholder:text-slate-400"
								/>
								<button
									type="submit"
									class="eased group flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[color:var(--brand)] px-4 text-sm font-semibold text-white hover:bg-[color:var(--brand-strong)] active:scale-[0.98] md:px-5"
								>
									<span class="pl-1">Cari</span>
									<span
										class="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition-transform duration-220 group-hover:translate-x-px"
									>
										<svg viewBox="0 0 24 24" class="h-4 w-4 text-white" aria-hidden="true">
											<path
												fill="currentColor"
												d="M14.47 5.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06l4.72-4.72H3a.75.75 0 0 1 0-1.5h16.19l-4.72-4.72a.75.75 0 0 1 0-1.06"
											/>
										</svg>
									</span>
								</button>
							</div>
							<div class="flex flex-wrap gap-2">
								{#each QUICK_FILTERS as filter (filter)}
									<button
										type="button"
										class="eased rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 text-xs font-medium text-[color:var(--muted)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
									>
										{filter}
									</button>
								{/each}
							</div>
						</form>
					</div>
					<p class="hero-meta enter-hero-copy enter-delay-4">
						Pembaruan data terakhir: <span class="font-semibold text-[color:var(--ink)]"
							>{HOMEPAGE_AS_OF}</span
						>
					</p>
				</div>
			</div>
		</div>
		<div class="hero-wave-divider" aria-hidden="true">
			<svg viewBox="0 0 1440 220" preserveAspectRatio="none">
				<path
					fill="var(--bg)"
					d="M0,140 C190,196 402,206 622,176 C848,145 1036,188 1248,166 C1338,158 1402,154 1440,150 L1440,220 L0,220 Z"
				/>
			</svg>
		</div>
	</section>

	<div class="content-unified-surface">
		<section class="section-shell stats-section border-b border-[color:var(--line)]">
			<div class="page-shell stats-canvas">
				<div class="stats-emblem-circle" aria-hidden="true">
					<img
						src="/media/logo-bekantan.png"
						alt=""
						class="h-20 w-20 rounded-full object-cover md:h-24 md:w-24"
						loading="lazy"
						decoding="async"
					/>
				</div>
				<SectionHeading
					eyebrow="Ringkasan"
					title="Statistik Progres Pengajuan"
					description="Ringkasan cepat untuk melihat kondisi pengajuan terbaru lintas wilayah."
				/>
				<div class="stats-grid">
					{#each HOMEPAGE_STATS as stat (stat.label)}
						<article class="stats-grid-item surface-panel depth-lift h-full p-4 sm:p-5 md:p-6">
							{#if getStatusLabel(stat.status)}
								<p
									class="text-[0.69rem] font-semibold tracking-[0.12em] text-[color:var(--muted)] uppercase"
								>
									{getStatusLabel(stat.status)}
								</p>
							{/if}
							<p
								class="mt-2 text-[1.82rem] font-semibold tracking-tight text-[color:var(--ink)] sm:text-[2rem]"
							>
								<CountValue value={stat.value} duration={1100} />
							</p>
							<p class="mt-2 text-[1.08rem] font-semibold text-[color:var(--ink)] sm:text-[1.2rem]">
								{stat.label}
							</p>
							<p
								class="mt-1 text-[0.98rem] leading-relaxed text-[color:var(--muted)] sm:text-[1.07rem]"
							>
								{stat.description}
							</p>
						</article>
					{/each}
				</div>
			</div>
		</section>

		<section class="process-highlight-section">
			<div class="process-wave-divider process-wave-top" aria-hidden="true">
				<svg viewBox="0 0 1440 220" preserveAspectRatio="none">
					<path
						fill="var(--bg)"
						d="M0,0 L0,86 C196,134 390,108 602,74 C832,40 1014,118 1230,94 C1328,84 1400,76 1440,82 L1440,0 Z"
					/>
				</svg>
			</div>

			<div class="process-highlight-content">
				<div class="page-shell">
					<div class="process-canvas-head">
						<div>
							<SectionHeading
								eyebrow="Alur Persetujuan"
								title="Tahapan Umum Persetujuan Lingkungan"
								description="Setiap pengajuan akan melewati urutan tahap berikut. Status pada daftar pengajuan menunjukkan posisi tahap aktif saat ini."
							/>
						</div>
						<aside class="process-mascot-card surface-panel" aria-label="Maskot layanan">
							<div class="process-mascot-circle">
								<img
									src="/media/logo-bekantan.png"
									alt=""
									class="h-14 w-14 rounded-full object-cover"
									loading="lazy"
									decoding="async"
								/>
							</div>
							<p class="text-sm leading-relaxed text-[color:var(--muted)]">
								Maskot layanan membantu publik mengenali area informasi edukatif.
							</p>
						</aside>
					</div>
					<div class="mt-7">
						<ol class="process-stepper" aria-label="Tahapan umum persetujuan lingkungan">
							{#each APPROVAL_STAGES as stage, index (stage.key)}
								<li class="process-step-item surface-panel depth-lift">
									{#if index < APPROVAL_STAGES.length - 1}
										<span class="process-step-link" aria-hidden="true"></span>
									{/if}
									<div class="process-step-head">
										<span
											class="process-step-number inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--brand-soft)] text-sm font-semibold text-[color:var(--brand)]"
										>
											{index + 1}
										</span>
										<h3 class="process-step-title">{stage.title}</h3>
									</div>
									<p class="process-step-description">
										{stage.description}
									</p>
								</li>
							{/each}
						</ol>
					</div>
				</div>
			</div>

			<div class="process-wave-divider process-wave-bottom" aria-hidden="true">
				<svg viewBox="0 0 1440 220" preserveAspectRatio="none">
					<path
						fill="var(--bg)"
						d="M0,164 C196,206 398,212 604,186 C826,158 1016,194 1226,174 C1326,166 1398,164 1440,160 L1440,220 L0,220 Z"
					/>
				</svg>
			</div>
		</section>

		<section class="section-shell latest-section border-b border-[color:var(--line)]">
			<div class="page-shell">
				<SectionHeading
					eyebrow="Pembaruan"
					title="Progres Terbaru Pengajuan"
					description="Contoh pengajuan terbaru untuk memudahkan masyarakat memahami status dan tahapan yang sedang berjalan."
				/>
				<div class="mt-7">
					<div class="space-y-4">
						{#each LATEST_SUBMISSIONS as submission (submission.registerId)}
							<SubmissionCard {submission} />
						{/each}
					</div>
				</div>
				<div class="latest-cta-row">
					<a href={resolve('/pengajuan')} class="latest-cta eased">
						Lihat semua pengajuan
						<span
							class="flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--bg-soft)]"
						>
							<svg viewBox="0 0 24 24" class="h-3.5 w-3.5" aria-hidden="true">
								<path
									fill="currentColor"
									d="m13.53 6.47 5 5a.75.75 0 0 1 0 1.06l-5 5a.75.75 0 1 1-1.06-1.06l3.72-3.72H6a.75.75 0 0 1 0-1.5h10.19l-3.72-3.72a.75.75 0 1 1 1.06-1.06"
								/>
							</svg>
						</span>
					</a>
				</div>
			</div>
		</section>

		<section class="section-shell faq-section">
			<div class="page-shell faq-layout">
				<div class="faq-head">
					<SectionHeading
						eyebrow="Bantuan"
						title="Pertanyaan yang Sering Ditanyakan"
						description="Jawaban singkat untuk membantu masyarakat membaca status dan progres dengan benar."
					/>
				</div>
				<div class="faq-body">
					<div class="faq-list">
						{#each FAQ_ITEMS as item (item.question)}
							<details
								class="faq-item surface-panel depth-lift group p-4 open:bg-[color:var(--bg-soft)] sm:p-5"
							>
								<summary class="faq-question">
									{item.question}
								</summary>
								<p class="faq-answer">
									{item.answer}
								</p>
							</details>
						{/each}
					</div>
				</div>
			</div>
		</section>
	</div>
</main>

<footer class="footer-shell border-t border-[color:var(--line)] bg-[color:var(--surface)]">
	<div class="page-shell footer-layout text-sm text-[color:var(--muted)]">
		<p>Dinas Lingkungan Hidup Provinsi Kalimantan Selatan</p>
		<p>Kontak layanan: +62 411 742811 | layanan@sikopling.go.id</p>
	</div>
</footer>
