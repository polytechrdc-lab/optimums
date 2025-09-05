"use client";
import AfricaMap from './AfricaMap';

export default function WhereWeOperate() {
  return (
    <section id="where" aria-label="Où nous opérons" className="section where">
      <div className="container where-grid">
        <div className="where-map"><AfricaMap /></div>
        <div className="where-copy">
          <div className="where-eyebrow">Où nous opérons</div>
          <h2 className="where-title">Présence régionale en Afrique</h2>
          <p className="where-desc">
            Nous opérons sur des marchés clés avec des équipes locales et des partenaires
            fiables, pour déployer, maintenir et optimiser des infrastructures critiques.
          </p>
          <a href="#markets" className="where-cta">Notre empreinte</a>
        </div>
      </div>
    </section>
  );
}
