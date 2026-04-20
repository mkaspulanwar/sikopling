<script lang="ts">
	type CmsQueueRow = {
		id: string
		registrationNo: string
		receivedDate: string
		agency: string
		activity: string
		documentType: string
		position: string
		progressStatus: string
		progressUpdatedDate: string
	}

	type StatusSummary = {
		status: string
		total: number
	}

	type DashboardData = {
		source: 'directus' | 'fallback'
		doklingRows: CmsQueueRow[]
		pertekRows: CmsQueueRow[]
		doklingSummary: StatusSummary[]
		pertekSummary: StatusSummary[]
	}

	type ActionState = {
		success?: boolean
		message?: string
		action?: 'create' | 'update' | 'delete'
		collection?: 'dokling' | 'pertek'
	}

	const { data, form }: { data: DashboardData; form: ActionState | null } = $props()

	const dateFormatter = new Intl.DateTimeFormat('id-ID', {
		day: '2-digit',
		month: 'short',
		year: 'numeric'
	})
	const numberFormatter = new Intl.NumberFormat('id-ID')
	const todayIso = new Date().toISOString().slice(0, 10)
	const positionOptions = ['Penyusun', 'Pemrakarsa', 'Sekretariat TU'] as const
	const doklingStatusOptions = [
		'SK terbit',
		'Perbaikan Uji Administrasi',
		'Pasca Sidang',
		'Penilaian KA',
		'Penjadwalan Rapat',
		'Dikembalikan',
		'Ditolak',
		'Submit'
	] as const
	const pertekStatusOptions = [
		'Evaluasi Dokumen',
		'Perbaikan Uji Administrasi',
		'Penjadwalan Rapat',
		'Dikembalikan',
		'Submit'
	] as const

	const formatDate = (value: string) => dateFormatter.format(new Date(`${value}T00:00:00`))
	const formatNumber = (value: number) => numberFormatter.format(value)
</script>

<section class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 md:px-8">
	<div class="flex flex-col gap-2">
		<h1 class="text-3xl font-bold tracking-tight text-slate-900">Dashboard Admin CMS</h1>
		<p class="text-sm text-slate-600">
			Kelola data Directus untuk koleksi <span class="font-semibold">dokling</span> dan
			<span class="font-semibold">pertek</span>
		</p>
		<div
			class="inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold"
			class:bg-emerald-100={data.source === 'directus'}
			class:text-emerald-700={data.source === 'directus'}
			class:bg-amber-100={data.source !== 'directus'}
			class:text-amber-700={data.source !== 'directus'}
		>
			{data.source === 'directus'
				? 'Connected to Directus'
				: 'Fallback mode (isi DIRECTUS_URL + DIRECTUS_TOKEN untuk CRUD)'}
		</div>
	</div>

	{#if form?.message}
		<div
			class="rounded-xl border px-4 py-3 text-sm"
			class:border-emerald-200={form.success}
			class:bg-emerald-50={form.success}
			class:text-emerald-700={form.success}
			class:border-rose-200={!form.success}
			class:bg-rose-50={!form.success}
			class:text-rose-700={!form.success}
		>
			{form.message}
		</div>
	{/if}

	<div class="grid gap-4 md:grid-cols-2">
		<article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
			<p class="text-xs uppercase tracking-wide text-slate-500">Total Dokling</p>
			<p class="mt-2 text-3xl font-bold text-slate-900">{formatNumber(data.doklingRows.length)}</p>
			<div class="mt-4 flex flex-wrap gap-2">
				{#each data.doklingSummary.slice(0, 5) as item}
					<span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
						{item.status}: {formatNumber(item.total)}
					</span>
				{/each}
			</div>
		</article>

		<article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
			<p class="text-xs uppercase tracking-wide text-slate-500">Total Pertek</p>
			<p class="mt-2 text-3xl font-bold text-slate-900">{formatNumber(data.pertekRows.length)}</p>
			<div class="mt-4 flex flex-wrap gap-2">
				{#each data.pertekSummary.slice(0, 5) as item}
					<span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
						{item.status}: {formatNumber(item.total)}
					</span>
				{/each}
			</div>
		</article>
	</div>

	<div class="grid gap-6 xl:grid-cols-2">
		<article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
			<h2 class="text-lg font-semibold text-slate-900">CRUD Dokling</h2>
			<form method="POST" action="?/create" class="mt-4 grid gap-3">
				<input type="hidden" name="collection" value="dokling" />
				<div class="grid gap-3 md:grid-cols-2">
					<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="registrationNo" placeholder="No registrasi" required />
					<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="agency" placeholder="Instansi" required />
				</div>
				<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="activity" placeholder="Kegiatan" required />
				<div class="grid gap-3 md:grid-cols-2">
					<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="documentType" placeholder="Jenis dokumen" value="Andal" required />
					<select class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="position" required>
						{#each positionOptions as item}
							<option value={item}>{item}</option>
						{/each}
					</select>
				</div>
				<div class="grid gap-3 md:grid-cols-2">
					<select class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="progressStatus" required>
						{#each doklingStatusOptions as item}
							<option value={item}>{item}</option>
						{/each}
					</select>
					<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" type="date" name="receivedDate" value={todayIso} required />
				</div>
				<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" type="date" name="progressUpdatedDate" value={todayIso} required />
				<button class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Tambah Dokling</button>
			</form>

			<div class="mt-5 space-y-3">
				{#if data.doklingRows.length === 0}
					<p class="text-sm text-slate-500">Belum ada data dokling</p>
				{:else}
					{#each data.doklingRows.slice(0, 25) as row}
						<details class="rounded-xl border border-slate-200 bg-slate-50 p-3">
							<summary class="cursor-pointer text-sm font-medium text-slate-800">
								{row.registrationNo} • {row.agency} • {row.progressStatus}
							</summary>
							<form method="POST" action="?/update" class="mt-3 grid gap-2">
								<input type="hidden" name="collection" value="dokling" />
								<input type="hidden" name="id" value={row.id} />
								<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="registrationNo" value={row.registrationNo} required />
								<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="agency" value={row.agency} required />
								<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="activity" value={row.activity} required />
								<div class="grid gap-2 md:grid-cols-2">
									<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="documentType" value={row.documentType} required />
									<select class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="position" required>
										{#each positionOptions as item}
											<option value={item} selected={row.position === item}>{item}</option>
										{/each}
									</select>
								</div>
								<div class="grid gap-2 md:grid-cols-2">
									<select class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="progressStatus" required>
										{#each doklingStatusOptions as item}
											<option value={item} selected={row.progressStatus === item}>{item}</option>
										{/each}
									</select>
									<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" type="date" name="receivedDate" value={row.receivedDate} required />
								</div>
								<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" type="date" name="progressUpdatedDate" value={row.progressUpdatedDate} required />
								<div class="flex gap-2">
									<button class="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white">Simpan Perubahan</button>
								</div>
							</form>
							<form method="POST" action="?/delete" class="mt-2">
								<input type="hidden" name="collection" value="dokling" />
								<input type="hidden" name="id" value={row.id} />
								<button class="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white">Hapus</button>
							</form>
							<p class="mt-2 text-xs text-slate-500">Update terakhir: {formatDate(row.progressUpdatedDate)}</p>
						</details>
					{/each}
				{/if}
			</div>
		</article>

		<article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
			<h2 class="text-lg font-semibold text-slate-900">CRUD Pertek</h2>
			<form method="POST" action="?/create" class="mt-4 grid gap-3">
				<input type="hidden" name="collection" value="pertek" />
				<div class="grid gap-3 md:grid-cols-2">
					<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="registrationNo" placeholder="No registrasi" required />
					<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="agency" placeholder="Instansi" required />
				</div>
				<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="activity" placeholder="Kegiatan" required />
				<div class="grid gap-3 md:grid-cols-2">
					<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="documentType" placeholder="Jenis dokumen" value="Air" required />
					<select class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="position" required>
						{#each positionOptions as item}
							<option value={item}>{item}</option>
						{/each}
					</select>
				</div>
				<div class="grid gap-3 md:grid-cols-2">
					<select class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="progressStatus" required>
						{#each pertekStatusOptions as item}
							<option value={item}>{item}</option>
						{/each}
					</select>
					<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" type="date" name="receivedDate" value={todayIso} required />
				</div>
				<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" type="date" name="progressUpdatedDate" value={todayIso} required />
				<button class="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Tambah Pertek</button>
			</form>

			<div class="mt-5 space-y-3">
				{#if data.pertekRows.length === 0}
					<p class="text-sm text-slate-500">Belum ada data pertek</p>
				{:else}
					{#each data.pertekRows.slice(0, 25) as row}
						<details class="rounded-xl border border-slate-200 bg-slate-50 p-3">
							<summary class="cursor-pointer text-sm font-medium text-slate-800">
								{row.registrationNo} • {row.agency} • {row.progressStatus}
							</summary>
							<form method="POST" action="?/update" class="mt-3 grid gap-2">
								<input type="hidden" name="collection" value="pertek" />
								<input type="hidden" name="id" value={row.id} />
								<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="registrationNo" value={row.registrationNo} required />
								<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="agency" value={row.agency} required />
								<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="activity" value={row.activity} required />
								<div class="grid gap-2 md:grid-cols-2">
									<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="documentType" value={row.documentType} required />
									<select class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="position" required>
										{#each positionOptions as item}
											<option value={item} selected={row.position === item}>{item}</option>
										{/each}
									</select>
								</div>
								<div class="grid gap-2 md:grid-cols-2">
									<select class="rounded-lg border border-slate-300 px-3 py-2 text-sm" name="progressStatus" required>
										{#each pertekStatusOptions as item}
											<option value={item} selected={row.progressStatus === item}>{item}</option>
										{/each}
									</select>
									<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" type="date" name="receivedDate" value={row.receivedDate} required />
								</div>
								<input class="rounded-lg border border-slate-300 px-3 py-2 text-sm" type="date" name="progressUpdatedDate" value={row.progressUpdatedDate} required />
								<div class="flex gap-2">
									<button class="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white">Simpan Perubahan</button>
								</div>
							</form>
							<form method="POST" action="?/delete" class="mt-2">
								<input type="hidden" name="collection" value="pertek" />
								<input type="hidden" name="id" value={row.id} />
								<button class="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white">Hapus</button>
							</form>
							<p class="mt-2 text-xs text-slate-500">Update terakhir: {formatDate(row.progressUpdatedDate)}</p>
						</details>
					{/each}
				{/if}
			</div>
		</article>
	</div>
</section>
