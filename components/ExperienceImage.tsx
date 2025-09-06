"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import towerSkyline from "../image/body/tower_skyline.png.webp";

export default function ExperienceImage() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let ticking = false;

    const compute = () => {
      ticking = false;
      if (reduce.matches) {
        media.style.transform = 'none';
        return;
      }
      const r = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const headerH = getComputedStyle(document.documentElement).getPropertyValue('--header-h')?.trim() || '72px';
      const utilH = getComputedStyle(document.documentElement).getPropertyValue('--utility-h')?.trim() || '0px';
      const headerPx = parseInt(headerH) + parseInt(utilH);
      // Normalize progress while sticky: 0 at entry, 1 at end of viewport travel
      // When sticky, section top ~= headerPx; we map media movement over viewport height
      const topWithinViewport = Math.max(0, Math.min(vh, r.top));
      const p = Math.max(0, Math.min(1, (headerPx - r.top) / Math.max(1, vh - headerPx)));
      // Ease-out
      const s = 1 - Math.pow(1 - p, 3);
      const translateMax = 80; // px
      const ty = (s - 0.5) * 2 * translateMax; // center around 0 for symmetric glide
      const scale = 1 + 0.05 * s;
      media.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true } as any);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="experience-image" aria-label="Illustration d'expérience">
      {/* B-media: image plein cadre */}
      <div ref={mediaRef} className="experience-media" aria-hidden>
        <Image
          src={towerSkyline}
          alt=""
          fill
          sizes="100vw"
          priority={false}
          style={{ objectFit: "cover", objectPosition: "75% 55%" }}
        />
      </div>
      {/* B-content: réservé pour futurs titres/texte */}
      <div className="experience-content" />
      {/* B-voile: calque au-dessus du contenu (désactivé par défaut) */}
      <div className="experience-voile" aria-hidden />
    </section>
  );
}
