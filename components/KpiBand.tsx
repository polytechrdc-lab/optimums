"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
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
  const [counts, setCounts] = useState<number[]>(() => kpis.map(() => 0));
  const animatedRef = useRef(false);
  const prefersReduce = usePrefersReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const bgMediaRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);

  // Counter animation trigger at 40% visibility
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduce || !countUp) { setActive(true); setCounts(kpis.map(k => k.value)); return; }
    if (!('IntersectionObserver' in window)) { setActive(true); setCounts(kpis.map(k => k.value)); return; }
    const io = new IntersectionObserver((ents) => {
      if (ents[0].isIntersecting && !animatedRef.current) {
        animatedRef.current = true;
        setActive(true);
        // Animate counts 0 -> target over 1.2s ease-out
        const start = performance.now();
        const duration = 1200;
        const targets = kpis.map(k => k.value);
        const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const e = easeOutCubic(t);
          setCounts(targets.map(v => Math.round(v * e)));
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [countUp, prefersReduce, kpis]);

  // Parallaxe du fond (wrapper média uniquement) + voile de recouvrement — rAF + scroll passif
  useEffect(() => {
    const section = ref.current;
    const media = bgMediaRef.current;
    const sweep = sweepRef.current;
    if (!section || !media) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let ticking = false;

    const compute = () => {
      ticking = false;
      const isNarrow = window.innerWidth < 768;
      if (reduce.matches || isNarrow) {
        media.style.transform = 'none';
        if (sweep) { sweep.style.opacity = '0'; sweep.style.transform = 'translate3d(0,0,0)'; }
        // Reset any value fade
        section.style.removeProperty('--kpiValueOpacity');
        return;
      }
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const denom = r.height + vh;
      // Normalized progress 0..1 based on section vs viewport; starts at 1st pixel
      const raw = (vh - r.top) / (denom || 1);
      const p = Math.max(0, Math.min(1, raw));
      // Ease-out for smoothness; also derive a centered signal for translate
      const s = 1 - Math.pow(1 - p, 3); // easeOutCubic
      const centered = (s - 0.5) * 2; // [-1,1]
      const translateMax = 80; // px (target)
      const ty = centered * translateMax;
      const scale = 1 + 0.05 * s; // 1.00 -> ~1.05
      media.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;

      // Sweep overlay (above content): appears from bottom and climbs, subtle opacity
      if (sweep) {
        const start = 0.02; // begin ~first 12px
        const end = 0.80;  // reach near max before exit
        const t = Math.max(0, Math.min(1, (p - start) / Math.max(0.0001, end - start)));
        const sweepMax = translateMax * 0.6; // 60% of background travel
        const sy = -t * sweepMax; // moving upward
        // Opacity: desktop up to 0.18, mobile already disabled
        const maxOpacity = 0.18;
        const opacity = t * maxOpacity;
        sweep.style.transform = `translate3d(0, ${sy.toFixed(1)}px, 0)`;
        sweep.style.opacity = opacity.toFixed(3);
      }

      // Optional: slight reduction of KPI numbers opacity between p=0.25 and 0.6
      {
        const a = 0.25, b = 0.6;
        let o = 1;
        if (p <= a) o = 1;
        else if (p >= b) o = 1;
        else {
          const tt = (p - a) / (b - a);
          // fade down to ~0.92 then back; symmetric curve around midpoint
          const dip = 0.08; // 8%
          const curve = 1 - 4 * (tt - 0.5) * (tt - 0.5); // 0..1 peaking at center
          o = 1 - dip * curve;
        }
        section.style.setProperty('--kpiValueOpacity', o.toFixed(3));
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true } as any);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const numberFmt = useMemo(() => new Intl.NumberFormat('fr-FR'), []);

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
        <div className="kpi-grid-bleed">
          <div className="kpi-grid">
          {kpis.map((k, i) => (
            <div className="kpi-item" key={i}>
              <div className="kpi-value" data-prefix={k.prefix ?? ''} data-suffix={k.suffix ?? ''}
                   aria-label={`${k.approx ? 'environ ' : ''}${k.prefix ?? ''}${k.value}${k.suffix ?? ''}`}>
                {k.approx ? '∼' : ''}{k.prefix ?? ''}{numberFmt.format(active ? counts[i] : 0)}{k.suffix ?? ''}
              </div>
              <div className="kpi-label">{k.label}</div>
            </div>
          ))}
          </div>
        </div>
      {/* Sweep overlay above content to create cover illusion */}
      <div ref={sweepRef} className="kpi-sweep" aria-hidden />
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
