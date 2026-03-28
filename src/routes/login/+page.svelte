<svelte:head>
	<title>Login | SIKOPLING</title>
	<meta
		name="description"
		content="Halaman login dummy SIKOPLING untuk tahap pengembangan antarmuka."
	/>
</svelte:head>

<section
	class="relative min-h-[100svh] overflow-hidden bg-[var(--canvas)] pt-28 pb-14 sm:pt-32 sm:pb-20"
>
	<div
		class="pointer-events-none absolute top-[-8rem] left-[8%] h-[22rem] w-[22rem] rounded-full bg-[#d8e7c8]/45 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute right-[6%] bottom-[-8rem] h-[24rem] w-[24rem] rounded-full bg-[#d8e3f2]/35 blur-3xl"
	></div>

	<div class="page-shell relative">
		<div class="mx-auto max-w-xl">
			<div
				class="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_22px_52px_-34px_rgba(15,23,42,0.42)] sm:p-8 lg:p-9"
			>
				<p class="text-xs font-semibold tracking-[0.1em] text-[#607b3d] uppercase">Demo Login</p>

				<form class="mt-6 space-y-5" onsubmit={(event) => event.preventDefault()}>
					<div>
						<label for="email" class="mb-2 block text-sm font-semibold text-[var(--ink)]"
							>Email</label
						>
						<input
							id="email"
							type="email"
							placeholder="nama@email.com"
							class="block h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[#9fb27d] focus:ring-0"
						/>
					</div>

					<div>
						<label for="password" class="mb-2 block text-sm font-semibold text-[var(--ink)]">
							Password
						</label>
						<input
							id="password"
							type="password"
							placeholder="Masukkan password"
							class="block h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[#9fb27d] focus:ring-0"
						/>
					</div>

					<div class="flex items-center justify-between gap-3">
						<label class="inline-flex items-center gap-2 text-sm text-[var(--muted)]">
							<input
								type="checkbox"
								class="h-4 w-4 rounded border-[var(--line)] text-[#7f9662] focus:ring-0"
							/>
							Ingat saya
						</label>
						<a
							href="/login/reset-password"
							class="text-sm font-medium text-[#5d7b33] hover:text-[#4c662a]"
						>
							Lupa password?
						</a>
					</div>

					<button
						type="submit"
						class="inline-flex h-12 w-full items-center justify-center rounded-xl border border-[#96ad75] bg-[#a9b388] px-4 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[#9ea97f]"
					>
						Masuk
					</button>
				</form>

				<p class="mt-6 text-center text-sm text-[var(--muted)]">
					Belum punya akun?
					<a href="/login/register" class="font-semibold text-[#5d7b33] hover:text-[#4c662a]"
						>Daftar</a
					>
				</p>

				<a
					href="/"
					class="mt-5 inline-flex h-12 w-full items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--accent-soft)]"
				>
					Kembali ke Beranda
				</a>
			</div>
		</div>
	</div>
</section>
