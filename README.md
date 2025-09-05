# Telecom Infrastructure Homepage — Next.js Scaffold

Minimal Next.js app router scaffold that mirrors the high‑level layout and interactions of a telecom infrastructure company homepage. It includes only neutral placeholders, comments, and TODOs — no proprietary text, logos, or media.

Use this as a starting point to rebuild a similar structure and behavior without copying protected content.

## Stack

- Next.js (App Router)
- React 18
- TypeScript
- SWR for simple data fetching placeholders

## Getting Started

1. Install dependencies:
   - `npm install` or `pnpm install` or `yarn`
2. Run the dev server:
   - `npm run dev`
3. Open `http://localhost:3000` to view the scaffold.

## Project Structure

- `app/`
  - `layout.tsx`: Root layout with sticky header, footer, skip link.
  - `page.tsx`: Homepage composition — hero, ticker, key stats, markets, updates.
  - `api/` — placeholder routes for `news` and `stats`.
- `components/`
  - `Header.tsx`: Sticky header with mobile menu toggle and TODOs for desktop dropdowns.
  - `Hero.tsx`: Background media placeholder, title, CTAs.
  - `Ticker.tsx`: Lightweight marquee placeholder; replace with accessible implementation.
  - `KeyStats.tsx`: Stats grid with future count‑up animation (respect reduced motion).
  - `MarketsMap.tsx`: Map/list interaction scaffold (no real map assets).
  - `NewsCarousel.tsx`: Carousel scaffold with next/prev and TODOs for swipe/auto advance.
  - `Footer.tsx`: Footer placeholders and legal area.
- `lib/`
  - `mockData.ts`: Non‑branded mock data for stats, news, markets.
  - `fetcher.ts`: Simple JSON fetcher used by SWR.
- `app/globals.css`: Neutral, minimal styles and utilities for placeholders.

## Accessibility Notes

- Includes a skip link to `#main-content`.
- Plan for keyboard‑accessible nav, focus management in dropdowns, and ARIA labels for carousel behavior.
- Respect `prefers-reduced-motion` for animations and counters.

## Section Parity & TODOs

- Header/Nav:
  - TODO: Desktop navigation with hover/focus dropdowns and proper focus trapping.
  - TODO: Sticky state styling parity.
- Hero:
  - TODO: Replace placeholder block with non‑proprietary image/video and accessible text overlays.
  - TODO: Responsive layout and CTAs.
- Ticker:
  - TODO: Accessible, pausable ticker well‑announced for screen readers.
- Key Stats:
  - TODO: Count‑up animation; pause when out of view, and disable on reduced motion.
  - TODO: Replace mock stats with real data.
- Markets Map:
  - TODO: Replace placeholder with SVG map or library; sync list hover/focus to map highlights.
  - TODO: Market detail popovers or modal drawer.
- Updates/News:
  - TODO: Connect to CMS or API; add pagination; implement auto‑advance with pause‑on‑hover.
- Footer:
  - TODO: Finalize nav, contact, and legal links; social icons with accessible labels.

## Legal & Content

- This repository contains no proprietary text, logos, or media.
- All content is neutral placeholder text and shapes intended for scaffolding only.
- Replace placeholders with your own original content and brand assets.

## Deployment

- Standard Next.js deployment flow applies: `npm run build` then `npm start` (Node hosting) or deploy to platforms like Vercel.

