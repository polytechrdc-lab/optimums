import Hero from "@/components/Hero";
import FullHeight from "@/components/FullHeight";
import WhereOperateHelios from "@/components/WhereOperateHelios";

export default function HomePage() {
  return (
    <div>
      {/* Hero section with background media placeholder and CTA */}
      <Hero />

      {/* Section avec la même hauteur que le hero */}
      <FullHeight />

      {/* Where we operate — Helios-style interactive starter */}
      {/* <WhereOperateHelios /> */}

      {/* Ancre pour le CTA RDC */}
      <section
        id="empreinte-rdc"
        className="section"
        aria-label="Notre empreinte en RDC"
      >
        <div className="container" style={{ display: "grid", gap: 12 }}>
          <h2 style={{ margin: 0 }}>Notre empreinte en RDC</h2>
          <p className="muted" style={{ maxWidth: "70ch" }}>
            3 250 sites actifs dans 18 villes. Uptime moyen 98,9 %. Couverture
            en croissance continue, infrastructures sécurisées et entretenues
            par des équipes locales.
          </p>
        </div>
      </section>
    </div>
  );
}
