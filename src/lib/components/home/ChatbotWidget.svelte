<script lang="ts">
	import { onDestroy } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly, scale } from 'svelte/transition';
	import Bot from 'lucide-svelte/icons/bot';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Headset from 'lucide-svelte/icons/headset';
	import MessageCircle from 'lucide-svelte/icons/message-circle';
	import Phone from 'lucide-svelte/icons/phone';
	import X from 'lucide-svelte/icons/x';

	type SupportChannel = {
		id: 'chatbot' | 'cs';
		title: string;
		description: string;
		phone: string;
		prefill: string;
	};

	const supportChannels: SupportChannel[] = [
		{
			id: 'chatbot',
			title: 'Chatbot WhatsApp',
			description: 'Untuk pertanyaan cepat seperti status dokumen, alur layanan, dan persyaratan umum.',
			phone: '+6282118314634',
			prefill: 'Halo Chatbot SI-KOPLING, saya ingin menanyakan informasi layanan.'
		},
		{
			id: 'cs',
			title: 'Customer Service',
			description: 'Untuk bantuan lanjutan, kendala pengajuan, atau konsultasi langsung dengan petugas.',
			phone: '+62882022795669',
			prefill: 'Halo CS SI-KOPLING, saya butuh bantuan terkait layanan.'
		}
	];

	let isOpen = $state(false);
	let buttonAnimating = $state(false);
	let buttonAnimationTimeout: ReturnType<typeof setTimeout> | null = null;

	function triggerButtonAnimation() {
		buttonAnimating = true;
		if (buttonAnimationTimeout) {
			clearTimeout(buttonAnimationTimeout);
		}
		buttonAnimationTimeout = setTimeout(() => {
			buttonAnimating = false;
		}, 260);
	}

	function togglePopup() {
		isOpen = !isOpen;
		triggerButtonAnimation();
	}

	function closePopup() {
		if (!isOpen) {
			return;
		}
		isOpen = false;
		triggerButtonAnimation();
	}

	function openWhatsApp(channel: SupportChannel) {
		const phone = channel.phone.replace(/\D/g, '');
		const text = encodeURIComponent(channel.prefill);
		window.open(`https://wa.me/${phone}?text=${text}`, '_blank', 'noopener,noreferrer');
		closePopup();
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			closePopup();
		}
	}

	onDestroy(() => {
		if (buttonAnimationTimeout) {
			clearTimeout(buttonAnimationTimeout);
		}
	});
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div
	class="pointer-events-none fixed right-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-0 z-30 px-3 sm:right-6 sm:bottom-6 sm:left-auto sm:px-0 lg:right-8 lg:bottom-8"
>
	<div class="pointer-events-auto flex w-full flex-col items-end sm:w-auto">
		{#if isOpen}
			<section
				id="chatbot-popup"
				class="mb-3 w-full max-w-[24rem] overflow-hidden rounded-xl border border-[#d7ded0] bg-[var(--surface)] shadow-[0_20px_36px_-24px_rgba(15,23,42,0.46)] sm:w-[min(92vw,24rem)]"
				in:fly={{ y: 14, duration: 190 }}
				out:fly={{ y: 10, duration: 140 }}
			>
				<div class="border-b border-[#e2e8db] bg-[#fbfcfa] px-4 py-3.5">
					<div>
						<p class="text-[0.95rem] font-semibold text-[var(--ink)]">Bantuan SI-KOPLING</p>
						<p class="mt-1 text-xs leading-relaxed text-[var(--muted)]">
							Pilih kanal bantuan, lalu lanjut chat via WhatsApp.
						</p>
					</div>
				</div>

				<div class="space-y-2.5 bg-[#fbfcfa] px-3 py-3">
					{#each supportChannels as channel (channel.id)}
						<button
							type="button"
							class="w-full rounded-lg border border-[#dbe2d4] bg-[var(--surface)] px-3.5 py-3.5 text-left transition-colors hover:bg-[#f8fbf6]"
							onclick={() => openWhatsApp(channel)}
						>
							<span class="flex items-start gap-3">
								<span
									class={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
										channel.id === 'cs'
											? 'bg-[#25D366] text-white'
											: 'border border-[#d7e1cd] bg-[#eef4e7] text-[#4f6a2c]'
									}`}
								>
									{#if channel.id === 'chatbot'}
										<Bot class="h-4.5 w-4.5" strokeWidth={1.8} aria-hidden="true" />
									{:else}
										<Headset class="h-4.5 w-4.5" strokeWidth={1.8} aria-hidden="true" />
									{/if}
								</span>
								<span class="min-w-0 flex-1">
									<span class="block text-sm font-semibold text-[var(--ink)]">{channel.title}</span>
									<span class="mt-1 block text-xs leading-relaxed text-[var(--muted)]">{channel.description}</span>
									<span class="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#1E7A42]">
										<Phone class="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden="true" />
										{channel.phone}
									</span>
								</span>
								<span class="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#d5decb] bg-[var(--surface)] text-[#5f7640]">
									<ChevronRight class="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
								</span>
							</span>
						</button>
					{/each}
				</div>

				<div class="border-t border-[#e2e8db] bg-[#fbfcfa] px-4 py-2.5">
					<p class="text-[11px] text-[var(--muted)]">
						Jam layanan: Senin-Jumat, 09.00-15.00 WITA
					</p>
				</div>
			</section>
		{/if}

		<button
			type="button"
			class={`chatbot-trigger mt-0.5 inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_16px_30px_-16px_rgba(100,173,49,0.82)] transition-[transform,background-color,box-shadow] duration-300 hover:scale-[1.03] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64AD31] focus-visible:ring-offset-2 sm:h-16 sm:w-16 ${
				isOpen
					? 'bg-[#EB9E27] shadow-[0_16px_30px_-16px_rgba(235,158,39,0.9)] hover:bg-[#CF8921]'
					: 'bg-[#64AD31] hover:bg-[#548F29]'
			} ${buttonAnimating ? 'chatbot-trigger--bounce' : ''}`}
			aria-label={isOpen ? 'Tutup pilihan bantuan' : 'Buka pilihan bantuan'}
			aria-expanded={isOpen}
			aria-controls="chatbot-popup"
			onclick={togglePopup}
		>
			<span class="relative block h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true">
				{#key isOpen}
					{#if isOpen}
						<span
							class="block h-full w-full"
							in:scale={{ start: 0.55, duration: 160, easing: cubicOut }}
							out:scale={{ start: 1, duration: 120, easing: cubicOut }}
						>
							<X class="h-full w-full" strokeWidth={2.45} aria-hidden="true" />
						</span>
					{:else}
						<span
							class="block h-full w-full"
							in:scale={{ start: 0.55, duration: 160, easing: cubicOut }}
							out:scale={{ start: 1, duration: 120, easing: cubicOut }}
						>
							<MessageCircle class="h-full w-full" strokeWidth={2.15} aria-hidden="true" />
						</span>
					{/if}
				{/key}
			</span>
		</button>
	</div>
</div>

<style>
	.chatbot-trigger--bounce {
		animation: chatbot-trigger-bounce 0.26s cubic-bezier(0.32, 1.55, 0.58, 1);
	}

	@keyframes chatbot-trigger-bounce {
		0% {
			transform: scale(1);
		}
		40% {
			transform: scale(0.86);
		}
		78% {
			transform: scale(1.09);
		}
		100% {
			transform: scale(1);
		}
	}
</style>
