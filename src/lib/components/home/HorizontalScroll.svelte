<script>
  import { onMount } from "svelte";

  const cards = [
    { src: "/home/Group 13.png", alt: "Card 1" },
    { src: "/home/Group 9.png", alt: "Card 2" },
    { src: "/home/Group 10.png", alt: "Card 3" },
    { src: "/home/Group 11.png", alt: "Card 4" },
    { src: "/home/Group 12.png", alt: "Card 5" }
  ];

  let sectionEl;
  let horizontalEl;
  let lenis;
  let tickerFn;
  let horizontalTween;
  let cardTweens = [];

  onMount(async () => {
    const gsapModule = await import("gsap");
    const scrollTriggerModule = await import("gsap/ScrollTrigger");
    const lenisModule = await import("lenis");

    const gsap = gsapModule.default || gsapModule.gsap;
    const ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default;
    const Lenis = lenisModule.default;

    gsap.registerPlugin(ScrollTrigger);

    lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    tickerFn = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    horizontalTween = gsap.to(horizontalEl, {
      x: () => -(horizontalEl.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: horizontalEl,
        start: "center center",
        end: () => "+=" + horizontalEl.scrollWidth,
        pin: sectionEl,
        scrub: true,
        invalidateOnRefresh: true
      }
    });

    horizontalEl.querySelectorAll(".card").forEach((card) => {
      const tween = gsap.from(card, {
        x: 250,
        duration: 0.6,
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          toggleActions: "play none none reverse"
        }
      });

      cardTweens.push(tween);
    });

    return () => {
      horizontalTween?.scrollTrigger?.kill();
      horizontalTween?.kill();

      cardTweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });

      gsap.ticker.remove(tickerFn);
      lenis?.destroy();
    };
  });
</script>

<section id="horizontal-scroll" bind:this={sectionEl}>
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
    padding: 160px 0;
  }

  .horizontal-scroll-wrapper {
    overflow: hidden;
    height: 100dvh;
    background-image: url("/home/gradient-texture.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
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
    width: 34%;
    height: 320%;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.42) 48%,
      rgba(255, 255, 255, 0) 100%
    );
    transform: translateX(0) rotate(14deg);
    opacity: 0;
    transition: transform 700ms cubic-bezier(0.2, 0.7, 0.2, 1), opacity 260ms ease;
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
      box-shadow: 0 24px 45px rgba(28, 72, 46, 0.26), 0 0 0 1px rgba(255, 255, 255, 0.22);
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
</style>