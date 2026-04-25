<script lang="ts">
	import type { StatusPengajuan } from '$lib/supabase/constants'

	const statusStyleMap: Record<StatusPengajuan, string> = {
		'Submit / Masuk': 'bg-sky-100 text-sky-700 ring-1 ring-sky-200',
		'Perbaikan Uji Administrasi': 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
		'Penjadwalan Rapat': 'bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200',
		'Drafting SK': 'bg-blue-100 text-blue-700 ring-1 ring-blue-200',
		'SK Terbit': 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
		'Belum Submit Perbaikan': 'bg-orange-100 text-orange-700 ring-1 ring-orange-200',
		'Uji Administrasi': 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200',
		Ditolak: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
		'Pasca Sidang': 'bg-fuchsia-100 text-fuchsia-700 ring-1 ring-fuchsia-200',
		'Evaluasi Dokumen': 'bg-violet-100 text-violet-700 ring-1 ring-violet-200',
		Hold: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200',
		Dikembalikan: 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
		'Penilaian KA': 'bg-purple-100 text-purple-700 ring-1 ring-purple-200'
	}

	let { status }: { status: StatusPengajuan } = $props()
</script>

<span
	class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${statusStyleMap[status]}`}
>
	{status}
</span>

