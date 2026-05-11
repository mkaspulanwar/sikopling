<script lang="ts">
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import { navigating, page } from '$app/state'
	import TopProgressBar from '$lib/components/TopProgressBar.svelte'
	import { cubicInOut } from 'svelte/easing'
	import { onDestroy, onMount } from 'svelte'
	import { slide } from 'svelte/transition'
	import type { Snippet } from 'svelte'
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right'
	import ChevronDown from 'lucide-svelte/icons/chevron-down'
	import ChevronRight from 'lucide-svelte/icons/chevron-right'
	import FileSpreadsheet from 'lucide-svelte/icons/file-spreadsheet'
	import FileText from 'lucide-svelte/icons/file-text'
	import FolderCheck from 'lucide-svelte/icons/folder-check'
	import FolderClock from 'lucide-svelte/icons/folder-clock'
	import GitBranch from 'lucide-svelte/icons/git-branch'
	import LayoutGrid from 'lucide-svelte/icons/layout-grid'
	import PanelLeftClose from 'lucide-svelte/icons/panel-left-close'
	import PanelLeftOpen from 'lucide-svelte/icons/panel-left-open'
	import SquareArrowRightExit from 'lucide-svelte/icons/square-arrow-right-exit'
	import UserRound from 'lucide-svelte/icons/user-round'
	import type { LayoutData } from './$types'

	let { children, data }: { children: Snippet; data: LayoutData } = $props()

	const monitoringItems = [
		{ label: 'Persetujuan Lingkungan', href: '/admin/layanan/perling', icon: FileSpreadsheet },
		{ label: 'Persetujuan Teknis', href: '/admin/layanan/pertek', icon: FileText },
		{ label: 'Integrasi', href: '/admin/layanan/integrasi', icon: GitBranch }
	]

	const pengumumanItems = [
		{ label: 'Persetujuan Lingkungan', href: '/admin/pengumuman/perling', icon: FileSpreadsheet },
		{ label: 'Persetujuan Teknis', href: '/admin/pengumuman/pertek', icon: FileText },
		{ label: 'Integrasi', href: '/admin/pengumuman/integrasi', icon: GitBranch }
	]

	const navItems = [
		{ type: 'link' as const, label: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
		{ type: 'group' as const, label: 'Monitoring', icon: FolderClock, items: monitoringItems },
		{ type: 'group' as const, label: 'Pengumuman', icon: FolderCheck, items: pengumumanItems },
		{ type: 'link' as const, label: 'Profil', href: '/admin/profil', icon: UserRound }
	]

	let isSidebarCollapsed = $state(false)
	let isMobileMenuOpen = $state(false)
	let mobileMenuMotionState = $state<'idle' | 'opening' | 'closing'>('idle')
	let isMonitoringOpen = $state(false)
	let isPengumumanOpen = $state(false)
	const ADMIN_KEEP_ALIVE_INTERVAL_MS = 12 * 60 * 1000
	const KEEP_ALIVE_LEADER_KEY = 'admin_keep_alive_leader'
	const KEEP_ALIVE_LEADER_LEASE_MS = 90 * 1000
	const KEEP_ALIVE_LEADER_HEARTBEAT_MS = 20 * 1000
	let keepAliveInterval: ReturnType<typeof setInterval> | null = null
	let leaderHeartbeatInterval: ReturnType<typeof setInterval> | null = null
	let isPingingSession = false
	let isKeepAliveLeader = false
	let tabId = ''

	const pathname = $derived.by(() => page.url.pathname.replace(/\/+$/, '') || '/admin/dashboard')
	const isAdminNavigationPending = $derived.by(() => {
		if (!browser || !navigating.to) return false
		return navigating.to.url.pathname.startsWith('/admin')
	})

	const isNavActive = (href: string) =>
		pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(`${href}/`))

	const isNavGroupActive = (items: typeof monitoringItems) => items.some((item) => isNavActive(item.href))

	const isNavGroupOpen = (label: string) => (label === 'Monitoring' ? isMonitoringOpen : isPengumumanOpen)

	const toggleNavGroup = (label: string) => {
		if (isSidebarCollapsed) {
			isSidebarCollapsed = false
		}

		if (label === 'Monitoring') {
			isMonitoringOpen = !isMonitoringOpen
			return
		}

		isPengumumanOpen = !isPengumumanOpen
	}

	const toggleMobileMenu = () => {
		isMobileMenuOpen = !isMobileMenuOpen
	}

	const toggleSidebar = () => {
		isSidebarCollapsed = !isSidebarCollapsed
	}

	const closeMobileMenu = () => {
		isMobileMenuOpen = false
	}

	$effect(() => {
		if (pathname.startsWith('/admin/layanan')) isMonitoringOpen = true
		if (pathname.startsWith('/admin/pengumuman')) isPengumumanOpen = true
	})

	const handleWindowKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') closeMobileMenu()
	}

	const mobileHeaderClass = () =>
		`fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur-lg lg:hidden ${
			isMobileMenuOpen ? 'mobile-nav-solid' : ''
		}`

	const mobileMenuPanelClass = () =>
		`mobile-menu-panel absolute inset-x-0 top-full z-40 border-t border-[var(--line)] bg-[var(--surface)] ${
			mobileMenuMotionState === 'opening'
				? 'is-opening'
				: mobileMenuMotionState === 'closing'
					? 'is-closing'
					: ''
		}`

	const mobileNavLinkClass = () =>
		'group flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold text-[#20232A] transition-colors duration-200 hover:bg-[var(--accent-soft)]'

	const mobileNavGroupButtonClass = () =>
		'group flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-transparent bg-transparent px-3 py-2.5 text-left text-sm font-semibold text-[#20232A] transition-colors duration-200 hover:bg-[var(--accent-soft)]'

	const mobileNavSubLinkClass = () =>
		'group flex h-10 w-full items-center justify-between gap-3 rounded-lg border border-transparent px-3 py-2 text-sm font-normal text-[#20232A] transition-colors duration-200 hover:bg-[var(--accent-soft)]'

	const handleMobileMenuIntroStart = () => {
		mobileMenuMotionState = 'opening'
	}

	const handleMobileMenuIntroEnd = () => {
		mobileMenuMotionState = 'idle'
	}

	const handleMobileMenuOutroStart = () => {
		mobileMenuMotionState = 'closing'
	}

	const handleMobileMenuOutroEnd = () => {
		mobileMenuMotionState = 'idle'
	}

	type KeepAliveLeaderState = {
		id: string
		expiresAt: number
	}

	const readKeepAliveLeaderState = (): KeepAliveLeaderState | null => {
		if (!browser) return null

		try {
			const rawValue = localStorage.getItem(KEEP_ALIVE_LEADER_KEY)
			if (!rawValue) return null
			const parsed = JSON.parse(rawValue) as Partial<KeepAliveLeaderState>
			if (typeof parsed.id !== 'string' || typeof parsed.expiresAt !== 'number') return null
			return { id: parsed.id, expiresAt: parsed.expiresAt }
		} catch {
			return null
		}
	}

	const writeKeepAliveLeaderState = (state: KeepAliveLeaderState) => {
		if (!browser) return
		localStorage.setItem(KEEP_ALIVE_LEADER_KEY, JSON.stringify(state))
	}

	const syncKeepAliveLeaderState = () => {
		const state = readKeepAliveLeaderState()
		isKeepAliveLeader = Boolean(state && state.id === tabId && state.expiresAt > Date.now())
	}

	const claimKeepAliveLeadership = () => {
		if (!browser || !tabId) return false

		const now = Date.now()
		const currentLeader = readKeepAliveLeaderState()

		if (!currentLeader || currentLeader.expiresAt <= now || currentLeader.id === tabId) {
			writeKeepAliveLeaderState({
				id: tabId,
				expiresAt: now + KEEP_ALIVE_LEADER_LEASE_MS
			})
			syncKeepAliveLeaderState()
			return isKeepAliveLeader
		}

		syncKeepAliveLeaderState()
		return false
	}

	const releaseKeepAliveLeadership = () => {
		if (!browser || !tabId) return
		const currentLeader = readKeepAliveLeaderState()
		if (currentLeader?.id === tabId) {
			localStorage.removeItem(KEEP_ALIVE_LEADER_KEY)
		}
		isKeepAliveLeader = false
	}

	const pingAdminSession = async () => {
		if (!browser || !data.supabaseAvailable || !data.isAdmin || isPingingSession || !isKeepAliveLeader) return

		isPingingSession = true
		try {
			const response = await fetch('/admin/session', {
				method: 'POST',
				credentials: 'include'
			})
			if (response.status === 401) {
				const redirectTarget = encodeURIComponent(`${page.url.pathname}${page.url.search}`)
				await goto(`/login?redirectTo=${redirectTarget}`)
			}
		} catch (error) {
			console.warn('Admin session keep-alive gagal', error)
		} finally {
			isPingingSession = false
		}
	}

	onMount(() => {
		tabId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
		void claimKeepAliveLeadership()
		void pingAdminSession()

		keepAliveInterval = setInterval(() => {
			claimKeepAliveLeadership()
			void pingAdminSession()
		}, ADMIN_KEEP_ALIVE_INTERVAL_MS)

		leaderHeartbeatInterval = setInterval(() => {
			claimKeepAliveLeadership()
		}, KEEP_ALIVE_LEADER_HEARTBEAT_MS)

		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				claimKeepAliveLeadership()
				void pingAdminSession()
			}
		}

		const handleStorageChange = (event: StorageEvent) => {
			if (event.key !== KEEP_ALIVE_LEADER_KEY) return
			syncKeepAliveLeaderState()
		}

		document.addEventListener('visibilitychange', handleVisibilityChange)
		window.addEventListener('storage', handleStorageChange)

		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange)
			window.removeEventListener('storage', handleStorageChange)
			if (keepAliveInterval) {
				clearInterval(keepAliveInterval)
				keepAliveInterval = null
			}
			if (leaderHeartbeatInterval) {
				clearInterval(leaderHeartbeatInterval)
				leaderHeartbeatInterval = null
			}
			releaseKeepAliveLeadership()
		}
	})

	onDestroy(() => {
		if (keepAliveInterval) {
			clearInterval(keepAliveInterval)
			keepAliveInterval = null
		}
		if (leaderHeartbeatInterval) {
			clearInterval(leaderHeartbeatInterval)
			leaderHeartbeatInterval = null
		}
		releaseKeepAliveLeadership()
	})
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div class="relative flex min-h-[100dvh] bg-white text-[var(--ink)]">
	<TopProgressBar active={isAdminNavigationPending} />
	<aside
		class={`admin-sidebar-desktop hidden overflow-hidden border-r border-[var(--line)] bg-[var(--surface)] px-[18px] pb-4 pt-5 shadow-[0_18px_42px_-30px_rgba(15,23,42,0.38)] lg:fixed lg:left-0 lg:top-0 lg:z-30 lg:flex lg:h-[100dvh] lg:flex-col ${
			isSidebarCollapsed ? 'lg:w-[95px]' : 'lg:w-[285px]'
		}`}
	>
			<div
				class={`mb-3 flex h-14 items-center border-b border-[var(--line)] pb-5 ${
					isSidebarCollapsed ? 'justify-center pr-0' : 'justify-between pr-0.5'
				}`}
			>
			<a
				href="/admin/dashboard"
				aria-label="Sikopling Admin"
				class={`admin-sidebar-brand inline-flex items-center overflow-hidden ${
					isSidebarCollapsed
						? 'is-collapsed pointer-events-none max-w-0 -translate-x-1 px-0 py-0 opacity-0'
						: 'is-expanded max-w-[11rem] translate-x-0 px-0 py-0 opacity-100'
				}`}
			>
				<img src="/layout/logo_sikopling.png" alt="Logo Sikopling" class="h-[24px] w-auto max-w-[9.5rem] object-contain" />
			</a>
			<button
				type="button"
				onclick={toggleSidebar}
				class={`inline-flex items-center justify-center text-[#20232A] transition-colors duration-200 hover:bg-[var(--accent-soft)] ${
					isSidebarCollapsed ? 'h-11 w-full shrink-0 rounded-xl bg-transparent' : 'h-11 w-11 rounded-xl bg-transparent'
				}`}
				aria-label={isSidebarCollapsed ? 'Buka sidebar' : 'Tutup sidebar'}
			>
				<span class="inline-flex h-full w-full items-center justify-center rounded-[inherit] transition-colors duration-200">
					{#if isSidebarCollapsed}
						<PanelLeftOpen class="h-[1.02rem] w-[1.02rem] transition-transform duration-300" />
					{:else}
						<PanelLeftClose class="h-[1.02rem] w-[1.02rem] transition-transform duration-300" />
					{/if}
				</span>
			</button>
		</div>

		<nav class="mt-3 space-y-2">
			{#each navItems as item}
				{#if item.type === 'link'}
					{@const active = isNavActive(item.href)}
					<a
						href={item.href}
						title={isSidebarCollapsed ? item.label : undefined}
						class={`admin-sidebar-link group flex h-11 items-center overflow-hidden rounded-xl border text-sm font-semibold ${
							isSidebarCollapsed ? 'justify-start gap-0 px-[13.5px]' : 'justify-start gap-3 px-2.5'
						} ${
							active
								? isSidebarCollapsed
									? 'border-transparent bg-[var(--secondary-soft)] text-[#20232A]'
									: 'border-transparent bg-[var(--secondary-soft)] text-[#20232A]'
								: 'border-transparent text-[#20232A] hover:bg-[var(--accent-soft)]'
						}`}
					>
						<span
							class={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
								active
									? 'bg-transparent text-[#20232A]'
									: 'bg-transparent text-[#20232A]'
							}`}
						>
							<item.icon class="h-[18px] w-[18px] shrink-0" />
						</span>
						<span
							class={`admin-sidebar-label min-w-0 truncate whitespace-nowrap ${
								isSidebarCollapsed
									? 'is-collapsed max-w-0 -translate-x-1 opacity-0'
									: 'is-expanded max-w-[13.5rem] translate-x-0 opacity-100'
							}`}
						>
							{item.label}
						</span>
					</a>
				{:else}
					{@const active = isNavGroupActive(item.items)}
					{@const open = isNavGroupOpen(item.label)}
					<div class="space-y-1">
						<button
							type="button"
							title={isSidebarCollapsed ? item.label : undefined}
							class={`admin-sidebar-link group flex h-11 w-full items-center overflow-hidden rounded-xl border text-left text-sm font-semibold ${
								isSidebarCollapsed ? 'justify-start gap-0 px-[13.5px]' : 'justify-start gap-3 px-2.5'
							} ${
								active
									? isSidebarCollapsed
										? 'border-transparent bg-[var(--secondary-soft)] text-[#20232A]'
										: 'border-transparent bg-[var(--secondary-soft)] text-[#20232A]'
									: 'border-transparent text-[#20232A] hover:bg-[var(--accent-soft)]'
							}`}
							aria-expanded={open}
							onclick={() => toggleNavGroup(item.label)}
						>
							<span
								class={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
									active
										? 'bg-transparent text-[#20232A]'
										: 'bg-transparent text-[#20232A]'
								}`}
							>
								<item.icon class="h-[18px] w-[18px] shrink-0" />
							</span>
							<span
								class={`admin-sidebar-label min-w-0 flex-1 truncate whitespace-nowrap ${
									isSidebarCollapsed
										? 'is-collapsed max-w-0 -translate-x-1 opacity-0'
										: 'is-expanded max-w-[10.5rem] translate-x-0 opacity-100'
								}`}
							>
								{item.label}
							</span>
							<span
								class={`admin-sidebar-label inline-flex shrink-0 items-center justify-center text-current ${
									isSidebarCollapsed
										? 'is-collapsed max-w-0 -translate-x-1 opacity-0'
										: 'is-expanded max-w-[1.25rem] translate-x-0 opacity-100'
								}`}
							>
								<ChevronRight class={`h-4 w-4 transition-transform duration-200 ease-out ${open ? 'rotate-90' : 'rotate-0'}`} />
							</span>
						</button>

						{#if open && !isSidebarCollapsed}
							<div
								class="admin-sidebar-submenu relative space-y-1 pl-[2.85rem]"
								transition:slide={{ duration: 180, easing: cubicInOut }}
							>
								{#each item.items as subItem}
									{@const subActive = isNavActive(subItem.href)}
									<a
										href={subItem.href}
										class={`admin-sidebar-submenu-link group flex h-10 items-center rounded-lg border px-2.5 text-sm transition-colors duration-200 ${
											subActive
												? 'border-transparent bg-[var(--secondary-soft)] text-[#20232A]'
												: 'border-transparent text-[#20232A] hover:bg-[var(--accent-soft)]'
										}`}
									>
										<span class="min-w-0 truncate">{subItem.label}</span>
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			{/each}
		</nav>

		<div class="mt-auto border-t border-[var(--line)] pt-4">
			<a
				href="/logout"
				title={isSidebarCollapsed ? 'Logout' : undefined}
				class={`flex h-11 items-center rounded-xl border border-[#d64545] bg-[#d64545] text-sm font-semibold text-white transition-colors duration-200 hover:border-[#c63d3d] hover:bg-[#c63d3d] hover:text-white ${
					isSidebarCollapsed ? 'w-full justify-center px-0' : 'w-full justify-center gap-2 px-3'
				}`}
			>
				<span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
					<SquareArrowRightExit class="h-[1.02rem] w-[1.02rem] shrink-0" />
				</span>
				<span
					class={`admin-sidebar-label whitespace-nowrap ${
						isSidebarCollapsed
							? 'is-collapsed max-w-0 -translate-x-1 opacity-0'
							: 'is-expanded max-w-[6rem] translate-x-0 opacity-100'
					}`}
				>
					Logout
				</span>
			</a>
			<p
				class={`mt-3 px-1 text-center text-[10px] leading-relaxed text-[var(--muted)] transition-all duration-300 ${
					isSidebarCollapsed ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-20 opacity-100'
				}`}
			>
				Powered by Sikopling
			</p>
		</div>
	</aside>

	<div class={`admin-main-shell min-w-0 flex-1 ${isSidebarCollapsed ? 'lg:pl-[95px]' : 'lg:pl-[285px]'}`}>
		<header class={mobileHeaderClass()}>
			<div class="nav-shell py-3">
				<div class="flex items-center justify-between gap-3">
					<a
						href="/admin/dashboard"
						class="inline-flex min-w-0 items-center"
						aria-label="Sikopling Admin"
						onclick={closeMobileMenu}
					>
						<img
							src="/layout/logo_sikopling.png"
							alt="Logo Sikopling"
							class="h-auto w-[9.8rem] object-contain sm:w-[10.4rem]"
						/>
					</a>
					<button
						type="button"
						onclick={toggleMobileMenu}
						class={`mobile-menu-toggle inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition-colors duration-200 hover:bg-[var(--accent-soft)] ${
							isMobileMenuOpen ? 'is-open' : ''
						}`}
						aria-expanded={isMobileMenuOpen}
						aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
					>
						<span class="sr-only">{isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}</span>
						<span class="mobile-menu-toggle__line line--top" aria-hidden="true"></span>
						<span class="mobile-menu-toggle__line line--middle" aria-hidden="true"></span>
						<span class="mobile-menu-toggle__line line--bottom" aria-hidden="true"></span>
					</button>
				</div>
			</div>

			{#if isMobileMenuOpen}
				<div
					class={mobileMenuPanelClass()}
					transition:slide={{ duration: 320, easing: cubicInOut }}
					onintrostart={handleMobileMenuIntroStart}
					onintroend={handleMobileMenuIntroEnd}
					onoutrostart={handleMobileMenuOutroStart}
					onoutroend={handleMobileMenuOutroEnd}
				>
					<div class="nav-shell max-h-[calc(100dvh-4.4rem)] overflow-y-auto pb-4 pt-2">
						<nav class="flex flex-col gap-1.5">
							<a href="/admin/dashboard" onclick={closeMobileMenu} class={mobileNavLinkClass()}>
								<span class="truncate">Dashboard</span>
								<ArrowUpRight class="h-4 w-4 opacity-75 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
							</a>

							<div class="space-y-1">
								<button
									type="button"
									class={mobileNavGroupButtonClass()}
									aria-expanded={isMonitoringOpen}
									onclick={() => toggleNavGroup('Monitoring')}
								>
									<span class="truncate">Monitoring</span>
									<ChevronDown class={`h-4 w-4 shrink-0 transition-transform duration-300 ease-out ${isMonitoringOpen ? 'rotate-180' : 'rotate-0'}`} strokeWidth={2.2} />
								</button>

								{#if isMonitoringOpen}
									<div
										class="ml-3 w-[calc(100%-0.75rem)] space-y-1 border-l border-[#cfd7e3] py-1 pl-3"
										transition:slide={{ duration: 220, easing: cubicInOut }}
									>
										{#each monitoringItems as item}
											<a href={item.href} onclick={closeMobileMenu} class={mobileNavSubLinkClass()}>
												<span class="truncate">{item.label}</span>
												<ArrowUpRight class="h-4 w-4 opacity-75 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
											</a>
										{/each}
									</div>
								{/if}
							</div>

							<div class="space-y-1">
								<button
									type="button"
									class={mobileNavGroupButtonClass()}
									aria-expanded={isPengumumanOpen}
									onclick={() => toggleNavGroup('Pengumuman')}
								>
									<span class="truncate">Pengumuman</span>
									<ChevronDown class={`h-4 w-4 shrink-0 transition-transform duration-300 ease-out ${isPengumumanOpen ? 'rotate-180' : 'rotate-0'}`} strokeWidth={2.2} />
								</button>

								{#if isPengumumanOpen}
									<div
										class="ml-3 w-[calc(100%-0.75rem)] space-y-1 border-l border-[#cfd7e3] py-1 pl-3"
										transition:slide={{ duration: 220, easing: cubicInOut }}
									>
										{#each pengumumanItems as item}
											<a href={item.href} onclick={closeMobileMenu} class={mobileNavSubLinkClass()}>
												<span class="truncate">{item.label}</span>
												<ArrowUpRight class="h-4 w-4 opacity-75 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
											</a>
										{/each}
									</div>
								{/if}
							</div>

							<a href="/admin/profil" onclick={closeMobileMenu} class={mobileNavLinkClass()}>
								<span class="truncate">Profil</span>
								<ArrowUpRight class="h-4 w-4 opacity-75 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
							</a>
						</nav>

						<a
							href="/logout"
							onclick={closeMobileMenu}
							class="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#d64545] bg-[#d64545] px-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-[#c63d3d] hover:bg-[#c63d3d] hover:text-white"
						>
							<SquareArrowRightExit class="h-4.5 w-4.5" />
							<span>Logout</span>
						</a>
					</div>
				</div>
			{/if}
		</header>

		<main class="px-4 pb-5 pt-[5.4rem] sm:px-6 sm:pt-[5.8rem] lg:px-8 lg:py-6">
			{@render children()}
		</main>
	</div>
</div>

<style>
	.admin-sidebar-desktop {
		font-family: var(--font-body);
		transition: width 340ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.admin-main-shell {
		transition: padding-left 340ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.admin-sidebar-brand {
		transform-origin: left center;
		transition:
			max-width 240ms cubic-bezier(0.16, 1, 0.3, 1),
			opacity 180ms ease,
			transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.admin-sidebar-brand.is-expanded {
		transition-delay: 120ms;
	}

	.admin-sidebar-brand.is-collapsed {
		transition-delay: 0ms;
	}

	.admin-sidebar-link {
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 600;
		line-height: 1.25rem;
		transition:
			padding 340ms cubic-bezier(0.22, 1, 0.36, 1),
			gap 340ms cubic-bezier(0.22, 1, 0.36, 1),
			background-color 200ms ease,
			color 200ms ease,
			border-color 200ms ease;
	}

	button.admin-sidebar-link {
		font-family: var(--font-body);
	}

	.admin-sidebar-submenu-link {
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 400;
		line-height: 1.25rem;
	}

	.admin-sidebar-submenu::before {
		content: '';
		position: absolute;
		bottom: 0.35rem;
		left: 1.55rem;
		top: 0.35rem;
		width: 1px;
		border-radius: 999px;
		background: #cfd7e3;
	}

	.admin-sidebar-label {
		display: block;
		transform-origin: left center;
		transition:
			max-width 220ms cubic-bezier(0.16, 1, 0.3, 1),
			opacity 160ms ease,
			transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.admin-sidebar-label.is-expanded {
		transition-delay: 120ms;
	}

	.admin-sidebar-label.is-collapsed {
		transition-delay: 0ms;
	}

	.mobile-menu-toggle {
		position: relative;
	}

	.mobile-nav-solid {
		transition-property: color, opacity, transform;
	}

	.mobile-menu-panel::after {
		content: '';
		position: absolute;
		top: 0;
		left: clamp(1rem, 5vw, 1.4rem);
		right: clamp(1rem, 5vw, 1.4rem);
		height: 2px;
		border-radius: 999px;
		background: linear-gradient(90deg, rgba(62, 177, 74, 0), rgba(62, 177, 74, 0.28), rgba(62, 177, 74, 0));
		opacity: 0;
		transform: scaleX(0.7);
		transform-origin: center;
		pointer-events: none;
	}

	.mobile-menu-panel.is-opening::after {
		animation: admin-mobile-menu-seam-open 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
	}

	.mobile-menu-panel.is-closing::after {
		animation: admin-mobile-menu-seam-close 240ms cubic-bezier(0.4, 0, 1, 1) both;
	}

	@keyframes admin-mobile-menu-seam-open {
		0% {
			opacity: 0;
			transform: scaleX(0.7);
		}
		55% {
			opacity: 0.38;
			transform: scaleX(1.04);
		}
		100% {
			opacity: 0.16;
			transform: scaleX(1.08);
		}
	}

	@keyframes admin-mobile-menu-seam-close {
		0% {
			opacity: 0.25;
			transform: scaleX(1);
		}
		100% {
			opacity: 0;
			transform: scaleX(0.56);
		}
	}

	.mobile-menu-toggle__line {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 1.1rem;
		height: 2px;
		border-radius: 999px;
		background-color: currentColor;
		transform-origin: center;
		will-change: transform, opacity;
		transition:
			transform 260ms cubic-bezier(0.16, 1, 0.3, 1),
			opacity 220ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.mobile-menu-toggle__line.line--top {
		transform: translate(-50%, calc(-50% - 5px));
	}

	.mobile-menu-toggle__line.line--middle {
		transform: translate(-50%, -50%);
	}

	.mobile-menu-toggle__line.line--bottom {
		transform: translate(-50%, calc(-50% + 5px));
	}

	.mobile-menu-toggle.is-open .mobile-menu-toggle__line.line--top {
		transform: translate(-50%, -50%) rotate(45deg);
	}

	.mobile-menu-toggle.is-open .mobile-menu-toggle__line.line--middle {
		opacity: 0;
		transform: translate(-50%, -50%) scaleX(0.52);
	}

	.mobile-menu-toggle.is-open .mobile-menu-toggle__line.line--bottom {
		transform: translate(-50%, -50%) rotate(-45deg);
	}

	@media (prefers-reduced-motion: reduce) {
		.admin-sidebar-desktop,
		.admin-main-shell,
		.admin-sidebar-brand,
		.admin-sidebar-link,
		.admin-sidebar-label,
		.mobile-menu-panel::after,
		.mobile-menu-toggle__line {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
