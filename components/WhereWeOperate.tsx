"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import africaPng from "../image/body/vecteezy_africa.png";

type GSAPType = any;

async function loadGsap(): Promise<{ gsap: GSAPType | null; ScrollTrigger: any | null }> {
  try {
    const g = await import("gsap");
    const st = await import("gsap/ScrollTrigger");
    (g as any).default?.registerPlugin(st.ScrollTrigger);
    return { gsap: (g as any).default ?? (g as any), ScrollTrigger: st.ScrollTrigger };
  } catch {
    return { gsap: null, ScrollTrigger: null };
  }
}

export default function WhereWeOperate() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;
    let ctx: any; let st: any; let killed = false;
    (async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (!gsap || !ScrollTrigger || killed) return;
      const root = sectionRef.current!;
      const wrap = mapWrapRef.current!;
      ctx = gsap.context(() => {
        const map = wrap.querySelector('.wm-map');
        const spot = wrap.querySelector('.wm-spotlight');
        if (!map) return;
        gsap.set(map, { opacity: 0, y: 12, scale: 0.98, xPercent: 8, transformOrigin: '60% 50%', willChange: 'transform,filter' });
        if (spot) gsap.set(spot, { xPercent: -6, opacity: 0.22 });
        // Smooth entrance (no parallax)
        gsap.to(map, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: root, start: 'top 85%' } });
        // Subtle idle animation on the map (premium but calm)
        gsap.to(map, { y: "+=4", duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to(map, { scale: 1.02, duration: 4.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to(map, { rotation: 0.25, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '60% 50%' });
        // Subtle spotlight sweep (idle)
        if (spot) {
          gsap.to(spot, { xPercent: 12, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1 });
          gsap.to(spot, { opacity: 0.12, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        }
      }, sectionRef);
    })();
    return () => { killed = true; try { st?.kill(); } catch {} try { ctx?.revert(); } catch {} };
  }, []);
  return (
    <section id="where-we-operate" className="where-we-operate section" aria-label="Where we operate" ref={sectionRef}>
      <div className="wm-overlay" aria-hidden="true" />
      <div className="container wm-grid">
        <div className="wm-copy">
          <div className="wm-badge" aria-hidden="true">🌍</div>
          <h2 className="wm-title">Où nous opérons</h2>
          <p className="wm-body">
            Nous intervenons à travers l’Afrique de l’Ouest et l’Afrique Centrale —
            de la conception au déploiement jusqu’à la maintenance — pour livrer des réseaux
            fiables, sécurisés et performants aux opérateurs et aux entreprises.
          </p>
          <a href="#contact" className="wm-cta">
            Nous contacter
            <span className="icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12h12M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
        <div className="wm-illus">
          <div className="wm-map-wrap" ref={mapWrapRef}>
            <div className="wm-spotlight" aria-hidden="true" />
            <Image
              src={africaPng}
              alt="Carte de l’Afrique illustrant notre présence"
              className="wm-map"
              sizes="(min-width: 1280px) 840px, (min-width: 768px) 62vw, 90vw"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
