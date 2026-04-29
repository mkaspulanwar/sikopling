<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, tick } from 'svelte';
	import { navigating, page } from '$app/state';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import {
		UNIVERSAL_SEARCH_BLOCKED_PATH_PREFIXES,
		UNIVERSAL_SEARCH_HIGHLIGHT_ATTR,
		UNIVERSAL_SEARCH_MIN_QUERY_LENGTH,
		UNIVERSAL_SEARCH_QUERY_PARAM
	} from '$lib/constants/universal-search';
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';
	import TopProgressBar from '$lib/components/TopProgressBar.svelte';
	import Navbar from '$lib/components/home/Navbar.svelte';
	import SiteFooter from '$lib/components/home/SiteFooter.svelte';
	import ChatbotWidget from '$lib/components/home/ChatbotWidget.svelte';

	let { children } = $props();

	injectAnalytics();

	onMount(() => {
		if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		}
		window.scrollTo(0, 0);
	});

	const highlightedSearchSelector = `mark[${UNIVERSAL_SEARCH_HIGHLIGHT_ATTR}]`;
	let highlightRequestId = 0;
	let removeHighlightDismissListener: (() => void) | null = null;

	const cleanSearchKeyword = (value: string) => value.replace(/\s+/g, ' ').trim();
	const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	const normalizePathname = (value: string) => value.replace(/\/+$/, '') || '/';
	const isUniversalSearchBlockedPath = (pathname: string) => {
		const normalizedPath = normalizePathname(pathname);
		return UNIVERSAL_SEARCH_BLOCKED_PATH_PREFIXES.some(
			(prefix) => normalizedPath === prefix || normalizedPath.startsWith(`${prefix}/`)
		);
	};
	const clearUniversalSearchHighlights = () => {
		if (typeof document === 'undefined') return;
		const highlights = document.querySelectorAll<HTMLElement>(highlightedSearchSelector);
		for (const highlight of highlights) {
			const parent = highlight.parentNode;
			if (!parent) continue;
			parent.replaceChild(document.createTextNode(highlight.textContent ?? ''), highlight);
			parent.normalize();
		}
	};
	const clearHighlightDismissHandler = () => {
		removeHighlightDismissListener?.();
		removeHighlightDismissListener = null;
	};
	const clearUniversalSearchKeywordParam = () => {
		if (typeof window === 'undefined') return;
		const nextUrl = new URL(window.location.href);
		if (!nextUrl.searchParams.has(UNIVERSAL_SEARCH_QUERY_PARAM)) return;
		nextUrl.searchParams.delete(UNIVERSAL_SEARCH_QUERY_PARAM);
		const query = nextUrl.searchParams.toString();
		const nextHref = `${nextUrl.pathname}${query ? `?${query}` : ''}${nextUrl.hash}`;
		history.replaceState(history.state, '', nextHref);
	};
	const enableDismissHighlightOnNextPointer = () => {
		if (typeof window === 'undefined') return;
		clearHighlightDismissHandler();
		const handlePointerDown = () => {
			clearUniversalSearchHighlights();
			clearUniversalSearchKeywordParam();
			clearHighlightDismissHandler();
		};
		window.addEventListener('pointerdown', handlePointerDown, { once: true, capture: true });
		removeHighlightDismissListener = () => {
			window.removeEventListener('pointerdown', handlePointerDown, true);
		};
	};
	const shouldSkipHighlightNode = (node: Node) => {
		const parentElement = node.parentElement;
		if (!parentElement) return true;
		if (
			parentElement.closest(
				'script, style, noscript, textarea, input, select, option, button, pre, code, mark, [contenteditable="true"]'
			)
		) {
			return true;
		}
		return false;
	};
	const highlightKeywordInMain = (
		mainContent: HTMLElement,
		keyword: string,
		preferredScope: HTMLElement | null
	) => {
		const pattern = new RegExp(escapeRegExp(keyword), 'giu');
		const walker = document.createTreeWalker(mainContent, NodeFilter.SHOW_TEXT, {
			acceptNode: (node) => {
				if (shouldSkipHighlightNode(node)) return NodeFilter.FILTER_REJECT;
				const nodeValue = node.nodeValue ?? '';
				if (!nodeValue.trim()) return NodeFilter.FILTER_REJECT;
				pattern.lastIndex = 0;
				return pattern.test(nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
			}
		});
		const textNodes: Text[] = [];
		let currentNode = walker.nextNode();
		while (currentNode) {
			if (currentNode instanceof Text) {
				textNodes.push(currentNode);
			}
			currentNode = walker.nextNode();
		}
		let firstHighlight: HTMLElement | null = null;
		let firstPreferredHighlight: HTMLElement | null = null;

		for (const textNode of textNodes) {
			const sourceText = textNode.nodeValue ?? '';
			pattern.lastIndex = 0;
			const isInsidePreferredScope = Boolean(
				preferredScope && textNode.parentElement && preferredScope.contains(textNode.parentElement)
			);
			let hasMatch = false;
			let lastIndex = 0;
			const fragment = document.createDocumentFragment();
			let match = pattern.exec(sourceText);
			while (match) {
				const startIndex = match.index ?? 0;
				const matchText = match[0] ?? '';
				if (matchText.length === 0) break;
				hasMatch = true;
				if (startIndex > lastIndex) {
					fragment.append(document.createTextNode(sourceText.slice(lastIndex, startIndex)));
				}
				const mark = document.createElement('mark');
				mark.className = 'universal-search-highlight';
				mark.setAttribute(UNIVERSAL_SEARCH_HIGHLIGHT_ATTR, 'true');
				mark.textContent = sourceText.slice(startIndex, startIndex + matchText.length);
				fragment.append(mark);
				if (!firstHighlight) firstHighlight = mark;
				if (isInsidePreferredScope && !firstPreferredHighlight) {
					firstPreferredHighlight = mark;
				}
				lastIndex = startIndex + matchText.length;
				match = pattern.exec(sourceText);
			}
			if (!hasMatch) continue;
			if (lastIndex < sourceText.length) {
				fragment.append(document.createTextNode(sourceText.slice(lastIndex)));
			}
			textNode.parentNode?.replaceChild(fragment, textNode);
		}

		return firstPreferredHighlight ?? firstHighlight;
	};
	const syncUniversalSearchHighlight = async (requestId: number) => {
		if (typeof window === 'undefined') return;
		clearHighlightDismissHandler();
		clearUniversalSearchHighlights();
		const pathname = normalizePathname(page.url.pathname);
		if (isUniversalSearchBlockedPath(pathname)) return;
		const keyword = cleanSearchKeyword(page.url.searchParams.get(UNIVERSAL_SEARCH_QUERY_PARAM) ?? '');
		if (keyword.length < UNIVERSAL_SEARCH_MIN_QUERY_LENGTH) return;

		await tick();
		await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
		if (requestId !== highlightRequestId) return;

		const mainContent = document.querySelector('main');
		if (!(mainContent instanceof HTMLElement)) return;
		const targetSectionId = page.url.hash.replace(/^#/, '');
		const preferredScopeCandidate = targetSectionId
			? document.getElementById(targetSectionId)
			: null;
		const preferredScope =
			preferredScopeCandidate && mainContent.contains(preferredScopeCandidate)
				? preferredScopeCandidate
				: null;
		const highlightedNode = highlightKeywordInMain(mainContent, keyword, preferredScope);
		if (!highlightedNode) return;
		highlightedNode.scrollIntoView({
			behavior: 'smooth',
			block: 'center'
		});
		enableDismissHighlightOnNextPointer();
	};

	const pageTitle = $derived.by(() => {
		const pathname = page.url.pathname.replace(/\/+$/, '') || '/';

		switch (pathname) {
			case '/':
				return 'Sikopling Kalsel';
			case '/layanan/dokling':
				return 'Antrian Dokumen Lingkungan';
			case '/layanan/pertek':
				return 'Antrian Persetujuan Teknis';
			case '/profil':
				return 'Profil Sikopling';
			case '/tentang':
				return 'Profil Sikopling';
			case '/kebijakan-privasi':
				return 'Kebijakan Privasi Sikopling';
			case '/ketentuan-layanan':
				return 'Ketentuan Layanan Sikopling';
			case '/kontak':
				return 'Kontak Sikopling';
			case '/login':
				return 'Login Sikopling';
			case '/admin/pengajuan':
				return 'Admin Pengajuan Sikopling';
			case '/admin':
			case '/admin/dashboard':
				return 'Dashboard Admin Sikopling';
			case '/admin/dokling':
				return 'Admin Dokling Sikopling';
			case '/admin/pertek':
				return 'Admin Pertek Sikopling';
			case '/admin/profil':
				return 'Profil Admin Sikopling';
			case '/admin/pengaturan':
				return 'Pengaturan Admin Sikopling';
			default:
				return 'Sikopling Kalsel';
		}
	});

	const usePublicChrome = $derived.by(() => {
		const pathname = page.url.pathname.replace(/\/+$/, '') || '/';
		return pathname !== '/login' && !pathname.startsWith('/admin');
	});

	const isPublicNavigationPending = $derived.by(() => {
		if (!browser || !navigating.to) return false;
		const destinationPath = normalizePathname(navigating.to.url.pathname);
		return destinationPath !== '/login' && !destinationPath.startsWith('/admin');
	});

	$effect(() => {
		page.url.pathname;
		page.url.search;
		page.url.hash;
		const requestId = ++highlightRequestId;
		void syncUniversalSearchHighlight(requestId);
		return () => {
			highlightRequestId += 1;
			clearHighlightDismissHandler();
			clearUniversalSearchHighlights();
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/png" />
	<title>{pageTitle}</title>
	<meta
		name="description"
		content="Portal informasi antrean pengajuan perizinan lingkungan Provinsi Kalimantan Selatan oleh Dinas Lingkungan Hidup."
	/>
</svelte:head>

<div class="min-h-[100dvh] bg-[var(--canvas)] text-[var(--ink)]">
	<TopProgressBar active={isPublicNavigationPending} />
	{#if usePublicChrome}
		<Navbar />
	{/if}
	<main class={usePublicChrome ? 'min-h-[40dvh]' : 'min-h-[100dvh]'}>
		{@render children()}
	</main>
	{#if usePublicChrome}
		<SiteFooter />
		<ChatbotWidget />
	{/if}
</div>
