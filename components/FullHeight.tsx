"use client";
import { useEffect, useRef } from 'react';
import Image from 'next/image';
// Images pour la pile multi-calques
import imgA from '../image/body/paysage.jpg'; // Paysage (milieu)
import imgB from '../image/body/t2.jpg'; // Tour (petite, avant-plan)
import imgC from '../image/body/satisfied-customer.jpg'; // Satisfied customer (grand fond, carré)
// Badge décoratif
import worldSvg from '../image/body/world-minified.svg?url';

export default function FullHeight() {
  const sectionRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const layerCRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reduceMotion = () => mq.matches;

    const onScroll = () => {
      const holder = sectionRef.current;
      const stack = stackRef.current;
      const A = layerARef.current;
      const B = layerBRef.current;
      const C = layerCRef.current;
      if (!holder || !stack || !A || !B || !C) return;

      const rect = holder.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const vw = window.innerWidth || 1024;

      // Progress through the section [0..1]
      const denom = vh + rect.height || 1;
      const raw = (vh - rect.top) / denom;
      const progress = Math.max(0, Math.min(1, raw));

      // Base reposition (eat vertical gap, push right)
      const baseShiftY = vw < 768 ? 12 : vw < 1200 ? 64 : 120;
      const baseShiftX = vw < 768 ? 4 : vw < 1200 ? 16 : 40;
      stack.style.transform = `translate(${baseShiftX}px, ${-baseShiftY}px)`;

      // Container dimensions per breakpoint (acceptance sizing)
      const cont = stack.parentElement as HTMLDivElement;
      const isMobile = vw < 768;
      const isTablet = vw >= 768 && vw < 1280;
      const isDesktop = vw >= 1280;
      if (cont) {
        cont.style.width = isDesktop ? '720px' : isTablet ? '600px' : '360px';
        cont.style.height = isDesktop ? '560px' : isTablet ? '520px' : '420px';
        cont.style.overflow = 'visible';
        cont.style.borderRadius = '24px';
      }

      // Layer A — Fond (satisfied-customer) square inside container
      const aContW = isDesktop ? 720 : isTablet ? 600 : 360;
      const aContH = isDesktop ? 560 : isTablet ? 520 : 420;
      const aSide = Math.min(aContH, aContW); // square side
      const aW = aSide;
      const aH = aSide;
      Object.assign(A.style, {
        width: `${aW}px`,
        height: `${aH}px`,
        left: '0',
        top: '0',
        right: 'auto',
        bottom: 'auto',
        borderRadius: '24px',
        zIndex: '1',
      });

      // Layer B — Milieu (paysage), 50% width of A, shifted left by 30% of its width
      const b2W = Math.round(aW * 0.5); // 50%
      const b2H = Math.round(b2W * (2 / 3)); // ~3:2
      const b2Top = isDesktop ? 64 : isTablet ? 48 : 24;
      const b2Shift = Math.round(b2W * 0.3); // 30% left translate
      Object.assign(B.style, {
        width: `${b2W}px`,
        height: `${b2H}px`,
        left: '0',
        top: `${b2Top}px`,
        right: 'auto',
        bottom: 'auto',
        borderRadius: '24px',
        zIndex: '2',
        transform: `translate(${-b2Shift}px, 0)`
      });

      // Layer C — Petite (tour), ~28% of A on desktop; tablet 26%; mobile 36%
      const cPct = isDesktop ? 0.28 : isTablet ? 0.26 : 0.36;
      const cW = Math.round(aW * cPct);
      const cH = isDesktop ? 280 : isTablet ? 220 : 180;
      const cTop = isDesktop ? 16 : isTablet ? 12 : 8;
      const cLeft = isDesktop ? 48 : isTablet ? 36 : 16;
      const cBorder = isDesktop ? 8 : isTablet ? 6 : 4;
      Object.assign(C.style, {
        width: `${cW}px`,
        height: `${cH}px`,
        left: `${cLeft}px`,
        top: `${cTop}px`,
        right: 'auto',
        bottom: 'auto',
        borderRadius: '24px',
        zIndex: '3',
        border: `${cBorder}px solid #fff`,
      });

      // Parallax movements (translateY only). Disable on reduced motion.
      const aMove = reduceMotion() ? 0 : (progress - 0.5) * 2 * (isDesktop ? 30 : isTablet ? 25 : 20);
      const bMove = reduceMotion() ? 0 : (progress - 0.5) * 2 * (isDesktop ? 60 : isTablet ? 55 : 50);
      const cMove = reduceMotion() ? 0 : (progress - 0.5) * 2 * (isDesktop ? 100 : isTablet ? 90 : 80);
      // Apply translates, preserving X translate for B (left shift)
      B.style.transform = `translate(${-b2Shift}px, ${bMove.toFixed(1)}px)`;
      A.style.transform = `translate(0, ${aMove.toFixed(1)}px)`;
      C.style.transform = `translate(0, ${cMove.toFixed(1)}px)`;
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
    <section ref={sectionRef} className="full-hero" aria-label="Section pleine hauteur">
      <div className="container wm-grid">
        {/* Copy block (left), centered */}
        <div className="wm-copy wm-reveal wm-copy-center">
          {/* Decorative SVG placed above the text */}
          <div className="wm-badge" aria-hidden>
            <img src={worldSvg} alt="" width={44} height={44} style={{ display: 'block' }} />
          </div>
          <p className="wm-body">
            Relier les communautés et créer des opportunités — notre mission est de connecter
            durablement les personnes et les entreprises grâce à des infrastructures fiables et
            accessibles, afin de développer les marchés et soutenir la croissance locale.
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
        {/* Illustration — pile multi-calques avec parallaxe */}
        <div className="wm-illus" aria-hidden={false}>
          <div
            className="wm-map-wrap"
            style={{
              position: 'relative',
              width: '620px',
              maxWidth: '100%',
              height: '560px',
              borderRadius: 24,
              marginRight: '-16px',
              overflow: 'visible',
            }}
          >
            <div ref={stackRef} style={{ position: 'absolute', inset: 0 }}>
              {/* Calque A — Fond (satisfied-customer) */}
              <div ref={layerARef} style={{ position: 'absolute', zIndex: 1, overflow: 'hidden', borderRadius: 24 }}>
                <Image
                  src={imgC}
                  alt=""
                  fill
                  sizes="(max-width: 1279px) 520px, 560px"
                  priority
                  style={{ objectFit: 'cover', objectPosition: '55% 50%' }}
                />
              </div>
              {/* Calque B — Milieu (paysage) */}
              <div ref={layerBRef} style={{ position: 'absolute', zIndex: 2, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', borderRadius: 24 }}>
                <Image
                  src={imgA}
                  alt="Paysage"
                  fill
                  sizes="(max-width: 1279px) 300px, 360px"
                  priority
                  style={{ objectFit: 'cover', objectPosition: '50% 50%' }}
                />
              </div>
              {/* Calque C — Avant-plan (tour, vignette) */}
              <div ref={layerCRef} style={{ position: 'absolute', zIndex: 3, overflow: 'visible', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', borderRadius: 24 }}>
                <Image
                  src={imgB}
                  alt="Tour de télécommunication"
                  fill
                  sizes="(max-width: 1279px) 156px, 200px"
                  priority
                  style={{ objectFit: 'cover', objectPosition: '50% 35%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
