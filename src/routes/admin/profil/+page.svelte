<script lang="ts">
	import type { PageData } from './$types'
	import Mail from 'lucide-svelte/icons/mail'
	import ShieldUser from 'lucide-svelte/icons/shield-user'
	import UserRound from 'lucide-svelte/icons/user-round'
	import CheckCircle2 from 'lucide-svelte/icons/check-circle-2'

	const { data }: { data: PageData } = $props()
	const roleLabel = $derived.by(() => (data.role ? data.role.replaceAll('_', ' ') : 'admin'))
	const accountLabel = $derived.by(() => data.user?.email?.split('@')[0] ?? 'Admin Sikopling')
</script>

<section class="mx-auto w-full max-w-[1320px] space-y-6">
	<header class="overflow-hidden rounded-3xl border border-[var(--line)] bg-[#64AD31] p-6 sm:p-7">
		<div class="relative">
			<div class="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full"></div>
			<p class="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--surface)]">Profil Admin</p>
			<h1 class="mt-2 text-2xl font-semibold tracking-tight text-[var(--surface)] sm:text-[2rem]">Profil Pengguna</h1>
			<p class="mt-2 max-w-3xl text-sm text-[var(--surface)] sm:text-[0.96rem]">
				Informasi akun admin yang aktif di panel manajemen Sikopling.
			</p>
		</div>
	</header>

	<section class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
		<div class="flex flex-wrap items-start justify-between gap-3">
			<div>
				<p class="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Status Akun</p>
				<h2 class="mt-1 text-lg font-semibold text-[var(--ink)]">Akun Admin Aktif</h2>
				<p class="mt-1 text-sm text-[var(--muted)]">
					Data ini mengikuti sesi Supabase yang sedang login.
				</p>
			</div>
			<span class="inline-flex items-center gap-1.5 rounded-full border border-[#d7ebc8] bg-[var(--secondary-soft)] px-3 py-1.5 text-xs font-semibold text-[#2f6f1b]">
				<CheckCircle2 class="h-3.5 w-3.5" />
				Online
			</span>
		</div>
	</section>

	<div class="grid gap-4 md:grid-cols-2">
		<article class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_20px_40px_-35px_rgba(15,23,42,0.55)]">
			<div class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d7ebc8] bg-[var(--secondary-soft)] text-[#2f6f1b]">
				<UserRound class="h-5 w-5" />
			</div>
			<p class="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Nama Akun</p>
			<p class="mt-1 text-base font-semibold text-[var(--ink)]">{accountLabel}</p>
		</article>

		<article class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_20px_40px_-35px_rgba(15,23,42,0.55)]">
			<div class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d7ebc8] bg-[var(--secondary-soft)] text-[#2f6f1b]">
				<Mail class="h-5 w-5" />
			</div>
			<p class="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Email</p>
			<p class="mt-1 break-all text-base font-semibold text-[var(--ink)]">{data.user?.email ?? 'admin@sikopling.id'}</p>
		</article>

		<article class="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_20px_40px_-35px_rgba(15,23,42,0.55)] md:col-span-2">
			<div class="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d7ebc8] bg-[var(--secondary-soft)] text-[#2f6f1b]">
				<ShieldUser class="h-5 w-5" />
			</div>
			<p class="mt-4 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">Role</p>
			<p class="mt-1 text-base font-semibold capitalize text-[var(--ink)]">{roleLabel}</p>
		</article>
	</div>
</section>
