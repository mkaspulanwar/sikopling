<script lang="ts">
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";

  type Cleanup = () => void;

  const cards = [
    { src: "/home/amdal.png", alt: "Card 1" },
    { src: "/home/ukl.png", alt: "Card 2" },
    { src: "/home/delh.png", alt: "Card 3" },
    { src: "/home/addendum.png", alt: "Card 4" },
    { src: "/home/pertek.png", alt: "Card 5" },
  ];

  const MAIN_TRIGGER_ID = "home-horizontal-scroll-main";
  const ENHANCE_MIN_WIDTH = 1024;
  const { header }: { header?: Snippet } = $props();

  let sectionEl: HTMLElement | null = null;
  let horizontalEl: HTMLElement | null = null;
  let isEnhanced = $state(false);

  const initHorizontalScroll = async (): Promise<Cleanup> => {
    if (!sectionEl || !horizontalEl) return () => {};
    if (!window.matchMedia(`(min-width: ${ENHANCE_MIN_WIDTH}px)`).matches) {
      isEnhanced = false;
      return () => {};
    }

    try {
      const [gsapModule, scrollTriggerModule, lenisModule] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);

      const gsap = (gsapModule.default ?? gsapModule.gsap) as any;
      const ScrollTrigger = (scrollTriggerModule.ScrollTrigger ??
        scrollTriggerModule.default) as any;
      const Lenis = lenisModule.default as any;

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.getById(MAIN_TRIGGER_ID)?.kill();

      const lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);

      const tickerFn = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);

      const mainTween = gsap.to(horizontalEl, {
        x: () => -(horizontalEl!.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          id: MAIN_TRIGGER_ID,
          trigger: horizontalEl,
          start: "center center",
          end: () => "+=" + horizontalEl!.scrollWidth,
          pin: sectionEl,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      const cardTweens = Array.from(
        horizontalEl.querySelectorAll<HTMLElement>(".card"),
      ).map((card) =>
        gsap.from(card, {
          x: 250,
          duration: 0.6,
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            toggleActions: "play none none reverse",
          },
        }),
      );

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      requestAnimationFrame(refresh);
      isEnhanced = true;

      return () => {
        window.removeEventListener("load", refresh);

        mainTween?.scrollTrigger?.kill();
        mainTween?.kill();

        cardTweens.forEach((tween) => {
          tween.scrollTrigger?.kill();
          tween.kill();
        });

        gsap.ticker.remove(tickerFn);
        lenis.destroy();
        isEnhanced = false;
      };
    } catch (error) {
      console.error("Horizontal scroll enhancement failed:", error);
      isEnhanced = false;
      return () => {};
    }
  };

  onMount(() => {
    let isUnmounted = false;
    let cleanup: Cleanup = () => {};

    void initHorizontalScroll().then((teardown) => {
      if (isUnmounted) {
        teardown();
        return;
      }
      cleanup = teardown;
    });

    return () => {
      isUnmounted = true;
      cleanup();
    };
  });
</script>

<section id="horizontal-scroll" class:enhanced={isEnhanced} bind:this={sectionEl}>
  <div class="horizontal-scroll-header">
    {@render header?.()}
  </div>
  <div class="horizontal-scroll-wrapper">
    <div class="horizontal" bind:this={horizontalEl}>
      {#each cards as card}
        <div>
          <div class="card">
            <img src={card.src} alt={card.alt} />
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  #horizontal-scroll {
    position: relative;
    overflow: hidden;
    background-image: url("/home/gradient-texture.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  .horizontal-scroll-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 5;
  }

  .horizontal-scroll-wrapper {
    overflow: hidden;
    height: 100dvh;
    background: transparent;
  }

  .horizontal {
    display: flex;
    align-items: center;
    height: 100%;
    padding-left: 45vw;
  }

  .horizontal > div {
    margin: 0 4vw;
    flex: 0 0 auto;
  }

  .horizontal > div:last-child {
    margin: 0 6vw 0 4vw;
  }

  .horizontal .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: clamp(300px, 38vw, 720px);
    aspect-ratio: 2192 / 1465;
    padding: clamp(18px, 2.5vw, 34px) clamp(24px, 3vw, 42px);
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    background-image: url("/home/Rectangle.png");
    background-size: 100% 100%;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
    isolation: isolate;
    box-shadow: 0 12px 30px rgba(27, 64, 42, 0.2);
    transition:
      transform 420ms cubic-bezier(0.22, 1, 0.36, 1),
      box-shadow 420ms ease,
      filter 420ms ease;
  }

  .horizontal .card::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    border: 1px solid rgba(255, 255, 255, 0.28);
    opacity: 0;
    transition: opacity 320ms ease;
    pointer-events: none;
    z-index: 2;
  }

  .horizontal .card::after {
    content: "";
    position: absolute;
    top: -145%;
    left: -35%;
    width: 44%;
    height: 320%;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.42) 48%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(0) rotate(14deg);
    opacity: 0;
    transition:
      transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1),
      opacity 260ms ease;
    pointer-events: none;
    z-index: 2;
  }

  .card img {
    width: 100%;
    max-height: 100%;
    object-fit: contain;
    align-self: flex-start;
    margin-left: 2%;
    position: relative;
    z-index: 1;
    transform-origin: center left;
    transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  @media (hover: hover) and (pointer: fine) {
    .horizontal .card:hover {
      transform: translateY(-10px) scale(1.03);
      box-shadow:
        0 24px 45px rgba(28, 72, 46, 0.26),
        0 0 0 1px rgba(255, 255, 255, 0.22);
      filter: saturate(1.08);
    }

    .horizontal .card:hover::before {
      opacity: 1;
    }

    .horizontal .card:hover::after {
      opacity: 1;
      transform: translateX(340%) rotate(14deg);
    }

    .horizontal .card:hover img {
      transform: scale(1.04);
    }
  }

  @media (hover: none) {
    .horizontal .card:active {
      transform: scale(0.985);
    }
  }

  @media (min-width: 768px) and (max-width: 1279px) {
    .horizontal-scroll-wrapper {
      height: clamp(32rem, 78dvh, 52rem);
    }

    .horizontal {
      align-items: center;
      padding-left: 18vw;
    }

    .horizontal > div {
      margin: 0 2.5vw;
    }

    .horizontal > div:last-child {
      margin: 0 10vw 0 2.5vw;
    }

    .horizontal .card {
      width: min(74vw, 34rem);
      border-radius: 20px;
      padding: clamp(16px, 2.8vw, 28px) clamp(18px, 3vw, 34px);
    }
  }

  @media (min-width: 768px) {
    #horizontal-scroll:not(.enhanced) {
      overflow: visible;
    }

    #horizontal-scroll:not(.enhanced) .horizontal-scroll-header {
      position: static;
      z-index: auto;
      margin-bottom: 1rem;
    }

    #horizontal-scroll:not(.enhanced) .horizontal-scroll-wrapper {
      height: auto;
      overflow-x: auto;
      overflow-y: visible;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    #horizontal-scroll:not(.enhanced) .horizontal-scroll-wrapper::-webkit-scrollbar {
      display: none;
    }

    #horizontal-scroll:not(.enhanced) .horizontal {
      align-items: stretch;
      height: auto;
      min-width: max-content;
      padding: 0 1.5rem 0.25rem;
    }

    #horizontal-scroll:not(.enhanced) .horizontal > div {
      margin: 0 1rem 0 0;
    }

    #horizontal-scroll:not(.enhanced) .horizontal > div:last-child {
      margin: 0 1.5rem 0 0;
    }

    #horizontal-scroll:not(.enhanced) .horizontal .card {
      width: min(70vw, 32rem);
      padding: clamp(16px, 2.4vw, 28px) clamp(18px, 2.6vw, 34px);
    }
  }

  @media (max-width: 767px) {
    #horizontal-scroll {
      overflow: visible;
    }

    .horizontal-scroll-header {
      position: static;
      z-index: auto;
      margin-bottom: 1rem;
    }

    .horizontal-scroll-wrapper {
      height: auto;
      overflow-x: auto;
      overflow-y: visible;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .horizontal-scroll-wrapper::-webkit-scrollbar {
      display: none;
    }

    .horizontal {
      align-items: stretch;
      height: auto;
      min-width: max-content;
      padding: 0 1rem 0.25rem;
    }

    .horizontal > div {
      margin: 0 0.75rem 0 0;
    }

    .horizontal > div:last-child {
      margin: 0 1rem 0 0;
    }

    .horizontal .card {
      width: min(88vw, 25rem);
      padding: clamp(14px, 3.4vw, 24px) clamp(16px, 4vw, 28px);
    }
  }
</style>
