import Hero from "@/components/Hero";
import FullHeight from "@/components/FullHeight";
import EditorialCards from "@/components/EditorialCards";
import KpiBand from "@/components/KpiBand";
import Image from "next/image";
import towerSkyline from "../image/body/tower_skyline.png.webp";

export default function HomePage() {
  return (
    <div>
      {/* Section Hero */}
      <Hero />

      {/* Section de transition pleine hauteur */}
      <FullHeight />

      {/* Construire un monde plus connecte (cartes editoriales) */}
      <EditorialCards
        headline="Construire un monde plus connecte"
        intro="Decouvrez nos priorites et comment nous accompagnons nos clients et nos communautes."
        cards={[
          { href: "#services", title: "Ce que nous faisons", desc: "Infrastructures, ingenierie et operations.", img: require("../image/hero/tel1.jpg"), alt: "Tours telecom au coucher du soleil" },
          { href: "#qhse", title: "Responsabilite & QHSE", desc: "Securite, qualite et environnement en action.", img: require("../image/hero/wh.jpg"), alt: "Salle de controle et ecrans de supervision" },
          { href: "#carriere", title: "Carrieres", desc: "Progressez au sein de projets qui comptent.", img: require("../image/hero/team.jpg"), alt: "Equipe en reunion sur des plans" },
        ]}
      />

      {/* Notre expérience (bandeau KPIs) — stage sticky interne au composant */}
      <KpiBand
        title="Notre expérience"
        intro="Un aperçu chiffré de notre empreinte et de nos opérations."
        kpis={[
          { value: 1200, approx: true, suffix: "+", label: "Sites tours en RDC" },
          { value: 18, suffix: "+", label: "Villes desservies" },
          { value: 3000, approx: true, suffix: "+", label: "Kilomètres de fibre optique déployés" },
        ]}
      />

      {/* Section image plein cadre sous "Notre expérience" */}
      <section className="experience-image" aria-label="Illustration d'expérience">
        <div className="experience-media" aria-hidden>
          <Image
            src={towerSkyline}
            alt=""
            fill
            sizes="100vw"
            priority={false}
            style={{ objectFit: 'cover', objectPosition: '75% 55%' }}
          />
        </div>
      </section>

      {/* (supprimé) aucune section supplémentaire après "Notre expérience" */}
    </div>
  );
}
