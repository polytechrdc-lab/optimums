"use client";
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import img1 from '../image/body/1.webp';

export default function FullHeight() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return; // Respect reduced motion

    const onScroll = () => {
      const el = parallaxRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Distance of element center from viewport center
      const center = rect.top + rect.height / 2;
      const delta = center - vh / 2;
      // Parallax factor (tweakable). Clamp for stability.
      const offset = Math.max(-60, Math.min(60, -delta * 0.08));
      el.style.transform = `translateY(${offset.toFixed(1)}px)`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true } as any);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section className="full-hero" aria-label="Section pleine hauteur">
      <div className="container wm-grid">
        {/* Copy block (left), centered */}
        <div className="wm-copy wm-reveal wm-copy-center">
          <h2 className="wm-title">Relier les communautés, créer des opportunités</h2>
          <p className="wm-body">
            Notre mission: connecter les personnes et les entreprises grâce à des
            infrastructures fiables et accessibles, pour développer les marchés et
            soutenir la croissance locale.
          </p>
          <a href="#apropos" className="wm-cta" aria-label="En savoir plus sur notre mission">
            <span className="label">En savoir plus sur notre mission</span>
            <span className="icon" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 12h8M12 8l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
        {/* Illustration — parallax image on the right */}
        <div className="wm-illus" aria-hidden="true">
          <div className="wm-map-wrap" style={{ position: 'relative', width: '580px', maxWidth: '100%', height: '380px', overflow: 'hidden', borderRadius: 12 }}>
            <div ref={parallaxRef} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
              <Image
                src={img1}
                alt=""
                fill
                sizes="(max-width: 1199px) 85vw, 580px"
                priority
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
