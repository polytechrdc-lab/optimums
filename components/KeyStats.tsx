"use client";
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export default function KeyStats() {
  const { data } = useSWR<{ items: { label: string; value: number; suffix?: string }[] }>(
    '/api/stats',
    fetcher
  );

  return (
    <section id="stats" aria-label="Key statistics" className="section">
      <div className="container" style={{ display: 'grid', gap: 16 }}>
        <h2 style={{ margin: 0 }}>At a Glance</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
          {(data?.items ?? Array.from({ length: 4 }).map((_, i) => ({ label: 'Loading', value: 0 }))).map((s, i) => (
            <article key={i} className="placeholder-media" style={{ padding: 16, borderRadius: 12 }}>
              {/* TODO: Replace with animated count-up; ensure reduced motion accessible */}
              <div style={{ fontSize: 28, fontWeight: 800 }}>{s.value}{s.suffix}</div>
              <div className="muted" style={{ fontSize: 14 }}>{s.label}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

