"use client";
import { useEffect } from "react";

type GSAPType = any;

function waitForGsap(timeoutMs = 1200): Promise<{ gsap: GSAPType; ScrollTrigger: any } | null> {
  return new Promise((resolve) => {
    const start = Date.now();
    const tick = () => {
      const gsap = (window as any).gsap;
      const ScrollTrigger = (window as any).ScrollTrigger;
      if (gsap && ScrollTrigger) return resolve({ gsap, ScrollTrigger });
      if (Date.now() - start > timeoutMs) return resolve(null);
      requestAnimationFrame(tick);
    };
    tick();
  });
}

export default function InterSectionParallax() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    let ctx: any | undefined;
    let killed = false;

    (async () => {
      const found = await waitForGsap();
      if (!found || killed) return;
      const { gsap } = found;

      const whSection = document.querySelector<HTMLElement>('#welcome-health');
      const rlSection = document.querySelector<HTMLElement>('#realisations');
      const whWrap = document.querySelector<HTMLElement>('#welcome-health .wh-image-centered-wrap');
      const rlBg = document.querySelector<HTMLElement>('#realisations .rl-bg');

      if (!whSection || !rlSection) return;

      ctx = gsap.context(() => {
        // Create a scroll range from when Realisations starts entering the viewport
        // until it reaches the top, animating both sections for a subtle parallax handoff.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rlSection,
            start: 'top bottom',
            end: 'top top',
            scrub: 1,
          }
        });

        // WelcomeHealth moves slightly slower up, its central image a bit more.
        if (whSection) tl.fromTo(whSection, { yPercent: 0 }, { yPercent: -8, ease: 'none' }, 0);
        if (whWrap) tl.fromTo(whWrap, { yPercent: 0 }, { yPercent: -20, ease: 'none' }, 0);

        // Realisations comes in a touch faster to enhance depth.
        if (rlSection) tl.fromTo(rlSection, { yPercent: 6 }, { yPercent: 0, ease: 'none' }, 0);

        // Optional: fade in Realisations background for a soft crossfade.
        if (rlBg) tl.fromTo(rlBg, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0.05);
      });
    })();

    return () => {
      killed = true;
      try { ctx?.revert(); } catch {}
    };
  }, []);

  return null;
}
