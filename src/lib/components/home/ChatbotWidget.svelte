<script lang="ts">
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	type ChatRole = 'bot' | 'user';
	type ChatMessage = {
		id: number;
		role: ChatRole;
		text: string;
		time: string;
	};

	const quickSuggestions = ['Cara cek status dokumen', 'Persyaratan layanan', 'Jam layanan DLH'];

	let isOpen = $state(false);
	let isTyping = $state(false);
	let messageInput = $state('');
	let inputEl = $state<HTMLInputElement | null>(null);
	let messageId = 1;
	let messages = $state<ChatMessage[]>([
		{
			id: 0,
			role: 'bot',
			text: 'Halo, saya Asisten SIKOPLING. Silakan tanyakan informasi layanan atau status pengajuan Anda.',
			time: formatTime()
		}
	]);

	function formatTime() {
		return new Date().toLocaleTimeString('id-ID', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getBotReply(query: string) {
		const lower = query.toLowerCase();

		if (lower.includes('status')) {
			return 'Untuk cek status, siapkan nomor registrasi lalu buka menu Layanan > Tracking Dokumen.';
		}
		if (lower.includes('syarat') || lower.includes('persyaratan')) {
			return 'Persyaratan umum biasanya meliputi formulir pengajuan, dokumen teknis lingkungan, dan identitas pemohon.';
		}
		if (lower.includes('jam') || lower.includes('layanan')) {
			return 'Jam layanan kerja: Senin-Kamis 08.00-15.30 WITA dan Jumat 08.00-11.00 WITA.';
		}

		return 'Pertanyaan Anda sudah dicatat. Untuk tindak lanjut detail, silakan gunakan menu Layanan atau hubungi kontak resmi di footer.';
	}

	async function toggleChat() {
		isOpen = !isOpen;
		if (isOpen) {
			await tick();
			inputEl?.focus();
		}
	}

	function closeChat() {
		isOpen = false;
	}

	function pushMessage(role: ChatRole, text: string) {
		messages.push({
			id: messageId++,
			role,
			text,
			time: formatTime()
		});
	}

	function sendMessage(text = messageInput) {
		const cleanText = text.trim();
		if (!cleanText || isTyping) {
			return;
		}

		pushMessage('user', cleanText);
		messageInput = '';
		isTyping = true;

		const reply = getBotReply(cleanText);
		setTimeout(() => {
			pushMessage('bot', reply);
			isTyping = false;
		}, 380);
	}

	function handleInputKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			sendMessage();
		}
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			closeChat();
		}
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div class="pointer-events-none fixed bottom-5 right-5 z-30 flex items-end sm:bottom-6 sm:right-6">
	<div class="pointer-events-auto flex flex-col items-end gap-3">
		{#if isOpen}
			<section
				class="w-[min(92vw,23rem)] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-[0_24px_56px_-30px_rgba(15,23,42,0.35)]"
				transition:fly={{ y: 10, duration: 160 }}
			>
				<div class="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
					<div>
						<p class="text-sm font-semibold text-[var(--ink)]">Asisten SIKOPLING</p>
						<p class="text-xs text-[var(--muted)]">Layanan Informasi Cepat</p>
					</div>
					<button
						type="button"
						class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]"
						aria-label="Tutup chatbot"
						onclick={closeChat}
					>
						<svg viewBox="0 0 20 20" class="h-4 w-4" aria-hidden="true">
							<path d="M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5" stroke="currentColor" stroke-width="1.8" />
						</svg>
					</button>
				</div>

				<div class="max-h-[17.5rem] space-y-3 overflow-y-auto px-4 py-3">
					{#each messages as message (message.id)}
						<div class={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
							<div
								class={`max-w-[85%] rounded-2xl px-3 py-2 ${
									message.role === 'user'
										? 'rounded-br-md bg-[#A9B388] text-[var(--ink)]'
										: 'rounded-bl-md border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)]'
								}`}
							>
								<p class="text-sm leading-relaxed">{message.text}</p>
								<p class="mt-1 text-[10px] text-[var(--muted)]">{message.time}</p>
							</div>
						</div>
					{/each}

					{#if isTyping}
						<div class="flex justify-start" transition:fade={{ duration: 120 }}>
							<div class="rounded-2xl rounded-bl-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
								<p class="text-sm text-[var(--muted)]">Asisten sedang menulis...</p>
							</div>
						</div>
					{/if}
				</div>

				<div class="border-t border-[var(--line)] px-4 py-2.5">
					<p class="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">Disarankan</p>
					<div class="flex flex-wrap gap-1.5">
						{#each quickSuggestions as suggestion}
							<button
								type="button"
								class="rounded-full border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]"
								onclick={() => sendMessage(suggestion)}
							>
								{suggestion}
							</button>
						{/each}
					</div>
				</div>

				<div class="border-t border-[var(--line)] px-3 py-3">
					<div class="flex items-center gap-2 rounded-xl border border-[var(--line)] px-3 py-2">
						<input
							bind:this={inputEl}
							bind:value={messageInput}
							type="text"
							placeholder="Ketik pertanyaan..."
							class="w-full border-0 bg-transparent px-0 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-0"
							onkeydown={handleInputKeydown}
						/>
						<button
							type="button"
							class="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--ink)]"
							aria-label="Kirim pesan"
							onclick={() => sendMessage()}
						>
							<svg viewBox="0 0 20 20" class="h-4 w-4" aria-hidden="true">
								<path d="M3 10L16.5 4.5L12.5 10L16.5 15.5L3 10Z" fill="currentColor" />
							</svg>
						</button>
					</div>
				</div>
			</section>
		{/if}

		<button
			type="button"
			class="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#A9B388] bg-[#A9B388] text-white shadow-[0_16px_32px_-20px_rgba(15,23,42,0.5)] transition-colors hover:bg-[#A9B388]"
			aria-label={isOpen ? 'Tutup chatbot' : 'Buka chatbot'}
			onclick={toggleChat}
		>
			{#if isOpen}
				<svg viewBox="0 0 20 20" class="h-5 w-5" aria-hidden="true">
					<path d="M5.5 5.5L14.5 14.5M14.5 5.5L5.5 14.5" stroke="currentColor" stroke-width="1.8" />
				</svg>
			{:else}
				<svg viewBox="0 0 24 24" class="h-6 w-6" aria-hidden="true">
					<path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor" />
				</svg>
			{/if}
		</button>
	</div>
</div>
