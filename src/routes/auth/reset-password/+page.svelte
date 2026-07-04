<script lang="ts">
	import { goto } from '$app/navigation'
	import { createSupabaseBrowserClient } from '$lib/supabase/client'
	import KeyRound from 'lucide-svelte/icons/key-round'
	import Eye from 'lucide-svelte/icons/eye'
	import EyeOff from 'lucide-svelte/icons/eye-off'
	import { onMount } from 'svelte'

	let password = $state('')
	let confirmPassword = $state('')
	let showPassword = $state(false)
	let isSubmitting = $state(false)
	let isReady = $state(false)
	let message = $state('')
	let errorMessage = $state('')

	onMount(async () => {
		const supabase = createSupabaseBrowserClient()
		if (!supabase) {
			errorMessage = 'Supabase belum dikonfigurasi.'
			return
		}

		const {
			data: { session }
		} = await supabase.auth.getSession()

		isReady = Boolean(session)
		if (!session) {
			errorMessage = 'Link reset tidak valid atau sudah kedaluwarsa. Minta reset sandi baru dari super admin.'
		}
	})

	const updatePassword = async () => {
		errorMessage = ''
		message = ''

		if (password.length < 8) {
			errorMessage = 'Kata sandi minimal 8 karakter.'
			return
		}

		if (password !== confirmPassword) {
			errorMessage = 'Konfirmasi sandi belum sama.'
			return
		}

		const supabase = createSupabaseBrowserClient()
		if (!supabase) {
			errorMessage = 'Supabase belum dikonfigurasi.'
			return
		}

		isSubmitting = true
		const { error } = await supabase.auth.updateUser({ password })
		isSubmitting = false

		if (error) {
			errorMessage = error.message
			return
		}

		message = 'Sandi berhasil diperbarui. Mengarahkan ke dashboard...'
		setTimeout(() => {
			void goto('/admin/dashboard')
		}, 650)
	}
</script>

<main class="min-h-screen bg-[#f6f8fb] px-4 py-10 text-[var(--ink)]">
	<section class="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
		<div class="w-full rounded-3xl border border-[var(--line)] bg-white p-6 shadow-[0_28px_60px_-45px_rgba(15,23,42,0.55)] sm:p-7">
			<span class="inline-flex size-12 items-center justify-center rounded-2xl bg-[#eef8e7] text-[#2f6f1b]">
				<KeyRound size={23} strokeWidth={2.2} />
			</span>
			<h1 class="mt-5 text-2xl font-semibold tracking-tight text-slate-900">Buat Sandi Baru</h1>
			<p class="mt-2 text-sm leading-6 text-slate-600">
				Masukkan sandi baru untuk akun admin. Setelah berhasil, akun akan diarahkan kembali ke dashboard.
			</p>

			{#if errorMessage}
				<p class="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
					{errorMessage}
				</p>
			{/if}
			{#if message}
				<p class="mt-5 rounded-2xl border border-[#cfe7bd] bg-[#eef8e7] px-4 py-3 text-sm font-medium text-[#2f6f1b]">
					{message}
				</p>
			{/if}

			<form
				class="mt-6 grid gap-4"
				onsubmit={(event) => {
					event.preventDefault()
					void updatePassword()
				}}
			>
				<label class="grid gap-1.5 text-sm font-semibold text-slate-800">
					Sandi baru
					<div class="relative">
						<input
							bind:value={password}
							type={showPassword ? 'text' : 'password'}
							autocomplete="new-password"
							disabled={!isReady || isSubmitting}
							class="h-11 w-full rounded-xl border border-[var(--line)] bg-white px-3.5 pr-11 text-sm font-normal text-[var(--ink)] placeholder:text-slate-400 focus:border-[#64AD31] focus:outline-none disabled:bg-slate-50"
							placeholder="Minimal 8 karakter"
						/>
						<button
							type="button"
							class="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
							aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOff size={17} strokeWidth={2.2} />
							{:else}
								<Eye size={17} strokeWidth={2.2} />
							{/if}
						</button>
					</div>
				</label>

				<label class="grid gap-1.5 text-sm font-semibold text-slate-800">
					Ulangi sandi
					<input
						bind:value={confirmPassword}
						type={showPassword ? 'text' : 'password'}
						autocomplete="new-password"
						disabled={!isReady || isSubmitting}
						class="h-11 rounded-xl border border-[var(--line)] bg-white px-3.5 text-sm font-normal text-[var(--ink)] placeholder:text-slate-400 focus:border-[#64AD31] focus:outline-none disabled:bg-slate-50"
						placeholder="Ketik ulang sandi"
					/>
				</label>

				<button
					type="submit"
					disabled={!isReady || isSubmitting}
					class="mt-1 inline-flex h-11 items-center justify-center rounded-xl border border-[#64AD31] bg-[#64AD31] px-4 text-sm font-semibold text-white transition hover:border-[#4f8925] hover:bg-[#4f8925] disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300"
				>
					{isSubmitting ? 'Menyimpan...' : 'Simpan Sandi Baru'}
				</button>
			</form>
		</div>
	</section>
</main>
