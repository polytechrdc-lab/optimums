"use client";

export default function ValueProps() {
  const items = [
    {
      title: "Tours & Rooftops",
      desc: "Collocation, déploiement et gestion de sites clés en main.",
    },
    {
      title: "Énergie & Backup",
      desc: "Alimentation fiable, optimisation et maintenance des systèmes.",
    },
    {
      title: "Déploiement & Maintenance",
      desc: "Construction, intégration, opérations et SLA de disponibilité.",
    },
    {
      title: "Audit & Optimisation",
      desc: "Audits techniques, redressements et amélioration continue.",
    },
  ];

  return (
    <section id="solutions" aria-label="Nos solutions" className="section">
      <div className="container" style={{ display: 'grid', gap: 24 }}>
        <h2 style={{ margin: 0 }}>Solutions</h2>
        <div className="cards-grid" role="list">
          {items.map((it, i) => (
            <article role="listitem" key={i} className="card vp-card">
              <div className="vp-card-body">
                <h3 className="vp-title">{it.title}</h3>
                <p className="vp-desc">{it.desc}</p>
                <a href="#contact" className="vp-cta" aria-label={`${it.title} — en savoir plus`}>
                  <span className="link-label">En savoir plus</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

