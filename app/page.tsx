import Hero from "@/components/Hero";
import FullHeight from "@/components/FullHeight";
import WhereOperateHelios from "@/components/WhereOperateHelios";
import EditorialCards from "@/components/EditorialCards";
import KpiBand from "@/components/KpiBand";

export default function HomePage() {
  return (
    <div>
      {/* Section Hero */}
      <Hero />

      {/* Section de transition pleine hauteur */}
      <FullHeight />

      {/* Construire un monde plus connecté (cartes éditoriales) */}
      <EditorialCards
        headline="Construire un monde plus connecté"
        intro="Découvrez nos priorités et comment nous accompagnons nos clients et nos communautés."
        cards={[
          { href: '#services', title: 'Ce que nous faisons', desc: 'Infrastructures, ingénierie et opérations.', img: require('../image/hero/tel1.jpg'), alt: 'Tours télécom au coucher du soleil' },
          { href: '#qhse', title: 'Responsabilité & QHSE', desc: 'Sécurité, qualité et environnement en action.', img: require('../image/hero/wh.jpg'), alt: 'Salle de contrôle et écrans de supervision' },
          { href: '#carriere', title: 'Carrières', desc: 'Progressez au sein de projets qui comptent.', img: require('../image/hero/team.jpg'), alt: 'Équipe en réunion sur des plans' },
        ]}
      />

      {/* Notre expérience (bandeau KPIs) */}
      <KpiBand
        title="Notre expérience"
        intro="Un aperçu chiffré de notre présence et de nos opérations."
        kpis={[
          { value: 3200, suffix: '+', label: 'Sites tours gérés' },
          { value: 18, suffix: '+', label: 'Villes desservies' },
          { value: 98, suffix: '%', approx: true, label: 'Disponibilité moyenne' },
        ]}
      />
    </div>
  );
}
