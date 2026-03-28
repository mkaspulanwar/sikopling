<script lang="ts">
	import { fly } from 'svelte/transition';

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

	function togglePopup() {
		isOpen = !isOpen;
	}

	function closePopup() {
		isOpen = false;
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
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div class="pointer-events-none fixed right-4 bottom-4 z-30 sm:right-6 sm:bottom-6 lg:right-8 lg:bottom-8">
	<div class="pointer-events-auto flex flex-col items-end">
		{#if isOpen}
			<section
				class="w-[min(92vw,24rem)] overflow-hidden rounded-xl border border-[#d7ded0] bg-[var(--surface)] shadow-[0_20px_36px_-24px_rgba(15,23,42,0.46)]"
				in:fly={{ y: 12, duration: 180 }}
			>
				<div class="border-b border-[#e2e8db] bg-[#fbfcfa] px-4 py-3.5">
					<div class="flex items-start justify-between gap-3">
						<div>
							<p class="text-[0.95rem] font-semibold text-[var(--ink)]">Bantuan SI-KOPLING</p>
							<p class="mt-1 text-xs leading-relaxed text-[var(--muted)]">
								Pilih kanal bantuan, lalu lanjut chat via WhatsApp.
							</p>
						</div>
						<button
							type="button"
							class="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#d9e0d2] bg-[var(--surface)] text-[var(--muted)]"
							aria-label="Tutup pilihan bantuan"
							onclick={closePopup}
						>
							<svg viewBox="0 0 20 20" class="h-4 w-4" aria-hidden="true">
								<path d="M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5" stroke="currentColor" stroke-width="1.8" />
							</svg>
						</button>
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
										<svg viewBox="0 0 20 20" class="h-4.5 w-4.5" aria-hidden="true">
											<path
												d="M4.2 10a5.8 5.8 0 0 1 10.1-3.8A5.8 5.8 0 0 1 10 15.8H6.7l-2 .9.6-1.9A5.8 5.8 0 0 1 4.2 10Z"
												fill="none"
												stroke="currentColor"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M7.3 9.4h5.1M7.3 11.4h3.6"
												fill="none"
												stroke="currentColor"
												stroke-width="1.5"
												stroke-linecap="round"
											/>
										</svg>
									{:else}
										<svg viewBox="0 0 24 24" class="h-4.5 w-4.5" aria-hidden="true">
											<path
												d="M12 3.5a8.2 8.2 0 0 0-7.1 12.3l-.9 3.1 3.2-.8A8.2 8.2 0 1 0 12 3.5Z"
												fill="none"
												stroke="white"
												stroke-width="1.8"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
											<path
												d="M9.2 8.9c.2-.2.3-.2.4-.2h.4c.1 0 .3 0 .4.3l.6 1.3c.1.2 0 .3 0 .4l-.3.4c-.1.1-.1.2 0 .3.1.2.5.8 1.2 1.3.8.6 1.4.8 1.6.9.2.1.2.1.3-.1l.5-.6c.1-.1.2-.2.3-.1l1.4.6c.1.1.2.2.2.3 0 .2-.2.8-.6 1.1-.3.3-.8.5-1.5.4-.8-.1-1.7-.5-2.8-1.2-1.6-1.1-2.5-2.6-2.9-3.3-.3-.7-.3-1.3.2-1.8l.4-.4Z"
												fill="none"
												stroke="white"
												stroke-width="1.4"
												stroke-linejoin="round"
												stroke-linecap="round"
											/>
										</svg>
									{/if}
								</span>
								<span class="min-w-0 flex-1">
									<span class="block text-sm font-semibold text-[var(--ink)]">{channel.title}</span>
									<span class="mt-1 block text-xs leading-relaxed text-[var(--muted)]">{channel.description}</span>
									<span class="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#1E7A42]">
										<svg viewBox="0 0 20 20" class="h-3.5 w-3.5" aria-hidden="true">
											<path
												d="M6 4.5h2L9 7l-1.4 1.3A10.3 10.3 0 0011.7 12L13 10.6l2.5 1v2a1 1 0 01-1 1A10 10 0 015 5.5a1 1 0 011-1z"
												fill="none"
												stroke="currentColor"
												stroke-width="1.5"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
										{channel.phone}
									</span>
								</span>
								<span class="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#d5decb] bg-[var(--surface)] text-[#5f7640]">
									<svg viewBox="0 0 20 20" class="h-3.5 w-3.5" aria-hidden="true">
										<path
											d="M7 5.5L12 10L7 14.5"
											fill="none"
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="1.8"
										/>
									</svg>
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
		{:else}
			<button
				type="button"
				class="inline-flex items-center justify-center border-0 bg-transparent p-0 focus-visible:outline-none"
				aria-label="Buka pilihan bantuan"
				onclick={togglePopup}
			>
				<img
					src="/layout/chatbot.svg"
					alt=""
					class="h-[6.8rem] w-[6.8rem] object-contain sm:h-[7.8rem] sm:w-[7.8rem] lg:h-[8.6rem] lg:w-[8.6rem]"
					aria-hidden="true"
				/>
			</button>
		{/if}
	</div>
</div>
