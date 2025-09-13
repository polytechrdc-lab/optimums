"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import logo from '../image/logo/LOGO-OPTIMUM-icone.png';

type DropdownId = null | 'services' | 'clients' | 'implantations' | 'apropos' | 'qhse' | 'carriere' | 'contact';

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownId>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerOpenId, setDrawerOpenId] = useState<DropdownId>(null);
  const [caretX, setCaretX] = useState<number | null>(null);
  const searchBtnRef = useRef<HTMLButtonElement>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  // Solid as soon as we start scrolling; transparent at scroll top
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true } as any);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Outside click / Esc to close dropdowns
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      const inHeader = headerRef.current?.contains(t);
      const inPanel = panelRef.current?.contains(t);
      if (!inHeader && !inPanel) setOpenDropdown(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setDrawerOpen(false);
        if (searchOpen) setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [searchOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    const { body } = document;
    if (!body) return;
    const prev = body.style.overflow;
    if (drawerOpen) body.style.overflow = 'hidden';
    else body.style.overflow = prev || '';
    return () => { body.style.overflow = prev || ''; };
  }, [drawerOpen]);

  // Focus helpers
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

  // Recompute caret horizontal position under active tab
  useEffect(() => {
    if (!openDropdown) { setCaretX(null); return; }
    const update = () => {
      const btn = document.getElementById(`btn-${openDropdown}`);
      if (!btn) { setCaretX(null); return; }
      const rect = btn.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const vw = Math.max(0, window.innerWidth || 0);
      const clamped = Math.max(12, Math.min(vw - 12, center));
      setCaretX(clamped);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [openDropdown]);

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}
        role="banner"
        aria-label="Site header"
      >
        <div className="container header-grid">
          {/* Left: Logo */}
          <div className="header-left">
            <a href="/" aria-label="Homepage" className="header-item header-brand-link">
              <Image src={logo} alt="Optimum" width={140} height={36} priority style={{ height: 36, width: 'auto' }} />
              <span className="brand-name desktop-only">Optimum Solutions</span>
            </a>
          </div>

          {/* Center: Primary nav (desktop) */}
          <nav className="header-desktop-nav" aria-label="Navigation principale" ref={dropdownRef}>
            <ul className="header-nav-list">
              {([
                { id: 'services', label: 'Nos services' },
                { id: 'clients', label: 'Nos clients' },
                { id: 'implantations', label: 'Implantations' },
                { id: 'apropos', label: 'À propos' },
                { id: 'qhse', label: 'QHSE' },
                { id: 'carriere', label: 'Carrières' },
                { id: 'contact', label: 'Contact' },
              ] as const).map(item => (
                <li key={item.id} className="nav-item">
                  {item.id === 'contact' ? (
                    <a href="#contact" className="nav-link header-item">{item.label}</a>
                  ) : (
                    <button
                      id={`btn-${item.id}`}
                      data-id={item.id}
                      className="nav-button header-item"
                      aria-haspopup="true"
                      aria-expanded={openDropdown === item.id}
                      aria-controls={`mega-panel-${item.id}`}
                      onClick={() => setOpenDropdown(v => v === item.id ? null : (item.id as DropdownId))}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          setOpenDropdown(item.id as DropdownId);
                          const panel = document.getElementById(`mega-panel-${item.id}`);
                          focusFirstItem(panel as HTMLElement);
                        } else if (e.key === 'ArrowRight') {
                          e.preventDefault();
                          moveBetweenTopLevel(e.currentTarget, 1, !!openDropdown);
                        } else if (e.key === 'ArrowLeft') {
                          e.preventDefault();
                          moveBetweenTopLevel(e.currentTarget, -1, !!openDropdown);
                        } else if (e.key === 'Tab' && !e.shiftKey && openDropdown === (item.id as DropdownId)) {
                          e.preventDefault();
                          const panel = document.getElementById(`mega-panel-${item.id}`);
                          focusFirstItem(panel as HTMLElement);
                        }
                      }}
                    >{item.label} <span className="chevron" aria-hidden="true" /></button>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right: Actions (search, contact quick, mobile menu) */}
          <div className="header-actions">
            <button
              ref={searchBtnRef}
              type="button"
              className="search-btn header-item"
              aria-label="Recherche"
              aria-controls="search-dialog"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(true)}
            >
              <span className="icon-search" aria-hidden>🔍</span>
            </button>
            <a href="#contact" className="header-item desktop-only" style={{ fontWeight: 700, textDecoration: 'none' }}>Contact</a>
            <button
              className="mobile-menu-btn mobile-only header-item"
              aria-expanded={drawerOpen}
              aria-controls="header-drawer"
              onClick={() => setDrawerOpen(v => !v)}
            >Menu</button>
          </div>
        </div>
      </header>

      {/* Mega panel */}
      {openDropdown && (
        <div
          ref={panelRef}
          id={`mega-panel-${openDropdown}`}
          className="mega-panel"
          role="region"
          aria-labelledby={`btn-${openDropdown}`}
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
            } else if (e.key === 'Tab') {
              const focusables = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])') ?? [])
                .filter(el => !el.hasAttribute('disabled'));
              if (focusables.length) {
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                const active = document.activeElement as HTMLElement | null;
                if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
                else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
              }
            } else if (e.key === 'Escape') {
              setOpenDropdown(null);
              const trigger = document.getElementById(`btn-${openDropdown}`) as HTMLButtonElement | null;
              trigger?.focus();
            }
          }}
        >
          {/* Caret: small triangle aligned under active tab */}
          {caretX !== null && (
            <div className="mega-caret" style={{ ['--caret-x' as any]: `${caretX}px` }} aria-hidden="true" />
          )}
          <div className="container mega-grid">
            <div className="mega-left">
              <h3 className="mega-title">
                <a
                  className="mega-heading-link"
                  href={
                    openDropdown === 'services' ? '#services' :
                    openDropdown === 'clients' ? '#clients' :
                    openDropdown === 'implantations' ? '#implantations' :
                    openDropdown === 'apropos' ? '#apropos' :
                    openDropdown === 'qhse' ? '#qhse' :
                    openDropdown === 'carriere' ? '#carriere' : '#'
                  }
                  aria-label={
                    'Découvrir la section ' + (
                      openDropdown === 'services' ? 'Nos services' :
                      openDropdown === 'clients' ? 'Nos clients' :
                      openDropdown === 'implantations' ? 'Implantations' :
                      openDropdown === 'apropos' ? 'À propos' :
                      openDropdown === 'qhse' ? 'QHSE' :
                      openDropdown === 'carriere' ? 'Carrières' : ''
                    )
                  }
                >
                  {openDropdown === 'services' && 'Nos services'}
                  {openDropdown === 'clients' && 'Nos clients'}
                  {openDropdown === 'implantations' && 'Implantations'}
                  {openDropdown === 'apropos' && 'À propos'}
                  {openDropdown === 'qhse' && 'QHSE'}
                  {openDropdown === 'carriere' && 'Carrières'}
                  <span className="heading-chevron" aria-hidden />
                </a>
              </h3>
              <p className="mega-desc">
                {openDropdown === 'services' && 'Solutions d’infrastructure télécom, ingénierie et opérations pour déployer plus vite et maintenir plus sûr.'}
                {openDropdown === 'clients' && 'Des offres adaptées aux opérateurs, entreprises et acteurs publics, avec preuves et retours terrain.'}
                {openDropdown === 'implantations' && 'Notre présence, nos sites et notre couverture : où nous opérons et comment nous vous accompagnons.'}
                {openDropdown === 'apropos' && 'Notre mission, gouvernance et actualités — ce qui nous anime et comment nous travaillons.'}
                {openDropdown === 'qhse' && 'Qualité, sécurité et environnement au cœur des opérations, avec processus et certifications.'}
                {openDropdown === 'carriere' && 'Rejoindre une équipe terrain et métier, au service d’infrastructures essentielles.'}
              </p>
              {/* Editorial CTA intentionally removed per spec (no CTAs in mega menus) */}
            </div>
            <div className="mega-right">
              {openDropdown === 'services' && (
                <>
                  <div className="dropdown-group">
                    <div className="group-title">Infra Télécom</div>
                    <a href="#services-tours" className="dropdown-link">Conception & construction de tours</a>
                    <a href="#services-energie" className="dropdown-link">Maintenance & énergie</a>
                    <a href="#services-partage" className="dropdown-link">Partage d'infrastructures</a>
                    <a href="#services-fibre" className="dropdown-link">Fibre / FTTx</a>
                  </div>
                  <div className="dropdown-group">
                    <div className="group-title">Ingénierie & Opérations</div>
                    <a href="#services-sa" className="dropdown-link">Site acquisition</a>
                    <a href="#services-radio" className="dropdown-link">Radio planning</a>
                    <a href="#services-noc" className="dropdown-link">NOC & supervision</a>
                    <a href="#services-eaas" className="dropdown-link">Énergie-as-a-Service</a>
                  </div>
                  <div className="dropdown-group">
                    <div className="group-title">Cyber & IT</div>
                    <a href="#services-redteam" className="dropdown-link">Sécurité offensive (Red Team)</a>
                    <a href="#services-soc" className="dropdown-link">SOC & détection</a>
                    <a href="#services-cloud" className="dropdown-link">Cloud & DevOps managé</a>
                  </div>
                  {/* CTA block removed */}
                </>
              )}
              {openDropdown === 'clients' && (
                <>
                  <div className="dropdown-group">
                    <div className="group-title">Segments</div>
                    <a href="#clients-mno" className="dropdown-link">Opérateurs mobiles (MNO)</a>
                    <a href="#clients-isp" className="dropdown-link">FAI / ISP</a>
                    <a href="#clients-entreprises" className="dropdown-link">Entreprises (mines/énergie/banking)</a>
                    <a href="#clients-public" className="dropdown-link">Secteur public & Défense</a>
                    <a href="#clients-integra" className="dropdown-link">Partenaires intégrateurs</a>
                  </div>
                  <div className="dropdown-group">
                    <div className="group-title">Preuves</div>
                    <a href="#clients-refs" className="dropdown-link">Références & témoignages</a>
                    <a href="#clients-logos" className="dropdown-link">Logos (gris)</a>
                    <a href="#clients-tout" className="dropdown-link">Voir toutes les références</a>
                  </div>
                </>
              )}
              {openDropdown === 'implantations' && (
                <>
                  <div className="dropdown-group">
                    <div className="group-title">Zones</div>
                    <a href="#drc-kin" className="dropdown-link">DRC – Kinshasa</a>
                    <a href="#drc-kongo" className="dropdown-link">Kongo Central</a>
                    <a href="#drc-katanga" className="dropdown-link">Katanga</a>
                    <a href="#drc-kasai" className="dropdown-link">Kasaï</a>
                  </div>
                  <div className="dropdown-group">
                    <div className="group-title">Données</div>
                    <a href="#drc-sites" className="dropdown-link"># de sites, couverture fibre</a>
                    <a href="#drc-sla" className="dropdown-link">SLA</a>
                    <a href="#drc-carte" className="dropdown-link">Carte interactive</a>
                    <a href="#drc-cta" className="dropdown-link">Nous déployer dans votre zone</a>
                  </div>
                </>
              )}
              {openDropdown === 'apropos' && (
                <>
                  <div className="dropdown-group">
                    <div className="group-title">À propos</div>
                    <a href="#ap-histoire" className="dropdown-link">Notre histoire</a>
                    <a href="#ap-equipe" className="dropdown-link">Équipe & Gouvernance</a>
                    <a href="#ap-durabilite" className="dropdown-link">Durabilité / RSE</a>
                    <a href="#ap-presse" className="dropdown-link">Actualités & Presse</a>
                    <a href="#ap-carrieres" className="dropdown-link">Carrières</a>
                  </div>
                  <div className="dropdown-highlight">
                    <div className="group-title">Notre mission</div>
                    <p className="muted">Photo + 1–2 lignes, lien.</p>
                    <a href="#ap-decouvrir" className="btn">Découvrir la société</a>
                  </div>
                </>
              )}
              {openDropdown === 'qhse' && (
                <>
                  <div className="dropdown-group">
                    <div className="group-title">QHSE</div>
                    <a href="#qhse-politique" className="dropdown-link">Politique Qualité</a>
                    <a href="#qhse-hs" className="dropdown-link">Hygiène & Sécurité</a>
                    <a href="#qhse-environnement" className="dropdown-link">Environnement</a>
                    <a href="#qhse-certifications" className="dropdown-link">Certifications</a>
                    <a href="#qhse-procedures" className="dropdown-link">Procédures & Conformité</a>
                    <a href="#qhse-signalement" className="dropdown-link">Signalement / Incident</a>
                  </div>
                  <div className="dropdown-highlight">
                    <div className="group-title">KPI Sécurité</div>
                    <p className="muted">128 jours sans incident. Badge ISO 9001.</p>
                  </div>
                </>
              )}
              {/* 'Contact' is not a dropdown */}
              {openDropdown === 'carriere' && (
                <>
                  <div className="dropdown-group">
                    <div className="group-title">Opportunités</div>
                    <a href="#jobs-ouverts" className="dropdown-link">Postes ouverts</a>
                    <a href="#stages" className="dropdown-link">Stages & alternance</a>
                    <a href="#spontanee" className="dropdown-link">Candidature spontanée</a>
                  </div>
                  <div className="dropdown-group">
                    <div className="group-title">À propos de nous</div>
                    <a href="#culture" className="dropdown-link">Culture & valeurs</a>
                    <a href="#processus" className="dropdown-link">Processus de recrutement</a>
                    <a href="#avantages" className="dropdown-link">Avantages</a>
                  </div>
                  {/* CTA block removed */}
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
        aria-label="Recherche"
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
          <form onSubmit={(e) => { e.preventDefault(); setSearchOpen(false); searchBtnRef.current?.focus(); }}>
            <label htmlFor="header-search-input" className="muted" style={{ fontSize: 12 }}>Rechercher</label>
            <input id="header-search-input" type="search" placeholder="Services, projets, pages…" className="search-input" />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" className="btn" onClick={() => { setSearchOpen(false); searchBtnRef.current?.focus(); }}>Fermer</button>
              <button type="submit" className="btn">Rechercher</button>
            </div>
          </form>
        </div>
      </div>

      {/* Off-canvas drawer (mobile) */}
      <div id="header-drawer" className={`header-drawer ${drawerOpen ? 'is-open' : ''}`} aria-hidden={!drawerOpen}>
        <div className="drawer-panel" role="dialog" aria-label="Menu principal">
          <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Fermer">×</button>
          <nav aria-label="Navigation mobile">
            <ul className="drawer-list">
              {([
                { id: 'services', label: 'Nos services' },
                { id: 'clients', label: 'Nos clients' },
                { id: 'implantations', label: 'Implantations' },
                { id: 'apropos', label: 'À propos' },
                { id: 'qhse', label: 'QHSE' },
                { id: 'carriere', label: 'Carrières' },
                { id: 'contact', label: 'Contact' },
              ] as const).map(item => (
                <li key={item.id}>
                  <button
                    className="drawer-accordion"
                    aria-expanded={drawerOpenId === (item.id as DropdownId)}
                    onClick={() => setDrawerOpenId(v => v === (item.id as DropdownId) ? null : (item.id as DropdownId))}
                  >{item.label}</button>
                  {drawerOpenId === (item.id as DropdownId) && (
                    <div className="drawer-accordion-panel">
                      {item.id === 'services' && (
                        <ul>
                          <li><a href="#services-tours" onClick={() => setDrawerOpen(false)}>Conception & tours</a></li>
                          <li><a href="#services-energie" onClick={() => setDrawerOpen(false)}>Maintenance & énergie</a></li>
                          <li><a href="#services-partage" onClick={() => setDrawerOpen(false)}>Partage d'infrastructures</a></li>
                          <li><a href="#services-fibre" onClick={() => setDrawerOpen(false)}>Fibre / FTTx</a></li>
                          <li><a href="#services-sa" onClick={() => setDrawerOpen(false)}>Site acquisition</a></li>
                          <li><a href="#services-radio" onClick={() => setDrawerOpen(false)}>Radio planning</a></li>
                          <li><a href="#services-noc" onClick={() => setDrawerOpen(false)}>NOC & supervision</a></li>
                          <li><a href="#services-eaas" onClick={() => setDrawerOpen(false)}>Énergie-as-a-Service</a></li>
                          <li><a href="#services-redteam" onClick={() => setDrawerOpen(false)}>Sécurité offensive</a></li>
                          <li><a href="#services-soc" onClick={() => setDrawerOpen(false)}>SOC & détection</a></li>
                          <li><a href="#services-cloud" onClick={() => setDrawerOpen(false)}>Cloud & DevOps managé</a></li>
                        </ul>
                      )}
                      {item.id === 'carriere' && (
                        <ul>
                          <li><a href="#jobs-ouverts" onClick={() => setDrawerOpen(false)}>Postes ouverts</a></li>
                          <li><a href="#stages" onClick={() => setDrawerOpen(false)}>Stages & alternance</a></li>
                          <li><a href="#spontanee" onClick={() => setDrawerOpen(false)}>Candidature spontanée</a></li>
                          <li><a href="#culture" onClick={() => setDrawerOpen(false)}>Culture & valeurs</a></li>
                          <li><a href="#processus" onClick={() => setDrawerOpen(false)}>Processus de recrutement</a></li>
                          <li><a href="#avantages" onClick={() => setDrawerOpen(false)}>Avantages</a></li>
                        </ul>
                      )}
                      {item.id === 'clients' && (
                        <ul>
                          <li><a href="#clients-mno" onClick={() => setDrawerOpen(false)}>Opérateurs mobiles (MNO)</a></li>
                          <li><a href="#clients-isp" onClick={() => setDrawerOpen(false)}>FAI / ISP</a></li>
                          <li><a href="#clients-entreprises" onClick={() => setDrawerOpen(false)}>Entreprises</a></li>
                          <li><a href="#clients-public" onClick={() => setDrawerOpen(false)}>Secteur public & Défense</a></li>
                          <li><a href="#clients-integra" onClick={() => setDrawerOpen(false)}>Partenaires intégrateurs</a></li>
                        </ul>
                      )}
                      {item.id === 'implantations' && (
                        <ul>
                          <li><a href="#drc-kin" onClick={() => setDrawerOpen(false)}>DRC – Kinshasa</a></li>
                          <li><a href="#drc-kongo" onClick={() => setDrawerOpen(false)}>Kongo Central</a></li>
                          <li><a href="#drc-katanga" onClick={() => setDrawerOpen(false)}>Katanga</a></li>
                          <li><a href="#drc-kasai" onClick={() => setDrawerOpen(false)}>Kasaï</a></li>
                        </ul>
                      )}
                      {item.id === 'apropos' && (
                        <ul>
                          <li><a href="#ap-histoire" onClick={() => setDrawerOpen(false)}>Notre histoire</a></li>
                          <li><a href="#ap-equipe" onClick={() => setDrawerOpen(false)}>Équipe & Gouvernance</a></li>
                          <li><a href="#ap-durabilite" onClick={() => setDrawerOpen(false)}>Durabilité / RSE</a></li>
                          <li><a href="#ap-presse" onClick={() => setDrawerOpen(false)}>Actualités & Presse</a></li>
                          <li><a href="#ap-carrieres" onClick={() => setDrawerOpen(false)}>Carrières</a></li>
                        </ul>
                      )}
                      {item.id === 'qhse' && (
                        <ul>
                          <li><a href="#qhse-politique" onClick={() => setDrawerOpen(false)}>Politique Qualité</a></li>
                          <li><a href="#qhse-hs" onClick={() => setDrawerOpen(false)}>Hygiène & Sécurité</a></li>
                          <li><a href="#qhse-environnement" onClick={() => setDrawerOpen(false)}>Environnement</a></li>
                          <li><a href="#qhse-certifications" onClick={() => setDrawerOpen(false)}>Certifications</a></li>
                          <li><a href="#qhse-procedures" onClick={() => setDrawerOpen(false)}>Procédures & Conformité</a></li>
                          <li><a href="#qhse-signalement" onClick={() => setDrawerOpen(false)}>Signalement / Incident</a></li>
                        </ul>
                      )}
                      {item.id === 'contact' && (
                        <div className="drawer-contact">
                          <a href="#contact" onClick={() => setDrawerOpen(false)}>Nous contacter (formulaire)</a>
                          <a href="#partenariat" onClick={() => setDrawerOpen(false)}>Devenir partenaire</a>
                          <ul>
                            <li>Commercial — <span className="masked">Afficher</span></li>
                            <li>Support 24/7/NOC — <span className="masked">Afficher</span></li>
                            <li>Partenariat — <span className="masked">Afficher</span></li>
                            <li>Presse — <span className="masked">Afficher</span></li>
                            <li>Appels d'offres / RFP — <span className="masked">Afficher</span></li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <div className="drawer-utility">
              <a href="#investisseurs">Investisseurs</a>
              <a href="#medias">Médias</a>
              <a href="#fournisseurs">Fournisseurs</a>
              <a href="/intranet">Intranet</a>
            </div>
            <div className="drawer-ctas">
              <a className="btn" href="#contact">Nous contacter</a>
              <a className="btn" href="#devis">Demander un devis</a>
            </div>
          </nav>
        </div>
        <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
      </div>
    </>
  );
}

function ContactPanel() {
  const [reveal, setReveal] = useState<{[k: string]: boolean}>({});
  const show = (key: string) => setReveal(r => ({ ...r, [key]: true }));
  return (
    <>
      <div className="dropdown-group">
        <div className="group-title">Canaux</div>
        <a href="#contact-commercial" className="dropdown-link">Commercial</a>
        <a href="#contact-noc" className="dropdown-link">Support 24/7 / NOC</a>
        <a href="#contact-partenariat" className="dropdown-link">Partenariat</a>
        <a href="#contact-presse" className="dropdown-link">Presse</a>
        <a href="#contact-rfp" className="dropdown-link">Appels d'offres / RFP</a>
      </div>
      <div className="dropdown-group">
        <div className="group-title">Infos</div>
        <button className="dropdown-link" onClick={() => show('email')}>{reveal.email ? 'contact@optimumsolutions.com' : 'Afficher l’email'}</button>
        <button className="dropdown-link" onClick={() => show('tel')}>{reveal.tel ? '+243 998 362 426' : 'Afficher le téléphone'}</button>
        <span className="muted">Horaires: Lun-Ven 9h–18h</span>
      </div>
      <div className="dropdown-highlight">
        <a href="#contact" className="btn">Nous contacter</a>
        <a href="#partenariat" className="btn" style={{ marginLeft: 8 }}>Devenir partenaire</a>
      </div>
    </>
  );
}
