"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import africaPng from "../image/body/vecteezy_africa.png";
import { gsapCore, isReducedMotion } from "@/lib/gsap";

export default function WhereWeOperate() {
  const sectionRef = useRef<HTMLElement>(null);
  const mapWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    let ctx: any; let killed = false;
    (async () => {
      const { gsap, ScrollTrigger } = await gsapCore();
      if (!gsap || !ScrollTrigger || killed) return;
      const root = sectionRef.current!;
      const wrap = mapWrapRef.current!;
      ctx = gsap.context(() => {
        const map = wrap.querySelector('.wm-map');
        const spot = wrap.querySelector('.wm-spotlight');
        if (!map) return;
        gsap.set(map, { opacity: 0, y: 12, scale: 0.98, xPercent: 8, transformOrigin: '60% 50%' });
        if (spot) gsap.set(spot, { xPercent: -6, opacity: 0.22 });
        // Smooth entrance (no parallax)
        gsap.to(map, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: root, start: 'top 85%' } });
        // Idle motion discipline: create paused loops, toggle when in view
        const idleTweens: any[] = [];
        idleTweens.push(gsap.to(map, { y: "+=4", duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true }));
        idleTweens.push(gsap.to(map, { scale: 1.02, duration: 4.8, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true }));
        idleTweens.push(gsap.to(map, { rotation: 0.25, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '60% 50%', paused: true }));
        if (spot) {
          idleTweens.push(gsap.to(spot, { xPercent: 12, duration: 6, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true }));
          idleTweens.push(gsap.to(spot, { opacity: 0.12, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true }));
        }
        // Toggle play/pause and will-change when section is in view
        const idleCtrl = ScrollTrigger.create({
          trigger: root,
          start: 'top 90%',
          end: 'bottom 10%',
          onEnter: () => { gsap.set([map, spot].filter(Boolean) as Element[], { willChange: 'transform' }); idleTweens.forEach(t => t.resume()); },
          onEnterBack: () => { gsap.set([map, spot].filter(Boolean) as Element[], { willChange: 'transform' }); idleTweens.forEach(t => t.resume()); },
          onLeave: () => { idleTweens.forEach(t => t.pause()); gsap.set([map, spot].filter(Boolean) as Element[], { willChange: 'auto' }); },
          onLeaveBack: () => { idleTweens.forEach(t => t.pause()); gsap.set([map, spot].filter(Boolean) as Element[], { willChange: 'auto' }); },
        });
      }, sectionRef);
    })();
    return () => { killed = true; try { ctx?.revert(); } catch {} };
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
            <div className="wm-spotlight" aria-hidden="true" data-animate="spotlight" />
            <Image
              src={africaPng}
              alt="Carte de l’Afrique illustrant notre présence"
              className="wm-map"
              sizes="(min-width: 1280px) 840px, (min-width: 768px) 62vw, 90vw"
              loading="lazy"
              data-animate="map"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
