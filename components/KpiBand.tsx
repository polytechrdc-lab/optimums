"use client";
import { useEffect, useMemo, useRef, useState } from 'react';

type Kpi = { value: number; prefix?: string; suffix?: string; approx?: boolean; label: string };

export default function KpiBand({
  title = 'Our Experience',
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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduce || !countUp) { setActive(true); return; }
    if (!('IntersectionObserver' in window)) { setActive(true); return; }
    const io = new IntersectionObserver((ents) => {
      if (ents[0].isIntersecting) { setActive(true); io.disconnect(); }
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [countUp, prefersReduce]);

  return (
    <section ref={ref} className="kpi-band" aria-label={title}>
      <div className="container kpi-wrap">
        <div className="kpi-head">
          <h2 className="kpi-title">{title}</h2>
          {intro && <p className="kpi-intro">{intro}</p>}
        </div>
        <div className="kpi-grid">
          {kpis.map((k, i) => (
            <div className="kpi-item" key={i}>
              <div className="kpi-value" aria-label={`${k.approx ? 'approximately ' : ''}${k.prefix ?? ''}${k.value}${k.suffix ?? ''}`}>
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

