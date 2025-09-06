"use client";

import { useEffect, useRef } from "react";

// Lazy import Lenis only on client to avoid SSR issues.
let LenisCtor: any = null;
async function ensureLenis() {
  if (!LenisCtor) {
    try {
      const mod = await import("@studio-freight/lenis");
      LenisCtor = (mod as any).default ?? (mod as any);
    } catch (e) {
      // Lenis not installed; no-op
      LenisCtor = null;
    }
  }
  return LenisCtor;
}

export function useLenis(enabled: boolean = true) {
  const ref = useRef<any>(null);
  useEffect(() => {
    let rafId = 0;
    let lenis: any;
    let mounted = true;

    (async () => {
      if (!enabled) return;
      const Ctor = await ensureLenis();
      if (!Ctor) return;
      lenis = new Ctor({
        duration: 1.1,
        easing: (x: number) => 1 - Math.pow(1 - x, 2), // easeOutQuad
        smoothWheel: true,
        touchMultiplier: 1.2,
        normalizeWheel: true,
      });
      ref.current = lenis;

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    })();

    return () => {
      mounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      try { ref.current?.destroy?.(); } catch {}
      ref.current = null;
    };
  }, [enabled]);

  return ref;
}

export function usePrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  return mq.matches;
}

export function useReducedMotionSync(callback: (reduced: boolean) => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => callback(mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [callback]);
}

// Basic inView hook using IntersectionObserver for SSR-safe reveals
export function useInViewOnce<T extends Element>(
  options: IntersectionObserverInit = { root: null, threshold: 0.2 }
) {
  const ref = useRef<T | null>(null);
  const seenRef = useRef(false);
  const stateRef = useRef({ inView: false });

  useEffect(() => {
    if (!ref.current || seenRef.current || typeof IntersectionObserver === "undefined") return;
    const el = ref.current;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          stateRef.current.inView = true;
          seenRef.current = true;
          io.disconnect();
        }
      });
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return { ref, inView: stateRef.current.inView } as const;
}

