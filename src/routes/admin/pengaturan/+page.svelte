<section class="mx-auto w-full max-w-[980px] space-y-5">
	<header class="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_28px_60px_-45px_rgba(15,23,42,0.55)] sm:p-7">
		<p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Pengaturan</p>
		<h1 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.9rem]">Pengaturan Dashboard</h1>
		<p class="mt-2 max-w-3xl text-sm text-slate-600 sm:text-[0.96rem]">
			Pusat pengaturan preferensi tampilan panel admin. Komponen ini sudah disiapkan untuk pengembangan pengaturan lanjutan.
		</p>
	</header>

	<div class="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_20px_40px_-35px_rgba(15,23,42,0.55)]">
		<label class="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3">
			<input type="checkbox" checked class="mt-1 h-4 w-4 rounded border-slate-300 text-[#64AD31] focus:ring-[#64AD31]" />
			<span>
				<span class="block text-sm font-semibold text-slate-800">Gunakan panel ringkas</span>
				<span class="mt-0.5 block text-xs text-slate-600">Mempertahankan layout modern dengan fokus pada informasi penting di atas.</span>
			</span>
		</label>

		<label class="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-3">
			<input type="checkbox" checked class="mt-1 h-4 w-4 rounded border-slate-300 text-[#64AD31] focus:ring-[#64AD31]" />
			<span>
				<span class="block text-sm font-semibold text-slate-800">Aktifkan notifikasi import/export</span>
				<span class="mt-0.5 block text-xs text-slate-600">Menampilkan status proses setelah import CSV dan setelah export file selesai.</span>
			</span>
		</label>

		<div class="rounded-xl border border-dashed border-slate-300 px-3 py-2.5 text-xs text-slate-500">
			Pengaturan ini saat ini bersifat tampilan. Integrasi ke penyimpanan preferensi user bisa ditambahkan pada iterasi berikutnya.
		</div>
	</div>
</section>
