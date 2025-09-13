"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import hero from "../image/body/work with us.jpg";
import { gsapCore, isReducedMotion } from "@/lib/gsap";

export default function Carriere() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    let ctx: any; let killed = false;
    (async () => {
      const { gsap, ScrollTrigger } = await gsapCore();
      if (!gsap || !ScrollTrigger || killed) return;
      const root = sectionRef.current!;
      ctx = gsap.context(() => {
        const panel = root.querySelector('.ca-panel');
        const bgImg = root.querySelector('.ca-hero-img');
        const accent = root.querySelector('.ca-accent-bar');

        // Intro reveal
        if (panel) {
          gsap.set(panel, { opacity: 0, y: 18 });
          gsap.to(panel, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', scrollTrigger: { trigger: root, start: 'top 80%', once: true } });
        }
        if (accent) {
          gsap.set(accent, { scaleY: 0, transformOrigin: '50% 0%' });
          gsap.to(accent, { scaleY: 1, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: root, start: 'top 80%', once: true } });
        }
        // Subtle non-pinned parallax: background slower, panel slightly faster upward
        if (bgImg) {
          gsap.to(bgImg, {
            yPercent: -10,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.4,
              onEnter: () => gsap.set(bgImg, { willChange: 'transform' }),
              onLeave: () => gsap.set(bgImg, { willChange: 'auto' }),
              onEnterBack: () => gsap.set(bgImg, { willChange: 'transform' }),
              onLeaveBack: () => gsap.set(bgImg, { willChange: 'auto' })
            }
          });
        }
        if (panel) {
          gsap.to(panel, {
            yPercent: -16,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.4,
              onEnter: () => gsap.set(panel, { willChange: 'transform' }),
              onLeave: () => gsap.set(panel, { willChange: 'auto' }),
              onEnterBack: () => gsap.set(panel, { willChange: 'transform' }),
              onLeaveBack: () => gsap.set(panel, { willChange: 'auto' })
            }
          });
        }
      }, sectionRef);
    })();
    return () => { killed = true; try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section id="carriere" className="carriere-hero" aria-label="Carrière" ref={sectionRef}>
      <div className="ca-hero-bg" aria-hidden="true">
        <Image src={hero} alt="" fill className="ca-hero-img" aria-hidden="true" sizes="100vw" loading="lazy" decoding="async" />
      </div>
      <div className="container ca-hero-wrap">
        <aside className="ca-panel" role="complementary" data-animate="ca-panel">
          <div className="ca-head">
            <span className="ca-accent-bar" aria-hidden="true" />
            <h2 className="ca-title"><span className="ca-title-hl">Construisons les réseaux de demain.</span></h2>
          </div>
          <div className="ca-body">
            <p>Rejoignez une équipe qui conçoit, déploie et opère des infrastructures télécoms à fort impact — avec l’exigence, la sécurité et la qualité comme standards.</p>
            <p>Nous recherchons des profils engagés pour livrer des projets ambitieux, à l’échelle et dans la durée.</p>
          </div>
          <div className="ca-actions">
            <a href="#" className="ca-link">Voir nos offres</a>
          </div>
        </aside>
      </div>
    </section>
  );
}
