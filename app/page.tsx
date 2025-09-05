import Hero from "@/components/Hero";
import FullHeight from "@/components/FullHeight";
import WhereOperateHelios from "@/components/WhereOperateHelios";
import EditorialCards from "@/components/EditorialCards";
import KpiBand from "@/components/KpiBand";

export default function HomePage() {
  return (
    <div>
      {/* Hero section with background media placeholder and CTA */}
      <Hero />

      {/* Section avec la mÃªme hauteur que le hero */}
      <FullHeight />

      {/* Where we operate â€” Helios-style interactive starter */}
      {/* <WhereOperateHelios /> */}

            <EditorialCards
        headline="Building a More Connected World"
        intro="Explore our priorities and how we partner with customers and communities."
        cards={[
          { href: '#services', title: 'What We Do', desc: 'Infrastructure, engineering, and operations.', img: require('../image/hero/tel1.jpg'), alt: 'Telecom towers at sunset' },
          { href: '#qhse', title: 'Responsibility', desc: 'Safety, quality and environment in action.', img: require('../image/hero/wh.jpg'), alt: 'Control room with monitoring screens' },
          { href: '#carriere', title: 'Careers', desc: 'Grow with projects that matter.', img: require('../image/hero/team.jpg'), alt: 'Team collaborating on site plans' },
        ]}
      />

      <KpiBand
        title="Our Experience"
        intro="A credibility snapshot across our footprint and operations."
        kpis={[
          { value: 3200, suffix: '+', label: 'Tower sites under management' },
          { value: 18, suffix: '+', label: 'Cities served' },
          { value: 98, suffix: '%', approx: true, label: 'Average uptime' },
        ]}
      />{/* Ancre pour le CTA RDC */}
    </div>
  );
}
