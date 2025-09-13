"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import hat from "../image/body/hat-hse.png";
import { gsapCore, isReducedMotion } from "@/lib/gsap";

export default function WelcomeHealth() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;

    let ctx: any; let killed = false;
    (async () => {
      const { gsap, ScrollTrigger } = await gsapCore();
      if (!gsap || !ScrollTrigger || killed) return;
      const root = sectionRef.current!;
      const wrap = wrapRef.current!;
      ctx = gsap.context(() => {
        const headingLines = root.querySelectorAll('[data-animate="wh-heading-line"]') as NodeListOf<HTMLElement>;
        const leftText = root.querySelector('[data-animate="wh-left"]') as HTMLElement | null;
        const rightText = root.querySelector('[data-animate="wh-right"]') as HTMLElement | null;
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

        // Idle motion discipline: create short, controllable loops and pause out of view
        const idleTweens: any[] = [];
        if (wrap) idleTweens.push(gsap.to(wrap, { y: '+=6', duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true }));
        if (leftText) idleTweens.push(gsap.to(leftText, { y: '+=4', duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true }));
        if (rightText) idleTweens.push(gsap.to(rightText, { y: '+=5', duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1, paused: true }));
        ScrollTrigger.create({
          trigger: root,
          start: 'top 90%',
          end: 'bottom 10%',
          onEnter: () => idleTweens.forEach(t => t.resume()),
          onEnterBack: () => idleTweens.forEach(t => t.resume()),
          onLeave: () => idleTweens.forEach(t => t.pause()),
          onLeaveBack: () => idleTweens.forEach(t => t.pause()),
        });
      }, sectionRef);
    })();
    return () => { killed = true; try { ctx?.revert(); } catch {} };
  }, []);

  return (
    <section id="welcome-health" className="welcome-health" aria-label="Section QHSE — fond et visuel" ref={sectionRef}>
      <div className="container wh-grid-3">
        <div className="wh-col wh-col-left">
          <p className="wh-text" data-animate="wh-left">
            La Qualité, l’Hygiène, la Sécurité et l’Environnement ne vivent pas en silos.
            Vos opérations télécom non plus. C’est pour cela que nous avons repensé le QHSE.
          </p>
        </div>
        <div className="wh-col wh-col-center">
          <h2 className="wh-title" aria-label="Bienvenue dans un QHSE à la hauteur de vos réseaux">
            <span className="line" data-animate="wh-heading-line">Bienvenue dans un QHSE</span><br className="wh-br" />
            <span className="line" data-animate="wh-heading-line">à la hauteur de vos réseaux</span>
          </h2>
          <div className="wh-stage">
            <div className="wh-image-centered-wrap" ref={wrapRef} data-parallax="-10">
              <Image src={hat} alt="" fill sizes="(min-width: 1024px) 56vw, 92vw" className="wh-image-centered-img" priority />
            </div>
          </div>
        </div>
        <div className="wh-col wh-col-right">
          <p className="wh-text" data-animate="wh-right">
            Nous connectons vos équipes terrain, interventions réseau, conformité (ISO 9001/45001/14001) et données IoT
            dans un protocole QHSE opérationnel pensé pour réduire les incidents, protéger les équipes et l’environnement,
            et améliorer la disponibilité de vos sites.
          </p>
        </div>
      </div>
    </section>
  );
}
