import Image from 'next/image';
import OptimumLogo from '../image/logo/LOGO-OPTIMUM-icone.png';

export default function Footer() {
  const year = new Date().getFullYear();
  const socials = [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/optimum-solutions', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9h3v9H6zM7.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM11 9h2.8v1.2h.04c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V18h-3v-4.1c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V18H11z" fill="currentColor"/></svg>
    )},
    { name: 'Twitter', href: 'https://twitter.com/optimum_solutions', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 5.9c-.7.3-1.5.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.7.4-1.6.8-2.4 1-1.4-1.6-3.8-1.6-5.3-.2-1 1-1.3 2.5-.9 3.8-3-.1-5.8-1.6-7.6-4-.9 1.6-.5 3.7 1 4.7-.6 0-1.1-.2-1.6-.4 0 1.8 1.3 3.4 3 3.8-.5.2-1 .2-1.5.1.4 1.5 1.9 2.6 3.5 2.6-1.3 1-3 1.6-4.7 1.6H3c1.7 1.1 3.7 1.7 5.7 1.7 6.8 0 10.6-5.7 10.4-10.9.7-.5 1.4-1.2 1.9-1.9z" fill="currentColor"/></svg>
    )},
    { name: 'Facebook', href: 'https://facebook.com/optimumsolutions', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 9h3V6h-3c-1.7 0-3 1.3-3 3v2H7v3h3v7h3v-7h2.6l.4-3H13V9z" fill="currentColor"/></svg>
    )},
    { name: 'Instagram', href: 'https://instagram.com/optimumsolutions', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor"/><circle cx="12" cy="12" r="4" stroke="currentColor"/><circle cx="18" cy="6" r="1.2" fill="currentColor"/></svg>
    )},
    { name: 'YouTube', href: 'https://youtube.com/@optimumsolutions', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M23 12s0-3.4-.4-5c-.2-.8-.9-1.5-1.7-1.7C18.8 4.8 12 4.8 12 4.8s-6.8 0-8.9.5c-.8.2-1.5.9-1.7 1.7C.9 8.6.9 12 .9 12s0 3.4.4 5c.2.8.9 1.5 1.7 1.7 2.1.5 8.9.5 8.9.5s6.8 0 8.9-.5c.8-.2 1.5-.9 1.7-1.7.4-1.6.4-5 .4-5z" stroke="currentColor"/><path d="M10 9l5 3-5 3V9z" fill="currentColor"/></svg>
    )},
    { name: 'WhatsApp', href: 'https://wa.me/243998362426', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 12a8 8 0 0 1-11.8 7L4 20l1-4.2A8 8 0 1 1 20 12z" stroke="currentColor"/><path d="M8.5 9.5c.3-.6.4-1 .9-1 .3 0 .6 0 1 .8.4.7.6 1.1.5 1.3-.1.2-.3.4-.6.6-.2.2-.2.4 0 .7.2.4.8 1.3 1.8 1.9 1 .6 1.6.7 2 .6.3-.1.5-.3.6-.5.1-.3.3-.5.5-.5.2 0 .8.4 1.1.6.3.2.5.4.5.7 0 .3-.2.9-.6 1.3-.4.4-1 .7-1.7.7-1.5 0-3.3-.7-4.6-1.9C9.2 13.8 8 12 8 10.6c0-.6.2-1 .5-1.1z" fill="currentColor"/></svg>
    )},
  ];
  return (
    <footer role="contentinfo" aria-label="Pied de page" className="site-footer">
      <div className="container" style={{ display: 'grid', gap: 24 }}>
        <div className="footer-grid">
          <div>
            <a href="/" aria-label="Optimum Solutions — Accueil" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8, color: '#fff', textDecoration: 'none' }}>
              <Image src={OptimumLogo} alt="" width={36} height={36} style={{ borderRadius: 6 }} />
              <span className="footer-title" style={{ margin: 0 }}>Optimum Solutions</span>
            </a>
            <p style={{ margin: 0, maxWidth: '60ch', color: '#E6EEF9' }}>
              Connecter. Construire. Optimiser. Infrastructures télécoms et services d’ingénierie
              pour accélérer la performance des réseaux.
            </p>
          </div>
          <nav aria-label="Navigation pied de page">
            <h4 className="footer-title">Navigation</h4>
            <ul className="footer-links">
              <li><a className="footer-link" href="#services">Services</a></li>
              <li><a className="footer-link" href="#markets">Implantations</a></li>
              <li><a className="footer-link" href="#updates">Actualités</a></li>
              <li><a className="footer-link" href="#sustainability">Impact</a></li>
            </ul>
          </nav>
          <div>
            <h4 className="footer-title">Contact</h4>
            <ul className="footer-links">
              <li><a className="footer-link" href="mailto:contact@optimumsolutions.com">contact@optimumsolutions.com</a></li>
              <li><a className="footer-link" href="tel:+243998362426">+243 998 362 426</a></li>
              <li><a className="footer-link" href="#contact">Formulaire de contact</a></li>
            </ul>
            <div className="footer-social" aria-label="Réseaux sociaux">
              {socials.map(s => (
                <a key={s.name} href={s.href} aria-label={s.name} target="_blank" rel="noopener noreferrer">{s.icon}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© {year} Optimum Solutions — Tous droits réservés.</div>
          <div>
            <a className="footer-link" href="#mentions">Mentions légales</a>
            {' '}
            ·{' '}
            <a className="footer-link" href="#confidentialite">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
