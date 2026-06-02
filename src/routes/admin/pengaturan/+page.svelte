<script lang="ts">
	import {
		DEFAULT_ADMIN_DASHBOARD_PREFERENCES,
		RECENT_ITEMS_LIMIT_OPTIONS,
		loadAdminDashboardPreferences,
		resetAdminDashboardPreferences,
		saveAdminDashboardPreferences,
		type AdminDashboardPreferences
	} from '$lib/admin-dashboard-preferences'
	import CheckCircle2 from 'lucide-svelte/icons/check-circle-2'
	import Clock3 from 'lucide-svelte/icons/clock-3'
	import Gauge from 'lucide-svelte/icons/gauge'
	import History from 'lucide-svelte/icons/history'
	import LayoutDashboard from 'lucide-svelte/icons/layout-dashboard'
	import RotateCcw from 'lucide-svelte/icons/rotate-ccw'
	import Save from 'lucide-svelte/icons/save'
	import TableProperties from 'lucide-svelte/icons/table-properties'
	import { onDestroy, onMount } from 'svelte'

	let preferences = $state<AdminDashboardPreferences>({ ...DEFAULT_ADMIN_DASHBOARD_PREFERENCES })
	let savedPreferences = $state<AdminDashboardPreferences>({ ...DEFAULT_ADMIN_DASHBOARD_PREFERENCES })
	let feedback = $state<'idle' | 'saved' | 'reset' | 'error'>('idle')
	let feedbackTimer: ReturnType<typeof setTimeout> | null = null

	const hasChanges = $derived.by(() => JSON.stringify(preferences) !== JSON.stringify(savedPreferences))

	const setFeedback = (state: typeof feedback) => {
		feedback = state
		if (feedbackTimer) clearTimeout(feedbackTimer)
		feedbackTimer = setTimeout(() => {
			feedback = 'idle'
		}, 3200)
	}

	const savePreferences = () => {
		try {
			const storedPreferences = saveAdminDashboardPreferences(preferences)
			preferences = { ...storedPreferences }
			savedPreferences = { ...storedPreferences }
			setFeedback('saved')
		} catch {
			setFeedback('error')
		}
	}

	const resetPreferences = () => {
		try {
			const storedPreferences = resetAdminDashboardPreferences()
			preferences = { ...storedPreferences }
			savedPreferences = { ...storedPreferences }
			setFeedback('reset')
		} catch {
			setFeedback('error')
		}
	}

	onMount(() => {
		const storedPreferences = loadAdminDashboardPreferences()
		preferences = { ...storedPreferences }
		savedPreferences = { ...storedPreferences }
	})

	onDestroy(() => {
		if (feedbackTimer) clearTimeout(feedbackTimer)
	})
</script>

<section class="mx-auto w-full max-w-[1040px]">
	<header class="border-b border-[var(--line)] pb-6">
		<p class="text-xs font-semibold uppercase tracking-[0.16em] text-[#4e9123]">Preferensi Admin</p>
		<h1 class="mt-2 text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-[2.35rem]">Pengaturan Dashboard</h1>
		<p class="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)] sm:text-[0.96rem]">
			Atur informasi yang ingin diprioritaskan pada dashboard admin. Preferensi disimpan pada browser ini dan langsung diterapkan ketika dashboard dibuka.
		</p>
	</header>

	<form
		class="py-7"
		onsubmit={(event) => {
			event.preventDefault()
			savePreferences()
		}}
	>
		<section class="grid gap-5 border-b border-[var(--line)] pb-7 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
			<div>
				<div class="flex items-center gap-2.5">
					<LayoutDashboard class="h-5 w-5 text-[#4e9123]" />
					<h2 class="text-lg font-semibold text-[var(--ink)]">Tampilan Utama</h2>
				</div>
				<p class="mt-2 text-sm leading-relaxed text-[var(--muted)]">Sesuaikan elemen utama yang selalu terlihat pada dashboard.</p>
			</div>

			<div class="divide-y divide-[var(--line)] border-y border-[var(--line)]">
				<label class="flex cursor-pointer items-start justify-between gap-4 py-4">
					<span>
						<span class="block text-sm font-semibold text-[var(--ink)]">Toolbar tetap di atas layar</span>
						<span class="mt-1 block text-xs leading-relaxed text-[var(--muted)]">Pencarian dan aksi cepat tetap dapat dijangkau saat halaman digulir.</span>
					</span>
					<input
						type="checkbox"
						bind:checked={preferences.stickyToolbar}
						class="mt-0.5 h-5 w-5 shrink-0 rounded border-[var(--line)] text-[#64AD31] focus:ring-[#64AD31]"
					/>
				</label>

				<label class="flex cursor-pointer items-start justify-between gap-4 py-4">
					<span>
						<span class="block text-sm font-semibold text-[var(--ink)]">Tampilkan panel sambutan</span>
						<span class="mt-1 block text-xs leading-relaxed text-[var(--muted)]">Tampilkan nama admin dan ringkasan singkat pada bagian awal dashboard.</span>
					</span>
					<input
						type="checkbox"
						bind:checked={preferences.showWelcomePanel}
						class="mt-0.5 h-5 w-5 shrink-0 rounded border-[var(--line)] text-[#64AD31] focus:ring-[#64AD31]"
					/>
				</label>

				<label class="flex cursor-pointer items-start justify-between gap-4 py-4">
					<span>
						<span class="block text-sm font-semibold text-[var(--ink)]">Tampilkan tanggal pada toolbar</span>
						<span class="mt-1 block text-xs leading-relaxed text-[var(--muted)]">Widget tanggal tetap muncul pada toolbar ketika layar cukup lebar.</span>
					</span>
					<input
						type="checkbox"
						bind:checked={preferences.showToolbarDate}
						class="mt-0.5 h-5 w-5 shrink-0 rounded border-[var(--line)] text-[#64AD31] focus:ring-[#64AD31]"
					/>
				</label>
			</div>
		</section>

		<section class="grid gap-5 border-b border-[var(--line)] py-7 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
			<div>
				<div class="flex items-center gap-2.5">
					<Gauge class="h-5 w-5 text-[#4e9123]" />
					<h2 class="text-lg font-semibold text-[var(--ink)]">Kepadatan Data</h2>
				</div>
				<p class="mt-2 text-sm leading-relaxed text-[var(--muted)]">Atur banyaknya informasi agar sesuai dengan kebutuhan kerja harian.</p>
			</div>

			<div class="space-y-5">
				<label class="flex cursor-pointer items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
					<span>
						<span class="block text-sm font-semibold text-[var(--ink)]">Gunakan kartu ringkasan ringkas</span>
						<span class="mt-1 block text-xs leading-relaxed text-[var(--muted)]">Kurangi padding kartu statistik agar lebih banyak konten terlihat sekaligus.</span>
					</span>
					<input
						type="checkbox"
						bind:checked={preferences.compactSummaryCards}
						class="mt-0.5 h-5 w-5 shrink-0 rounded border-[var(--line)] text-[#64AD31] focus:ring-[#64AD31]"
					/>
				</label>

				<label class="block">
					<span class="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
						<TableProperties class="h-4 w-4 text-[#4e9123]" />
						Jumlah pengajuan terbaru
					</span>
					<span class="mt-1 block text-xs leading-relaxed text-[var(--muted)]">Batasi jumlah baris pada tabel dashboard agar daftar tetap mudah dipindai.</span>
					<select
						bind:value={preferences.recentItemsLimit}
						class="mt-3 h-10 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm font-semibold text-[var(--ink)] focus:border-[#64AD31] focus:ring-[#64AD31] sm:max-w-[12rem]"
					>
						{#each RECENT_ITEMS_LIMIT_OPTIONS as option}
							<option value={option}>{option} pengajuan</option>
						{/each}
					</select>
				</label>
			</div>
		</section>

		<section class="grid gap-5 border-b border-[var(--line)] py-7 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10">
			<div>
				<div class="flex items-center gap-2.5">
					<History class="h-5 w-5 text-[#4e9123]" />
					<h2 class="text-lg font-semibold text-[var(--ink)]">Informasi Tambahan</h2>
				</div>
				<p class="mt-2 text-sm leading-relaxed text-[var(--muted)]">Pilih detail pendukung yang perlu terlihat di dashboard.</p>
			</div>

			<div class="divide-y divide-[var(--line)] border-y border-[var(--line)]">
				<label class="flex cursor-pointer items-start justify-between gap-4 py-4">
					<span>
						<span class="block text-sm font-semibold text-[var(--ink)]">Tampilkan riwayat login</span>
						<span class="mt-1 block text-xs leading-relaxed text-[var(--muted)]">Perlihatkan aktivitas akun pada sisi kanan daftar pengajuan terbaru.</span>
					</span>
					<input
						type="checkbox"
						bind:checked={preferences.showLoginHistory}
						class="mt-0.5 h-5 w-5 shrink-0 rounded border-[var(--line)] text-[#64AD31] focus:ring-[#64AD31]"
					/>
				</label>

				<label class="flex cursor-pointer items-start justify-between gap-4 py-4">
					<span>
						<span class="block text-sm font-semibold text-[var(--ink)]">Tampilkan detik pada waktu update</span>
						<span class="mt-1 block text-xs leading-relaxed text-[var(--muted)]">Gunakan timestamp yang lebih presisi pada tabel pengajuan terbaru dan riwayat login.</span>
					</span>
					<input
						type="checkbox"
						bind:checked={preferences.showUpdateSeconds}
						class="mt-0.5 h-5 w-5 shrink-0 rounded border-[var(--line)] text-[#64AD31] focus:ring-[#64AD31]"
					/>
				</label>
			</div>
		</section>

		<div class="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
			<div class="min-h-5">
				{#if feedback === 'saved'}
					<p class="inline-flex items-center gap-1.5 text-sm font-semibold text-[#39751c]">
						<CheckCircle2 class="h-4 w-4" />
						Pengaturan tersimpan dan siap digunakan.
					</p>
				{:else if feedback === 'reset'}
					<p class="inline-flex items-center gap-1.5 text-sm font-semibold text-[#39751c]">
						<CheckCircle2 class="h-4 w-4" />
						Pengaturan dikembalikan ke nilai awal.
					</p>
				{:else if feedback === 'error'}
					<p class="text-sm font-semibold text-[#c63d3d]">Pengaturan gagal disimpan pada browser ini.</p>
				{:else if hasChanges}
					<p class="text-sm text-[var(--muted)]">Ada perubahan yang belum disimpan.</p>
				{:else}
					<p class="inline-flex items-center gap-1.5 text-sm text-[var(--muted)]">
						<Clock3 class="h-4 w-4" />
						Preferensi tersimpan pada browser ini.
					</p>
				{/if}
			</div>

			<div class="flex flex-wrap gap-2">
				<button
					type="button"
					onclick={resetPreferences}
					class="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--line)] px-3.5 text-sm font-semibold transition hover:border-[#64AD31] hover:bg-[var(--accent-soft)]"
				>
					<RotateCcw class="h-4 w-4" />
					Reset
				</button>
				<button
					type="submit"
					disabled={!hasChanges}
					class="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#64AD31] px-4 text-sm font-semibold text-white! transition hover:bg-[#559c28] disabled:cursor-not-allowed disabled:opacity-45"
				>
					<Save class="h-4 w-4" />
					Simpan Pengaturan
				</button>
			</div>
		</div>
	</form>
</section>
