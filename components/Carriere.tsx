"use client";
import Image from "next/image";
import hero from "../image/body/work with us.jpg";

export default function Carriere() {
  return (
    <section id="carriere" className="carriere-hero" aria-label="Carrière">
      <div className="ca-hero-bg" aria-hidden="true">
        <Image src={hero} alt="" fill className="ca-hero-img" priority aria-hidden="true" />
      </div>
      <div className="container ca-hero-wrap">
        <aside className="ca-panel" role="complementary">
          <div className="ca-head">
            <span className="ca-accent-bar" aria-hidden="true" />
            <h2 className="ca-title"><span className="ca-title-hl">Construisons les réseaux de demain.</span></h2>
          </div>
          <div className="ca-body">
            <p>Rejoignez une équipe qui conçoit, déploie et opère des infrastructures télécoms à fort impact — avec l’exigence, la sécurité et la qualité comme standards.</p>
            <p>Nous recherchons des profils engagés pour livrer des projets ambitieux, à l’échelle et dans la durée.</p>
          </div>
          <div className="ca-actions">
            <a href="#" className="ca-link">Voir nos offres</a>
          </div>
        </aside>
      </div>
    </section>
  );
}
