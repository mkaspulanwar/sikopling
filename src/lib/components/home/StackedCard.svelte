<script lang="ts">
    import Clock3 from "lucide-svelte/icons/clock-3";
    import FileText from "lucide-svelte/icons/file-text";
    import Route from "lucide-svelte/icons/route";
    import { onMount } from "svelte";

    let sectionEl: HTMLElement | null = null;
    let cardOneEl: HTMLElement | null = null;
    let cardTwoEl: HTMLElement | null = null;
    let cardThreeEl: HTMLElement | null = null;
    const DESKTOP_MEDIA_QUERY = "(min-width: 1101px)";

    onMount(() => {
        let isUnmounted = false;
        let teardownDesktopAnimation: (() => void) | null = null;
        let syncToken = 0;
        const desktopMedia = window.matchMedia(DESKTOP_MEDIA_QUERY);

        const getCards = () =>
            [cardOneEl, cardTwoEl, cardThreeEl].filter(
                (card): card is HTMLElement => Boolean(card),
            );

        const resetCardsToStaticState = () => {
            getCards().forEach((card) => {
                card.style.removeProperty("transform");
                card.style.removeProperty("will-change");
            });
        };

        const createDesktopAnimation = async () => {
            if (!sectionEl) {
                return () => {};
            }

            const [gsapModule, scrollTriggerModule] = await Promise.all([
                import("gsap"),
                import("gsap/ScrollTrigger"),
            ]);

            if (isUnmounted || !sectionEl || !desktopMedia.matches) {
                return () => {};
            }

            const gsap = (gsapModule.default ?? gsapModule.gsap) as any;
            const ScrollTrigger = (scrollTriggerModule.ScrollTrigger ??
                scrollTriggerModule.default) as any;

            gsap.registerPlugin(ScrollTrigger);

            const cards = getCards();
            if (!cards.length) {
                return () => {};
            }

            gsap.set(cards, {
                yPercent: 120,
                rotate: (i: number) => (i % 2 === 0 ? -10 : 10),
                willChange: "transform",
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionEl,
                    start: "top top",
                    end: "+=280%",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            tl.to(cards, {
                yPercent: 0,
                rotate: 0,
                duration: 2,
                stagger: 0.9,
                ease: "power2.out",
            });

            return () => {
                tl.scrollTrigger?.kill(true);
                tl.kill();
                gsap.set(cards, { clearProps: "transform,will-change" });
            };
        };

        const syncAnimationByViewport = async () => {
            const currentToken = ++syncToken;
            teardownDesktopAnimation?.();
            teardownDesktopAnimation = null;
            resetCardsToStaticState();

            if (!desktopMedia.matches) {
                return;
            }

            const teardown = await createDesktopAnimation();
            if (isUnmounted || currentToken !== syncToken) {
                teardown();
                return;
            }
            teardownDesktopAnimation = teardown;
        };

        void syncAnimationByViewport();

        const handleViewportChange = () => {
            void syncAnimationByViewport();
        };

        desktopMedia.addEventListener("change", handleViewportChange);

        return () => {
            isUnmounted = true;
            desktopMedia.removeEventListener("change", handleViewportChange);
            teardownDesktopAnimation?.();
        };
    });
</script>

<section class="quality-section" bind:this={sectionEl}>
    <div class="quality-grid">
        <div class="quality-content">
            <h2 class="quality-title">
                Kemudahan dalam Setiap
                <span class="text-green">Proses</span>
            </h2>
            <p class="quality-description">
                Kami menghadirkan sistem yang mempermudah pengajuan dokumen
                lingkungan dengan alur yang jelas, transparan, dan terintegrasi.
            </p>
        </div>

        <div class="quality-cards-wrapper">
            <article
                class="quality-card card-green-light card-one"
                bind:this={cardOneEl}
            >
                <div class="quality-card-top">
                    <div>
                        <p class="quality-number">3 Cara</p>
                        <p class="quality-subtitle">Mudah</p>
                    </div>
                    <span
                        class="quality-card-icon quality-card-icon-route"
                        aria-hidden="true"
                    >
                        <Route />
                    </span>
                </div>
                <p class="quality-copy">Daftar &bull; Upload &bull; Pantau</p>
            </article>

            <article
                class="quality-card card-green card-two"
                bind:this={cardTwoEl}
            >
                <div class="quality-card-top">
                    <div>
                        <p class="quality-number">&le; 5 Hari</p>
                        <p class="quality-subtitle">Proses Pengajuan</p>
                    </div>
                    <span class="quality-card-icon" aria-hidden="true">
                        <Clock3 />
                    </span>
                </div>
                <p class="quality-copy">Lebih cepat dan terukur.</p>
            </article>

            <article
                class="quality-card card-orange card-three"
                bind:this={cardThreeEl}
            >
                <div class="quality-card-top">
                    <div>
                        <p class="quality-number">100%</p>
                        <p class="quality-subtitle">Pengajuan online</p>
                    </div>
                    <span class="quality-card-icon" aria-hidden="true">
                        <FileText />
                    </span>
                </div>
                <p class="quality-copy">
                    Dari mana saja. Tanpa perlu datang ke kantor.
                </p>
            </article>
        </div>

        <p class="mobile-swipe-hint">
            Geser kartu untuk melihat semua kemudahan.
        </p>
    </div>
</section>

<style>
    :global(:root) {
        --color-beige: #f5f0e4;
        --color-black: #2c2c2c;
        --color-green-light: #77d37f;
        --color-green: #64ad31;
        --color-orange: #eb9e27;
        --color-green-theme: #64ad31;
        --muted: #475467;
    }

    .quality-section {
        color: var(--color-black);
        font-family: var(--font-body);
        overflow: hidden;
        padding: 7.5rem 7rem 10rem;
    }

    .quality-grid {
        display: grid;
        gap: 5rem;
        grid-template-columns: repeat(12, minmax(0, 1fr));
    }

    .quality-content {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
        grid-column: span 7;
        justify-content: space-between;
    }

    .quality-title {
        font-size: clamp(2.2rem, 5.5vw, 4.5rem);
        font-weight: 600;
        line-height: 1.08;
        margin: 0;
        max-width: 43.75rem;
    }

    .text-green {
        color: var(--color-green-theme);
    }

    .quality-description {
        color: var(--muted);
        font-size: 1.125rem;
        font-weight: 500;
        line-height: 1.6;
        margin: 0;
        max-width: 28.75rem;
    }

    .quality-cards-wrapper {
        grid-column: span 5;
        min-height: 32.5rem;
        position: relative;
    }

    .mobile-swipe-hint {
        display: none;
    }

    .quality-card {
        border-radius: 1.5rem;
        box-sizing: border-box;
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: auto;
        max-width: 28.75rem;
        min-height: 28rem;
        position: relative;
        padding: 2.5rem;
        width: 100%;
    }

    .quality-card-top {
        align-items: flex-start;
        display: flex;
        gap: 1.25rem;
        justify-content: space-between;
        width: 100%;
    }

    .quality-card-icon {
        align-items: center;
        --icon-size: clamp(1.6rem, 3.1vw, 2.6rem);
        background: rgba(255, 255, 255, 0.14);
        border: 2px solid rgba(255, 255, 255, 0.32);
        border-radius: 999px;
        color: rgba(255, 255, 255, 0.95);
        display: inline-flex;
        flex-shrink: 0;
        height: clamp(3.8rem, 7vw, 5.8rem);
        justify-content: center;
        box-shadow: 0 10px 22px rgba(21, 34, 53, 0.16);
        width: clamp(3.8rem, 7vw, 5.8rem);
    }

    .quality-card-icon :global(svg) {
        display: block;
        height: var(--icon-size);
        stroke-width: 2.35;
        width: var(--icon-size);
    }

    .card-green-light {
        background: var(--color-green-light);
    }

    .card-green-light .quality-card-icon {
        background: rgba(235, 255, 238, 0.2);
        border-color: rgba(230, 255, 235, 0.52);
        box-shadow: 0 10px 22px rgba(36, 113, 58, 0.2);
    }

    .card-green {
        background: var(--color-green);
    }

    .card-green .quality-card-icon {
        background: rgba(236, 255, 226, 0.14);
        border-color: rgba(235, 255, 224, 0.42);
        box-shadow: 0 10px 22px rgba(28, 83, 13, 0.26);
    }

    .card-orange {
        background: var(--color-orange);
    }

    .card-orange .quality-card-icon {
        background: rgba(255, 245, 223, 0.18);
        border-color: rgba(255, 247, 228, 0.45);
        box-shadow: 0 10px 22px rgba(138, 82, 8, 0.26);
    }

    .card-two {
        position: absolute;
        right: 0;
        top: 4rem;
    }

    .card-three {
        position: absolute;
        right: 0;
        top: 8rem;
    }

    .quality-number {
        font-size: clamp(3.2rem, 7.5vw, 6.5rem);
        font-family: var(--font-display);
        font-weight: 600;
        line-height: 0.88;
        margin: 0 0 1rem;
    }

    .quality-subtitle {
        font-size: clamp(1.3rem, 2vw, 1.875rem);
        font-family: var(--font-display);
        font-weight: 600;
        line-height: 1.2;
        margin: 0;
    }

    .quality-copy {
        font-size: 1.125rem;
        line-height: 1.5;
        margin: 0;
    }

    @media (max-width: 1100px) {
        .quality-section {
            padding-inline: clamp(1.5rem, 5vw, 4rem);
        }

        .quality-grid {
            gap: 2.5rem;
        }

        .quality-content,
        .quality-cards-wrapper {
            grid-column: 1 / -1;
        }

        .quality-cards-wrapper {
            display: grid;
            gap: 1rem;
            min-height: 0;
        }

        .quality-card {
            margin-left: 0;
            max-width: 100%;
            min-height: 16rem;
        }

        .card-two,
        .card-three {
            position: static;
        }
    }

    @media (max-width: 768px) {
        .quality-section {
            background: linear-gradient(180deg, #f9f6ee 0%, #ffffff 100%);
            padding-top: 4.5rem;
            padding-bottom: 5.5rem;
            padding-inline: clamp(1.05rem, 2.4vw, 2.25rem);
        }

        .quality-grid {
            gap: 2rem;
        }

        .quality-content {
            align-items: flex-start;
            gap: 1rem;
            text-align: center;
        }

        .quality-title {
            font-size: clamp(3rem, 12vw, 3.8rem);
            max-width: 20ch;
            text-align: center;
        }

        .quality-description {
            font-size: 1rem;
            line-height: 1.55;
            max-width: 100%;
        }

        .quality-cards-wrapper {
            display: grid;
            gap: 0.85rem;
            justify-items: start;
            margin-inline: 0;
            overflow: visible;
            padding: 0;
        }

        .quality-card {
            align-items: flex-start;
            border-radius: 1.25rem;
            box-shadow: 0 12px 30px rgba(11, 18, 30, 0.12);
            min-height: 11.5rem;
            max-width: 100%;
            padding: 1rem 1.05rem;
            text-align: left;
            width: min(100%, 20.5rem);
        }

        .quality-card-icon {
            --icon-size: clamp(1.35rem, 5vw, 1.7rem);
            border-width: 1.5px;
            height: clamp(3.2rem, 13vw, 3.8rem);
            width: clamp(3.2rem, 13vw, 3.8rem);
        }

        .quality-card-icon-route :global(svg) {
            transform: translateY(1px);
        }

        .quality-number {
            font-size: clamp(2.3rem, 10.5vw, 3.2rem);
            margin-bottom: 0.5rem;
        }

        .quality-subtitle {
            font-size: clamp(1.1rem, 5vw, 1.4rem);
        }

        .quality-copy {
            font-size: 0.96rem;
            line-height: 1.45;
        }

        .mobile-swipe-hint {
            display: none;
        }
    }

    @media (min-width: 641px) and (max-width: 768px) {
        .quality-content {
            align-items: center;
            text-align: center;
        }

        .quality-cards-wrapper {
            justify-items: center;
            gap: 1rem;
        }

        .quality-card {
            width: min(100%, 24rem);
            min-height: 12.5rem;
            padding: 1.2rem 1.25rem;
        }

        .quality-number {
            font-size: clamp(2.5rem, 8vw, 3.4rem);
        }

        .quality-subtitle {
            font-size: clamp(1.15rem, 3.2vw, 1.5rem);
        }

        .quality-copy {
            font-size: 1rem;
        }
    }

    @media (max-width: 640px) {
        .quality-section {
            padding-left: max(1.3rem, calc(env(safe-area-inset-left) + 0.8rem));
            padding-right: max(
                1.3rem,
                calc(env(safe-area-inset-right) + 0.8rem)
            );
        }

        .quality-card {
            width: min(100%, 19rem);
        }
        .quality-content {
            align-items: flex-start;
            gap: 1rem;
            text-align: center;
        }
        .quality-title {
            font-size: clamp(2rem, 9vw, 2.4rem);
            max-width: 17ch;
        }
        .quality-description {
            font-size: 0.9rem;
            line-height: 1.4;
            max-width: 100%;
        }
        .quality-cards-wrapper {
            display: grid;
            gap: 0.85rem;
            align-items: center;
            justify-items: center;
            margin-inline: 0;
            overflow: visible;
            padding: 0;
        }

        .quality-card-icon {
            --icon-size: 1.25rem;
            height: 3rem;
            width: 3rem;
        }

        .quality-card-icon-route :global(svg) {
            transform: translateY(0.5px);
        }
    }
</style>
