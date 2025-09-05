"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
// Calques
import imgLandscape from '../image/body/paysage.jpg';
import imgPortrait from '../image/body/t2.jpg';
import imgBackground from '../image/body/satisfied-customer.jpg';

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export default function FullHeight() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);
  const vbarRef = useRef<HTMLDivElement>(null);
  const hbarRef = useRef<HTMLDivElement>(null);

  // Mirror disposition (false = AT baseline, true = flipped)
  const MIRROR = true;

  const [bp, setBp] = useState<Breakpoint>('desktop');
  const [dims, setDims] = useState({ W: 620, H: 480 });
  const [plx, setPlx] = useState({ a: 0, b: 0, c: 0 });

  // Compute breakpoint + wrapper dims
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth || 1280;
      const nextBp: Breakpoint = w < 768 ? 'mobile' : w < 1280 ? 'tablet' : 'desktop';
      setBp(nextBp);
      if (nextBp === 'desktop') setDims({ W: 620, H: 480 });
      else if (nextBp === 'tablet') setDims({ W: 520, H: 420 });
      else {
        const cw = wrapperRef.current?.parentElement?.clientWidth ?? Math.min(480, w - 24);
        const H = Math.max(420, Math.min(460, Math.round((cw || 360) * 0.72)));
        setDims({ W: cw || 360, H });
      }
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Layout: positions and sizes per spec (percent of W/H)
  useEffect(() => {
    const wrap = wrapperRef.current;
    const A = bgRef.current; // fond
    const B = midRef.current; // paysage
    const C = fgRef.current; // portrait
    const VB = vbarRef.current; // barre verticale
    const HB = hbarRef.current; // barre horizontale
    if (!wrap || !A || !B || !C || !VB || !HB) return;

    // Ensure mobile width uses container width
    if (bp === 'mobile') {
      const contW = wrap.parentElement?.clientWidth ?? dims.W;
      if (Math.abs(contW - dims.W) > 2) {
        setDims(d => ({ ...d, W: contW }));
      }
    }

    const { W, H } = dims;
    const radius = 12; // rayon d'angle unifié (12–16px)
    const bar = bp === 'desktop' ? 16 : bp === 'tablet' ? 14 : 12;

    // Wrapper — keep internal unchanged; only adjust outer placement/bleed
    // Compute right bleed with safe-area (desktop only): +40..+64px, safe-area ≥16px
    let bleedX = 0;
    if (bp === 'desktop') {
      const parent = wrap.parentElement as HTMLElement | null; // .wm-illus
      const pr = parent?.getBoundingClientRect();
      const vw = window.innerWidth || 1280;
      const spaceRight = pr ? Math.max(0, vw - pr.right) : 0; // gap between parent right and viewport right
      const maxBleed = Math.max(0, spaceRight - 16); // respect 16px safe-area
      // Prefer 40–64px, but do not exceed maxBleed (safe-area wins over min bleed)
      bleedX = Math.min(64, maxBleed);
    } else if (bp === 'tablet') {
      // Tablet: +24..+32px, but keep 16px safe-area
      const parent = wrap.parentElement as HTMLElement | null;
      const pr = parent?.getBoundingClientRect();
      const vw = window.innerWidth || 1024;
      const spaceRight = pr ? Math.max(0, vw - pr.right) : 0;
      const maxBleed = Math.max(0, spaceRight - 16);
      bleedX = Math.min(32, maxBleed);
    } else {
      bleedX = 0; // no bleed on mobile
    }

    Object.assign(wrap.style, {
      position: 'relative',
      width: bp === 'mobile' ? '100%' : `${W}px`,
      height: `${H}px`,
      overflow: 'visible',
      borderRadius: `${radius}px`,
      right: `${-bleedX}px`, // bleed to the right without creating a new stacking context
    });

    // Calque 1 — GRAND FOND (remplit le wrapper)
    Object.assign(A.style, {
      position: 'absolute', inset: '0', zIndex: '1', overflow: 'hidden', borderRadius: `${radius}px`,
    } as any);

    // Calque 2 — MILIEU (paysage) — plus petit, équilibré
    const bPct = bp === 'desktop' ? 0.62 : bp === 'tablet' ? 0.58 : 0.66; // largeur
    const bGrow = 1.25; // +25% vers la droite (garde l'ancrage côté gauche/droit)
    const bW = Math.round(bPct * W * bGrow);
    // Base height for ~21:9, doubled then reduced by 25% per request
    const bH = Math.round((bW * 0.42) * 2 * 0.75);
    const bLeft = !MIRROR ? Math.round(-0.08 * W) : undefined;
    const bRight = MIRROR ? Math.round(-0.08 * W) : undefined;
    const bBottom = Math.round((bp === 'desktop' ? -0.05 : bp === 'tablet' ? -0.04 : -0.03) * H);
    Object.assign(B.style, {
      position: 'absolute',
      width: `${bW}px`,
      height: `${bH}px`,
      left: bLeft !== undefined ? `${bLeft}px` : 'auto',
      right: bRight !== undefined ? `${bRight}px` : 'auto',
      bottom: `${bBottom}px`,
      zIndex: '2',
      overflow: 'hidden',
      borderRadius: `${radius}px`,
      // Soft edge blending via mask to help the "glide" feel
      WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 10%, #000 90%, rgba(0,0,0,0) 100%)',
      maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, #000 10%, #000 90%, rgba(0,0,0,0) 100%)',
      WebkitMaskSize: '100% 100%',
      maskSize: '100% 100%',
    } as any);

    // Calque 3 — PETIT PORTRAIT
    const cPct = bp === 'desktop' ? 0.28 : bp === 'tablet' ? 0.26 : 0.40; // largeur
    const cW = Math.round(cPct * W);
    const cH = Math.round(cW * 1.33);
    const anchorPct = bp === 'desktop' ? 0.56 : bp === 'tablet' ? 0.54 : 0.52; // pos. from side
    const cLeft = !MIRROR ? Math.round(anchorPct * W) : undefined;
    const cRight = MIRROR ? Math.round(anchorPct * W) : undefined;
    const cBottom = Math.round((bp === 'desktop' ? -0.03 : bp === 'tablet' ? -0.03 : -0.02) * H);
    Object.assign(C.style, {
      position: 'absolute',
      width: `${cW}px`,
      height: `${cH}px`,
      left: cLeft !== undefined ? `${cLeft}px` : 'auto',
      right: cRight !== undefined ? `${cRight}px` : 'auto',
      bottom: `${cBottom}px`,
      zIndex: '3',
      overflow: 'hidden',
      borderRadius: `${radius}px`,
      boxShadow: '0 8px 20px rgba(0,0,0,0.10)',
    } as any);

    // Barres de marque (derrière tout)
    const vHeight = Math.round((bp === 'desktop' ? 0.84 : 0.82) * H);
    const vTop = Math.round(0.08 * H);
    Object.assign(VB.style, {
      position: 'absolute',
      width: `${bar}px`,
      height: `${vHeight}px`,
      top: `${vTop}px`,
      left: `${-bar}px`,
      right: 'auto',
      zIndex: '0',
      background: 'var(--brandPrimary, #E30613)',
      borderRadius: '0',
      boxShadow: 'none',
    } as any);

    const hWidth = Math.round((bp === 'desktop' ? 0.22 : bp === 'tablet' ? 0.20 : 0.18) * W);
    const hBottom = -bar;
    Object.assign(HB.style, {
      position: 'absolute',
      height: `${bar}px`,
      width: `${hWidth}px`,
      bottom: `${hBottom}px`,
      right: `${-bar}px`,
      zIndex: '0',
      background: 'var(--brandPrimary, #E30613)',
      borderRadius: '0',
      boxShadow: 'none',
    } as any);
  }, [bp, dims, MIRROR]);

  // Parallaxe (translateY uniquement) — subtile, fenêtre = hauteur de section
  useEffect(() => {
    const el = sectionRef.current;
    const A = bgRef.current;
    const B = midRef.current;
    const C = fgRef.current;
    if (!el || !A || !B || !C) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onScroll = () => {
      if (reduce.matches) {
        A.style.transform = 'none';
        B.style.transform = 'none';
        C.style.transform = 'none';
        setPlx({ a: 0, b: 0, c: 0 });
        return;
      }
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const denom = r.height + vh;
      const raw = (vh - r.top) / (denom || 1);
      const p = Math.max(0, Math.min(1, raw));
      // Dynamic amplitudes proportional to layer heights (half-range, total travel ≈ 2*amp)
      const Ah = A.getBoundingClientRect().height || 1;
      const Bh = B.getBoundingClientRect().height || 1;
      const Ch = C.getBoundingClientRect().height || 1;
      // Increase motion slightly for a snappier feel
      // Back (hero): ~10–16% total travel of its height
      const ampA = Math.round(Ah * (bp === 'mobile' ? 0.05 : bp === 'tablet' ? 0.07 : 0.08));
      // Middle (landscape): ~45–68% total travel of its height
      const ampB = Math.round(Bh * (bp === 'mobile' ? 0.26 : bp === 'tablet' ? 0.28 : 0.34));
      // Front card: minimal (pinned feel) ~6–8% → slightly more, but still subtle
      const ampC = Math.round(Ch * (bp === 'mobile' ? 0.032 : bp === 'tablet' ? 0.036 : 0.038));
      // Use smoothstep S-curve for all layers so the band visibly glides
      // between the slower background and faster vignette.
      // smoothstep: s = 3x^2 - 2x^3 (x in [0,1]) then center to [-1,1]
      const x = p;
      const s = 3 * x * x - 2 * x * x * x;
      const sCentered = (s - 0.5) * 2; // [-1,1]
      const tA = sCentered * ampA;       // slowest
      const tB = sCentered * (ampB * 1.1); // mid, slight boost to emphasize glide
      const tC = sCentered * ampC;       // fastest
      A.style.transform = `translateY(${tA.toFixed(1)}px)`;
      B.style.transform = `translateY(${tB.toFixed(1)}px)`;
      C.style.transform = `translateY(${tC.toFixed(1)}px)`;
      setPlx({ a: tA, b: tB, c: tC });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true } as any);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [bp]);

  const sizesMid = useMemo(() => (
    bp === 'desktop' ? '480px' : bp === 'tablet' ? '378px' : '82vw'
  ), [bp]);
  const sizesFg = useMemo(() => (
    bp === 'desktop' ? '174px' : bp === 'tablet' ? '135px' : '40vw'
  ), [bp]);

  return (
    <section ref={sectionRef} className="full-hero" aria-label="Section collage parallax miroir">
      <div className="container wm-grid">
        <div className="wm-copy wm-reveal wm-copy-center">
          <p className="wm-body">
            Relier les communautés et créer des opportunités — notre mission est de connecter durablement
            les personnes et les entreprises grâce à des infrastructures fiables et accessibles.
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
        <div className="wm-illus" aria-hidden={false}>
          <div ref={wrapperRef}>
            {/* Barres de marque (derrière) */}
            <div ref={vbarRef} />
            <div ref={hbarRef} />
            {/* Calque 1 — GRAND FOND */}
            <div ref={bgRef}>
              <Image
                src={imgBackground}
                alt=""
                fill
                priority
                sizes="(min-width: 1280px) 620px, (min-width: 768px) 520px, 100vw"
                style={{ objectFit: 'cover', objectPosition: '55% 50%' }}
              />
            </div>
            {/* Calque 2 — MILIEU (paysage) */}
            <div ref={midRef}>
              <Image
                src={imgLandscape}
                alt="Bande paysage"
                fill
                priority
                sizes={sizesMid}
                style={{ objectFit: 'cover', objectPosition: '50% 50%' }}
              />
            </div>
            {/* Calque 3 — PETIT PORTRAIT */}
            <div ref={fgRef}>
              <Image
                src={imgPortrait}
                alt="Tour télécom"
                fill
                priority
                sizes={sizesFg}
                style={{ objectFit: 'cover', objectPosition: '50% 38%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

