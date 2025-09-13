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
        const backdrop = sec.querySelector(".ph-backdrop");
        const title = sec.querySelector(".ph-title");
        const deck = sec.querySelector(".ph-deck");
        const ctas = sec.querySelector(".ph-ctas");
        const l1 = sec.querySelector(".ph-layer-1");
        const l2 = sec.querySelector(".ph-layer-2");
        const badge = sec.querySelector(".ph-badge");

        // Keep text static: no reveal animations
        gsap.set([l1, l2], { willChange: "transform", rotate: 0.001 });
        if (backdrop) gsap.set(backdrop, { willChange: "transform", rotate: 0.001, yPercent: 0, scale: 1 });
        gsap.set(l1, { transformOrigin: "50% 50%" });
        gsap.set([l1, l2], { opacity: 1 });

        const base = {
          trigger: sec,
          start: "top top",
          end: "+=120%",
          scrub: true,
        } as const;

        // Timeline for text reveals and parallax layers
        mm({
          // Desktop
          "(min-width: 1024px)": () => {
            const tl = gsap.timeline({ scrollTrigger: { ...base } });

            // Parallax motion + top image zoom
            if (backdrop) tl.to(backdrop, { yPercent: -8, ease: "none" }, 0);
            tl.to(l1, { yPercent: -15, ease: "none" }, 0)
              .to(l2, { yPercent: -36, ease: "none" }, 0);
            // Text remains static; no accent sweep/outro animations
          },

          // Tablet
          "(min-width: 640px) and (max-width: 1023px)": () => {
            const tl = gsap.timeline({ scrollTrigger: { ...base, end: "+=100%" } });
            tl.to(backdrop, { yPercent: -6, ease: "none" }, 0)
              .to(l1, { yPercent: -14, ease: "none" }, 0)
              .to(l2, { yPercent: -32, ease: "none" }, 0);
          },

          // Mobile
          "(max-width: 639px)": () => {
            const tl = gsap.timeline({ scrollTrigger: { ...base, end: "+=90%" } });
            tl.to(backdrop, { yPercent: -4, ease: "none" }, 0)
              .to(l1, { yPercent: -10, ease: "none" }, 0)
              .to(l2, { yPercent: -24, ease: "none" }, 0);
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
      <div className="ph-backdrop backdrop-radial" aria-hidden="true" />
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
