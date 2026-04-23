<script lang="ts">
	import type { StatusPengajuan } from '$lib/supabase/constants'

	const statusStyleMap: Record<StatusPengajuan, string> = {
		Masuk: 'bg-sky-100 text-sky-700 ring-1 ring-sky-200',
		Verifikasi: 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200',
		Perbaikan: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
		Penjadwalan: 'bg-violet-100 text-violet-700 ring-1 ring-violet-200',
		'Pasca Sidang': 'bg-fuchsia-100 text-fuchsia-700 ring-1 ring-fuchsia-200',
		Selesai: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
	}

	let { status }: { status: StatusPengajuan } = $props()
</script>

<span
	class={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${statusStyleMap[status]}`}
>
	{status}
</span>
