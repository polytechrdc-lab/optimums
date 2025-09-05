"use client";
import { useEffect, useRef } from 'react';

export default function Ticker() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Minimal marquee-like scroll; replace with accessible alternative.
    const el = ref.current;
    if (!el) return;
    let id: number;
    let x = 0;
    const step = () => {
      x = (x - 0.5) % el.scrollWidth;
      el.style.transform = `translateX(${x}px)`;
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div aria-label="Ticker" style={{ overflow: 'hidden', borderTop: '1px solid #ffffff22', borderBottom: '1px solid #ffffff22', background: '#00000022' }}>
      <div style={{ whiteSpace: 'nowrap', willChange: 'transform' }} ref={ref}>
        {/* Neutral, non-branded placeholder text. */}
        <span style={{ padding: '8px 24px', display: 'inline-block' }}>Update 1: Placeholder announcement</span>
        <span style={{ padding: '8px 24px', display: 'inline-block' }}>Update 2: Another short line</span>
        <span style={{ padding: '8px 24px', display: 'inline-block' }}>Update 3: Replace with investor news</span>
      </div>
    </div>
  );
}

