"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import t1 from "../image/body/1.webp";
import t3 from "../image/body/3.webp";
// Using two layers: 1.webp (L1) and 3.webp (L2)

type GSAPType = any;

async function loadGsap(): Promise<{ gsap: GSAPType | null; ScrollTrigger: any | null }> {
  try {
    const g = await import("gsap");
    const st = await import("gsap/ScrollTrigger");
    (g as any).default?.registerPlugin(st.ScrollTrigger);
    return { gsap: (g as any).default ?? (g as any), ScrollTrigger: st.ScrollTrigger };
  } catch (_) {
    // Fallback to CDN if package not installed
    const loadScript = (src: string) => new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src; s.async = true; s.onload = () => resolve(); s.onerror = () => reject();
      document.head.appendChild(s);
    });
    try {
      // Only append if not already present
      if (!(window as any).gsap) {
        await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js");
      }
      if (!(window as any).ScrollTrigger) {
        await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js");
      }
      const gsap = (window as any).gsap ?? null;
      const ScrollTrigger = (window as any).ScrollTrigger ?? null;
      if (gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    } catch (e) {
      console.warn("GSAP failed to load", e);
      return { gsap: null, ScrollTrigger: null };
    }
  }
}

export default function PostHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      // Ensure everything is visible without animation
      sectionRef.current?.querySelectorAll("[data-anim]").forEach(el => {
        (el as HTMLElement).style.transform = "none";
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.clipPath = "none";
      });
      return; // Skip animations
    }

    let ctx: any;
    let st: any;
    let killed = false;
    (async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (!gsap || !ScrollTrigger || killed) return;
      st = ScrollTrigger;

      const sec = sectionRef.current;
      if (!sec) return;

      ctx = gsap.context(() => {
        const mm = ScrollTrigger.matchMedia;

        // Shared elements
        const title = sec.querySelector(".ph-title");
        const deck = sec.querySelector(".ph-deck");
        const ctas = sec.querySelector(".ph-ctas");
        const l1 = sec.querySelector(".ph-layer-1");
        const l2 = sec.querySelector(".ph-layer-2");
        const badge = sec.querySelector(".ph-badge");

        gsap.set([title, deck, ctas, badge], { opacity: 0, y: 32 });
        gsap.set([l1, l2], { willChange: "transform", rotate: 0.001 });
        gsap.set(l1, { transformOrigin: "50% 50%" });
        gsap.set([l1, l2], { opacity: 1 });

        const base = {
          trigger: sec,
          start: "top top",
          end: "+=300%",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        } as const;

        // Timeline for text reveals and parallax layers
        mm({
          // Desktop
          "(min-width: 1024px)": () => {
            const tl = gsap.timeline({ scrollTrigger: { ...base } });

            // Intro text reveal
            tl.to(title, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.05)
              .to(deck, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.15)
              .to(badge, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.20)
              .to(ctas, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 0.30);

            // Parallax motion + top image zoom
            tl.to(l1, { yPercent: -15, ease: "none" }, 0)
              .to(l2, { yPercent: -36, scale: 1.06, ease: "none" }, 0)
              .fromTo(l1, { scale: 1.0 }, { scale: 1.32, ease: "none" }, 0);

            // Midway mask/reveal style accent sweep
            tl.fromTo(".ph-accent", { clipPath: "inset(0 100% 0 0 round 14px)" },
              { clipPath: "inset(0 0% 0 0 round 14px)", ease: "power2.out", duration: 0.8 }, 0.35);

            // Outro: gently ease out text to mimic kinetic cadence
            tl.to([title, deck, badge, ctas], { y: -24, opacity: 0.92, duration: 0.6, ease: "power1.out" }, 0.65);
          },

          // Tablet
          "(min-width: 640px) and (max-width: 1023px)": () => {
            const tl = gsap.timeline({ scrollTrigger: { ...base, end: "+=260%" } });
            tl.to(title, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.05)
              .to(deck, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.12)
              .to(ctas, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.2)
              .to(l1, { yPercent: -14, ease: "none" }, 0)
              .to(l2, { yPercent: -32, scale: 1.05, ease: "none" }, 0)
              .fromTo(l1, { scale: 1.0 }, { scale: 1.24, ease: "none" }, 0)
              .fromTo(".ph-accent", { clipPath: "inset(0 100% 0 0 round 12px)" }, { clipPath: "inset(0 0% 0 0 round 12px)", duration: 0.7, ease: "power2.out" }, 0.3);
          },

          // Mobile
          "(max-width: 639px)": () => {
            const tl = gsap.timeline({ scrollTrigger: { ...base, end: "+=220%" } });
            tl.to(title, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.05)
              .to(deck, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.12)
              .to(ctas, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.18)
              .to(l1, { yPercent: -10, ease: "none" }, 0)
              .to(l2, { yPercent: -24, scale: 1.04, ease: "none" }, 0)
              .fromTo(l1, { scale: 1.0 }, { scale: 1.18, ease: "none" }, 0)
              .fromTo(".ph-accent", { clipPath: "inset(0 100% 0 0 round 10px)" }, { clipPath: "inset(0 0% 0 0 round 10px)", duration: 0.6, ease: "power2.out" }, 0.26);
          },
        });
      }, sectionRef);
    })();

    return () => {
      killed = true;
      try { st?.kill(); } catch {}
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
      <div className="container ph-grid">
        <div className="ph-copy" data-anim>
          <div className="ph-badge" aria-hidden="true">Depuis 2009</div>
          <h2 className="ph-title">Concevoir, déployer et maintenir à l’échelle.</h2>
          <p className="ph-deck">
            Une équipe multidisciplinaire pour livrer rapidement des infrastructures
            télécoms fiables, optimisées et sécurisées.
          </p>
          <div className="ph-ctas">
            <a href="#services" className="btn btn-primary">Nos services</a>
            <a href="#contact" className="btn btn-secondary">Parler à un expert</a>
          </div>
        </div>

        <div className="ph-visual">
          <div className="ph-accent u-noise-mask" aria-hidden="true" />
          <div className="ph-layer ph-layer-1" data-anim>
            <Image src={t1} alt="" fill sizes="(min-width: 1024px) 600px, 50vw" priority className="ph-img" />
          </div>
          <div className="ph-layer ph-layer-2" data-anim>
            <Image src={t3} alt="" fill sizes="(min-width: 1024px) 480px, 45vw" className="ph-img" />
          </div>
          {/* Third layer removed */}
        </div>
      </div>
    </section>
  );
}
