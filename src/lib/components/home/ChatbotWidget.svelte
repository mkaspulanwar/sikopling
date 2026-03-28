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

<div class="pointer-events-none fixed right-4 bottom-4 z-30 flex items-end sm:right-6 sm:bottom-6 lg:right-8 lg:bottom-8">
	<div class="pointer-events-auto flex flex-col items-end gap-3">
		{#if isOpen}
			<section
				class="w-[min(92vw,24rem)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-[0_28px_60px_-32px_rgba(15,23,42,0.4)]"
				transition:fly={{ y: 12, duration: 180 }}
			>
				<div class="flex items-start justify-between border-b border-[var(--line)] px-4 py-3">
					<div>
						<p class="text-sm font-semibold text-[var(--ink)]">Butuh Bantuan?</p>
						<p class="text-xs text-[var(--muted)]">Pilih kanal konsultasi SI-KOPLING</p>
					</div>
					<button
						type="button"
						class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]"
						aria-label="Tutup pilihan bantuan"
						onclick={closePopup}
					>
						<svg viewBox="0 0 20 20" class="h-4 w-4" aria-hidden="true">
							<path d="M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5" stroke="currentColor" stroke-width="1.8" />
						</svg>
					</button>
				</div>

				<div class="space-y-2.5 px-3 py-3">
					{#each supportChannels as channel (channel.id)}
						<button
							type="button"
							class="group w-full rounded-xl border border-[var(--line)] bg-[var(--accent-soft)] px-3 py-3 text-left transition-all duration-200 hover:border-[#9FB17A] hover:bg-[var(--surface)] hover:shadow-[0_10px_20px_-16px_rgba(15,23,42,0.45)]"
							onclick={() => openWhatsApp(channel)}
						>
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0">
									<p class="text-sm font-semibold text-[var(--ink)]">{channel.title}</p>
									<p class="mt-1 text-xs leading-relaxed text-[var(--muted)]">{channel.description}</p>
									<p class="mt-2 text-xs font-medium text-[#1E7A42]">{channel.phone}</p>
								</div>
								<span
									class="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--muted)] transition-colors group-hover:border-[#9FB17A] group-hover:text-[var(--ink)]"
								>
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
							</div>
						</button>
					{/each}
				</div>

				<div class="border-t border-[var(--line)] bg-[var(--accent-soft)] px-4 py-2.5">
					<p class="text-[11px] text-[var(--muted)]">Jam operasional: Senin-Jumat, 09.00-15.00 WITA</p>
				</div>
			</section>
		{/if}

		<button
			type="button"
			class="inline-flex items-center justify-center border-0 bg-transparent p-0 focus-visible:outline-none"
			aria-label={isOpen ? 'Tutup pilihan bantuan' : 'Buka pilihan bantuan'}
			onclick={togglePopup}
		>
			<img
				src="/layout/chatbot.svg"
				alt=""
				class="h-[6.8rem] w-[6.8rem] object-contain sm:h-[7.8rem] sm:w-[7.8rem] lg:h-[8.6rem] lg:w-[8.6rem]"
				aria-hidden="true"
			/>
		</button>
	</div>
</div>
