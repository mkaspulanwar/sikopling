<script lang="ts">
	import type { PageData } from './$types'
	import Mail from 'lucide-svelte/icons/mail'
	import ShieldUser from 'lucide-svelte/icons/shield-user'
	import UserRound from 'lucide-svelte/icons/user-round'

const { data }: { data: PageData } = $props()
const roleLabel = $derived.by(() => (data.role ? data.role.replaceAll('_', ' ') : 'admin'))
</script>

<section class="mx-auto w-full max-w-[980px] space-y-5">
	<header class="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_28px_60px_-45px_rgba(15,23,42,0.55)] sm:p-7">
		<p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Profil Admin</p>
		<h1 class="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-[1.9rem]">Profil Pengguna</h1>
		<p class="mt-2 max-w-3xl text-sm text-slate-600 sm:text-[0.96rem]">
			Informasi akun admin yang aktif di panel manajemen Sikopling.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<article class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_20px_40px_-35px_rgba(15,23,42,0.55)]">
			<div class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
				<UserRound class="h-5 w-5" />
			</div>
			<p class="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Nama Akun</p>
			<p class="mt-1 text-base font-semibold text-slate-900">{data.user?.email?.split('@')[0] ?? 'Admin Sikopling'}</p>
		</article>

		<article class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_20px_40px_-35px_rgba(15,23,42,0.55)]">
			<div class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
				<Mail class="h-5 w-5" />
			</div>
			<p class="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Email</p>
			<p class="mt-1 break-all text-base font-semibold text-slate-900">{data.user?.email ?? 'admin@sikopling.id'}</p>
		</article>

		<article class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_20px_40px_-35px_rgba(15,23,42,0.55)] sm:col-span-2">
			<div class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
				<ShieldUser class="h-5 w-5" />
			</div>
			<p class="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Role</p>
			<p class="mt-1 text-base font-semibold capitalize text-slate-900">{roleLabel}</p>
		</article>
	</div>
</section>
