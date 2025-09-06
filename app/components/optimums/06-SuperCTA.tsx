"use client";
import React, { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/utils/scroll";

export function SuperCTA() {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let w = c.width = c.clientWidth * devicePixelRatio;
    let h = c.height = c.clientHeight * devicePixelRatio;
    let raf = 0;
    const particles = Array.from({ length: 32 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      z: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
    }));
    const draw = () => {
      ctx.clearRect(0,0,w,h);
      particles.forEach(p => {
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2 * p.z, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(10,85,232,0.25)';
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const onResize = () => { w = c.width = c.clientWidth * devicePixelRatio; h = c.height = c.clientHeight * devicePixelRatio; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, [reduced]);

  return (
    <section aria-labelledby="cta-title" style={{ position: 'relative', minHeight: '60vh' }}>
      <div style={{
        position: 'sticky',
        top: '72px',
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
      }}>
        <div aria-hidden className="mask-soft-edge" style={{ position: 'absolute', inset: '-10%', background: 'radial-gradient(120% 120% at 30% 20%, color-mix(in srgb, var(--brand) 25%, transparent), transparent 60%), radial-gradient(120% 120% at 70% 80%, color-mix(in srgb, var(--accent) 20%, transparent), transparent 60%)', filter: 'blur(24px)' }} />
        <canvas ref={canvasRef} aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: reduced ? 'none' : 'block' }} />
        <div style={{
          position: 'relative',
          zIndex: 1,
          width: 'min(920px, 92%)',
          padding: 24,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.65), rgba(255,255,255,0.35))',
          border: '1px solid #E6EEF9',
          borderRadius: 20,
          boxShadow: '0 12px 28px rgba(1,4,22,0.08)',
          transform: 'translateZ(0)',
        }}>
          <h2 id="cta-title" style={{ margin: 0, textAlign: 'center', fontSize: 'clamp(26px, 4.6vw, 40px)', color: 'var(--ink)' }}>Prêt à booster vos opérations ?</h2>
          <p style={{ margin: '10px auto 16px', textAlign: 'center', color: 'var(--muted)', maxWidth: 800 }}>Parlons fiabilité, sécurité et performance adaptées à vos contraintes terrain.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#contact" role="button" aria-label="Parler à un expert" className="u-focus-ring" style={{ background: 'var(--brand)', color: '#fff', textDecoration: 'none', fontWeight: 800, padding: '12px 16px', borderRadius: 12 }}>Parler à un expert</a>
            <a href="#playbook" role="button" aria-label="Télécharger notre playbook" className="u-focus-ring" style={{ background: '#fff', color: 'var(--brand)', textDecoration: 'none', fontWeight: 800, padding: '12px 16px', borderRadius: 12, border: '1px solid #E6EEF9' }}>Télécharger notre playbook</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SuperCTA;

