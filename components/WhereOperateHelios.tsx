"use client";
import { useEffect, useMemo, useRef, useState } from 'react';
import { whereData, CountryData } from '@/lib/whereData';

type Props = { defaultCountry?: string };

export default function WhereOperateHelios({ defaultCountry = 'CD' }: Props) {
  const [active, setActive] = useState<string>(defaultCountry);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  const [mode, setMode] = useState<'africa' | 'rdc'>('africa');
  const [tooltip, setTooltip] = useState<{ code: string; x: number; y: number; visible: boolean } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const country = useMemo<CountryData | null>(() => whereData[active] ?? null, [active]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setHovered(null); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Charger et inline le SVG (Afrique ou RDC) et enrichir les paths
  useEffect(() => {
    let aborted = false;
    const el = containerRef.current;
    if (!el) return;
    (async () => {
      try {
        // Importer les SVG comme URL bundlées (fiable côté client)
        const africaUrl = (await import('../image/map/africa.svg?url')).default as string;
        const rdcUrl = (await import('../image/map/rdc.svg?url')).default as string;
        const url = mode === 'africa' ? africaUrl : rdcUrl;
        const res = await fetch(url);
        const text = await res.text();
        if (aborted) return;
        el.innerHTML = text;
        const svg = el.querySelector('svg');
        if (svg) {
          svg.setAttribute('role', 'img');
          svg.setAttribute('aria-label', mode === 'africa' ? "Carte de l’Afrique" : 'Carte de la RDC — provinces');
          svg.classList.add('wo-map');
        }
        const root = el.querySelector('#africa') || el;
        const paths = root.querySelectorAll('path');
        paths.forEach((p) => {
          const code = (p.getAttribute('id') || '').toUpperCase();
          if (!code) return;
          // Hit-area clone
          const hit = p.cloneNode(true) as SVGPathElement;
          hit.classList.add('wo-hit');
          p.parentElement?.insertBefore(hit, p);
          // Visual class + states
          p.classList.add('wo-country');
          const status = mode === 'africa' ? ((whereData as any)[code]?.status ?? 'rest') : 'rest';
          p.classList.add(`wo-${status}`);
          // A11y
          p.setAttribute('tabindex', '0');
          const data = (whereData as any)[code];
          const label = `${data?.name ?? code} — ${data?.sites ?? '—'} sites, ${data?.cities ?? '—'} villes, uptime ${data?.slas ?? '—'}`;
          p.setAttribute('aria-label', label);
          // Events
          p.addEventListener('mouseenter', (e: any) => {
            setHovered(code);
            positionTooltip(el, p as SVGPathElement, e);
          });
          p.addEventListener('mouseleave', () => setHovered(null));
          p.addEventListener('focus', () => {
            setFocus(code);
            positionTooltip(el, p as SVGPathElement, null);
          });
          p.addEventListener('blur', () => setFocus(null));
          p.addEventListener('click', () => setActive(code));
          p.addEventListener('mousemove', (e: any) => positionTooltip(el, p as SVGPathElement, e));
          p.addEventListener('keydown', (e: any) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActive(code); }
          });
        });
      } catch {}
    })();
    return () => { aborted = true; if (el) el.innerHTML = ''; };
  }, [mode]);

  function positionTooltip(el: HTMLDivElement, path: SVGPathElement, e: MouseEvent | null) {
    const rect = el.getBoundingClientRect();
    let x = rect.left + rect.width / 2;
    let y = rect.top + rect.height / 2;
    if (e) {
      x = e.clientX; y = e.clientY;
    } else {
      const bb = path.getBBox();
      const svg = el.querySelector('svg') as SVGSVGElement | null;
      if (svg) {
        const pt = svg.createSVGPoint();
        pt.x = bb.x + bb.width / 2; pt.y = bb.y + bb.height / 2;
        const screenPt = pt.matrixTransform((svg as any).getScreenCTM());
        x = screenPt.x; y = screenPt.y;
      }
    }
    setTooltip({ code: path.id.toUpperCase(), x: x - rect.left + 12, y: y - rect.top + 12, visible: true });
  }

  return (
    <section className="wo-section" aria-label="Où nous opérons">
      <div className="container wo-grid">
        {/* Carte Afrique inline (chargée depuis /image/map/africa.svg) */}
        <div className="wo-map-wrap">
          <div className="wo-map-inline" ref={containerRef} aria-hidden="false" />
        </div>
        {/* Bloc copy dynamique */}
        <div className="wo-copy">
          <div className="wo-eyebrow">OÙ NOUS OPÉRONS</div>
          <h2 className="wo-title">{country?.name ?? 'Afrique Centrale'} — Notre empreinte</h2>
          <p className="wo-desc">
            {country?.id === 'CD'
              ? `3 250 sites actifs dans 18 villes; uptime ${country?.slas}. Infrastructures fiables pour connecter les communautés et soutenir la croissance.`
              : `Implantations et opérations fiables; uptime ${country?.slas ?? '98%'}. Découvrez nos services et notre empreinte dans ${country?.name ?? 'la région'}.`}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href={country?.cta ?? '#'} className="wo-cta">Voir notre empreinte</a>
            {active === 'CD' && (
              <button type="button" className="wo-cta" onClick={() => setMode(mode === 'africa' ? 'rdc' : 'africa')}>
                {mode === 'africa' ? 'Voir par province' : '← Afrique'}
              </button>
            )}
          </div>
        </div>
        {/* Tooltip */}
        <div className="wo-tooltip" style={{ opacity: tooltip?.visible ? 1 : 0, left: (tooltip?.x ?? 0), top: (tooltip?.y ?? 0) }}>
          <div className="wo-tip-title">{whereData[tooltip?.code ?? '']?.name ?? tooltip?.code}</div>
          {whereData[tooltip?.code ?? ''] && (
            <div className="wo-tip-kpi">{whereData[tooltip!.code].sites ?? '—'} sites • {whereData[tooltip!.code].cities ?? '—'} villes</div>
          )}
        </div>
      </div>
    </section>
  );
}

type CountryProps = {
  code: string;
  d: string;
  active: string;
  hovered: string | null;
  focus: string | null;
  onEnter: (code: string) => void;
  onLeave: () => void;
  onSelect: (code: string) => void;
  onFocus: (code: string) => void;
};

function Country({ code, d, active, hovered, focus, onEnter, onLeave, onSelect, onFocus }: CountryProps) {
  const status = whereData[code]?.status ?? 'rest';
  const isActive = active === code;
  const isHovered = hovered === code;
  const isFocus = focus === code;
  return (
    <g>
      {/* Hit-area élargie pour petits pays (souris uniquement) */}
      <path d={d} className="wo-hit" aria-hidden="true" />
      {/* Pays visible */}
      <path
        id={code}
        d={d}
        className={`wo-country wo-${status} ${isActive ? 'is-active' : ''} ${isHovered ? 'is-hover' : ''} ${isFocus ? 'is-focus' : ''}`}
        tabIndex={0}
        aria-label={`${whereData[code]?.name ?? code} — ${whereData[code]?.sites ?? '—'} sites, ${whereData[code]?.cities ?? '—'} villes, uptime ${whereData[code]?.slas ?? '—'}`}
        onMouseEnter={() => onEnter(code)}
        onMouseLeave={onLeave}
        onFocus={() => onFocus(code)}
        onBlur={() => onFocus('')}
        onClick={() => onSelect(code)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(code);
          }
        }}
      />
      {/* Hatch pattern pour l'actif (color-blind friendly) */}
      {isActive && (
        <path d={d} fill="url(#wo-active-hatch)" pointerEvents="none" />
      )}
    </g>
  );
}
