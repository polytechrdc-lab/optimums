"use client";
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import mainImg from '../image/body/t1.jpg';
import smallAImg from '../image/body/2.jpg';
import smallBImg from '../image/body/3.webp';

export default function ATIntro() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [plx, setPlx] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Subtle parallax for accent bar/placard only (images stay fixed)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) return;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: -1 (far above) to 1 (far below)
      const center = r.top + r.height / 2;
      const delta = (center - vh / 2) / vh; // -0.5..0.5 typical
      const offset = Math.max(-12, Math.min(12, -delta * 24)); // clamp to ~±12px
      setPlx(offset * 0.85);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);

  return (
    <section ref={ref} className="section at-intro at-size-xs at-compact" aria-label="Solutions Optimum" style={{ ['--plx' as any]: `${plx}px` }}>
      <div className="container at-grid">
        {/* Single image center with parallax */}
        <div className={`at-collage ${visible ? 'is-visible' : ''}`}>
          <div className="at-canvas" aria-hidden="true">
            <div className="at-parallax at-reveal" style={{ ['--delay' as any]: '80ms' }}>
              <Image
                src={smallBImg}
                alt="Infrastructure — visuel principal"
                fill
                priority
                sizes="(min-width: 1280px) 1020px, (min-width: 768px) 900px, 90vw"
                className="img"
              />
            </div>
          </div>
        </div>

        {/* Right copy */}
        <div className="at-copy">
          <div className="at-dots" aria-hidden="true" />
          <h2 className="at-title">Solutions d’infrastructure, simples et efficaces</h2>
          <p className="at-lead">
            Déploiement, énergie, supervision: nous sécurisons la performance de vos réseaux
            avec des équipes locales et des délais maîtrisés.
          </p>
          <a href="#solutions" className="at-link" aria-label="En savoir plus sur nos solutions">
            <span className="label">En savoir plus</span>
            <span className="icon" aria-hidden>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2"/><path d="M8 12h8M12 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
