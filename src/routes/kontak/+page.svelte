<script lang="ts">
	type ContactChannel = {
		label: string;
		value: string;
		note: string;
	};

	const contactChannels: ContactChannel[] = [
		{
			label: 'Telepon Layanan',
			value: '(0511) 326-7711',
			note: 'Senin - Jumat, 08.00 - 16.00 WITA'
		},
		{
			label: 'Email Resmi',
			value: 'layanan.dlh@kalselprov.go.id',
			note: 'Respon administratif maksimal 1x24 jam kerja'
		},
		{
			label: 'Lokasi Kantor',
			value: 'Banjarbaru, Kalimantan Selatan',
			note: 'Dinas Lingkungan Hidup Provinsi Kalimantan Selatan'
		}
	];
</script>

<svelte:head>
	<title>Kontak | SIKOPLING</title>
	<meta
		name="description"
		content="Halaman kontak SIKOPLING dengan informasi kanal layanan dan formulir dummy pengajuan pertanyaan."
	/>
</svelte:head>

<section class="relative overflow-hidden bg-[var(--canvas)] pt-28 pb-14 sm:pt-32 sm:pb-20">
	<div
		class="pointer-events-none absolute top-[-9rem] right-[8%] h-[22rem] w-[22rem] rounded-full bg-[#d8e7c8]/45 blur-3xl"
	></div>
	<div
		class="pointer-events-none absolute bottom-[-8rem] left-[6%] h-[24rem] w-[24rem] rounded-full bg-[#d8e3f2]/35 blur-3xl"
	></div>

	<div class="page-shell relative">
		<div class="mx-auto max-w-3xl text-center">
			<p class="text-xs font-semibold tracking-[0.12em] text-[#7f9662] uppercase">Kontak Layanan</p>
			<h1
				class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl lg:text-5xl"
			>
				Hubungi Tim SI-KOPLING
			</h1>
			<p class="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
				Gunakan kanal kontak resmi berikut untuk pertanyaan umum, konsultasi awal, atau tindak
				lanjut proses layanan persetujuan lingkungan.
			</p>
		</div>
	</div>
</section>

<section class="bg-[var(--canvas)] pb-16 sm:pb-20">
	<div class="page-shell">
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each contactChannels as item}
				<article class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
					<p class="text-xs font-semibold tracking-[0.08em] text-[#5d7b33] uppercase">
						{item.label}
					</p>
					<p class="mt-2 text-base font-semibold text-[var(--ink)] sm:text-lg">{item.value}</p>
					<p class="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.note}</p>
				</article>
			{/each}
		</div>
	</div>
</section>

<section class="border-y border-[var(--line)] bg-[#f8fafc] py-16 sm:py-20">
	<div class="page-shell">
		<div class="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
			<div class="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
				<p class="text-xs font-semibold tracking-[0.1em] text-[#607b3d] uppercase">
					Formulir Dummy
				</p>
				<h2 class="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
					Kirim Pertanyaan
				</h2>
				<form class="mt-6 space-y-4" onsubmit={(event) => event.preventDefault()}>
					<div>
						<label for="nama" class="mb-2 block text-sm font-semibold text-[var(--ink)]">Nama</label
						>
						<input
							id="nama"
							type="text"
							placeholder="Nama lengkap"
							class="block h-12 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[#9fb27d] focus:ring-0"
						/>
					</div>

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
						<label for="pesan" class="mb-2 block text-sm font-semibold text-[var(--ink)]"
							>Pesan</label
						>
						<textarea
							id="pesan"
							rows="5"
							placeholder="Tulis pertanyaan Anda"
							class="block w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[#9fb27d] focus:ring-0"
						></textarea>
					</div>

					<button
						type="submit"
						class="inline-flex h-12 w-full items-center justify-center rounded-xl border border-[#96ad75] bg-[#a9b388] px-4 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[#9ea97f]"
					>
						Kirim Pesan
					</button>
				</form>
			</div>

			<div class="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 sm:p-8">
				<p class="text-xs font-semibold tracking-[0.1em] text-[#607b3d] uppercase">
					Informasi Tambahan
				</p>
				<h2 class="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)] sm:text-3xl">
					Jam Operasional
				</h2>
				<div class="mt-6 space-y-4">
					<div class="rounded-2xl border border-[var(--line)] bg-[#fbfdf9] p-4">
						<p class="text-sm font-semibold text-[var(--ink)]">Senin - Kamis</p>
						<p class="mt-1 text-sm text-[var(--muted)]">08.00 - 16.00 WITA</p>
					</div>
					<div class="rounded-2xl border border-[var(--line)] bg-[#fbfdf9] p-4">
						<p class="text-sm font-semibold text-[var(--ink)]">Jumat</p>
						<p class="mt-1 text-sm text-[var(--muted)]">08.00 - 16.30 WITA</p>
					</div>
					<div class="rounded-2xl border border-[var(--line)] bg-[#fbfdf9] p-4">
						<p class="text-sm font-semibold text-[var(--ink)]">Catatan</p>
						<p class="mt-1 text-sm leading-relaxed text-[var(--muted)]">
							Untuk kebutuhan konsultasi teknis, jadwal dapat menyesuaikan agenda tim penilai.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
