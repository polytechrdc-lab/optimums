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

      {/* Construire un monde plus connect� (cartes �ditoriales) */}
      <EditorialCards
        headline="Construire un monde plus connect�"
        intro="D�couvrez nos priorit�s et comment nous accompagnons nos clients et nos communaut�s."
        cards={[
          { href: '#services', title: 'Ce que nous faisons', desc: 'Infrastructures, ing�nierie et op�rations.', img: require('../image/hero/tel1.jpg'), alt: 'Tours t�l�com au coucher du soleil' },
          { href: '#qhse', title: 'Responsabilit� & QHSE', desc: 'S�curit�, qualit� et environnement en action.', img: require('../image/hero/wh.jpg'), alt: 'Salle de contr�le et �crans de supervision' },
          { href: '#carriere', title: 'Carri�res', desc: 'Progressez au sein de projets qui comptent.', img: require('../image/hero/team.jpg'), alt: '�quipe en r�union sur des plans' },
        ]}
      />

      {/* Notre exp�rience (bandeau KPIs) */}
      <KpiBand
        title="Notre exp�rience"
        intro="Un aper�u chiffr� de notre pr�sence et de nos op�rations."
        kpis={[
          { value: 3200, suffix: '+', label: 'Sites tours g�r�s' },
          { value: 18, suffix: '+', label: 'Villes desservies' },
          { value: 98, suffix: '%', approx: true, label: 'Disponibilit� moyenne' },
        ]}
      />
    </div>
  );
}
