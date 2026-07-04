<script lang="ts">
	import Search from 'lucide-svelte/icons/search'
	import ShieldCheck from 'lucide-svelte/icons/shield-check'
	import UserPlus from 'lucide-svelte/icons/user-plus'
	import type { ActionData, PageData } from './$types'

	const { data, form }: { data: PageData; form: ActionData } = $props()
	type FormValues = { values?: { email?: string; fullName?: string } }

	const dateFormatter = new Intl.DateTimeFormat('id-ID', {
		dateStyle: 'medium',
		timeStyle: 'short'
	})

	let keyword = $state('')

	const filteredAccounts = $derived.by(() => {
		const search = keyword.trim().toLowerCase()
		if (!search) return data.accounts

		return data.accounts.filter((account) =>
			[
				account.email,
				account.full_name ?? '',
				account.role,
				account.is_active ? 'aktif' : 'nonaktif',
				account.providers.join(' ')
			]
				.join(' ')
				.toLowerCase()
				.includes(search)
		)
	})

	const formValues = $derived.by(() => {
		if (!form || !('values' in form)) return null
		return (form as FormValues).values ?? null
	})

	const formatDateTime = (value: string | null) => {
		if (!value) return '-'
		const parsed = new Date(value)
		return Number.isNaN(parsed.getTime()) ? '-' : dateFormatter.format(parsed)
	}

	const formatRole = (role: string) => (role === 'super_admin' ? 'Super Admin' : 'Admin')

	const roleBadgeClass = (role: string) =>
		role === 'super_admin'
			? 'border-[#cddaf3] bg-[#f0f6ff] text-[#2d5bd1]'
			: 'border-[#cfe7bd] bg-[#eef8e7] text-[#2f6f1b]'

	const providerLabel = (providers: string[]) => {
		if (providers.length === 0) return 'Email'
		return providers.map((provider) => provider[0]?.toUpperCase() + provider.slice(1)).join(', ')
	}
</script>

<section class="mx-auto w-full max-w-[1320px] space-y-6">
	<header class="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_28px_60px_-45px_rgba(15,23,42,0.48)] sm:p-7">
		<p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Super Admin</p>
		<h1 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.95rem]">Manajemen Akun Admin</h1>
		<p class="mt-2 max-w-3xl text-sm text-slate-600 sm:text-[0.96rem]">
			Undang admin baru, kirim reset sandi, dan nonaktifkan akses admin tanpa membuka Supabase.
		</p>
	</header>

	{#if data.unavailable}
		<p class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
			Supabase belum dikonfigurasi. Akun admin belum dapat dimuat.
		</p>
	{:else if data.forbidden}
		<p class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
			Halaman ini hanya dapat diakses oleh super admin.
		</p>
	{:else}
		{#if data.errorMessage}
			<p class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
				{data.errorMessage}
			</p>
		{/if}

		{#if form?.success}
			<p class="rounded-2xl border border-[#cfe7bd] bg-[#eef8e7] px-4 py-3 text-sm font-medium text-[#2f6f1b]">
				{form.success}
			</p>
		{/if}
		{#if form?.error}
			<p class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
				{form.error}
			</p>
		{/if}

		<section class="grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
			<form
				method="POST"
				action="?/invite"
				class="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-[0_18px_36px_-34px_rgba(15,23,42,0.46)] sm:p-5"
			>
				<div class="flex items-start gap-3">
					<span class="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef8e7] text-[#2f6f1b]">
						<UserPlus size={21} strokeWidth={2.2} />
					</span>
					<div>
						<h2 class="text-lg font-semibold text-slate-900">Undang Admin</h2>
						<p class="mt-1 text-sm text-slate-600">Role akun baru otomatis admin.</p>
					</div>
				</div>

				<div class="mt-5 grid gap-3">
					<label class="grid gap-1.5 text-sm font-semibold text-slate-800">
						Email
						<input
							name="email"
							type="email"
							autocomplete="email"
							value={formValues?.email ?? ''}
							placeholder="admin@contoh.go.id"
							class="h-11 rounded-xl border border-[var(--line)] bg-white px-3.5 text-sm font-normal text-[var(--ink)] placeholder:text-slate-400 focus:border-[#64AD31] focus:outline-none"
						/>
					</label>
					<label class="grid gap-1.5 text-sm font-semibold text-slate-800">
						Nama
						<input
							name="fullName"
							type="text"
							autocomplete="name"
							value={formValues?.fullName ?? ''}
							placeholder="Nama admin"
							class="h-11 rounded-xl border border-[var(--line)] bg-white px-3.5 text-sm font-normal text-[var(--ink)] placeholder:text-slate-400 focus:border-[#64AD31] focus:outline-none"
						/>
					</label>
				</div>

				<button
					type="submit"
					class="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#64AD31] bg-[#64AD31] px-4 text-sm font-semibold text-white transition hover:border-[#4f8925] hover:bg-[#4f8925]"
				>
					<UserPlus size={17} strokeWidth={2.3} />
					Kirim Undangan
				</button>
			</form>

			<div class="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-[0_18px_36px_-34px_rgba(15,23,42,0.46)] sm:p-5">
				<div class="flex items-start gap-3">
					<span class="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#f0f6ff] text-[#2d5bd1]">
						<ShieldCheck size={22} strokeWidth={2.2} />
					</span>
					<div>
						<h2 class="text-lg font-semibold text-slate-900">Proteksi Role</h2>
						<p class="mt-1 text-sm text-slate-600">
							Super admin tetap satu sebagai pemilik utama. Admin Google maupun email dikelola sebagai admin biasa.
						</p>
					</div>
				</div>

				<div class="mt-5 grid grid-cols-2 gap-3">
					<div class="rounded-xl border border-[#d7dee8] bg-slate-50 px-4 py-4">
						<p class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Total Akun</p>
						<p class="mt-2 text-2xl font-semibold text-slate-900">{data.accounts.length}</p>
					</div>
					<div class="rounded-xl border border-[#d7dee8] bg-slate-50 px-4 py-4">
						<p class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Aktif</p>
						<p class="mt-2 text-2xl font-semibold text-slate-900">
							{data.accounts.filter((account) => account.is_active).length}
						</p>
					</div>
				</div>
			</div>
		</section>

		<section class="rounded-2xl border border-[var(--line)] bg-white shadow-[0_20px_40px_-35px_rgba(15,23,42,0.48)]">
			<div class="flex flex-col gap-3 border-b border-[var(--line)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
				<div>
					<h2 class="text-lg font-semibold text-slate-900">Daftar Admin</h2>
					<p class="mt-1 text-sm text-slate-600">{filteredAccounts.length} dari {data.accounts.length} akun tampil.</p>
				</div>
				<label class="relative w-full sm:max-w-[320px]" aria-label="Cari akun admin">
					<Search class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
					<input
						type="search"
						bind:value={keyword}
						placeholder="Cari akun admin"
						class="h-11 w-full rounded-xl border border-[var(--line)] bg-white pl-9 pr-3 text-sm text-[var(--ink)] placeholder:text-slate-400 focus:border-[#64AD31] focus:outline-none"
					/>
				</label>
			</div>

			{#if filteredAccounts.length === 0}
				<div class="px-4 py-12 text-center text-sm text-[var(--muted)]">
					Tidak ada akun admin yang cocok dengan pencarian.
				</div>
			{:else}
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-[var(--line)] text-left text-sm">
						<thead class="bg-slate-50 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
							<tr>
								<th scope="col" class="px-4 py-3">Admin</th>
								<th scope="col" class="px-4 py-3">Role</th>
								<th scope="col" class="px-4 py-3">Status</th>
								<th scope="col" class="px-4 py-3">Login</th>
								<th scope="col" class="px-4 py-3">Provider</th>
								<th scope="col" class="px-4 py-3 text-right">Aksi</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-[var(--line)]">
							{#each filteredAccounts as account}
								<tr class="align-top transition hover:bg-slate-50">
									<td class="px-4 py-4">
										<p class="font-semibold text-slate-900">{account.full_name || account.email}</p>
										<p class="mt-1 text-xs text-slate-500">{account.email}</p>
									</td>
									<td class="px-4 py-4">
										<span class={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${roleBadgeClass(account.role)}`}>
											{formatRole(account.role)}
										</span>
									</td>
									<td class="px-4 py-4">
										<span
											class={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
												account.is_active
													? 'border-[#cfe7bd] bg-[#eef8e7] text-[#2f6f1b]'
													: 'border-rose-200 bg-rose-50 text-rose-700'
											}`}
										>
											{account.is_active ? 'Aktif' : 'Nonaktif'}
										</span>
									</td>
									<td class="px-4 py-4 text-slate-600">
										<p>{formatDateTime(account.auth_last_sign_in_at)}</p>
										<p class="mt-1 text-xs text-slate-400">Dibuat {formatDateTime(account.created_at)}</p>
									</td>
									<td class="px-4 py-4 text-slate-600">
										{providerLabel(account.providers)}
									</td>
									<td class="px-4 py-4">
										<div class="flex flex-wrap justify-end gap-2">
											<form method="POST" action="?/resetPassword">
												<input type="hidden" name="id" value={account.id} />
												<input type="hidden" name="email" value={account.email} />
												<button
													type="submit"
													class="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--line)] bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
												>
													Reset Sandi
												</button>
											</form>

											{#if account.role !== 'super_admin'}
												<form method="POST" action="?/toggleActive">
													<input type="hidden" name="id" value={account.id} />
													<input type="hidden" name="nextActive" value={String(!account.is_active)} />
													<button
														type="submit"
														class={`inline-flex h-9 items-center justify-center rounded-lg border px-3 text-xs font-semibold transition ${
															account.is_active
																? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
																: 'border-[#cfe7bd] bg-[#eef8e7] text-[#2f6f1b] hover:bg-[#e2f1d7]'
														}`}
													>
														{account.is_active ? 'Nonaktifkan' : 'Aktifkan'}
													</button>
												</form>
											{/if}
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</section>
	{/if}
</section>
