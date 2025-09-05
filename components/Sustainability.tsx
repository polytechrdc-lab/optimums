export default function Sustainability() {
  return (
    <section id="sustainability" aria-label="Sustainability" className="section esg">
      <div className="container esg-grid">
        <div className="esg-media" aria-hidden="true">
          <div className="placeholder-media" style={{ height: 300, borderRadius: 12 }} />
        </div>
        <div className="esg-copy">
          <div className="esg-eyebrow">Notre impact</div>
          <h2 className="esg-title">Sécurité, environnement et communautés</h2>
          <p className="esg-desc">
            Nous investissons durablement pour sécuriser les équipes, réduire l'empreinte carbone
            et soutenir les communautés locales.
          </p>
          <ul className="esg-list">
            <li>Programmes HSE et formation continue</li>
            <li>Optimisation énergétique et réduction des émissions</li>
            <li>Initiatives sociales avec partenaires locaux</li>
          </ul>
          <a href="#impact" className="esg-cta">Notre impact</a>
        </div>
      </div>
    </section>
  );
}
