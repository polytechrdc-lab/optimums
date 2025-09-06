"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/utils/scroll";

const LOGOS = [
  "/optimums/logos/logo1.svg",
  "/optimums/logos/logo2.svg",
  "/optimums/logos/logo3.svg",
  "/optimums/logos/logo4.svg",
  "/optimums/logos/logo5.svg",
];

const QUOTES = [
  {
    quote: "Optimums a stabilisé notre réseau critique tout en réduisant nos coûts d'exploitation",
    author: "A. Mbuyi",
    role: "CTO, Opérateur Régional",
    avatar: "/optimums/avatars/a.svg",
  },
  {
    quote: "Des équipes engagées, des résultats mesurables, un partenaire de confiance.",
    author: "S. Kabila",
    role: "Directeur IT, Groupe Énergie",
    avatar: "/optimums/avatars/b.svg",
  },
];

export function ClientsTestimonials() {
  return (
    <section aria-labelledby="clients-title" style={{ padding: "64px 0", background: "#ffffff" }}>
      <div style={{ width: "min(1120px,92%)", margin: "0 auto", display: "grid", gap: 26 }}>
        <div>
          <h2 id="clients-title" style={{ margin: 0, color: "var(--ink)" }}>Clients & Témoignages</h2>
          <p style={{ marginTop: 6, color: "var(--muted)" }}>La preuve par la confiance et les résultats.</p>
        </div>

        <LogoMarquee />
        <TestimonialsSlider />
      </div>
    </section>
  );
}

function LogoMarquee() {
  const reduced = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (reduced) return;
    const el = trackRef.current;
    if (!el) return;
    let pos = 0;
    let raf = 0;
    const tick = () => {
      pos = (pos - 0.3 + el.scrollWidth) % el.scrollWidth;
      el.style.transform = `translateX(${-pos}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <div role="marquee" aria-label="Logos de clients" style={{ position: "relative", overflow: "hidden", border: "1px solid #E6EEF9", borderRadius: 16, background: "#fff" }}>
      <div style={{ display: "flex", gap: 32, padding: 16, willChange: "transform" }} ref={trackRef}>
        {[...LOGOS, ...LOGOS].map((src, i) => (
          <img key={i} src={src} alt="Logo client" style={{ height: 36, width: "auto", opacity: 0.85 }} />
        ))}
      </div>
    </div>
  );
}

function useTypewriter(text: string, speed = 24, start = false, reduced = false) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!start) return;
    if (reduced) { setOut(text); return; }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, start, reduced]);
  return out;
}

function TestimonialsSlider() {
  const reduced = usePrefersReducedMotion();
  const [idx, setIdx] = useState(0);
  const q = QUOTES[idx];
  const typed = useTypewriter(q.quote, 22, true, reduced);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % QUOTES.length), 5000);
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <div aria-roledescription="carousel" aria-label="Témoignages" style={{ display: "grid", gridTemplateColumns: "1fr", justifyItems: "center" }}>
      <figure style={{
        width: "min(800px, 100%)",
        margin: 0,
        padding: 20,
        background: "linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.5))",
        border: "1px solid #E6EEF9",
        borderRadius: 16,
        boxShadow: "0 10px 28px rgba(1,4,22,0.06)",
        backdropFilter: "blur(6px)",
      }}>
        <blockquote style={{ margin: 0, color: "var(--ink)", fontSize: 20, lineHeight: 1.5 }}>{typed}</blockquote>
        <figcaption style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
          <img src={q.avatar} alt="" width={36} height={36} style={{ borderRadius: 999, background: "#eef2fb" }} />
          <span style={{ color: "var(--ink)", fontWeight: 700 }}>{q.author}</span>
          <span style={{ color: "var(--muted)" }}>— {q.role}</span>
        </figcaption>
        <div role="group" aria-label="Contrôles" style={{ display: "flex", gap: 8, marginTop: 12 }}>
          {QUOTES.map((_, i) => (
            <button key={i} type="button" aria-label={`Afficher témoignage ${i+1}`} className="u-focus-ring" onClick={() => setIdx(i)}
              style={{ width: 28, height: 8, borderRadius: 999, border: "none", background: i === idx ? "var(--brand)" : "#DFE7F5", cursor: "pointer" }} />
          ))}
        </div>
      </figure>
    </div>
  );
}

export default ClientsTestimonials;

