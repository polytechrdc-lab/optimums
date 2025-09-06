"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/utils/scroll";

type CaseItem = {
  title: string;
  desc: string;
  poster: string;
  videoWebm?: string;
  videoMp4?: string;
};

const CASES: CaseItem[] = [
  {
    title: "Backbone urbain – Kinshasa",
    desc: "Refonte de l'architecture d'accès avec QoS et segmentation, MTTR ÷ 2.",
    poster: "/optimums/posters/backbone.svg",
  },
  {
    title: "Modernisation data center",
    desc: "Migration SDN, observabilité bout-en-bout, 35% de latence en moins.",
    poster: "/optimums/posters/dc.svg",
  },
  {
    title: "Sécurisation réseau opérateur",
    desc: "Zero Trust, micro-segmentation, conformité NIST, incidents critiques -60%.",
    poster: "/optimums/posters/security.svg",
  },
];

export function CasesCinemagraph() {
  const reduced = usePrefersReducedMotion();
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = el.clientWidth;
      const i = Math.round(el.scrollLeft / w);
      setIndex(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Pause videos when not visible
    const el = scrollerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const vids = Array.from(el.querySelectorAll("video"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const v = en.target as HTMLVideoElement;
        if (en.isIntersecting) {
          if (!reduced) v.play().catch(() => {});
        } else v.pause();
      });
    }, { root: el, threshold: 0.6 });
    vids.forEach(v => io.observe(v));
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section aria-labelledby="cases-title" style={{ padding: "56px 0", background: "#fdfdfd" }}>
      <div style={{ width: "min(1200px, 94%)", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 12, marginBottom: 10 }}>
          <h2 id="cases-title" style={{ margin: 0, fontSize: "clamp(24px,4.5vw,40px)", color: "var(--ink)" }}>Études de cas</h2>
          <div style={{ fontSize: 14, color: "var(--muted)" }}>{index + 1} / {CASES.length}</div>
        </div>

        <div
          ref={scrollerRef}
          role="region"
          aria-label="Carrousel des études de cas"
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridAutoColumns: "minmax(80%, 1fr)",
            gap: 18,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: 8,
          }}
        >
          {CASES.map((c, i) => (
            <article key={i} style={{
              position: "relative",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid #E6EEF9",
              background: "#fff",
              transform: `scale(${index === i ? 1 : 0.95})`,
              filter: index === i ? "none" : "blur(1px)",
              transition: "transform 280ms var(--ease-base), filter 280ms var(--ease-base)",
              scrollSnapAlign: "start",
            }}>
              <MediaCard item={c} active={index === i} reduced={reduced} />
            </article>
          ))}
        </div>

        <div aria-hidden style={{ height: 4, background: "#E6EEF9", borderRadius: 999, marginTop: 12 }}>
          <div style={{ height: "100%", width: `${((index+1)/CASES.length)*100}%`, background: "var(--brand)", borderRadius: 999, transition: "width 240ms var(--ease-base)" }} />
        </div>
      </div>
    </section>
  );
}

function MediaCard({ item, active, reduced }: { item: CaseItem; active: boolean; reduced: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (!videoRef.current) return;
    if (reduced) { videoRef.current.pause(); return; }
    if (active) videoRef.current.play().catch(() => {});
    else videoRef.current.pause();
  }, [active, reduced]);

  return (
    <div>
      <div style={{ position: "relative", aspectRatio: "16/9", background: "#f6f8fb" }}>
        {item.videoWebm || item.videoMp4 ? (
          <video ref={videoRef} muted loop playsInline preload="metadata" poster={item.poster} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}>
            {item.videoWebm && <source src={item.videoWebm} type="video/webm" />}
            {item.videoMp4 && <source src={item.videoMp4} type="video/mp4" />}
          </video>
        ) : (
          <picture>
            <img src={item.poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </picture>
        )}
        {/* Shape title reveal via gradient mask */}
        <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient( to top, rgba(0,0,0,0.5), transparent 50%)" }} />
        <h3 style={{ position: "absolute", left: 16, bottom: 12, margin: 0, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>{item.title}</h3>
      </div>
      <p style={{ margin: "10px 12px 14px", color: "var(--ink)" }}>{item.desc}</p>
    </div>
  );
}

export default CasesCinemagraph;

