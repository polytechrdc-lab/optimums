"use client";
import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion, useInViewOnce } from "@/utils/scroll";

const MotionDiv = dynamic(() => import("framer-motion").then(m => m.motion.div), { ssr: false, loading: () => <div /> });

function easeOutQuad(t: number) { return 1 - (1 - t) * (1 - t); }

function useCountUp(value: number, duration = 1400, start = false, reduced = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (reduced) { setVal(value); return; }
    let raf: number;
    const t0 = performance.now();
    const loop = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      setVal(Math.round(value * easeOutQuad(p)));
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, start, reduced]);
  return val;
}

function formatNumber(n: number) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

type KPI = { value: number; suffix?: string; approx?: boolean; label: string };

const KPIS: KPI[] = [
  { value: 2500, approx: true, suffix: "+", label: "sites maintenus / an" },
  { value: 99.95, label: "de disponibilité moyenne", suffix: "%" },
  { value: 15, label: "pays couverts AEM" },
  { value: -28, label: "de coûts OPEX chez nos clients", suffix: "%" },
];

export function ImpactKPI() {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section aria-labelledby="kpi-title" style={{ padding: "64px 0", background: "#fff" }}>
      <div style={{ width: "min(1120px,92%)", margin: "0 auto" }}>
        <h2 id="kpi-title" style={{ fontSize: "clamp(24px,4vw,36px)", margin: 0, color: "var(--ink)" }}>Impact KPI</h2>
        <p style={{ color: "var(--muted)", margin: "6px 0 18px" }}>Des résultats concrets, auditables et continus.</p>

        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: 16 }}>
          {KPIS.map((k, i) => (
            <TiltCard key={i} delay={i * 0.06} reduced={reduced} inView={inView}>
              <Kpi value={k.value} suffix={k.suffix} approx={k.approx} label={k.label} inView={inView} reduced={reduced} />
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function Kpi({ value, suffix, approx, label, inView, reduced }: { value: number; suffix?: string; approx?: boolean; label: string; inView: boolean; reduced: boolean; }) {
  const show = useCountUp(value, 1400, inView, reduced);
  const display = useMemo(() => {
    const isFloat = !Number.isInteger(value);
    const num = isFloat ? (inView || reduced ? value : 0) : show;
    const formatted = isFloat ? num.toFixed(2) : formatNumber(num);
    return `${approx ? '≈ ' : ''}${formatted}${suffix ?? ''}`;
  }, [show, suffix, approx, value, inView, reduced]);

  return (
    <div>
      <div style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, color: "var(--brand)", lineHeight: 1 }}>{display}</div>
      <div style={{ color: "var(--ink)", marginTop: 4 }}>{label}</div>
    </div>
  );
}

function TiltCard({ children, delay, reduced, inView }: { children: React.ReactNode; delay: number; reduced: boolean; inView: boolean; }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [xy, setXY] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setXY({ x: px, y: py });
  }, []);

  return (
    <MotionDiv
      ref={ref as any}
      className="u-glare u-focus-ring"
      onMouseMove={(e: any) => { if (!reduced) { onMove(e); (e.currentTarget as HTMLElement).style.setProperty('--gx', `${e.nativeEvent.offsetX}px`); (e.currentTarget as HTMLElement).style.setProperty('--gy', `${e.nativeEvent.offsetY}px`);} }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setXY({ x: 0, y: 0 }); }}
      initial={reduced ? false : { opacity: 0, y: 10, scale: 0.98 }}
      animate={reduced ? {} : (inView ? { opacity: 1, y: 0, scale: 1 } : {})}
      transition={{ delay: reduced ? 0 : delay, duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
      style={{
        background: "#fff",
        border: "1px solid #E6EEF9",
        borderRadius: 16,
        padding: 18,
        boxShadow: hover ? `0 16px 40px rgba(1,4,22,0.12)` : `0 8px 22px rgba(1,4,22,0.08)`,
        transform: reduced ? undefined : `perspective(700px) rotateX(${-(xy.y * 6)}deg) rotateY(${xy.x * 6}deg) translateZ(${hover ? 6 : 0}px)`,
        transition: "box-shadow 180ms ease",
      }}
    >
      {children}
    </MotionDiv>
  );
}

export default ImpactKPI;

