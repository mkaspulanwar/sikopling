<script lang="ts">
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import Eye from 'lucide-svelte/icons/eye';
	import EyeOff from 'lucide-svelte/icons/eye-off';

	type LoginData = {
		redirectTo: string
	}

	type LoginFormState = {
		error?: string
		redirectTo?: string
	}

	let showPassword = $state(false);

	const { data, form }: { data: LoginData; form: LoginFormState | null } = $props();
</script>

<svelte:head>
	<meta
		name="description"
		content="Masuk ke akun SIKOPLING untuk memantau progres dokumen dan mengelola layanan persetujuan lingkungan."
	/>
	<link
		rel="preload"
		href="/home/video-hero.webm?v=20260418"
		as="video"
		type="video/webm"
	/>
</svelte:head>

<section class="login-scene relative isolate overflow-hidden">
	<div class="login-media absolute inset-0 z-0" aria-hidden="true">
		<video
			class="login-media-video"
			autoplay
			muted
			loop
			playsinline
			preload="metadata"
		>
			<source src="/home/video-hero.webm?v=20260418" type="video/webm" />
			<source src="/home/video-hero.mp4?v=20260418" type="video/mp4" />
		</video>
	</div>
	<div class="absolute inset-0 z-10 bg-slate-950/30" aria-hidden="true"></div>
	<div
		class="absolute inset-0 z-10 bg-[radial-gradient(circle_at_14%_20%,rgba(109,206,116,0.09),transparent_42%),radial-gradient(circle_at_86%_68%,rgba(79,142,210,0.08),transparent_38%)]"
		aria-hidden="true"
	></div>

	<a
		href="/"
		class="absolute top-[max(0.95rem,calc(env(safe-area-inset-top)+0.45rem))] left-[max(0.95rem,calc(env(safe-area-inset-left)+0.45rem))] z-30 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/14 px-3.5 py-2 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/22 lg:left-12 xl:left-16"
	>
		<ArrowLeft class="h-4 w-4" />
		<span>Beranda</span>
	</a>

	<div class="relative z-20 h-full lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(25rem,34rem)]">
		<div class="hidden h-full lg:flex lg:items-end lg:px-12 lg:pb-11 xl:px-16">
			<div class="max-w-lg text-white">
				<img
					src="/layout/logo_sikopling.png"
					alt="Logo SIKOPLING"
					class="h-auto w-[12rem] brightness-0 invert"
				/>
				<h1 class="mt-6 text-[2.9rem] leading-[1.04] font-semibold tracking-tight">Masuk ke SIKOPLING</h1>
				<p class="mt-4 max-w-md text-lg leading-relaxed text-white/84">
					Masuk untuk melanjutkan layanan, memantau progres, dan mengelola dokumen Anda dalam satu
					tempat.
				</p>
				<div class="mt-6 inline-flex rounded-full border border-white/28 bg-white/10 px-4 py-2 text-sm font-semibold text-white/92">
					Cepat • Transparan • Terdokumentasi
				</div>
			</div>
		</div>

		<div class="h-full lg:border-l lg:border-white/16 lg:bg-white/12 lg:backdrop-blur-xl">
			<div class="login-form-scroll h-full overflow-y-auto px-4 sm:px-6 lg:px-8">
				<div class="flex min-h-full items-center justify-center py-5 sm:py-6">
					<div class="w-full max-w-[28.5rem]">
						<div class="rounded-[1.55rem] border border-white/28 bg-white/97 p-5 shadow-[0_26px_60px_-36px_rgba(15,23,42,0.78)] sm:p-6">
							<h2 class="text-center text-[1.75rem] leading-tight font-semibold tracking-tight text-(--ink) sm:text-[1.95rem]">
								Masuk
							</h2>
							<p class="mt-1.5 text-center text-sm text-(--muted) sm:text-[0.96rem]">
								Silakan masuk dengan akun terdaftar.
							</p>

							<form class="mt-5 space-y-3.5" method="post" novalidate>
								<input type="hidden" name="redirectTo" value={form?.redirectTo ?? data.redirectTo} />

								<div class="space-y-1.5">
									<label for="email" class="text-sm font-semibold text-(--ink)">Email</label>
									<input
										id="email"
										name="email"
										type="email"
										autocomplete="email"
										placeholder="contoh: pemrakarsa@contoh.id"
										class="h-11 w-full rounded-xl border border-[#d7dee8] bg-white px-3.5 text-[0.95rem] text-(--ink) placeholder:text-[#7b8595] transition-colors focus:border-[#8dbd62] focus:outline-none focus:ring-0 focus-visible:outline-none"
										required
									/>
								</div>

								<div class="space-y-1.5">
									<label for="password" class="text-sm font-semibold text-(--ink)">Kata Sandi</label>
									<div class="relative">
										<input
											id="password"
											name="password"
											type={showPassword ? 'text' : 'password'}
											autocomplete="current-password"
											placeholder="Masukkan kata sandi"
											class="h-11 w-full rounded-xl border border-[#d7dee8] bg-white px-3.5 pr-11 text-[0.95rem] text-(--ink) placeholder:text-[#7b8595] transition-colors focus:border-[#8dbd62] focus:outline-none focus:ring-0 focus-visible:outline-none"
											required
										/>
										<button
											type="button"
											class="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center rounded-r-xl text-[#7b8595] transition-colors hover:text-[#4d5665] focus-visible:outline-none focus-visible:text-[#4d5665]"
											aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
											aria-controls="password"
											aria-pressed={showPassword}
											onclick={() => (showPassword = !showPassword)}
										>
											{#if showPassword}
												<EyeOff class="h-4 w-4" />
											{:else}
												<Eye class="h-4 w-4" />
											{/if}
										</button>
									</div>
								</div>

								{#if form?.error}
									<p class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
										{form.error}
									</p>
								{/if}

								<div class="flex items-center justify-between gap-2 pt-0.5">
									<label class="inline-flex items-center gap-2 text-sm text-(--muted)">
										<input
											type="checkbox"
											name="remember"
											class="h-4 w-4 rounded border-[#c3cfdd] text-[#64AD31] focus:ring-[#64AD31]"
										/>
										Ingat saya
									</label>
									<button
										type="button"
										class="text-sm font-semibold text-[#426f1d] transition-colors hover:text-[#2f5213]"
									>
										Lupa kata sandi?
									</button>
								</div>

								<button
									type="submit"
									class="inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#64AD31] text-sm font-semibold !text-white transition-colors hover:bg-[#4f8925]"
								>
									Masuk
								</button>
							</form>

						</div>
						<p class="mt-4 hidden text-center text-xs text-white/84 lg:block">
							&copy; 2026 Dinas Lingkungan Hidup Kalimantan Selatan
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<p class="pointer-events-none absolute inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-20 px-4 text-center text-xs text-white/84 sm:text-sm lg:hidden">
		&copy; 2026 Dinas Lingkungan Hidup Kalimantan Selatan
	</p>
</section>

<style>
	.login-scene {
		height: 100vh;
		min-height: 100vh;
		background-color: #09120d;
	}

	.login-media {
		pointer-events: none;
	}

	.login-media-video {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}

	@media (max-width: 640px) {
		.login-media {
			background-image: url('/login/hutan.jpg');
			background-position: center;
			background-repeat: no-repeat;
			background-size: cover;
		}

		.login-media-video {
			display: none;
		}
	}

	@supports (height: 100dvh) {
		.login-scene {
			height: 100dvh;
			min-height: 100dvh;
		}
	}

	.login-form-scroll {
		padding-top: max(0.9rem, env(safe-area-inset-top));
		padding-bottom: max(0.9rem, env(safe-area-inset-bottom));
	}
</style>
