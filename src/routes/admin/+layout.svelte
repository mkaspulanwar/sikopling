<script lang="ts">
	import { page } from '$app/state'
	import { cubicInOut } from 'svelte/easing'
	import { slide } from 'svelte/transition'
	import type { Snippet } from 'svelte'
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right'
	import FileSpreadsheet from 'lucide-svelte/icons/file-spreadsheet'
	import FileText from 'lucide-svelte/icons/file-text'
	import LayoutDashboard from 'lucide-svelte/icons/layout-dashboard'
	import PanelLeftClose from 'lucide-svelte/icons/panel-left-close'
	import PanelLeftOpen from 'lucide-svelte/icons/panel-left-open'
	import SquareArrowRightExit from 'lucide-svelte/icons/square-arrow-right-exit'
	import type { LayoutData } from './$types'

	let { children }: { children: Snippet; data: LayoutData } = $props()

	const navItems = [
		{ label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
		{ label: 'Dokling', href: '/admin/dokling', icon: FileSpreadsheet },
		{ label: 'Pertek', href: '/admin/pertek', icon: FileText }
	]

	let isSidebarCollapsed = $state(false)
	let isMobileMenuOpen = $state(false)
	let mobileMenuMotionState = $state<'idle' | 'opening' | 'closing'>('idle')

	const pathname = $derived.by(() => page.url.pathname.replace(/\/+$/, '') || '/admin/dashboard')

	const isNavActive = (href: string) =>
		pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(`${href}/`))

	const toggleMobileMenu = () => {
		isMobileMenuOpen = !isMobileMenuOpen
	}

	const closeMobileMenu = () => {
		isMobileMenuOpen = false
	}

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
		'group flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold text-[var(--muted)] transition-colors duration-200 hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]'

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
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div class="relative flex min-h-[100dvh] bg-white text-[var(--ink)]">
	<aside
		class={`hidden overflow-hidden border-r border-[var(--line)] bg-[var(--surface)] px-3 pb-4 pt-5 shadow-[0_18px_42px_-30px_rgba(15,23,42,0.38)] [transition:width_280ms_cubic-bezier(0.22,1,0.36,1)] lg:fixed lg:left-0 lg:top-0 lg:z-30 lg:flex lg:h-[100dvh] lg:flex-col ${
			isSidebarCollapsed ? 'lg:w-[5.75rem]' : 'lg:w-[17.5rem]'
		}`}
	>
		<div
			class={`mb-3 flex h-14 items-center border-b border-[var(--line)] pb-3 ${
				isSidebarCollapsed ? 'justify-center pr-0' : 'justify-between pr-0.5'
			}`}
		>
			<a
				href="/admin/dashboard"
				aria-label="Sikopling Admin"
				class={`inline-flex items-center overflow-hidden transition-all duration-300 ${
					isSidebarCollapsed
						? 'pointer-events-none max-w-0 px-0 py-0 opacity-0'
						: 'max-w-[11rem] px-0 py-0 opacity-100'
				}`}
			>
				<img src="/layout/logo_sikopling.png" alt="Logo Sikopling" class="h-[26px] w-auto max-w-[9.5rem] object-contain" />
			</a>
			<button
				type="button"
				onclick={() => (isSidebarCollapsed = !isSidebarCollapsed)}
				class={`inline-flex items-center justify-center text-[var(--muted)] transition-colors duration-200 hover:bg-[var(--accent-soft)] hover:text-[var(--ink)] ${
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
				{@const active = isNavActive(item.href)}
				<a
					href={item.href}
					title={isSidebarCollapsed ? item.label : undefined}
					class={`group flex h-11 items-center overflow-hidden rounded-xl border text-sm font-semibold transition-colors duration-200 ${
						isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-2.5'
					} ${
						active
							? isSidebarCollapsed
								? 'border-transparent bg-[var(--secondary-soft)] text-[#2f6f1b]'
								: 'border-[#d7ebc8] bg-[var(--secondary-soft)] text-[#2f6f1b]'
							: 'border-transparent text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]'
					}`}
				>
					<span
						class={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
							active
								? isSidebarCollapsed
									? 'bg-transparent text-[var(--secondary)]'
									: 'bg-[var(--secondary)]/15 text-[var(--secondary)]'
								: 'bg-transparent text-[var(--muted)] group-hover:text-[var(--ink)]'
						}`}
					>
						<item.icon class="h-[1.02rem] w-[1.02rem] shrink-0" />
					</span>
					<span
						class={`truncate whitespace-nowrap transition-all duration-300 ${
							isSidebarCollapsed ? 'max-w-0 -translate-x-1 opacity-0' : 'max-w-[9rem] translate-x-0 opacity-100'
						}`}
					>
						{item.label}
					</span>
				</a>
			{/each}
		</nav>

		<div class="mt-auto border-t border-[var(--line)] pt-4">
			<a
				href="/logout"
				title={isSidebarCollapsed ? 'Logout' : undefined}
				class={`flex h-11 items-center rounded-xl border border-[#fecaca] bg-[#fff1f1] text-sm font-semibold text-[#b42318] transition-colors duration-200 hover:bg-[#ffe9e9] hover:text-[#991b1b] ${
					isSidebarCollapsed ? 'w-full justify-center px-0' : 'w-full justify-center gap-2 px-3'
				}`}
			>
				<span class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
					<SquareArrowRightExit class="h-[1.02rem] w-[1.02rem] shrink-0" />
				</span>
				<span
					class={`whitespace-nowrap transition-all duration-300 ${
						isSidebarCollapsed ? 'max-w-0 -translate-x-1 opacity-0' : 'max-w-[6rem] translate-x-0 opacity-100'
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

	<div class={`min-w-0 flex-1 ${isSidebarCollapsed ? 'lg:pl-[5.75rem]' : 'lg:pl-[17.5rem]'}`}>
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
							{#each navItems as item}
								<a href={item.href} onclick={closeMobileMenu} class={mobileNavLinkClass()}>
									<span class="truncate">{item.label}</span>
									<ArrowUpRight class="h-4 w-4 opacity-75 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
								</a>
							{/each}
						</nav>

						<a
							href="/logout"
							onclick={closeMobileMenu}
							class="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#fecaca] bg-[#fff1f1] px-3 text-sm font-semibold text-[#b42318] transition-colors duration-200 hover:bg-[#ffe9e9] hover:text-[#991b1b]"
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
		.mobile-menu-panel::after,
		.mobile-menu-toggle__line {
			animation: none !important;
			transition: none !important;
		}
	}
</style>
