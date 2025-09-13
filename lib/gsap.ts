let _corePromise: Promise<{ gsap: any; ScrollTrigger: any }>|null = null;

// Loads GSAP + ScrollTrigger once, registers plugin on client, and sets sensible defaults.
// Use only from the client (e.g., inside useEffect) to avoid SSR touching window.
export function gsapCore(): Promise<{ gsap: any; ScrollTrigger: any }> {
  if (_corePromise) return _corePromise;
  _corePromise = (async () => {
    const g = await import('gsap');
    const st = await import('gsap/ScrollTrigger');
    const gsap: any = (g as any).default ?? g;
    const ScrollTrigger: any = (st as any).ScrollTrigger ?? (st as any).default ?? st;

    // Register plugin on the client only
    if (typeof window !== 'undefined') {
      try { gsap.registerPlugin(ScrollTrigger); } catch {}
      // Shared animation defaults (keep modest; sections can override)
      try { gsap.defaults({ ease: 'power2.out', duration: 0.5 }); } catch {}
    }

    return { gsap, ScrollTrigger };
  })();
  return _corePromise;
}

// Helper: respect reduced motion everywhere
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined' || !('matchMedia' in window)) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

