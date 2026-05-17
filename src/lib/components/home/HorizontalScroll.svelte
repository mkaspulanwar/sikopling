<script lang="ts">
  import { onMount } from "svelte";
  import type { Snippet } from "svelte";
  import ArrowLeftRight from "lucide-svelte/icons/arrow-left-right";

  type Cleanup = () => void;

  const cards = [
    { src: "/home/amdal.png", alt: "Card 1" },
    { src: "/home/ukl.png", alt: "Card 2" },
    { src: "/home/delh.png", alt: "Card 3" },
    { src: "/home/addendum.png", alt: "Card 4" },
    { src: "/home/pertek.png", alt: "Card 5" },
  ];

  const MAIN_TRIGGER_ID = "home-horizontal-scroll-main";
  const DESKTOP_MIN_WIDTH = 1024;
  const { header }: { header?: Snippet } = $props();

  let sectionEl: HTMLElement | null = null;
  let horizontalEl: HTMLElement | null = null;
  let wrapperEl: HTMLElement | null = null;
  let progressTrackEl: HTMLButtonElement | null = null;
  let isEnhanced = $state(false);
  let scrollProgress = $state(0);
  let isProgressDragging = false;
  let enhancedScrollTrigger: any = null;
  let enhancedLenis: any = null;

  const setNavScrollLock = (isLocked: boolean) => {
    if (typeof document === "undefined") return;

    document.documentElement.dataset.horizontalScrollNavLock = isLocked
      ? "true"
      : "false";
  };

  const clampProgress = (value: number) => Math.min(Math.max(value, 0), 1);

  const setNativeProgress = () => {
    if (!wrapperEl) {
      scrollProgress = 0;
      return;
    }

    const maxScrollLeft = wrapperEl.scrollWidth - wrapperEl.clientWidth;
    if (maxScrollLeft <= 0) {
      scrollProgress = 0;
      return;
    }

    scrollProgress = clampProgress(wrapperEl.scrollLeft / maxScrollLeft);
  };

  const applyProgress = (nextProgress: number) => {
    const normalizedProgress = clampProgress(nextProgress);

    if (isEnhanced && enhancedScrollTrigger) {
      const targetY =
        enhancedScrollTrigger.start +
        (enhancedScrollTrigger.end - enhancedScrollTrigger.start) *
          normalizedProgress;

      if (enhancedLenis) {
        enhancedLenis.scrollTo(targetY, { immediate: false, duration: 0.85 });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
      return;
    }

    if (!wrapperEl) return;

    const maxScrollLeft = wrapperEl.scrollWidth - wrapperEl.clientWidth;
    wrapperEl.scrollTo({
      left: maxScrollLeft * normalizedProgress,
      behavior: "smooth",
    });
  };

  const updateProgressFromPointer = (clientX: number) => {
    if (!progressTrackEl) return;

    const { left, width } = progressTrackEl.getBoundingClientRect();
    if (width <= 0) return;

    applyProgress((clientX - left) / width);
  };

  const handleProgressPointerDown = (event: PointerEvent) => {
    isProgressDragging = true;
    progressTrackEl?.setPointerCapture(event.pointerId);
    updateProgressFromPointer(event.clientX);
  };

  const handleProgressPointerMove = (event: PointerEvent) => {
    if (!isProgressDragging) return;
    updateProgressFromPointer(event.clientX);
  };

  const handleProgressPointerUp = (event: PointerEvent) => {
    if (!isProgressDragging) return;
    isProgressDragging = false;
    progressTrackEl?.releasePointerCapture(event.pointerId);
    updateProgressFromPointer(event.clientX);
  };

  const teardownEnhancedScrollState = () => {
    enhancedScrollTrigger?.kill?.();
    enhancedScrollTrigger = null;

    enhancedLenis?.destroy?.();
    enhancedLenis = null;

    setNavScrollLock(false);
    isEnhanced = false;
  };

  const initHorizontalScroll = async (): Promise<Cleanup> => {
    if (!sectionEl || !horizontalEl) return () => {};
    if (!window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`).matches) {
      teardownEnhancedScrollState();
      setNativeProgress();
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

      const lenis = new Lenis({
        // Allow native scroll inside modal/popup containers.
        prevent: (node: Element | null) =>
          Boolean(node?.closest?.("[data-lenis-prevent]")),
      });
      enhancedLenis = lenis;
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
          onToggle: (self: any) => {
            setNavScrollLock(self.isActive);
          },
          onUpdate: (self: any) => {
            scrollProgress = clampProgress(self.progress);
          },
        },
      });
      enhancedScrollTrigger = mainTween.scrollTrigger;

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
        teardownEnhancedScrollState();
      };
    } catch (error) {
      console.error("Horizontal scroll enhancement failed:", error);
      teardownEnhancedScrollState();
      return () => {};
    }
  };

  onMount(() => {
    let isUnmounted = false;
    let cleanup: Cleanup = () => {};
    const desktopMediaQuery = window.matchMedia(
      `(min-width: ${DESKTOP_MIN_WIDTH}px)`,
    );

    const syncModeByViewport = async () => {
      cleanup();
      cleanup = () => {};
      setNativeProgress();

      if (!desktopMediaQuery.matches) {
        teardownEnhancedScrollState();
        return;
      }

      const nextCleanup = await initHorizontalScroll();
      if (isUnmounted) {
        nextCleanup();
        return;
      }

      cleanup = nextCleanup;
    };

    const handleNativeScroll = () => {
      if (isEnhanced) return;
      setNativeProgress();
    };
    const handleResize = () => setNativeProgress();
    const handleViewportChange = () => {
      void syncModeByViewport();
    };

    wrapperEl?.addEventListener("scroll", handleNativeScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    desktopMediaQuery.addEventListener("change", handleViewportChange);
    requestAnimationFrame(setNativeProgress);

    void syncModeByViewport();

    return () => {
      isUnmounted = true;
      wrapperEl?.removeEventListener("scroll", handleNativeScroll);
      window.removeEventListener("resize", handleResize);
      desktopMediaQuery.removeEventListener("change", handleViewportChange);
      setNavScrollLock(false);
      cleanup();
    };
  });
</script>

<section id="horizontal-scroll" class:enhanced={isEnhanced} bind:this={sectionEl}>
  <div class="horizontal-scroll-header">
    {@render header?.()}
  </div>
  <div class="horizontal-mobile-hint" aria-hidden="true">
    <span class="horizontal-mobile-hint-icon">
      <ArrowLeftRight strokeWidth={2.2} />
    </span>
    <span>Geser kartu</span>
  </div>
  <div class="horizontal-scroll-wrapper" bind:this={wrapperEl}>
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
  <div class="horizontal-progress-shell">
    <button
      type="button"
      class="horizontal-progress-track"
      bind:this={progressTrackEl}
      aria-label="Progress geser layanan dokumen"
      onpointerdown={handleProgressPointerDown}
      onpointermove={handleProgressPointerMove}
      onpointerup={handleProgressPointerUp}
      onpointercancel={handleProgressPointerUp}
    >
      <span
        class="horizontal-progress-fill"
        style={`transform: scaleX(${Math.max(scrollProgress, 0.04)});`}
      ></span>
      <span
        class="horizontal-progress-thumb"
        style={`left: calc(${scrollProgress * 100}% - 0.5rem);`}
      ></span>
    </button>
  </div>
</section>

<style>
  #horizontal-scroll {
    position: relative;
    overflow: visible;
    background-image: url("/home/gradient-texture.jpg");
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

  .horizontal-mobile-hint {
    display: none;
  }

  .horizontal-scroll-wrapper {
    overflow: visible;
    height: auto;
    min-height: 0;
    background: transparent;
  }

  .horizontal-progress-shell {
    position: absolute;
    left: 50%;
    bottom: clamp(1rem, 2.4vw, 1.65rem);
    z-index: 6;
    width: min(22rem, calc(100vw - 2.5rem));
    transform: translateX(-50%);
    pointer-events: none;
  }

  .horizontal-progress-track {
    position: relative;
    display: block;
    width: 100%;
    height: 0.8rem;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.26);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.14),
      0 10px 24px rgba(10, 18, 14, 0.16);
    cursor: ew-resize;
    pointer-events: auto;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    touch-action: none;
    overflow: hidden;
  }

  .horizontal-progress-fill {
    position: absolute;
    inset: 0;
    transform-origin: left center;
    background: linear-gradient(
      90deg,
      rgba(229, 246, 196, 0.92) 0%,
      rgba(145, 211, 107, 0.98) 52%,
      rgba(255, 199, 106, 0.96) 100%
    );
    border-radius: inherit;
  }

  .horizontal-progress-thumb {
    position: absolute;
    top: 50%;
    width: 1rem;
    height: 1rem;
    border-radius: 999px;
    background: #fffef7;
    border: 1px solid rgba(69, 96, 52, 0.16);
    box-shadow:
      0 4px 10px rgba(10, 18, 14, 0.18),
      0 0 0 3px rgba(255, 255, 255, 0.12);
    transform: translateY(-50%);
  }

  .horizontal {
    display: flex;
    align-items: stretch;
    height: auto;
    box-sizing: border-box;
    padding: 0 1rem 0.25rem;
  }

  .horizontal > div {
    margin: 0 0.75rem 0 0;
    flex: 0 0 auto;
    scroll-snap-align: start;
  }

  .horizontal > div:last-child {
    margin: 0 1rem 0 0;
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

  @media (min-width: 1024px) {
    #horizontal-scroll.enhanced {
      overflow: hidden;
    }

    #horizontal-scroll.enhanced .horizontal-scroll-header {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 5;
      margin-bottom: 0;
    }

    #horizontal-scroll.enhanced .horizontal-scroll-wrapper {
      overflow: hidden;
      height: 100vh;
      height: 100svh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100svh;
      min-height: 100dvh;
    }

    #horizontal-scroll.enhanced .horizontal {
      align-items: center;
      height: 100%;
      padding: clamp(8.25rem, 12vw, 11.5rem) 0 clamp(4.5rem, 7vw, 6.5rem) 45vw;
    }

    #horizontal-scroll.enhanced .horizontal > div {
      margin: 0 4vw;
    }

    #horizontal-scroll.enhanced .horizontal > div:last-child {
      margin: 0 6vw 0 4vw;
    }

    #horizontal-scroll.enhanced .horizontal .card {
      width: clamp(300px, 38vw, 720px);
    }
  }

  @media (min-width: 768px) and (max-width: 1279px) {
    .horizontal {
      align-items: center;
      padding: 0 1.5rem 0.25rem;
    }

    .horizontal > div {
      margin: 0 1rem 0 0;
    }

    .horizontal > div:last-child {
      margin: 0 1.5rem 0 0;
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
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      scroll-snap-type: x mandatory;
      scroll-padding-inline: 1.5rem;
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
      width: 100vw;
      margin-inline: calc(50% - 50vw);
      min-height: 40rem;
      padding: 1.5rem 0;
      display: flex;
      flex-direction: column;
    }

    .horizontal-scroll-header {
      position: static;
      margin-bottom: 0.75rem;
      flex: 0 0 auto;
    }

    .horizontal-mobile-hint {
      display: inline-flex;
      align-items: center;
      align-self: center;
      gap: 0.45rem;
      margin-bottom: 0.9rem;
      padding: 0.42rem 0.8rem;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.14);
      color: rgba(255, 255, 255, 0.92);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      user-select: none;
      pointer-events: none;
    }

    .horizontal-mobile-hint-icon {
      width: 0.95rem;
      height: 0.95rem;
      flex: 0 0 auto;
    }

    .horizontal-mobile-hint-icon :global(svg) {
      width: 100%;
      height: 100%;
      display: block;
    }

    .horizontal-scroll-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      scroll-snap-type: x mandatory;
      scroll-padding-inline: 1rem;
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

    .horizontal-progress-shell {
      display: none;
    }
  }
</style>
