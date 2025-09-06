import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import UtilityBar from '@/components/UtilityBar';
import Footer from '@/components/Footer';
import SkipLink from '@/components/SkipLink';
import dynamic from 'next/dynamic';

const ClientScroll = dynamic(() => import('./ClientScroll'), { ssr: false });

export const metadata: Metadata = {
  // Generic, non-branded metadata; replace in your project.
  title: 'Telecom Infrastructure — Homepage Skeleton',
  description:
    'Minimal scaffold to reproduce a telecom infrastructure homepage layout and behaviors.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/image/logo/LOGO-OPTIMUM-icone.png" />
      </head>
      <body>
        {/* Skip to content for keyboard navigation */}
        <SkipLink />
        {/* Utility bar (sticky) */}
        <UtilityBar />
        {/* New Header */}
        <Header />
        {/* Smooth scroll initializer (Lenis) */}
        <ClientScroll />
        <main id="main-content" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
