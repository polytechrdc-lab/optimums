"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import kpiBg from '../image/body/experience-bg.jpg';

type Kpi = { value: number; prefix?: string; suffix?: string; approx?: boolean; label: string };

export default function KpiBand({
  title = 'Notre expérience',
  intro,
  kpis,
  countUp = false,
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

  // Parallaxe et voile supprimés: ne garder que les KPI

  const numberFmt = useMemo(() => new Intl.NumberFormat('fr-FR'), []);

  return (
    <section ref={ref} className="kpi-band" aria-label={title}>
      {/* Static background media (no animation) */}
      <div className="kpi-bg" aria-hidden>
        <Image
          src={kpiBg}
          alt=""
          fill
          sizes="100vw"
          priority={false}
          style={{ objectFit: 'cover', objectPosition: '75% 55%' }}
        />
        <div className="kpi-tint" />
      </div>
      <div className="container kpi-wrap">
        <div className="kpi-content">
          <div className="kpi-head">
            <h2 className="kpi-title">{title}</h2>
            {intro && <p className="kpi-intro">{intro}</p>}
          </div>
        </div>
        {/* Values row (baseline-aligned) */}
        <div className="kpi-values">
          {kpis.slice(0,3).map((k, i) => (
            <div className={`kpi-col kpi-col-${i+1}`} key={`v-${i}`}>
              <div className="kpi-value" data-prefix={k.prefix ?? ''} data-suffix={k.suffix ?? ''}
                   aria-label={`${k.approx ? 'environ ' : ''}${k.prefix ?? ''}${k.value}${k.suffix ?? ''}`}>
                {k.approx ? '∼' : ''}{k.prefix ?? ''}{numberFmt.format(active ? counts[i] : 0)}{k.suffix ?? ''}
              </div>
            </div>
          ))}
        </div>
        {/* Labels row */}
        <div className="kpi-labels">
          {kpis.slice(0,3).map((k, i) => (
            <div className={`kpi-col kpi-col-${i+1}`} key={`l-${i}`}>
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
