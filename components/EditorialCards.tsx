"use client";
import Image from 'next/image';

type Card = {
  href: string;
  title: string;
  desc?: string;
  img: any;
  alt: string;
};

export default function EditorialCards({
  headline = 'Building a More Connected World',
  intro = 'Explore our priorities and how we partner with customers and communities.',
  cards,
}: {
  headline?: string;
  intro?: string;
  cards: Card[];
}) {
  return (
    <section className="edcards-section" aria-label={headline}>
      <div className="container edcards-wrap">
        <h2 className="edcards-title">{headline}</h2>
        {intro && <p className="edcards-intro">{intro}</p>}
        <div className="edcards-grid">
          {cards.map((card, i) => (
            <a key={i} href={card.href} className="edcard" aria-label={`${card.title}: ${card.desc ?? 'Learn more'}`}>
              <div className="edcard-media">
                <Image src={card.img} alt={card.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw" loading="lazy" className="edcard-img" />
                <div className="edcard-tint" aria-hidden="true" />
              </div>
              <div className="edcard-content">
                <div className="edcard-title-row">
                  <span className="edcard-title">{card.title}</span>
                  <span className="edcard-arrow" aria-hidden>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                {card.desc && <p className="edcard-desc">{card.desc}</p>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

