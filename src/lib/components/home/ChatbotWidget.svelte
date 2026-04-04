<script lang="ts">
import { onDestroy } from 'svelte';
import { cubicOut } from 'svelte/easing';
import { fly, scale } from 'svelte/transition';
import Clock3 from 'lucide-svelte/icons/clock-3';
import ChevronRight from 'lucide-svelte/icons/chevron-right';
import X from 'lucide-svelte/icons/x';
import { siWhatsapp } from 'simple-icons';

type SupportChannel = {
	id: 'chatbot' | 'cs';
	title: string;
	description: string;
	phone: string;
	prefill: string;
};

type FaqItem = {
	id: string;
	question: string;
	answer: string;
};

const supportChannels: SupportChannel[] = [
		{
			id: 'chatbot',
			title: 'Chatbot WhatsApp',
			description: 'Pertanyaan cepat seputar layanan dan status dokumen.',
			phone: '+6282118314634',
			prefill: 'Halo Chatbot SI-KOPLING, saya ingin menanyakan informasi layanan.'
		},
		{
			id: 'cs',
			title: 'Customer Service',
			description: 'Bantuan lanjutan langsung dari tim admin SI-KOPLING.',
			phone: '+62882022795669',
			prefill: 'Halo CS SI-KOPLING, saya butuh bantuan terkait layanan.'
	}
];

const faqItems: FaqItem[] = [
	{
		id: 'status-dokumen',
		question: 'Bagaimana cara cek status dokumen?',
		answer: 'Pilih Chatbot WhatsApp lalu kirim nomor registrasi pengajuan.'
	},
	{
		id: 'eskalasi',
		question: 'Kapan harus menghubungi Customer Service?',
		answer: 'Saat perlu pendampingan lanjutan atau mengalami kendala teknis.'
	},
	{
		id: 'jenis-layanan',
		question: 'Layanan apa saja yang bisa ditanyakan?',
		answer: 'Antrian dokumen lingkungan, persetujuan teknis, dan alur pengajuan layanan.'
	},
	{
		id: 'lupa-nomor',
		question: 'Bagaimana jika lupa nomor registrasi?',
		answer: 'Hubungi Customer Service dan sertakan data identitas pengajuan yang Anda miliki.'
	}
];

let isOpen = $state(false);
let buttonAnimating = $state(false);
let activeFaqId = $state<string | null>(null);
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

function toggleFaq(id: string) {
	activeFaqId = activeFaqId === id ? null : id;
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
	class={`pointer-events-none fixed right-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-0 px-3 sm:right-6 sm:bottom-6 sm:left-auto sm:px-0 lg:right-8 lg:bottom-8 ${
		isOpen ? 'z-[60]' : 'z-30'
	}`}
>
	<div class="pointer-events-auto flex w-full flex-col items-end sm:w-auto">
		{#if isOpen}
			<section
				id="chatbot-popup"
				class="fixed inset-0 z-40 flex h-[100dvh] w-screen flex-col overflow-y-auto overscroll-contain bg-white sm:static sm:mb-3 sm:h-[29rem] sm:w-[min(92vw,24rem)] sm:max-w-[24rem] sm:rounded-2xl sm:border sm:border-[#e4e7ec] sm:shadow-[0_24px_34px_-24px_rgba(15,23,42,0.35)]"
				in:fly={{ y: 14, duration: 190 }}
				out:fly={{ y: 10, duration: 140 }}
			>
				<div class="border-b border-[#eef1f5] bg-white px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-3.5 sm:pt-4">
					<div class="flex items-start justify-between gap-2.5">
						<div>
							<p class="text-[1.35rem] font-semibold text-[#0f172a]">Pusat Bantuan</p>
							<p class="mt-1 text-[0.82rem] leading-relaxed text-[#475467]">
								Silakan sampaikan pertanyaan Anda, kami siap membantu informasi layanan dan antrean perizinan lingkungan.
							</p>
							<div class="mt-2.5 flex flex-wrap items-center gap-1.5 text-[0.72rem] text-[#667085]">
								<Clock3 class="h-3.5 w-3.5 text-[#98A2B3]" strokeWidth={2.2} aria-hidden="true" />
								<span class="font-medium text-[#475467]">Jam operasional</span>
								<span class="text-[#98A2B3]">•</span>
								<span>Senin-Jumat, 09.00-15.00 WITA</span>
							</div>
						</div>
						<div class="pt-0.5">
							<button
								type="button"
								class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#e4e7ec] bg-white text-[#475467] transition-colors hover:bg-[#f8fafc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64AD31] focus-visible:ring-offset-2 sm:hidden"
								aria-label="Tutup popup bantuan"
								onclick={closePopup}
							>
								<X class="h-4.5 w-4.5" strokeWidth={2.3} aria-hidden="true" />
							</button>
						</div>
					</div>
				</div>

				<div class="space-y-4 bg-white px-3 py-3.5 sm:py-3.5">
					<section class="space-y-2.5">
						<p class="px-1 text-[0.78rem] font-semibold text-[#344054]">Pilih Kanal Bantuan</p>
						<div class="space-y-2">
							{#each supportChannels as channel (channel.id)}
								<button
									type="button"
									class="w-full rounded-xl border border-[#e4e7ec] bg-white px-3 py-3 text-left transition-colors hover:bg-[#f9fafb]"
									onclick={() => openWhatsApp(channel)}
								>
									<span class="flex items-start gap-2.5">
										<span class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#cfe3bc] bg-[#f2f9ec] text-[#25D366]">
											<svg viewBox="0 0 24 24" class="h-4.5 w-4.5" aria-hidden="true">
												<path d={siWhatsapp.path} fill="currentColor"></path>
											</svg>
										</span>
										<span class="min-w-0 flex-1">
											<span class="block text-sm font-semibold text-[#101828]">{channel.title}</span>
											<span class="mt-0.5 block text-[0.72rem] leading-relaxed text-[#667085]">
												{channel.description}
											</span>
											<span class="mt-2 inline-flex items-center gap-1 text-[0.72rem] font-medium text-[#344054]">
												Mulai Percakapan
												<ChevronRight class="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
											</span>
										</span>
									</span>
								</button>
							{/each}
						</div>
					</section>

					<section class="space-y-2.5">
						<div class="px-1">
							<p class="text-[0.78rem] font-semibold text-[#344054]">FAQ Singkat</p>
						</div>
						<div class="overflow-hidden rounded-xl border border-[#e4e7ec] bg-white">
							{#each faqItems as faq (faq.id)}
								<div>
									<button
										type="button"
										class="flex w-full items-center justify-between gap-2.5 px-3 py-2.5 text-left"
										onclick={() => toggleFaq(faq.id)}
										aria-expanded={activeFaqId === faq.id}
									>
										<span class="text-xs leading-relaxed font-medium text-[#101828]">{faq.question}</span>
										<span
											class={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#e4e7ec] bg-[#f9fafb] text-[#667085] transition-transform duration-200 ${
												activeFaqId === faq.id ? 'rotate-90' : ''
											}`}
										>
											<ChevronRight class="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden="true" />
										</span>
									</button>
									{#if activeFaqId === faq.id}
										<p class="px-3 py-2 text-[0.72rem] leading-relaxed text-[#475467]">
											{faq.answer}
										</p>
									{/if}
								</div>
							{/each}
							<a
								href="/kontak"
								class="block border-t border-[#eef1f5] px-3 py-2.5 text-[0.78rem] font-semibold text-[#344054] transition-colors hover:bg-[#f9fafb] hover:text-[#1f8f3a]"
							>
								<span>Lihat selengkapnya</span>
							</a>
						</div>
					</section>
				</div>

				<div class="border-t border-[#eef1f5] bg-white px-4 pt-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:py-2.5">
					<p class="text-center text-[11px] text-[#98A2B3]">Powered By Sikopling</p>
				</div>
			</section>
		{/if}

		<button
			type="button"
			class={`chatbot-trigger mt-0.5 inline-flex h-14 w-14 items-center justify-center transition-[transform,background-color,box-shadow] duration-300 hover:scale-[1.03] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64AD31] focus-visible:ring-offset-2 sm:h-16 sm:w-16 ${
				isOpen
					? 'rounded-full border border-[#d88b1f] bg-[#EB9E27] text-white shadow-[0_14px_28px_-14px_rgba(235,158,39,0.82),0_6px_12px_-8px_rgba(15,23,42,0.3)] hover:bg-[#CF8921]'
					: 'bg-transparent text-[#20232A] shadow-none'
			} ${isOpen ? 'hidden sm:inline-flex' : 'inline-flex'} ${buttonAnimating ? 'chatbot-trigger--bounce' : ''}`}
			aria-label={isOpen ? 'Tutup pilihan bantuan' : 'Buka pilihan bantuan'}
			aria-expanded={isOpen}
			aria-controls="chatbot-popup"
			onclick={togglePopup}
		>
			<span
				class={`relative block ${
					isOpen ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-12 w-12 sm:h-16 sm:w-16'
				}`}
				aria-hidden="true"
			>
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
							<img
								src="/layout/chatbot.svg"
								alt=""
								class="h-full w-full origin-center scale-[1.35] object-contain sm:scale-[1.3]"
								aria-hidden="true"
							/>
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
