"use client";

export default function CareersMiniHero() {
  return (
    <section id="careers" aria-label="Carrières" className="careers-mini">
      <div className="careers-bg" aria-hidden="true" />
      <div className="container careers-grid">
        <div className="careers-copy">
          <h2 className="careers-title">Rejoindre Optimum</h2>
          <p className="careers-deck">Des projets d'impact, des équipes engagées, une croissance durable.</p>
          <a href="#offres" className="careers-cta">Voir les offres</a>
        </div>
      </div>
    </section>
  );
}

