"use client";
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import img1 from '../image/body/1.webp';
// Use bundled SVG as URL for inline <img>
import worldSvg from '../image/body/world-minified.svg?url';

export default function FullHeight() {
  const sectionRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const leftBandRef = useRef<HTMLDivElement>(null);
  const bottomBandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return; // Respect reduced motion

    const onScroll = () => {
      const holder = sectionRef.current;
      const layer = parallaxRef.current;
      const leftBand = leftBandRef.current;
      const bottomBand = bottomBandRef.current;
      if (!holder || !layer) return;

      const rect = holder.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const vw = window.innerWidth || 1024;

      // Progress of the section through the viewport (0 at enter, 1 at exit)
      // Map rect.top from [vh .. -rect.height] -> progress [0..1]
      const denom = vh + rect.height || 1;
      const raw = (vh - rect.top) / denom;
      const progress = Math.max(0, Math.min(1, raw));

      // Move background slower than content. Stronger amplitude by breakpoint.
      const MAX = vw < 768 ? 140 : vw < 1200 ? 200 : 260; // px
      const parallaxY = (progress - 0.5) * 2 * MAX; // [-MAX .. +MAX]

      // Base composition offsets (static reposition) with caps by breakpoint
      const baseShiftY = vw < 768 ? 16 : vw < 1200 ? 72 : 120; // up by px
      const baseShiftX = vw < 768 ? 6 : vw < 1200 ? 16 : 48; // right by px

      // Apply combined transform (right + up + parallax)
      const tx = baseShiftX;
      const ty = -baseShiftY + parallaxY; // negative moves up
      layer.style.transform = `translate(${tx}px, ${ty.toFixed(1)}px)`;

      // Brand bands (left and bottom), fixed thickness per breakpoint
      const thickness = vw < 768 ? 8 : vw < 1200 ? 10 : 12; // px
      const radius = 12; // match wrapper radius
      if (leftBand) {
        leftBand.style.width = `${thickness}px`;
        leftBand.style.height = `100%`;
        leftBand.style.left = `0`;
        leftBand.style.top = `0`;
        leftBand.style.borderTopLeftRadius = `${radius}px`;
        leftBand.style.borderBottomLeftRadius = `${radius}px`;
        leftBand.style.borderTopRightRadius = `0px`;
        leftBand.style.borderBottomRightRadius = `0px`;
        // Share only the parallax (vertical) movement; keep static offset to reveal band
        leftBand.style.transform = `translate(0px, ${parallaxY.toFixed(1)}px)`;
      }
      if (bottomBand) {
        bottomBand.style.height = `${thickness}px`;
        bottomBand.style.width = `100%`;
        bottomBand.style.left = `0`;
        bottomBand.style.bottom = `0`;
        bottomBand.style.borderBottomLeftRadius = `${radius}px`;
        bottomBand.style.borderBottomRightRadius = `${radius}px`;
        bottomBand.style.borderTopLeftRadius = `0px`;
        bottomBand.style.borderTopRightRadius = `0px`;
        // Share only the parallax (vertical) movement
        bottomBand.style.transform = `translate(0px, ${parallaxY.toFixed(1)}px)`;
      }
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
        {/* Illustration — parallax image on the right */}
        <div className="wm-illus" aria-hidden="true">
          <div
            className="wm-map-wrap"
            style={{
              position: 'relative',
              width: '620px', // slightly wider to feel closer to the edge
              maxWidth: '100%',
              height: '460px', // slightly taller vertically
              overflow: 'hidden',
              borderRadius: 12,
              marginRight: '-16px', // nudge closer to the container edge
            }}
          >
            {/* Brand bands behind the image (decorative) */}
            <div
              ref={leftBandRef}
              aria-hidden
              style={{
                position: 'absolute',
                zIndex: 0,
                background: 'var(--primary)',
                pointerEvents: 'none',
              }}
            />
            <div
              ref={bottomBandRef}
              aria-hidden
              style={{
                position: 'absolute',
                zIndex: 0,
                background: 'var(--primary)',
                pointerEvents: 'none',
              }}
            />
            {/* Background layer (parallax) */}
            <div
              ref={parallaxRef}
              style={{
                position: 'absolute',
                inset: 0,
                willChange: 'transform',
                zIndex: 1,
                filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.08))',
              }}
            >
              <Image
                src={img1}
                alt=""
                fill
                sizes="(max-width: 1199px) 85vw, 620px"
                priority
                style={{ objectFit: 'cover', objectPosition: '80% 0%' }}
              />
            </div>
            {/* Overlay removed as requested */}
          </div>
        </div>
      </div>
    </section>
  );
}
