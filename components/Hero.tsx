"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
// Use static imports so images always resolve, even outside /public
import tel1 from '../image/hero/tel1.jpg';
import wh from '../image/hero/wh.jpg';
import team from '../image/hero/team.jpg';
import optical from '../image/hero/optical.jpg';

export default function Hero() {
  const [playing, setPlaying] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [fading, setFading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [kbReady, setKbReady] = useState(false);
  const [inView, setInView] = useState(true);
  const heroRef = useRef<HTMLElement>(null);

  // Carousel slides with per-slide messaging (adjust as needed)
  type Slide = {
    src: StaticImageData;
    eyebrow: string;
    title: string;
    deck: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
    pos: string;
    posMobile: string;
    tintTop?: number; tintBottom?: number; dark60?: number; dark100?: number;
    poly?: string; polyOpacity?: number; polyTopMix?: string; polyBottomWash?: string;
  };
  const SLIDES: Slide[] = [
    // Team (people first)
    {
      src: team,
      eyebrow: 'Supervision 24/7',
      title: 'Voir les incidents avant qu’ils n’impactent.',
      deck: 'Monitoring proactif et interventions rapides.',
      primary: { label: 'Supervision', href: '#services-infrastructures-supervision' },
      secondary: { label: 'Parler à un expert', href: '#contact' },
      pos: '68% 50%',
      posMobile: '65% 50%',
      tintTop: 12, tintBottom: 6, dark60: 0.26, dark100: 0.48,
      poly: 'var(--accent)',
      polyOpacity: 0.95, polyTopMix: '82%', polyBottomWash: '6%',
    },
    // Tel1 (tower/site)
    {
      src: tel1,
      eyebrow: 'Réseaux mobiles',
      title: 'Déployer plus vite, maintenir plus sûr.',
      deck: 'Conception, construction et maintenance de sites télécoms clés en main.',
      primary: { label: 'Découvrir', href: '#services-infrastructures-bts' },
      secondary: { label: 'Parler à un expert', href: '#contact' },
      pos: '82% 46%',
      posMobile: '78% 46%',
      tintTop: 12, tintBottom: 6, dark60: 0.32, dark100: 0.58,
      poly: 'var(--brandPrimary)',
      polyOpacity: 0.95, polyTopMix: '85%', polyBottomWash: '4%',
    },
    // Optical (fibre)
    {
      src: optical,
      eyebrow: 'Fibre & Transmission',
      title: 'Reliez vos marchés à très haut débit.',
      deck: 'Études, tirage, raccordement, recette de qualité.',
      primary: { label: 'Découvrir', href: '#services-fibre-optique' },
      secondary: { label: 'Nous contacter', href: '#contact' },
      pos: '58% 50%',
      posMobile: '56% 50%',
      tintTop: 12, tintBottom: 6, dark60: 0.28, dark100: 0.52,
      poly: 'var(--brandPrimary-700)',
      polyOpacity: 0.96, polyTopMix: '88%', polyBottomWash: '2%',
    },
    // WH (énergie)
    {
      src: wh,
      eyebrow: 'Énergie & Power',
      title: 'Alimentation fiable pour vos sites critiques.',
      deck: 'Audits, maintenance et optimisation pour réduire les coûts d’énergie.',
      primary: { label: 'Solutions énergie', href: '#services-energie-maintenance' },
      secondary: { label: 'Parler à un expert', href: '#contact' },
      pos: '72% 52%',
      posMobile: '70% 52%',
      tintTop: 12, tintBottom: 6, dark60: 0.30, dark100: 0.56,
      poly: 'var(--gray)',
      polyOpacity: 0.94, polyTopMix: '80%', polyBottomWash: '8%',
    },
  ];
  const SEGMENTS = SLIDES.length;

  // Reduced motion: stop autoplay transitions
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      if (mq.matches) {
        setPlaying(false);
      }
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // Track mobile breakpoint for focal point switching
  useEffect(() => {
    const m = window.matchMedia('(max-width: 767px)');
    const apply = () => setIsMobile(m.matches);
    apply();
    m.addEventListener('change', apply);
    return () => m.removeEventListener('change', apply);
  }, []);

  // Align hero text start with the brand (logo) left edge in header
  useEffect(() => {
    const updateAlign = () => {
      const headerContainer = document.querySelector('.site-header > .container') as HTMLElement | null;
      const brand = document.querySelector('.site-header a[aria-label="Homepage"]') as HTMLElement | null;
      const heroEl = heroRef.current;
      if (!headerContainer || !brand || !heroEl) return;
      const brandLeft = brand.getBoundingClientRect().left;
      const contLeft = headerContainer.getBoundingClientRect().left;
      const pad = Math.max(0, Math.round(brandLeft - contLeft));
      heroEl.style.setProperty('--hero-align-pad', `${pad}px`);
    };
    updateAlign();
    window.addEventListener('resize', updateAlign);
    return () => window.removeEventListener('resize', updateAlign);
  }, []);

  // Pause Ken Burns when hero not in view or tab hidden; enable after first load
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    let hidden = document.visibilityState === 'hidden';
    const onVis = () => { hidden = document.visibilityState === 'hidden'; };
    document.addEventListener('visibilitychange', onVis);
    let obs: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      obs = new IntersectionObserver(([entry]) => {
        setInView(entry.isIntersecting);
      }, { threshold: 0.01 });
      obs.observe(el);
    }
    return () => { document.removeEventListener('visibilitychange', onVis); obs?.disconnect(); };
  }, []);

  // Simple autoplay for segments; pause on hover/focus handled via playing state
  const goNext = () => {
    setActiveIdx(prev => {
      setPrevIdx(prev);
      setFading(true);
      return (prev + 1) % SEGMENTS;
    });
  };
  const goPrev = () => {
    setActiveIdx(prev => {
      setPrevIdx(prev);
      setFading(true);
      return (prev - 1 + SEGMENTS) % SEGMENTS;
    });
  };

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(goNext, 6000);
    return () => clearInterval(id);
  }, [playing, SEGMENTS]);

  useEffect(() => {
    if (prevIdx === null) return;
    const t = setTimeout(() => { setPrevIdx(null); setFading(false); }, 260);
    return () => clearTimeout(t);
  }, [prevIdx]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === ' ') { e.preventDefault(); setPlaying(p => !p); }
      else if (e.key === 'ArrowRight') { goNext(); }
      else if (e.key === 'ArrowLeft') { goPrev(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <section
      id="hero"
      aria-label="Hero"
      className="hero"
      aria-live="polite"
      ref={heroRef}
      style={{
        // Per-slide overlay tuning via CSS vars
        ['--hero-tint-top' as any]: `${SLIDES[activeIdx].tintTop ?? 12}%`,
        ['--hero-tint-bottom' as any]: `${SLIDES[activeIdx].tintBottom ?? 6}%`,
        ['--hero-dark-top' as any]: `${0}`,
        ['--hero-dark-60' as any]: `${SLIDES[activeIdx].dark60 ?? 0.25}`,
        ['--hero-dark-100' as any]: `${SLIDES[activeIdx].dark100 ?? 0.5}`,
        ['--poly-color' as any]: SLIDES[activeIdx].poly ?? 'var(--brandPrimary)',
        ['--poly-opacity' as any]: `${(SLIDES[activeIdx] as any).polyOpacity ?? 0.95}`,
        ['--poly-top-mix' as any]: `${(SLIDES[activeIdx] as any).polyTopMix ?? '85%'}`,
        ['--poly-bottom-wash' as any]: `${(SLIDES[activeIdx] as any).polyBottomWash ?? '0%'}`,
      }}
    >
      <div
        className="hero-video"
        aria-hidden="true"
      >
        {prevIdx !== null && (
          <Image
            key={`prev-${prevIdx}`}
            src={SLIDES[prevIdx].src}
            alt=""
            fill
            sizes="100vw"
            priority={prevIdx === 0}
            className={`hero-img ${fading ? 'is-prev' : ''}`}
            style={{
              objectFit: 'cover',
              objectPosition: (isMobile ? (SLIDES[prevIdx].posMobile ?? SLIDES[prevIdx].pos) : SLIDES[prevIdx].pos) ?? '60% center',
              transformOrigin: ((isMobile ? (SLIDES[prevIdx].posMobile ?? SLIDES[prevIdx].pos) : SLIDES[prevIdx].pos) ?? '80% 50%').replace('center','50%')
            }}
          />
        )}
        <Image
          key={`cur-${activeIdx}`}
          src={SLIDES[activeIdx].src}
          alt=""
          fill
          sizes="100vw"
          priority={activeIdx === 0}
          className={`hero-img is-current hero-kenburns ${kbReady && inView ? '' : 'kb-paused'} wow ${['wow-in','wow-out','wow-left','wow-right'][activeIdx % 4]}`}
          onLoadingComplete={() => { if (!kbReady) { setTimeout(() => setKbReady(true), 0); } }}
          style={{
            objectFit: 'cover',
            objectPosition: (isMobile ? (SLIDES[activeIdx].posMobile ?? SLIDES[activeIdx].pos) : SLIDES[activeIdx].pos) ?? '60% center',
            transformOrigin: ((isMobile ? (SLIDES[activeIdx].posMobile ?? SLIDES[activeIdx].pos) : SLIDES[activeIdx].pos) ?? '80% 50%').replace('center','50%')
          }}
        />
      </div>
      <div className="hero-overlay" />
      <div className="hero-poly" aria-hidden="true" />

      <div className="container">
        <div className="hero-panel">
          <div className="hero-eyebrow">{SLIDES[activeIdx].eyebrow}</div>
          <h1 className="hero-title">{SLIDES[activeIdx].title}</h1>
          <p className="hero-deck">{SLIDES[activeIdx].deck}</p>
          <div className="hero-ctas">
            <a href={SLIDES[activeIdx].primary.href} className="btn-hero-primary">
              {SLIDES[activeIdx].primary.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{marginLeft:8}}>
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href={SLIDES[activeIdx].secondary.href} className="btn-hero-secondary">
              {SLIDES[activeIdx].secondary.label}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{marginLeft:8}}>
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="hero-bottombar" aria-label="Navigation du hero">
        <span className="muted">Diaporama</span>
        <div className="hero-segments">
          {Array.from({ length: SEGMENTS }).map((_, i) => (
            <button
              type="button"
              key={i}
              className={`hero-segment ${i === activeIdx ? 'is-active' : ''}`}
              aria-label={`Aller à la diapositive ${i + 1}`}
              onClick={() => {
                setPrevIdx(activeIdx);
                setFading(true);
                setActiveIdx(i);
              }}
            />
          ))}
        </div>
        <button
          type="button"
          className="hero-pp"
          aria-label={playing ? 'Mettre en pause' : 'Lecture'}
          onClick={() => setPlaying(p => !p)}
        >
          {playing ? (
            // Pause icon
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" fill="currentColor" />
              <rect x="14" y="4" width="4" height="16" fill="currentColor" />
            </svg>
          ) : (
            // Play icon
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M8 5v14l11-7-11-7z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      {/* Baseline blanche + encoche triangulaire centrée sous la pointe */}
      <div className="hero-baseline" aria-hidden="true" />
    </section>
  );
}
