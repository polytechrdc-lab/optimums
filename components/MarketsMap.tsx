"use client";
import { useState } from 'react';
import { mockMarkets } from '@/lib/mockData';

export default function MarketsMap() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="markets" aria-label="Operating markets" className="section">
      <div className="container" style={{ display: 'grid', gap: 16 }}>
        <h2 style={{ margin: 0 }}>Markets</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
          {/* Map placeholder canvas; replace with SVG or map library of choice */}
          <div className="placeholder-media" style={{ height: 320, borderRadius: 12 }} aria-hidden="true"></div>
          <div role="list" aria-label="Market list" style={{ display: 'grid', gap: 8 }}>
            {mockMarkets.map((m) => (
              <button
                key={m.id}
                role="listitem"
                className="placeholder-media"
                onClick={() => setActive(m.id)}
                aria-pressed={active === m.id}
                style={{
                  textAlign: 'left',
                  padding: 12,
                  borderRadius: 10,
                  background: active === m.id ? '#36c2b422' : undefined,
                  border: '1px dashed #ffffff22',
                  color: 'var(--text)'
                }}
              >
                <strong>{m.name}</strong>
                <div className="muted" style={{ fontSize: 12 }}>Placeholder KPI summary</div>
              </button>
            ))}
          </div>
        </div>
        {/* TODO: Hovering list items highlights regions on the map; focus sync for a11y. */}
      </div>
    </section>
  );
}

