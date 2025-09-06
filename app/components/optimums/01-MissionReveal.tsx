"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion, useInViewOnce } from "@/utils/scroll";

const MotionDiv = dynamic(() => import("framer-motion").then(m => m.motion.div), { ssr: false, loading: () => <div /> });

function splitWords(text: string) {
  return text.split(/\s+/g).filter(Boolean);
}

export function MissionReveal() {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInViewOnce<HTMLDivElement>({ threshold: 0.25 });

  const words = useMemo(() => splitWords("Nous drivons l'excellence opérationnelle, pas seulement la connectivité"), []);

  return (
    <section
      aria-labelledby="mission-title"
      className="u-transform-gpu"
      style={{
        minHeight: "90vh",
        display: "grid",
        placeItems: "center",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated conic gradient backdrop */}
      <div
        aria-hidden
        className="backdrop-conic u-noise-mask"
        style={{
          position: "absolute",
          inset: "-20%",
          filter: "blur(24px)",
          transform: reduced ? undefined : `translateZ(0) scale(1.05)` ,
          animation: reduced ? undefined : "bgspin 14s linear infinite",
          opacity: 0.65,
        }}
      />
      <style>{`
        @keyframes bgspin { from { transform: translateZ(0) rotate(0deg) scale(1.05);} to { transform: translateZ(0) rotate(360deg) scale(1.05);} }
      `}</style>
      <div ref={ref} style={{ width: "min(1024px,92%)", zIndex: 1, textAlign: "center" }}>
        <h1 id="mission-title" style={{
          fontSize: "clamp(28px, 5vw, 56px)",
          lineHeight: 1.12,
          margin: 0,
          color: "var(--ink)",
          textWrap: "balance" as any
        }}>
          {words.map((w, i) => (
            <MotionDiv
              key={i}
              initial={reduced ? false : { y: 14, opacity: 0, filter: "blur(6px)" }}
              animate={reduced ? {} : (inView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {})}
              transition={{ delay: reduced ? 0 : i * 0.06, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
              style={{ display: "inline-block", marginRight: 8 }}
            >
              {w}
            </MotionDiv>
          ))}
        </h1>
        <p style={{ marginTop: 14, fontSize: 18, color: "var(--muted)", maxWidth: 900, marginInline: "auto" }}>
          Chez Optimums, nous concevons, déployons et opérons des solutions télécoms et numériques fiables, scalables, et pensées pour l'Afrique.
        </p>
        <ul aria-label="Atouts clés" style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 18, flexWrap: "wrap", listStyle: "none", padding: 0 }}>
          {[
            { label: "Infra résiliente", icon: "M4 12h16M4 6h16M4 18h16" },
            { label: "Sécurité by design", icon: "M12 4l6 4v8l-6 4-6-4V8z" },
            { label: "Performance mesurable", icon: "M4 18h4l2-8 2 6 2-10 2 12h4" },
          ].map((it, idx) => (
            <li key={idx} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 12px", background: "#ffffff", border: "1px solid #E6EEF9", borderRadius: 12, color: "var(--ink)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d={it.icon} />
              </svg>
              <span>{it.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default MissionReveal;

