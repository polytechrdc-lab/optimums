"use client";
import React, { useMemo, useRef, useState } from "react";
import { useInViewOnce, usePrefersReducedMotion } from "@/utils/scroll";

type City = { id: string; name: string; x: number; y: number; services: string; sla: string; contact: string };

const CITIES: City[] = [
  { id: "kin", name: "Kinshasa", x: 28, y: 58, services: "Backbone, PoP, FO, LTE", sla: ">= 99,95%", contact: "kin@optimums.org" },
  { id: "lub", name: "Lubumbashi", x: 78, y: 78, services: "PoP, FO", sla: ">= 99,9%", contact: "lub@optimums.org" },
  { id: "gom", name: "Goma", x: 68, y: 30, services: "PoP, FO", sla: ">= 99,9%", contact: "goma@optimums.org" },
  { id: "mat", name: "Matadi", x: 12, y: 64, services: "PoP", sla: ">= 99,8%", contact: "matadi@optimums.org" },
];

export function NetworkMap() {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.25 });
  const [active, setActive] = useState<City | null>(null);

  // Precompute path arcs between Kinshasa and others (dummy layout coordinates)
  const arcs = useMemo(() => {
    const kin = CITIES[0];
    return CITIES.slice(1).map((c) => ({ from: kin, to: c }));
  }, []);

  return (
    <section aria-labelledby="netmap-title" className="backdrop-radial" style={{ padding: "64px 0", position: "relative" }}>
      <div style={{ width: "min(1120px, 92%)", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <div>
            <h2 id="netmap-title" style={{ margin: 0, color: "var(--ink)" }}>Carte réseau</h2>
            <p style={{ marginTop: 6, color: "var(--muted)" }}>Présence & liaisons clé</p>
          </div>
          <a href="#" role="button" aria-label="Voir toutes nos implantations" className="u-focus-ring" style={{ color: "#fff", background: "var(--brand)", padding: "10px 14px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>Voir toutes nos implantations</a>
        </div>

        <div ref={ref} style={{ position: "relative", marginTop: 16, borderRadius: 16, overflow: "hidden", background: "#fff", border: "1px solid #E6EEF9" }}>
          <svg viewBox="0 0 100 100" role="img" aria-label="Couverture Afrique et RDC" style={{ width: "100%", height: "auto", display: "block" }}>
            <defs>
              <radialGradient id="g" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#dfe9ff" />
                <stop offset="100%" stopColor="#ffffff" />
              </radialGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <rect x="0" y="0" width="100" height="100" fill="url(#g)" />
            {/* Simplified RDC silhouette */}
            <path d="M25,35 C35,30 55,30 65,40 C72,50 70,65 60,70 C45,75 30,70 25,60 Z" fill="#E6EEF9" stroke="#c8d8f5" />

            {/* Animated arcs */}
            {arcs.map((a, i) => {
              const x1 = a.from.x, y1 = a.from.y;
              const x2 = a.to.x, y2 = a.to.y;
              const mx = (x1 + x2) / 2;
              const my = Math.min(y1, y2) - 12; // raise mid for curve
              const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
              return (
                <path key={i} d={d} fill="none" stroke="var(--brand)" strokeWidth="0.8" strokeLinecap="round" style={{
                  filter: "drop-shadow(0 0 2px rgba(10,85,232,0.25))",
                  strokeDasharray: 120,
                  strokeDashoffset: reduced ? 0 : (inView ? 0 : 120),
                  transition: "stroke-dashoffset 1200ms ease-out 120ms"
                }} />
              );
            })}

            {/* City markers */}
            {CITIES.map((c) => (
              <g key={c.id} transform={`translate(${c.x} ${c.y})`}>
                <circle r="1.6" fill="var(--brand)" filter="url(#glow)"></circle>
                <circle r="4" fill="transparent" stroke="var(--brand)" strokeOpacity="0.25">
                  <animate attributeName="r" values="3;5;3" dur="3.2s" repeatCount="indefinite" begin="0s" />
                </circle>
                <title>{c.name}</title>
              </g>
            ))}
          </svg>

          {/* Accessible Tooltips */}
          <div aria-live="polite" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            {active && (
              <div role="dialog" aria-label={`Détails ${active.name}`} style={{ position: "absolute", left: `${active.x}%`, top: `${active.y}%`, transform: "translate(8px, -50%)", background: "#fff", border: "1px solid #E6EEF9", borderRadius: 12, boxShadow: "0 8px 24px rgba(1,4,22,0.08)", padding: 12, minWidth: 220 }}>
                <div style={{ fontWeight: 700, color: "var(--ink)" }}>{active.name}</div>
                <div style={{ color: "var(--muted)", fontSize: 14, marginTop: 4 }}>{active.services}</div>
                <div style={{ color: "var(--ink)", fontSize: 14, marginTop: 6 }}>SLA: {active.sla}</div>
                <a href={`mailto:${active.contact}`} className="u-focus-ring" style={{ display: "inline-block", marginTop: 8, textDecoration: "none", color: "var(--brand)", fontWeight: 700 }}>Contacter</a>
              </div>
            )}
          </div>

          {/* Hit targets for tooltips */}
          <div aria-hidden style={{ position: "absolute", inset: 0 }}>
            {CITIES.map((c) => (
              <button key={c.id} aria-label={`${c.name}, détails`} onMouseEnter={() => setActive(c)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(c)} onBlur={() => setActive(null)}
                className="u-focus-ring" style={{ position: "absolute", left: `calc(${c.x}% - 12px)`, top: `calc(${c.y}% - 12px)`, width: 24, height: 24, borderRadius: 999, background: "transparent", border: "none", cursor: "pointer" }} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default NetworkMap;

