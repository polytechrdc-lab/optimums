import Hero from "@/components/Hero";
import FullHeight from "@/components/FullHeight";
import EditorialCards from "@/components/EditorialCards";
import KpiBand from "@/components/KpiBand";

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

      {/* Notre experience (bandeau KPIs) */}
      <KpiBand
        title="Notre experience"
        intro="Un apercu chiffre de notre presence et de nos operations."
        kpis={[
          { value: 3200, suffix: "+", label: "Sites tours geres" },
          { value: 18, suffix: "+", label: "Villes desservies" },
          { value: 98, suffix: "%", approx: true, label: "Disponibilite moyenne" },
        ]}
      />
    </div>
  );
}
