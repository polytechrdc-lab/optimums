"use client";
import { useState } from 'react';

export default function FindSite() {
  const [q, setQ] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Hook to real locator or form target
    window.location.hash = "contact";
  };

  return (
    <section id="find-site" aria-label="Trouver un site" className="section findsite">
      <div className="container" style={{ display: 'grid', gap: 16 }}>
        <h2 style={{ margin: 0 }}>Trouver un site / couverture</h2>
        <form onSubmit={onSubmit} className="findsite-form" role="search" aria-label="Recherche de site">
          <input
            className="findsite-input"
            type="search"
            placeholder="Adresse / coordonnées / ville"
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            aria-label="Recherche"
          />
          <button className="findsite-btn" type="submit">
            Trouver un site
          </button>
        </form>
        <p className="muted" style={{ margin: 0 }}>
          Zones: DRC, Angola, Roaming — <a href="#markets" className="findsite-link">Voir la carte</a>
        </p>
      </div>
    </section>
  );
}

