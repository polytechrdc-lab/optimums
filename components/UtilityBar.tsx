"use client";
import { useEffect, useMemo, useRef, useState } from 'react';

export default function UtilityBar() {
  // Always sticky: no auto-hide
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountBtnRef = useRef<HTMLButtonElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');

  // Expose utility height to :root so header can offset correctly
  // 44px on touch devices, else 32px
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    const mq = window.matchMedia('(pointer: coarse)');
    const apply = () => {
      const h = mq.matches ? '44px' : '32px';
      document.documentElement.style.setProperty('--utility-h', h);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => {
      mq.removeEventListener('change', apply);
      document.documentElement.style.setProperty('--utility-h', '0px');
    };
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      const inKebab = !!(menuRef.current?.contains(t) || menuBtnRef.current?.contains(t));
      const inAccount = !!(accountMenuRef.current?.contains(t) || accountBtnRef.current?.contains(t));
      if (!inKebab) setMenuOpen(false);
      if (!inAccount) setAccountOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMenuOpen(false); setAccountOpen(false); }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Keep <html lang> in sync for basic a11y signal
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang.toLowerCase();
    }
  }, [lang]);

  const toggleLang = () => {
    setLang((l) => (l === 'FR' ? 'EN' : 'FR'));
    track('utility_lang_toggle');
  };

  // Optional rotating message center slot
  const messages = useMemo(
    () => [
      'Nouveau rapport ESG disponible',
      'Dernières actualités: lancement plateforme clients',
    ],
    []
  );
  const [msgIndex, setMsgIndex] = useState(0);
  useEffect(() => {
    if (!messages.length) return;
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % messages.length), 6000);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div
      className="utility-bar"
      role="region"
      aria-label="Barre utilitaire"
      data-hidden={'false'}
      data-mode={'sticky'}
    >
      <div className="container utility-grid" aria-label="Raccourcis utilitaires">
        {/* Slot gauche: info statut */}
        <div className="utility-left">
          <span className="utility-chip" aria-hidden="true">Info</span>
          <span className="utility-item">
            <span className="utility-label">Hotline 24/7</span>
            <a className="utility-link" href="tel:+243995037226" onClick={() => track('utility_tel_click')}>
              +243&nbsp;995&nbsp;037&nbsp;226
            </a>
          </span>
          <span className="utility-sep" aria-hidden="true">•</span>
          <span className="utility-item">
            <span className="status-dot status-ok" role="img" aria-label="Services opérationnels" title="Services opérationnels" />
            <span className="utility-label">Statut</span> OK
          </span>
        </div>

        {/* Slot centre (facultatif) */}
        <div className="utility-center" aria-live="polite">
          {messages[msgIndex]}
        </div>

        {/* Slot droit: liens utilitaires */}
        <div role="navigation" aria-label="Liens utilitaires" className="utility-right">
          <a className="utility-link" href="#investisseurs" onClick={() => track('utility_investisseurs')}>Investisseurs</a>
          <a className="utility-link" href="#medias" onClick={() => track('utility_medias')}>Médias</a>
          <a className="utility-link" href="#fournisseurs" onClick={() => track('utility_fournisseurs')}>Fournisseurs</a>
          <button
            type="button"
            className="utility-toggle is-optional"
            aria-pressed={lang === 'EN'}
            aria-label="Basculer langue FR/EN"
            onClick={toggleLang}
          >
            {lang}
          </button>
          <div className="utility-account-wrap">
            <button
              ref={accountBtnRef}
              type="button"
              className="utility-toggle"
              aria-haspopup="true"
              aria-expanded={accountOpen}
              aria-controls="intranet-menu"
              onClick={() => { setAccountOpen(v => !v); track('utility_intranet_toggle'); }}
            >
              Intranet
            </button>
            {accountOpen && (
              <div ref={accountMenuRef} id="intranet-menu" role="menu" className="utility-menu" aria-label="Menu intranet">
                <a role="menuitem" tabIndex={0} className="utility-menuitem" href="/intranet" onClick={() => { setAccountOpen(false); track('utility_intranet_login'); }}>Se connecter à l'intranet</a>
              </div>
            )}
          </div>
        </div>

        {/* Mobile kebab for corporate links */}
        <div className="utility-kebab-wrap">
          <button
            ref={menuBtnRef}
            type="button"
            className="utility-kebab"
            aria-label="Corporate"
            aria-expanded={menuOpen}
            aria-controls="utility-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="kebab-dot" aria-hidden />
            <span className="kebab-dot" aria-hidden />
            <span className="kebab-dot" aria-hidden />
          </button>
          {menuOpen && (
            <div ref={menuRef} id="utility-menu" role="menu" className="utility-menu" aria-label="Menu corporate">
              <a role="menuitem" tabIndex={0} className="utility-menuitem" href="#investisseurs" onClick={() => { setMenuOpen(false); track('utility_investisseurs'); }}>Investisseurs</a>
              <a role="menuitem" tabIndex={0} className="utility-menuitem" href="#medias" onClick={() => { setMenuOpen(false); track('utility_medias'); }}>Médias</a>
              <a role="menuitem" tabIndex={0} className="utility-menuitem" href="#fournisseurs" onClick={() => { setMenuOpen(false); track('utility_fournisseurs'); }}>Fournisseurs</a>
              <a role="menuitem" tabIndex={0} className="utility-menuitem" href="/intranet" onClick={() => { setMenuOpen(false); track('utility_intranet_login'); }}>Intranet</a>
              <button role="menuitem" tabIndex={0} className="utility-menuitem utility-menuitem-btn" onClick={() => { toggleLang(); setMenuOpen(false); }} aria-pressed={lang === 'EN'} aria-label="Basculer langue FR/EN">{lang}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function track(event: string) {
  try {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.dataLayer) {
      // @ts-ignore
      window.dataLayer.push({ event });
    } else {
      // eslint-disable-next-line no-console
      console.debug('[analytics]', event);
    }
  } catch {}
}
