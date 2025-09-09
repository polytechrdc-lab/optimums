"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import hat from "../image/body/hat-hse.png";

type GSAPType = any;

async function loadGsap(): Promise<{ gsap: GSAPType | null; ScrollTrigger: any | null }> {
  try {
    const g = await import("gsap");
    const st = await import("gsap/ScrollTrigger");
    (g as any).default?.registerPlugin(st.ScrollTrigger);
    return { gsap: (g as any).default ?? (g as any), ScrollTrigger: st.ScrollTrigger };
  } catch {
    return { gsap: null, ScrollTrigger: null };
  }
}

export default function WelcomeHealth() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    let ctx: any; let st: any; let killed = false;
    (async () => {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (!gsap || !ScrollTrigger || killed) return;
      const root = sectionRef.current!;
      const wrap = wrapRef.current!;
      ctx = gsap.context(() => {
        const headingLines = root.querySelectorAll('.wh-title .line');
        const leftText = root.querySelector('.wh-col-left .wh-text');
        const rightText = root.querySelector('.wh-col-right .wh-text');
        gsap.set([headingLines], { opacity: 0, y: 22 });
        gsap.set(wrap, { opacity: 0, y: 16, scale: 0.98, transformOrigin: '50% 50%' });
        gsap.set([leftText, rightText], { opacity: 0, y: 16 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 80%', end: '+=140%', scrub: 1 } });
        tl.to(headingLines, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.08 }, 0.0)
          .to([leftText, rightText], { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, 0.05)
          .to(wrap, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.06)
          .to(wrap, { yPercent: -10, ease: 'none' }, 0)
          .to(leftText, { yPercent: -6, ease: 'none' }, 0)
          .to(rightText, { yPercent: -8, ease: 'none' }, 0)
          .fromTo(wrap, { scale: 0.98 }, { scale: 1.12, ease: 'none' }, 0);
        gsap.to(wrap, { y: '+=6', duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to(leftText, { y: '+=4', duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
        gsap.to(rightText, { y: '+=5', duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      }, sectionRef);
    })();
    return () => { killed = true; try { st?.kill(); } catch {} try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section id="welcome-health" className="welcome-health" aria-label="Section QHSE — fond et visuel" ref={sectionRef}>
      <div className="container wh-grid-3">
        <div className="wh-col wh-col-left">
          <p className="wh-text">
            La Qualité, l’Hygiène, la Sécurité et l’Environnement ne vivent pas en silos.
            Vos opérations télécom non plus. C’est pour cela que nous avons repensé le QHSE.
          </p>
        </div>
        <div className="wh-col wh-col-center">
          <h2 className="wh-title" aria-label="Bienvenue dans un QHSE à la hauteur de vos réseaux">
            <span className="line">Bienvenue dans un QHSE</span><br className="wh-br" />
            <span className="line">à la hauteur de vos réseaux</span>
          </h2>
          <div className="wh-stage">
            <div className="wh-image-centered-wrap" ref={wrapRef}>
              <Image src={hat} alt="" fill sizes="(min-width: 1024px) 56vw, 92vw" className="wh-image-centered-img" priority />
            </div>
          </div>
        </div>
        <div className="wh-col wh-col-right">
          <p className="wh-text">
            Nous connectons vos équipes terrain, interventions réseau, conformité (ISO 9001/45001/14001) et données IoT
            dans un protocole QHSE opérationnel pensé pour réduire les incidents, protéger les équipes et l’environnement,
            et améliorer la disponibilité de vos sites.
          </p>
        </div>
      </div>
    </section>
  );
}
