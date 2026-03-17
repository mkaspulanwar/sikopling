<section id="informasi" class="py-16 md:py-20">
	<div class="page-shell">
		<div class="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
			<div>
				<p class="text-sm font-semibold text-[var(--accent)]">Informasi antrean per jenis layanan</p>
				<h2 class="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-5xl">
					Status antrean pengajuan hari ini
				</h2>
				<p class="mt-4 max-w-[62ch] text-base leading-relaxed text-[var(--muted)]">
					Pembaruan status dilakukan selama jam layanan. Tabel ini membantu pemohon melihat progres layanan
					tanpa perlu datang ke kantor.
				</p>

				<div class="mt-8 overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-[var(--surface-strong)]">
					<div class="grid grid-cols-[1.15fr_1fr_0.85fr] border-b border-[var(--line)] bg-[var(--surface)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">
						<p>Jenis pengajuan</p>
						<p>Nomor terlayani</p>
						<p>Status</p>
					</div>
					<div class="divide-y divide-[var(--line)]">
						<div class="grid grid-cols-1 gap-2 px-5 py-4 text-sm text-[var(--ink)] md:grid-cols-[1.15fr_1fr_0.85fr] md:items-center">
							<p class="font-medium">Persetujuan Lingkungan</p>
							<p>A-058</p>
							<p>
								<span class="inline-flex rounded-full border border-emerald-300 bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Normal</span>
							</p>
						</div>
						<div class="grid grid-cols-1 gap-2 px-5 py-4 text-sm text-[var(--ink)] md:grid-cols-[1.15fr_1fr_0.85fr] md:items-center">
							<p class="font-medium">Persetujuan Teknis (Pertek)</p>
							<p>P-031</p>
							<p>
								<span class="inline-flex rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Padat</span>
							</p>
						</div>
						<div class="grid grid-cols-1 gap-2 px-5 py-4 text-sm text-[var(--ink)] md:grid-cols-[1.15fr_1fr_0.85fr] md:items-center">
							<p class="font-medium">Pernyataan Kesanggupan Pengelolaan</p>
							<p>PK-019</p>
							<p>
								<span class="inline-flex rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Stabil</span>
							</p>
						</div>
					</div>
				</div>
			</div>

			<div class="space-y-4">
				<div class="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
					<p class="text-sm font-semibold text-[var(--ink)]">Sinkronisasi data</p>
					<p class="mt-1 text-sm text-[var(--muted)]">Pembaruan dilakukan setiap 10 menit selama jam kerja.</p>
					<div class="mt-4 space-y-2">
						<div class="h-3 w-[78%] animate-pulse rounded-full bg-[var(--line)]"></div>
						<div class="h-3 w-[61%] animate-pulse rounded-full bg-[var(--line)]"></div>
						<div class="h-3 w-[46%] animate-pulse rounded-full bg-[var(--line)]"></div>
					</div>
				</div>
				<div class="rounded-[1.5rem] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
					<p class="text-sm font-semibold text-[var(--ink)]">Notifikasi revisi berkas</p>
					<p class="mt-1 text-sm leading-relaxed text-[var(--muted)]">
						Jika berkas memerlukan perbaikan, sistem akan menampilkan catatan pemeriksa pada akun pemohon.
					</p>
				</div>
			</div>
		</div>

		<div id="alur" class="mt-16 rounded-[1.9rem] border border-[var(--line)] bg-[var(--surface-strong)] p-6 md:p-8">
			<p class="text-sm font-semibold text-[var(--accent)]">Alur pengajuan</p>
			<div class="mt-5 grid gap-5 md:grid-cols-2">
				<div class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
					<p class="text-sm font-semibold text-[var(--ink)]">1. Registrasi akun pemohon</p>
					<p class="mt-2 text-sm leading-relaxed text-[var(--muted)]">Lengkapi profil badan usaha atau perorangan sebelum membuat pengajuan izin.</p>
				</div>
				<div class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
					<p class="text-sm font-semibold text-[var(--ink)]">2. Unggah dokumen administrasi</p>
					<p class="mt-2 text-sm leading-relaxed text-[var(--muted)]">Siapkan dokumen teknis dan formulir sesuai ketentuan layanan yang dipilih.</p>
				</div>
				<div class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
					<p class="text-sm font-semibold text-[var(--ink)]">3. Verifikasi dan antrean layanan</p>
					<p class="mt-2 text-sm leading-relaxed text-[var(--muted)]">Petugas memeriksa kelengkapan lalu sistem memberi nomor antrean pemrosesan.</p>
				</div>
				<div class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
					<p class="text-sm font-semibold text-[var(--ink)]">4. Publikasi hasil perizinan</p>
					<p class="mt-2 text-sm leading-relaxed text-[var(--muted)]">Pemohon menerima pemberitahuan hasil akhir melalui dashboard dan surat elektronik.</p>
				</div>
			</div>
		</div>
	</div>
</section>
