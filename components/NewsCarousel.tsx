"use client";
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { useRef, useState } from 'react';

export default function NewsCarousel() {
  const { data } = useSWR<{ items: { id: string; title: string; date: string }[] }>(
    '/api/news',
    fetcher
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const items = data?.items ?? Array.from({ length: 5 }).map((_, i) => ({ id: String(i), title: 'Loading…', date: '' }));

  const next = () => setIndex((i) => (i + 1) % items.length);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);

  return (
    <section id="updates" aria-label="Latest updates" className="section">
      <div className="container" style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0 }}>Latest Updates</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={prev} aria-label="Previous">‹</button>
            <button className="btn" onClick={next} aria-label="Next">›</button>
          </div>
        </div>
        <div
          ref={containerRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Updates carousel"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}
        >
          {items.slice(index, index + 3).map((n) => (
            <article key={n.id} className="placeholder-media" style={{ padding: 16, borderRadius: 12 }}>
              {/* Replace with card layout; preserve dates and tags semantics */}
              <div className="muted" style={{ fontSize: 12 }}>{n.date || '—'}</div>
              <h3 style={{ marginTop: 8 }}>{n.title}</h3>
            </article>
          ))}
        </div>
        {/* TODO: Add swipe gestures on touch; auto-advance with pause-on-hover and prefers-reduced-motion support. */}
      </div>
    </section>
  );
}

