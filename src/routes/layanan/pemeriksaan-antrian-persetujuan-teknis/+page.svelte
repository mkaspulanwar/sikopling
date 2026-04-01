<svelte:head>
	<title>Pemeriksaan Antrian Persetujuan Teknis | SIKOPLING</title>
	<meta
		name="description"
		content="Halaman antrian persetujuan teknis untuk memantau status pemeriksaan teknis layanan persetujuan lingkungan."
	/>
</svelte:head>

<section class="relative overflow-hidden bg-[var(--canvas)] pt-28 pb-14 sm:pt-32 sm:pb-20">
	<div class="pointer-events-none absolute top-[-9rem] left-[8%] h-[23rem] w-[23rem] rounded-full bg-[#d9e8cb]/45 blur-3xl"></div>
	<div class="pointer-events-none absolute right-[6%] bottom-[-8rem] h-[22rem] w-[22rem] rounded-full bg-[#dbe5f4]/40 blur-3xl"></div>

	<div class="nav-shell relative">
		<div class="mx-auto max-w-4xl text-center">
			<p class="text-xs font-semibold tracking-[0.12em] text-[#7f9662] uppercase">Layanan</p>
			<h1 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl lg:text-5xl">
				Antrian Persetujuan Teknis
			</h1>
			<p class="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
				Pantau antrean pemeriksaan teknis secara ringkas untuk melihat tahapan dan pembaruan proses
				persetujuan.
			</p>
		</div>
	</div>
</section>

<section class="pb-16 sm:pb-20">
	<div class="nav-shell">
		<div class="mx-auto max-w-5xl rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6">
			<div class="overflow-x-auto">
				<table class="min-w-full text-left text-sm">
					<thead>
						<tr class="border-b border-[var(--line)] text-[var(--muted)]">
							<th class="px-3 py-3 font-semibold">No Registrasi</th>
							<th class="px-3 py-3 font-semibold">Instansi</th>
							<th class="px-3 py-3 font-semibold">Tahapan Teknis</th>
							<th class="px-3 py-3 font-semibold">Update Terakhir</th>
						</tr>
					</thead>
					<tbody class="text-[var(--ink)]">
						<tr class="border-b border-[var(--line)]/70">
							<td class="px-3 py-3">TKS-2026-0012</td>
							<td class="px-3 py-3">PT Banua Infrastruktur Hijau</td>
							<td class="px-3 py-3">Telaah Dokumen</td>
							<td class="px-3 py-3">30 Maret 2026</td>
						</tr>
						<tr class="border-b border-[var(--line)]/70">
							<td class="px-3 py-3">TKS-2026-0013</td>
							<td class="px-3 py-3">Dinas PUPR Kab. Banjar</td>
							<td class="px-3 py-3">Klarifikasi Teknis</td>
							<td class="px-3 py-3">31 Maret 2026</td>
						</tr>
						<tr>
							<td class="px-3 py-3">TKS-2026-0014</td>
							<td class="px-3 py-3">PT Tirta Kalimantan Sejahtera</td>
							<td class="px-3 py-3">Rekomendasi Final</td>
							<td class="px-3 py-3">1 April 2026</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</section>
