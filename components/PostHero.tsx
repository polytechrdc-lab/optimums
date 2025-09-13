"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import t1 from "../image/body/1.webp";
import t3 from "../image/body/3.webp";
// Using two layers: 1.webp (L1) and 3.webp (L2)
import { gsapCore, isReducedMotion } from "@/lib/gsap";

export default function PostHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isReducedMotion()) {
      // Ensure everything is visible without animation
      sectionRef.current?.querySelectorAll("[data-anim]").forEach(el => {
        (el as HTMLElement).style.transform = "none";
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.clipPath = "none";
      });
      return; // Skip animations
    }

    let ctx: any;
    let killed = false;
    (async () => {
      const { gsap, ScrollTrigger } = await gsapCore();
      if (!gsap || !ScrollTrigger || killed) return;

      const sec = sectionRef.current;
      if (!sec) return;

      ctx = gsap.context(() => {
        const mm = (ScrollTrigger as any).matchMedia ?? (gsap as any).matchMedia;

        // Shared elements
        const backdrop = sec.querySelector(".ph-backdrop");
        const title = sec.querySelector(".ph-title");
        const deck = sec.querySelector(".ph-deck");
        const ctas = sec.querySelector(".ph-ctas");
        const l1 = sec.querySelector(".ph-layer-1");
        const l2 = sec.querySelector(".ph-layer-2");
        const badge = sec.querySelector(".ph-badge");
        const rlSection = document.querySelector<HTMLElement>('#realisations');

        // Keep text static: no reveal animations
        gsap.set([l1, l2], { willChange: "transform", rotate: 0.001 });
        if (backdrop) gsap.set(backdrop, { willChange: "transform", rotate: 0.001, yPercent: 0, scale: 1 });
        gsap.set(l1, { transformOrigin: "50% 50%" });
        gsap.set([l1, l2], { opacity: 1 });

        // Will-change discipline: enable during scroll through this section only
        const wcTargets = [backdrop, l1, l2].filter(Boolean) as Element[];
        ScrollTrigger.create({
          trigger: sec,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => gsap.set(wcTargets, { willChange: 'transform' }),
          onLeave: () => gsap.set(wcTargets, { willChange: 'auto' }),
          onEnterBack: () => gsap.set(wcTargets, { willChange: 'transform' }),
          onLeaveBack: () => gsap.set(wcTargets, { willChange: 'auto' }),
        });

        const getParallax = (el: Element | null, fallback: number) => {
          if (!el) return fallback;
          const v = parseFloat((el as HTMLElement).getAttribute('data-parallax') || `${fallback}`);
          return Number.isFinite(v) ? v : fallback;
        };
        const pBackdrop = getParallax(backdrop, -8);
        const pL1 = getParallax(l1, -15);
        const pL2 = getParallax(l2, -36);

        const base = {
          trigger: sec,
          start: "top top",
          end: "+=120%",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        } as const;

        // Timeline for text reveals and parallax layers
        mm({
          // Desktop
          "(min-width: 1024px)": () => {
            const tl = gsap.timeline({ scrollTrigger: { ...base } });

            // Parallax motion, values from data-parallax (desktop scale = 1)
            if (backdrop) tl.to(backdrop, { yPercent: pBackdrop, ease: "none" }, 0);
            tl.to(l1, { yPercent: pL1, ease: "none" }, 0)
              .to(l2, { yPercent: pL2, ease: "none" }, 0);
            // Text remains static; no accent sweep/outro animations
            if (rlSection) tl.fromTo(rlSection, { opacity: 0 }, { opacity: 1, ease: 'none', immediateRender: false }, 0.12);
          },

          // Tablet
          "(min-width: 640px) and (max-width: 1023px)": () => {
            const tl = gsap.timeline({ scrollTrigger: { ...base, end: "+=100%" } });
            const k = 0.85;
            tl.to(backdrop, { yPercent: pBackdrop * k, ease: "none" }, 0)
              .to(l1, { yPercent: pL1 * k, ease: "none" }, 0)
              .to(l2, { yPercent: pL2 * k, ease: "none" }, 0);
            if (rlSection) tl.fromTo(rlSection, { opacity: 0 }, { opacity: 1, ease: 'none', immediateRender: false }, 0.12);
          },

          // Mobile
          "(max-width: 639px)": () => {
            const tl = gsap.timeline({ scrollTrigger: { ...base, end: "+=90%" } });
            const k = 0.6;
            tl.to(backdrop, { yPercent: pBackdrop * k, ease: "none" }, 0)
              .to(l1, { yPercent: pL1 * k, ease: "none" }, 0)
              .to(l2, { yPercent: pL2 * k, ease: "none" }, 0);
            if (rlSection) tl.fromTo(rlSection, { opacity: 0 }, { opacity: 1, ease: 'none', immediateRender: false }, 0.12);
          },
        });
      }, sectionRef);
    })();

    return () => {
      killed = true;
      try { ctx?.revert(); } catch {}
    };
  }, []);

  return (
    <section
      id="post-hero"
      aria-label="Aperçu des capacités"
      className="post-hero"
      ref={sectionRef}
    >
      <div className="ph-backdrop backdrop-radial" aria-hidden="true" data-parallax="-8" />
      <div className="container ph-grid">
        <div className="ph-copy" data-anim>
          <div className="ph-badge" aria-hidden="true" data-animate="hero">Depuis 2009</div>
          <h2 className="ph-title" data-animate="hero">Concevoir, déployer et maintenir à l’échelle.</h2>
          <p className="ph-deck" data-animate="hero">
            Une équipe multidisciplinaire pour livrer rapidement des infrastructures
            télécoms fiables, optimisées et sécurisées.
          </p>
          <div className="ph-ctas" data-animate="hero">
            <a href="#services" className="btn btn-primary">Nos services</a>
            <a href="#contact" className="btn btn-secondary">Parler à un expert</a>
          </div>
        </div>

        <div className="ph-visual">
          <div className="ph-accent u-noise-mask" aria-hidden="true" />
          <div className="ph-layer ph-layer-1" data-anim data-parallax="-15">
            <Image src={t1} alt="" fill sizes="(min-width: 1024px) 600px, 50vw" priority className="ph-img" />
          </div>
          <div className="ph-layer ph-layer-2" data-anim data-parallax="-36">
            <Image src={t3} alt="" fill sizes="(min-width: 1024px) 480px, 45vw" className="ph-img" />
          </div>
          {/* Third layer removed */}
        </div>
      </div>
    </section>
  );
}
