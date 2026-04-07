<script lang="ts">
    import { onMount } from "svelte";

    let sectionEl: HTMLElement | null = null;
    let cardOneEl: HTMLElement | null = null;
    let cardTwoEl: HTMLElement | null = null;
    let cardThreeEl: HTMLElement | null = null;

    onMount(() => {
        let isUnmounted = false;
        let tl: any = null;

        void (async () => {
            if (!sectionEl) return;

            const [gsapModule, scrollTriggerModule] = await Promise.all([
                import("gsap"),
                import("gsap/ScrollTrigger"),
            ]);

            if (isUnmounted || !sectionEl) return;

            const gsap = (gsapModule.default ?? gsapModule.gsap) as any;
            const ScrollTrigger = (scrollTriggerModule.ScrollTrigger ??
                scrollTriggerModule.default) as any;

            gsap.registerPlugin(ScrollTrigger);

            const cards = [cardOneEl, cardTwoEl, cardThreeEl].filter(Boolean);

            cards.forEach((card, i) => {
                gsap.set(card, {
                    y: "180%",
                    rotate: i % 2 === 0 ? -10 : 10,
                });
            });

            tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionEl,
                    start: "top top",
                    end: "+=300%",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            tl.to(cards, {
                y: 0,
                rotate: 0,
                duration: 2,
                stagger: 1,
                ease: "power2.out",
            });
        })();

        return () => {
            isUnmounted = true;
            tl?.scrollTrigger?.kill();
            tl?.kill();
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
                Kami menghadirkan sistem yang mempermudah pengajuan dokumen lingkungan dengan alur yang jelas, transparan, dan terintegrasi.
            </p>
        </div>

        <div class="quality-cards-wrapper">
            <article class="quality-card card-blue" bind:this={cardOneEl}>
                <div>
                    <p class="quality-number">3 Langkah</p>
                    <p class="quality-subtitle">Mudah</p>
                </div>
                <p class="quality-copy">
                    Daftar • Upload • Pantau
                </p>
            </article>

            <article
                class="quality-card card-yellow card-two"
                bind:this={cardTwoEl}
            >
                <div>
                    <p class="quality-number">≤ 5 Hari</p>
                    <p class="quality-subtitle">Proses Pengajuan</p>
                </div>
                <p class="quality-copy">
                    Lebih cepat dan terukur.
                </p>
            </article>

            <article
                class="quality-card card-green card-three"
                bind:this={cardThreeEl}
            >
                <div>
                    <p class="quality-number">100%</p>
                    <p class="quality-subtitle">Pengajuan dokumen online</p>
                </div>
                <p class="quality-copy">Dari mana saja. Tanpa perlu datang ke kantor.</p>
            </article>
        </div>
    </div>
</section>

<style>
    :global(:root) {
        --color-beige: #f5f0e4;
        --color-black: #2c2c2c;
        --color-blue: #77D37F;
        --color-yellow: #64AD31;
        --color-green: #EB9E27;
        --color-green-theme: #64AD31;
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
        padding: 2.5rem;
        width: 100%;
    }

    .card-blue {
        background: var(--color-blue);
    }

    .card-yellow {
        background: var(--color-yellow);
    }

    .card-green {
        background: var(--color-green);
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
            min-height: 40rem;
        }

        .quality-card {
            max-width: 100%;
        }
    }

    @media (max-width: 768px) {
        .quality-section {
            padding: 5rem 1.25rem 6rem;
        }

        .quality-content {
            align-items: center;
            text-align: center;
        }

        .quality-title {
            max-width: 100%;
        }

        .quality-description {
            max-width: 34ch;
        }

        .quality-cards-wrapper {
            display: grid;
            gap: 1rem;
            justify-items: center;
            min-height: 0;
        }

        .quality-card {
            align-items: center;
            margin-left: 0;
            min-height: 14.5rem;
            padding: 1.5rem;
            text-align: center;
        }

        .card-two,
        .card-three {
            position: static;
        }

        .quality-number {
            font-size: clamp(2.8rem, 11vw, 3.8rem);
            margin-bottom: 0.65rem;
        }

        .quality-subtitle {
            font-size: clamp(1.35rem, 5.5vw, 1.8rem);
        }

        .quality-copy {
            font-size: clamp(1.02rem, 4vw, 1.2rem);
            line-height: 1.45;
        }
    }
</style>
