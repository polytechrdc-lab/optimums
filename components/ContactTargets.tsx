"use client";

const CARDS = [
  { title: "Opérateurs", desc: "Solutions de collocation et services gérés.", href: "#contact-operateurs" },
  { title: "Propriétaires fonciers", desc: "Valorisez vos terrains & toits.", href: "#contact-fonciers" },
  { title: "Fournisseurs", desc: "Partenariats et appels d'offres.", href: "#contact-fournisseurs" },
  { title: "Investisseurs", desc: "Confiance et performance durable.", href: "#contact-investisseurs" },
];

export default function ContactTargets() {
  return (
    <section id="contact" aria-label="Contacts par profil" className="section">
      <div className="container" style={{ display: 'grid', gap: 16 }}>
        <h2 style={{ margin: 0 }}>Contact</h2>
        <div className="cards-grid" role="list">
          {CARDS.map((c) => (
            <a key={c.title} role="listitem" className="card vp-card contact-card" href={c.href}>
              <div className="vp-card-body">
                <h3 className="vp-title">{c.title}</h3>
                <p className="vp-desc">{c.desc}</p>
                <span className="vp-cta"><span className="link-label">Nous écrire</span></span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

