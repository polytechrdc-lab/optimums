"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import kpiBg from '../image/body/experience-bg.jpg';

type Kpi = { value: number; prefix?: string; suffix?: string; approx?: boolean; label: string };

export default function KpiBand({
  title = 'Notre expérience',
  intro,
  kpis,
  countUp = true,
}: {
  title?: string;
  intro?: string;
  kpis: Kpi[];
  countUp?: boolean;
}) {
  const [active, setActive] = useState(false);
  const prefersReduce = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const bgMediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduce || !countUp) { setActive(true); return; }
    if (!('IntersectionObserver' in window)) { setActive(true); return; }
    const io = new IntersectionObserver((ents) => {
      if (ents[0].isIntersecting) { setActive(true); io.disconnect(); }
    }, { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [countUp, prefersReduce]);

  // Parallaxe du fond – démarre dès le 1er pixel de scroll
  useEffect(() => {
    const section = ref.current;
    const media = bgMediaRef.current;
    if (!section || !media) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onScroll = () => {
      if (reduce.matches) { media.style.transform = 'none'; return; }
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const denom = r.height + vh;
      // Progress 0..1 through the section relative to viewport
      const raw = (vh - r.top) / (denom || 1);
      const p = Math.max(0, Math.min(1, raw));
      // Smoothstep easing for a gentle glide
      const s = 3 * p * p - 2 * p * p * p;
      const centered = (s - 0.5) * 2; // [-1,1]
      // Amplitude: ~14% of section height total travel
      const amp = Math.round(r.height * 0.07);
      const ty = centered * amp;
      media.style.transform = `translateY(${ty.toFixed(1)}px)`;
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
    <section ref={ref} className="kpi-band" aria-label={title}>
      {/* Full-bleed background with parallax */}
      <div ref={bgRef} className="kpi-bg" aria-hidden>
        <div ref={bgMediaRef} className="kpi-bg-media">
          <Image
            src={kpiBg}
            alt=""
            fill
            priority={false}
            placeholder="blur"
            quality={70}
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: '50% 50%' }}
          />
        </div>
        <div className="kpi-tint" />
      </div>
      <div className="container kpi-wrap">
        <div className="kpi-content">
          <div className="kpi-head">
            <h2 className="kpi-title">{title}</h2>
            {intro && <p className="kpi-intro">{intro}</p>}
          </div>
        </div>
        <div className="kpi-grid">
          {kpis.map((k, i) => (
            <div className="kpi-item" key={i}>
              <div className="kpi-value" aria-label={`${k.approx ? 'environ ' : ''}${k.prefix ?? ''}${k.value}${k.suffix ?? ''}`}>
                {k.approx ? '∼' : ''}{k.prefix ?? ''}{active ? k.value : Math.max(0, Math.floor((k.value) * 0.82))}{k.suffix ?? ''}
              </div>
              <div className="kpi-label">{k.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return reduce;
}
