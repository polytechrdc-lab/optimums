"use client";
import { useLenis, usePrefersReducedMotion } from "@/utils/scroll";

export default function ClientScroll() {
  const reduced = usePrefersReducedMotion();
  useLenis(!reduced);
  return null;
}

