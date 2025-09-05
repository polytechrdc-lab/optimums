"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import logo from '../image/logo/LOGO-OPTIMUM-icone.png';

type DropdownId = null | 'services' | 'clients' | 'apropos' | 'qhse' | 'implantations' | 'contact';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const [mobileOpenId, setMobileOpenId] = useState<DropdownId>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [caretLeft, setCaretLeft] = useState<number | null>(null);

  // Preview behavior: header is transparent at rest, solid after any scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true } as any);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const inHeader = headerRef.current?.contains(target);
      const inPanel = panelRef.current?.contains(target);
      if (!inHeader && !inPanel) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Close dropdowns on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Blur handling: close dropdowns when focus leaves the nav
  const onNavBlurCapture = () => {
    setTimeout(() => {
      const nav = dropdownRef.current;
      if (!nav) return;
      const active = document.activeElement as HTMLElement | null;
      if (active && !nav.contains(active)) {
        setOpenDropdown(null);
      }
    }, 0);
  };

  // Keyboard navigation helpers
  const focusFirstItem = (panel: HTMLElement | null) => {
    if (!panel) return;
    const items = panel.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
    if (items.length) items[0].focus();
  };
  const moveBetweenTopLevel = (currentButton: HTMLElement, dir: -1 | 1, keepPanel = false) => {
    const buttons = Array.from(
      dropdownRef.current?.querySelectorAll<HTMLButtonElement>('.nav-button') ?? []
    );
    const idx = buttons.indexOf(currentButton as HTMLButtonElement);
    if (idx === -1) return;
    const nextBtn = buttons[(idx + dir + buttons.length) % buttons.length];
    nextBtn.focus();
    const nextId = nextBtn.getAttribute('data-id') as DropdownId | null;
    setOpenDropdown(keepPanel ? nextId : null);
  };
  const moveInMenu = (currentItem: HTMLElement, dir: -1 | 1) => {
    const panel = currentItem.closest('.mega-panel') as HTMLElement | null;
    if (!panel) return;
    const items = Array.from(panel.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])'));
    const idx = items.indexOf(currentItem);
    if (idx === -1) return;
    const next = (idx + dir + items.length) % items.length;
    items[next].focus();
  };

  // Recompute caret position under active button
  useEffect(() => {
    if (!openDropdown) { setCaretLeft(null); return; }
    const btn = document.getElementById(`btn-${openDropdown}`);
    if (!btn) { setCaretLeft(null); return; }
    const rect = btn.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    setCaretLeft(center);
  }, [openDropdown]);

  // Open/close search modal and focus management
  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 0);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          setSearchOpen(false);
          searchBtnRef.current?.focus();
        } else if (e.key === 'Tab') {
          // Simple focus trap inside dialog
          const dialog = document.getElementById('search-dialog');
          if (!dialog) return;
          const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(
            'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )).filter(el => !el.hasAttribute('disabled'));
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          const active = document.activeElement as HTMLElement | null;
          if (!e.shiftKey && active === last) {
            e.preventDefault();
            first.focus();
          } else if (e.shiftKey && active === first) {
            e.preventDefault();
            last.focus();
          }
        }
      };
      document.addEventListener('keydown', onKey);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('keydown', onKey);
      };
    }
  }, [searchOpen]);

  return (
    <>
    <header
      className="site-header"
      role="banner"
      aria-label="Site header"
      data-solid={scrolled ? 'true' : 'false'}
      ref={headerRef}
    >
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', height: 72, gap: 12 }}>
        {/* Left: Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" aria-label="Homepage" className="header-item" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
            <Image src={logo} alt="Optimum" width={140} height={36} priority style={{ height: 36, width: 'auto' }} />
            <span style={{ marginLeft: 10, fontWeight: 800, letterSpacing: '0.02em', fontSize: 18 }}>Optimum Solutions</span>
          </a>
        </div>

        {/* Center: Desktop primary nav */}
        <nav className="header-desktop-nav" aria-label="Navigation principale" ref={dropdownRef} onBlurCapture={onNavBlurCapture}>
          <ul className="header-nav-list">
            {/* Nos services (mega menu) */}
            <li className="nav-item">
              <button
                id="btn-services"
                data-id="services"
                className="nav-button header-item"
                aria-haspopup="true"
                aria-expanded={openDropdown === 'services'}
                aria-controls="mega-panel-services"
                onClick={() => setOpenDropdown(v => v === 'services' ? null : 'services')}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setOpenDropdown('services');
                    const panel = document.getElementById('mega-panel-services');
                    focusFirstItem(panel as HTMLElement);
                  } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    moveBetweenTopLevel(e.currentTarget, 1, !!openDropdown);
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    moveBetweenTopLevel(e.currentTarget, -1, !!openDropdown);
                  } else if (e.key === 'Tab' && !e.shiftKey && openDropdown === 'services') {
                    e.preventDefault();
                    const panel = document.getElementById('mega-panel-services');
                    focusFirstItem(panel as HTMLElement);
                  }
                }}
              >Nos services <span className="chevron" aria-hidden="true" /></button>
            </li>

            {/* Nos clients */}
            <li className="nav-item">
              <button
                id="btn-clients"
                data-id="clients"
                className="nav-button header-item"
                aria-haspopup="true"
                aria-expanded={openDropdown === 'clients'}
                aria-controls="mega-panel-clients"
                onClick={() => setOpenDropdown(v => v === 'clients' ? null : 'clients')}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setOpenDropdown('clients');
                    const panel = document.getElementById('mega-panel-clients');
                    focusFirstItem(panel as HTMLElement);
                  } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    moveBetweenTopLevel(e.currentTarget, 1, !!openDropdown);
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    moveBetweenTopLevel(e.currentTarget, -1, !!openDropdown);
                  } else if (e.key === 'Tab' && !e.shiftKey && openDropdown === 'clients') {
                    e.preventDefault();
                    const panel = document.getElementById('mega-panel-clients');
                    focusFirstItem(panel as HTMLElement);
                  }
                }}
              >Nos clients <span className="chevron" aria-hidden="true" /></button>
            </li>

            {/* Implantations */}
            <li className="nav-item">
              <button
                id="btn-implantations"
                data-id="implantations"
                className="nav-button header-item"
                aria-haspopup="true"
                aria-expanded={openDropdown === 'implantations'}
                aria-controls="mega-panel-implantations"
                onClick={() => setOpenDropdown(v => v === 'implantations' ? null : 'implantations')}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setOpenDropdown('implantations');
                    const panel = document.getElementById('mega-panel-implantations');
                    focusFirstItem(panel as HTMLElement);
                  } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    moveBetweenTopLevel(e.currentTarget, 1, !!openDropdown);
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    moveBetweenTopLevel(e.currentTarget, -1, !!openDropdown);
                  } else if (e.key === 'Tab' && !e.shiftKey && openDropdown === 'implantations') {
                    e.preventDefault();
                    const panel = document.getElementById('mega-panel-implantations');
                    focusFirstItem(panel as HTMLElement);
                  }
                }}
              >Implantations <span className="chevron" aria-hidden="true" /></button>
            </li>

            <li className="nav-item">
              <button
                id="btn-apropos"
                data-id="apropos"
                className="nav-button header-item"
                aria-haspopup="true"
                aria-expanded={openDropdown === 'apropos'}
                aria-controls="mega-panel-apropos"
                onClick={() => setOpenDropdown(v => v === 'apropos' ? null : 'apropos')}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setOpenDropdown('apropos');
                    const panel = document.getElementById('mega-panel-apropos');
                    focusFirstItem(panel as HTMLElement);
                  } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    moveBetweenTopLevel(e.currentTarget, 1, !!openDropdown);
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    moveBetweenTopLevel(e.currentTarget, -1, !!openDropdown);
                  } else if (e.key === 'Tab' && !e.shiftKey && openDropdown === 'apropos') {
                    e.preventDefault();
                    const panel = document.getElementById('mega-panel-apropos');
                    focusFirstItem(panel as HTMLElement);
                  }
                }}
              >À propos <span className="chevron" aria-hidden="true" /></button>
            </li>

            {/* QHSE */}
            <li className="nav-item">
              <button
                id="btn-qhse"
                data-id="qhse"
                className="nav-button header-item"
                aria-haspopup="true"
                aria-expanded={openDropdown === 'qhse'}
                aria-controls="mega-panel-qhse"
                onClick={() => setOpenDropdown(v => v === 'qhse' ? null : 'qhse')}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setOpenDropdown('qhse');
                    const panel = document.getElementById('mega-panel-qhse');
                    focusFirstItem(panel as HTMLElement);
                  } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    moveBetweenTopLevel(e.currentTarget, 1, !!openDropdown);
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    moveBetweenTopLevel(e.currentTarget, -1, !!openDropdown);
                  } else if (e.key === 'Tab' && !e.shiftKey && openDropdown === 'qhse') {
                    e.preventDefault();
                    const panel = document.getElementById('mega-panel-qhse');
                    focusFirstItem(panel as HTMLElement);
                  }
                }}
              >QHSE <span className="chevron" aria-hidden="true" /></button>
            </li>
            {/* Contact */}
            <li className="nav-item">
              <button
                id="btn-contact"
                data-id="contact"
                className="nav-button header-item"
                aria-haspopup="true"
                aria-expanded={openDropdown === 'contact'}
                aria-controls="mega-panel-contact"
                onClick={() => setOpenDropdown(v => v === 'contact' ? null : 'contact')}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setOpenDropdown('contact');
                    const panel = document.getElementById('mega-panel-contact');
                    focusFirstItem(panel as HTMLElement);
                  } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    moveBetweenTopLevel(e.currentTarget, 1, !!openDropdown);
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    moveBetweenTopLevel(e.currentTarget, -1, !!openDropdown);
                  } else if (e.key === 'Tab' && !e.shiftKey && openDropdown === 'contact') {
                    e.preventDefault();
                    const panel = document.getElementById('mega-panel-contact');
                    focusFirstItem(panel as HTMLElement);
                  }
                }}
              >Contact <span className="chevron" aria-hidden="true" /></button>
            </li>
          </ul>
        </nav>

        {/* Right: CTA + mobile menu button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center' }}>
          {/* Search button: 40x40 circle with 44x44 hit area */}
          <button
            ref={searchBtnRef}
            type="button"
            className="search-btn header-item"
            aria-label="Search"
            aria-controls="search-dialog"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen(true)}
          >
            <span className="icon-search" aria-hidden="true">🔍</span>
          </button>
          <button
            className="mobile-menu-btn mobile-only header-item"
            aria-expanded={mobileOpen}
            aria-controls="primary-nav"
            onClick={() => setMobileOpen(v => !v)}
          >Menu</button>
        </div>
      </div>

      {/* Mobile nav (collapsible) */}
      <nav id="primary-nav" aria-label="Navigation principale" className="mobile-only" style={{ display: mobileOpen ? 'block' : 'none' }}>
        <div className="container" style={{ paddingBottom: 12 }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 16 }}>
            {/* Accordion: Nos services */}
            <li>
              <button className="mobile-accordion" aria-expanded={mobileOpenId === 'services'} onClick={() => setMobileOpenId(v => v === 'services' ? null : 'services')}>Nos services <span className="chevron" aria-hidden="true" /></button>
              {mobileOpenId === 'services' && (
                <div className="mobile-accordion-panel">
                  <p className="muted" style={{ marginTop: 0 }}>Description courte de la section et des services proposés.</p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
                    <li className="muted">Infrastructures télécoms</li>
                    <li><a href="#services-infrastructures-audit">Audit de tours</a></li>
                    <li><a href="#services-infrastructures-redressement">Redressement</a></li>
                    <li><a href="#services-infrastructures-bts">Construction sites/BTS</a></li>
                    <li><a href="#services-infrastructures-maintenance">Maintenance</a></li>
                    <li><a href="#services-infrastructures-supervision">Supervision</a></li>
                    <li className="muted" style={{ marginTop: 8 }}>Énergie / Power</li>
                    <li><a href="#services-energie-audits">Audits</a></li>
                    <li><a href="#services-energie-maintenance">Maintenance</a></li>
                    <li className="muted" style={{ marginTop: 8 }}>Fibre & Transmission</li>
                    <li><a href="#services-fibre-optique">Fibre optique</a></li>
                    <li><a href="#services-fibre-tirage">Tirage & raccordement</a></li>
                    <li className="muted" style={{ marginTop: 8 }}>Génie civil & Projets</li>
                    <li><a href="#services-genie-conception">Conception structures acier</a></li>
                    <li><a href="#services-genie-controle">Contrôle & supervision</a></li>
                    <li><a href="#services-genie-pmo">PMO</a></li>
                    <li><a href="#services-genie-due">Due diligence</a></li>
                    <li><a href="#services-genie-acquisition">Acquisition sites</a></li>
                    <li><a href="#services-genie-audit-equip">Audit équipements</a></li>
                  </ul>
                </div>
              )}
            </li>
            {/* Accordion: Nos clients */}
            <li>
              <button className="mobile-accordion" aria-expanded={mobileOpenId === 'clients'} onClick={() => setMobileOpenId(v => v === 'clients' ? null : 'clients')}>Nos clients <span className="chevron" aria-hidden="true" /></button>
              {mobileOpenId === 'clients' && (
                <div className="mobile-accordion-panel">
                  <p className="muted" style={{ marginTop: 0 }}>Études de cas, témoignages et réalisations clés.</p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
                    <li><a href="#clients-cas">Études de cas</a></li>
                    <li><a href="#clients-témoignages">Clients & témoignages</a></li>
                    <li><a href="#clients-realisations">Réalisations (KPI/Projets)</a></li>
                  </ul>
                </div>
              )}
            </li>
            {/* Accordion: À propos */}
            <li>
              <button className="mobile-accordion" aria-expanded={mobileOpenId === 'apropos'} onClick={() => setMobileOpenId(v => v === 'apropos' ? null : 'apropos')}>À propos <span className="chevron" aria-hidden="true" /></button>
              {mobileOpenId === 'apropos' && (
                <div className="mobile-accordion-panel">
                  <p className="muted" style={{ marginTop: 0 }}>Informations sur l’histoire, l’équipe, les bureaux et les valeurs.</p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
                    <li><a href="#apropos-histoire">Histoire & vision</a></li>
                    <li><a href="#apropos-equipe">Équipe/leadership</a></li>
                    <li><a href="#apropos-bureaux">Bureaux (Kinshasa; Lubumbashi; Matadi)</a></li>
                    <li><a href="#apropos-valeurs">Valeurs</a></li>
                  </ul>
                </div>
              )}
            </li>
            {/* Accordion: QHSE */}
            <li>
              <button className="mobile-accordion" aria-expanded={mobileOpenId === 'qhse'} onClick={() => setMobileOpenId(v => v === 'qhse' ? null : 'qhse')}>QHSE <span className="chevron" aria-hidden="true" /></button>
              {mobileOpenId === 'qhse' && (
                <div className="mobile-accordion-panel">
                  <p className="muted" style={{ marginTop: 0 }}>Politique, sécurité, environnement et conformité.</p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
                    <li><a href="#qhse-politique">Politique QHSE</a></li>
                    <li><a href="#qhse-sécurité">Sécurité au travail</a></li>
                    <li><a href="#qhse-environnement">Environnement/ESG</a></li>
                    <li><a href="#qhse-certifications">Certifications/ISO</a></li>
                    <li><a href="#qhse-ethique">Éthique & conformité</a></li>
                  </ul>
                </div>
              )}
            </li>
            {/* Accordion: Implantations */}
            <li>
              <button className="mobile-accordion" aria-expanded={mobileOpenId === 'implantations'} onClick={() => setMobileOpenId(v => v === 'implantations' ? null : 'implantations')}>Implantations <span className="chevron" aria-hidden="true" /></button>
              {mobileOpenId === 'implantations' && (
                <div className="mobile-accordion-panel">
                  <p className="muted" style={{ marginTop: 0 }}>Notre empreinte et nos marchés.</p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
                    <li><a href="#empreinte-rdc">RDC — Vue d’ensemble</a></li>
                    <li><a href="#markets">Marchés / Pays</a></li>
                  </ul>
                </div>
              )}
            </li>
            {/* Accordion: Contact */}
            <li>
              <button className="mobile-accordion" aria-expanded={mobileOpenId === 'contact'} onClick={() => setMobileOpenId(v => v === 'contact' ? null : 'contact')}>Contact <span className="chevron" aria-hidden="true" /></button>
              {mobileOpenId === 'contact' && (
                <div className="mobile-accordion-panel">
                  <p className="muted" style={{ marginTop: 0 }}>Écrivez-nous ou contactez une équipe dédiée.</p>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
                    <li><a href="#contact">Formulaire de contact</a></li>
                    <li><a href="mailto:contact@optimumsolutions.com">contact@optimumsolutions.com</a></li>
                    <li><a href="tel:+243998362426">+243 998 362 426</a></li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      </nav>
    </header>
    {/* Mega panel: full-width below header */}
    {openDropdown && (
      <div
        ref={panelRef}
        id={`mega-panel-${openDropdown}`}
        className="mega-panel"
        role="region"
        aria-labelledby={`btn-${openDropdown}`}
        style={{ display: openDropdown ? 'block' : 'none' }}
        onKeyDown={(e) => {
          const target = e.target as HTMLElement;
          if (e.key === 'ArrowDown') { e.preventDefault(); moveInMenu(target, 1); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); moveInMenu(target, -1); }
          else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const btn = document.getElementById(`btn-${openDropdown}`) as HTMLElement;
            moveBetweenTopLevel(btn, -1, true);
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            const btn = document.getElementById(`btn-${openDropdown}`) as HTMLElement;
            moveBetweenTopLevel(btn, 1, true);
          } else if (e.key === 'Escape') {
            setOpenDropdown(null);
            const trigger = document.getElementById(`btn-${openDropdown}`) as HTMLButtonElement | null;
            trigger?.focus();
          }
        }}
      >
        {caretLeft !== null && <div className="mega-caret" style={{ left: caretLeft }} aria-hidden="true" />}
        <div className="container mega-grid">
          <div className="mega-left">
            <h3 className="mega-title">
              {openDropdown === 'services' && 'Nos services'}
              {openDropdown === 'clients' && 'Nos clients'}
              {openDropdown === 'implantations' && 'Implantations'}
              {openDropdown === 'apropos' && 'À propos'}
              {openDropdown === 'qhse' && 'QHSE'}
              {openDropdown === 'contact' && 'Contact'}
            </h3>
            <p className="mega-desc">
              {/* 1–2 lines placeholder summary (~120–200 chars) */}
              Découvrez la structure du site et les contenus clés de cette section. Cette maquette illustre la navigation par thèmes et les groupes de liens associés.
            </p>
          </div>
          <div className="mega-right">
            {openDropdown === 'services' && (
              <>
                <div className="dropdown-group">
                  <div className="group-title">Infrastructures télécoms</div>
                  <a href="#services-infrastructures-audit" className="dropdown-link">Audit de tours</a>
                  <a href="#services-infrastructures-redressement" className="dropdown-link">Redressement</a>
                  <a href="#services-infrastructures-bts" className="dropdown-link">Construction sites/BTS</a>
                  <a href="#services-infrastructures-maintenance" className="dropdown-link">Maintenance</a>
                  <a href="#services-infrastructures-supervision" className="dropdown-link">Supervision</a>
                </div>
                <div className="dropdown-group">
                  <div className="group-title">Énergie / Power</div>
                  <a href="#services-energie-audits" className="dropdown-link">Audits</a>
                  <a href="#services-energie-maintenance" className="dropdown-link">Maintenance</a>
                </div>
                <div className="dropdown-group">
                  <div className="group-title">Fibre & Transmission</div>
                  <a href="#services-fibre-optique" className="dropdown-link">Fibre optique</a>
                  <a href="#services-fibre-tirage" className="dropdown-link">Tirage & raccordement</a>
                </div>
                <div className="dropdown-group">
                  <div className="group-title">Génie civil & Projets</div>
                  <a href="#services-genie-conception" className="dropdown-link">Conception structures acier</a>
                  <a href="#services-genie-controle" className="dropdown-link">Contrôle & supervision</a>
                  <a href="#services-genie-pmo" className="dropdown-link">PMO</a>
                  <a href="#services-genie-due" className="dropdown-link">Due diligence</a>
                  <a href="#services-genie-acquisition" className="dropdown-link">Acquisition sites</a>
                  <a href="#services-genie-audit-equip" className="dropdown-link">Audit équipements</a>
                </div>
              </>
            )}
            {openDropdown === 'clients' && (
              <>
                <div className="dropdown-group">
                  <div className="group-title">Nos clients</div>
                  <a href="#clients-cas" className="dropdown-link">Études de cas</a>
                  <a href="#clients-témoignages" className="dropdown-link">Clients & témoignages</a>
                  <a href="#clients-realisations" className="dropdown-link">Réalisations (KPI/Projets)</a>
                </div>
              </>
            )}
            {openDropdown === 'implantations' && (
              <>
                <div className="dropdown-group">
                  <div className="group-title">Notre empreinte</div>
                  <a href="#empreinte-rdc" className="dropdown-link">RDC — Vue d’ensemble</a>
                  <a href="#markets" className="dropdown-link">Marchés / Pays</a>
                </div>
                <div className="dropdown-group">
                  <div className="group-title">RDC — Détails</div>
                  <a href="#empreinte-rdc" className="dropdown-link">Sites et villes</a>
                  <a href="#services-infrastructures-maintenance" className="dropdown-link">Maintenance & SLA</a>
                  <a href="#services-fibre-optique" className="dropdown-link">Backbone & fibre</a>
                </div>
              </>
            )}
            {openDropdown === 'apropos' && (
              <>
                <div className="dropdown-group">
                  <div className="group-title">À propos</div>
                  <a href="#apropos-histoire" className="dropdown-link">Histoire & vision</a>
                  <a href="#apropos-equipe" className="dropdown-link">Équipe/leadership</a>
                  <a href="#apropos-bureaux" className="dropdown-link">Bureaux (Kinshasa; Lubumbashi; Matadi)</a>
                  <a href="#apropos-valeurs" className="dropdown-link">Valeurs</a>
                </div>
              </>
            )}
            {openDropdown === 'qhse' && (
              <>
                <div className="dropdown-group">
                  <div className="group-title">QHSE</div>
                  <a href="#qhse-politique" className="dropdown-link">Politique QHSE</a>
                  <a href="#qhse-sécurité" className="dropdown-link">Sécurité au travail</a>
                  <a href="#qhse-environnement" className="dropdown-link">Environnement/ESG</a>
                  <a href="#qhse-certifications" className="dropdown-link">Certifications/ISO</a>
                  <a href="#qhse-ethique" className="dropdown-link">Éthique & conformité</a>
                </div>
              </>
            )}
            {openDropdown === 'contact' && (
              <>
                <div className="dropdown-group">
                  <div className="group-title">Nous contacter</div>
                  <a href="#contact" className="dropdown-link">Formulaire de contact</a>
                  <a href="mailto:contact@optimumsolutions.com" className="dropdown-link">contact@optimumsolutions.com</a>
                  <a href="tel:+243998362426" className="dropdown-link">+243 998 362 426</a>
                </div>
                <div className="dropdown-group">
                  <div className="group-title">Profils</div>
                  <a href="#contact-operateurs" className="dropdown-link">Opérateurs</a>
                  <a href="#contact-fonciers" className="dropdown-link">Propriétaires fonciers</a>
                  <a href="#contact-fournisseurs" className="dropdown-link">Fournisseurs</a>
                  <a href="#contact-investisseurs" className="dropdown-link">Investisseurs</a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )}
    {/* Search dialog overlay */}
    <div
      id="search-dialog"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      style={{ display: searchOpen ? 'block' : 'none' }}
      className="search-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          setSearchOpen(false);
          searchBtnRef.current?.focus();
        }
      }}
    >
      <div className="search-modal" role="document">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: Wire up to real search route.
            setSearchOpen(false);
            searchBtnRef.current?.focus();
          }}
        >
          <label htmlFor="header-search-input" className="muted" style={{ fontSize: 12 }}>Rechercher</label>
          <input
            id="header-search-input"
            ref={searchInputRef}
            type="search"
            placeholder="Rechercher des services, projets, pages…"
            className="search-input"
          />
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" className="btn" onClick={() => { setSearchOpen(false); searchBtnRef.current?.focus(); }}>Fermer</button>
            <button type="submit" className="btn">Rechercher</button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}


