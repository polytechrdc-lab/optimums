"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import r1 from "../image/body/1.webp";
import r2 from "../image/body/2.jpg";
import r3 from "../image/body/3.webp";
import { gsapCore, isReducedMotion } from "@/lib/gsap";

const KPIS = [
  { label: "Sites déployés", value: "1 200+" },
  { label: "Km de fibre", value: "3 400+" },
  { label: "Uptime moyen", value: "99.95%" },
  { label: "Pays couverts", value: "6" },
  { label: "Clients", value: "25+" },
];

const PILLARS: Array<{ icon: string; title: string; bullets: string[]; link?: string }> = [
  { icon: "⚙️", title: "Exécution fiable & délais tenus", bullets: ["Planification serrée", "Pilotage quotidien", "Livraison sans surprise"] },
  { icon: "🔌", title: "Infrastructure & énergie maîtrisées", bullets: ["Énergie critique", "Refroidissement", "Sécurité site"] },
  { icon: "🛡️", title: "SLA mesurés & O&M 24/7", bullets: ["NOC 24/7", "SLO/SLA suivis", "Maintenance préventive"] },
  { icon: "🌍", title: "Couverture multi‑pays & partenaires", bullets: ["Équipes locales", "Réseau de partenaires", "Logistique maîtrisée"] },
  { icon: "📈", title: "Optimisation CapEx/OpEx", bullets: ["Design-to-cost", "Énergie optimisée", "Préventif intelligent"] },
  { icon: "✅", title: "Qualité/QHSE & conformité", bullets: ["ISO 9001/45001/14001", "Procédures terrain", "Traçabilité"] },
];

type CaseItem = {
  title: string;
  client: string;
  country: string;
  period: string;
  problem: string;
  solution: string;
  result: string[];
  image: any;
  url: string;
};

const CASES: CaseItem[] = [
  {
    title: "Backbone fibre — 3 400+ km",
    client: "Opérateur régional",
    country: "Sénégal / Côte d’Ivoire",
    period: "2022–2024",
    problem: "Étendre rapidement la capacité inter‑villes avec des SLAs stricts",
    solution: "Études, tirage, DBO, réflectométrie, recette et documentation As‑Built",
    result: ["3 400+ km certifiés", "Mises en service progressives", "SLA > 99,9%"],
    image: r2,
    url: "#",
  },
  {
    title: "Énergie sites critiques — 99.95% uptime",
    client: "Data center & opérateur",
    country: "Région UEMOA",
    period: "2021–2024",
    problem: "Limiter les incidents sur sites sensibles (4G/5G, backbone, DC)",
    solution: "Audit, modernisation chaînes énergie, supervision, préventif et astreinte",
    result: ["Uptime 99.95%", "Réduction OPEX", "MTTR réduit"],
    image: r3,
    url: "#",
  },
];

export default function Realisations() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;
    let ctx: any; let killed = false;
    (async () => {
      const { gsap, ScrollTrigger } = await gsapCore();
      if (!gsap || !ScrollTrigger || killed) return;
      const root = sectionRef.current!;
      ctx = gsap.context(() => {
        const heroEls = root.querySelectorAll('[data-animate="hero"], .rl-hero .reveal');
        const kpiEls = root.querySelectorAll('[data-animate="kpi"], .rl-kpi');
        const pillarEls = root.querySelectorAll('[data-animate="pillar"], .rl-pillar');
        const cases = root.querySelectorAll('[data-animate="case"], .rl-case');
        const hexEls = root.querySelectorAll('[data-animate="hex"], .rl-hex .hex');
        const finalEls = root.querySelectorAll('[data-animate="final"], .rl-final .reveal');
        const overlineEl = root.querySelector('[data-animate="overline"], .rl-overline');
        const kpiValues = root.querySelectorAll('[data-animate="kpi-value"], .rl-kpi-value');
        const kpiLabels = root.querySelectorAll('[data-animate="kpi-label"], .rl-kpi-label');
        const pillIcons = root.querySelectorAll('[data-animate="pillar-icon"], .rl-pill-icon');

        gsap.set(heroEls, { opacity: 0, y: 16 });
        if (overlineEl) gsap.set(overlineEl, { x: -8 });
        gsap.set([kpiEls, pillarEls, cases, hexEls, finalEls], { opacity: 0, y: 18 });

        gsap.to(heroEls, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08, scrollTrigger: { trigger: root, start: 'top 85%' } });
        if (overlineEl) gsap.to(overlineEl, { x: 0, duration: 0.5, ease: 'power2.out', scrollTrigger: { trigger: root, start: 'top 85%' } });
        gsap.to(kpiEls, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08, scrollTrigger: { trigger: root.querySelector('.rl-kpis'), start: 'top 80%' } });
        gsap.to(pillarEls, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08, scrollTrigger: { trigger: root.querySelector('.rl-pillars'), start: 'top 80%' } });
        gsap.to(cases, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1, scrollTrigger: { trigger: root.querySelector('.rl-cases'), start: 'top 85%' } });
        gsap.to(hexEls, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.08, scrollTrigger: { trigger: root.querySelector('.rl-hex'), start: 'top 85%' } });
        gsap.to(finalEls, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.08, scrollTrigger: { trigger: root.querySelector('.rl-final'), start: 'top 85%' } });

        // Case image entrance (separate from general reveal)
        const caseImgs = root.querySelectorAll<HTMLElement>('[data-animate="case-img"]');
        caseImgs.forEach((img) => {
          gsap.fromTo(img, { opacity: 0, y: 16, scale: 1.02 }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: (img.closest('.rl-case') as Element) ?? img, start: 'top 85%', once: true },
            onComplete: () => {
              // Idle breathing (subtle, no scroll dependency)
              gsap.to(img, { scale: 1.008, duration: 5.6, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 50%', overwrite: false });
            }
          });
        });

        // Desktop-only parallax on images (discreet, no pin, no jank)
        const mm = ScrollTrigger.matchMedia;
        mm({
          "(min-width: 1024px)": () => {
            const heroImg = root.querySelector('.rl-hero-visual img');
            if (heroImg) gsap.to(heroImg, { y: -24, ease: 'none', scrollTrigger: { trigger: root.querySelector('.rl-hero')!, start: 'top bottom', end: 'bottom top', scrub: 0.3 } });

            const hexCenter = root.querySelectorAll('[data-animate="hex"][data-hex-role="center"] .hex-img');
            if (hexCenter.length) {
              gsap.to(hexCenter, { y: -30, ease: 'none', scrollTrigger: { trigger: root.querySelector('.rl-hex')!, start: 'top bottom', end: 'bottom top', scrub: 0.3 } });
              gsap.to(hexCenter, { scale: 1.015, duration: 4.8, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 50%', overwrite: false });
              gsap.to(hexCenter, { rotation: 0.6, ease: 'none', transformOrigin: '50% 50%', scrollTrigger: { trigger: root.querySelector('.rl-hex')!, start: 'top bottom', end: 'bottom top', scrub: 0.3 } });
            }
            const hexSides = root.querySelectorAll('[data-animate="hex"][data-hex-role="side"] .hex-img');
            if (hexSides.length) {
              gsap.to(hexSides, { y: -18, ease: 'none', scrollTrigger: { trigger: root.querySelector('.rl-hex')!, start: 'top bottom', end: 'bottom top', scrub: 0.3 } });
              gsap.to(hexSides, { scale: 1.01, duration: 5.0, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 50%', overwrite: false });
              gsap.to(hexSides, { rotation: -0.4, ease: 'none', transformOrigin: '50% 50%', scrollTrigger: { trigger: root.querySelector('.rl-hex')!, start: 'top bottom', end: 'bottom top', scrub: 0.3 } });
            }
            // Will-change discipline for hex images during the hex band viewport range
            const hexImgs: Element[] = [...Array.from(hexCenter), ...Array.from(hexSides)];
            if (hexImgs.length) {
              ScrollTrigger.create({
                trigger: root.querySelector('.rl-hex')!,
                start: 'top bottom',
                end: 'bottom top',
                onEnter: () => gsap.set(hexImgs, { willChange: 'transform' }),
                onLeave: () => gsap.set(hexImgs, { willChange: 'auto' }),
                onEnterBack: () => gsap.set(hexImgs, { willChange: 'transform' }),
                onLeaveBack: () => gsap.set(hexImgs, { willChange: 'auto' }),
              });
            }

            // Per-case parallax with per-item will-change toggles
            caseImgs.forEach((img) => {
              const trig = (img.closest('.rl-case') as Element) ?? img;
              gsap.to(img, { y: -24, ease: 'none', scrollTrigger: { trigger: trig, start: 'top bottom', end: 'bottom top', scrub: 0.3, onEnter: () => gsap.set(img, { willChange: 'transform' }), onLeave: () => gsap.set(img, { willChange: 'auto' }), onEnterBack: () => gsap.set(img, { willChange: 'transform' }), onLeaveBack: () => gsap.set(img, { willChange: 'auto' }) } });
            });
          }
        });

        // KPI slight parallax between values and labels (all viewports)
        if (kpiValues.length) {
          gsap.to(kpiValues, {
            y: -6,
            ease: 'none',
            scrollTrigger: {
              trigger: root.querySelector('.rl-kpis')!,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.2,
              onEnter: () => gsap.set(kpiValues, { willChange: 'transform' }),
              onLeave: () => gsap.set(kpiValues, { willChange: 'auto' }),
              onEnterBack: () => gsap.set(kpiValues, { willChange: 'transform' }),
              onLeaveBack: () => gsap.set(kpiValues, { willChange: 'auto' }),
            }
          });
        }
        if (kpiLabels.length) {
          gsap.to(kpiLabels, {
            y: -3,
            ease: 'none',
            scrollTrigger: {
              trigger: root.querySelector('.rl-kpis')!,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.2,
              onEnter: () => gsap.set(kpiLabels, { willChange: 'transform' }),
              onLeave: () => gsap.set(kpiLabels, { willChange: 'auto' }),
              onEnterBack: () => gsap.set(kpiLabels, { willChange: 'transform' }),
              onLeaveBack: () => gsap.set(kpiLabels, { willChange: 'auto' }),
            }
          });
        }

        // Pillar icons subtle float on scroll
        if (pillIcons.length) {
          gsap.to(pillIcons, { y: -6, ease: 'none', scrollTrigger: { trigger: root.querySelector('.rl-pillars')!, start: 'top bottom', end: 'bottom top', scrub: 0.2 } });
        }

        // Reveal results bullets inside each case with stagger
        cases.forEach((c) => {
          const lis = (c as HTMLElement).querySelectorAll('.rl-case-results li');
          if (!lis.length) return;
          gsap.from(lis, { opacity: 0, y: 8, duration: 0.45, ease: 'power2.out', stagger: 0.06, scrollTrigger: { trigger: c as Element, start: 'top 85%', once: true } });
        });

        // KPI count-up (visual only; DOM keeps final value)
        kpiEls.forEach((el) => {
          const v = el.querySelector('.rl-kpi-odometer') as HTMLElement | null;
          if (!v) return;
          const finalText = v.dataset.final ?? v.textContent ?? '';
          const match = finalText.match(/([0-9\s\.,]+)(.*)/);
          if (!match) return;
          const num = parseFloat(match[1].replace(/\s/g, '').replace(',', '.'));
          const suffix = match[2] ?? '';
          const obj = { n: 0 } as any;
          gsap.fromTo(obj, { n: 0 }, {
            n: num,
            duration: 1.0,
            ease: 'none',
            onUpdate: () => {
              const val = Math.floor(obj.n).toLocaleString('fr-FR');
              v.textContent = `${val}${suffix}`;
            },
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
          });
        });
      }, sectionRef);
    })();
    return () => { killed = true; try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section id="realisations" className="realisations" aria-label="Nos réalisations" ref={sectionRef}>
      <div className="container rl-wrap">
        {/* Hero compact */}
        <div className="rl-hero rl-section">
          <div className="rl-hero-grid-12">
            <div className="rl-hero-col rl-hero-left">
              <div className="rl-overline reveal" aria-hidden="true" data-animate="overline">NOS RÉALISATIONS</div>
              <h2 className="rl-hero-title reveal" data-animate="hero">Des réalisations solides, livrées à l’heure.</h2>
              <div className="rl-hero-ctas reveal" data-animate="hero">
                <a href="#contact" className="rl-cta-outline">Parler à un expert</a>
              </div>
            </div>
            <div className="rl-hero-col rl-hero-right">
              <p className="rl-hero-lead reveal" data-animate="hero">Des projets télécoms menés de bout en bout — ingénierie, déploiement, énergie et opérations 24/7 — documentés, sourcés et vérifiés sur le terrain. Des résultats tangibles à la clé : délais tenus, SLA ≥ 99,9 %, coûts optimisés (CapEx/OpEx) et qualité auditable.</p>
            </div>
          </div>
        </div>

        {/* KPIs proof bar */}
        <div className="rl-kpis rl-section">
          <ul className="rl-kpi-list" aria-label="Chiffres clés">
            {KPIS.map((k, i) => (
              <li key={i} className="rl-kpi" data-animate="kpi">
                <div className="rl-kpi-value" aria-label={k.value} data-animate="kpi-value">
                  <span className="rl-kpi-odometer" aria-hidden="true" data-final={k.value}>{k.value}</span>
                  <span className="sr-only">{k.value}</span>
                </div>
                <div className="rl-kpi-label" data-animate="kpi-label">{k.label}</div>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillars */}
        <div className="rl-pillars rl-section">
          <div className="rl-pillar-grid">
            {PILLARS.map((p, i) => (
              <article key={i} className="rl-pillar" data-animate="pillar">
                <div className="rl-pill-head">
                  <span className="rl-pill-icon" aria-hidden="true" data-animate="pillar-icon">{p.icon}</span>
                  <h3 className="rl-pillar-title">{p.title}</h3>
                </div>
                <ul className="rl-pillar-points">
                  {p.bullets.map((b, j) => (<li key={j}>{b}</li>))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        {/* Hex imagery band */}
        <div className="rl-hex rl-section" aria-hidden="true">
          <div className="rl-hex-band">
            <div className="hex hex-side" data-animate="hex" data-hex-role="side">
              <Image src={r3} alt="" className="hex-img" sizes="(min-width: 1024px) 320px, 40vw" loading="lazy" />
            </div>
            <div className="hex hex-center" data-animate="hex" data-hex-role="center">
              <Image src={r1} alt="" className="hex-img" sizes="(min-width: 1024px) 420px, 56vw" loading="lazy" />
            </div>
            <div className="hex hex-side" data-animate="hex" data-hex-role="side">
              <Image src={r2} alt="" className="hex-img" sizes="(min-width: 1024px) 320px, 40vw" loading="lazy" />
            </div>
          </div>
        </div>

        {/* Featured cases */}
        <div className="rl-cases rl-section">
          {CASES.map((c, idx) => (
            <article key={idx} className={`rl-case rl-case-split ${idx % 2 === 0 ? 'rl-case-a' : 'rl-case-b'}`} data-animate="case">
              <div className="rl-case-media"><Image src={c.image} alt={c.title} className="rl-case-img" sizes="(min-width: 1024px) 600px, 90vw" loading="lazy" data-animate="case-img" /></div>
              <div className="rl-case-copy">
                <h3 className="rl-case-title">{c.title}</h3>
                <p className="rl-case-text meta"><strong>Client:</strong> {c.client} • <strong>Pays:</strong> {c.country} • <strong>Période:</strong> {c.period}</p>
                <p className="rl-case-text"><strong>Problème:</strong> {c.problem}</p>
                <p className="rl-case-text"><strong>Solution:</strong> {c.solution}</p>
                <ul className="rl-case-results">
                  {c.result.slice(0,3).map((r, i) => (<li key={i}>{r}</li>))}
                </ul>
                <a href={c.url} className="rl-case-cta">Voir l’étude de cas</a>
              </div>
            </article>
          ))}
        </div>

        {/* Final CTA */}
        <div className="rl-final rl-section">
          <h3 className="rl-final-title reveal" data-animate="final">Besoin d’un aperçu détaillé ?</h3>
          <p className="rl-final-text reveal" data-animate="final">Recevez notre deck PDF ou échangez 15 minutes avec un chef de projet.</p>
          <div className="rl-final-ctas reveal" data-animate="final">
            <a href="#" className="btn btn-primary">Télécharger le deck</a>
            <a href="#contact" className="btn btn-secondary">Nous contacter</a>
          </div>
        </div>
      </div>
    </section>
  );
}
