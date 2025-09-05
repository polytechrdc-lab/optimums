import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import UtilityBar from '@/components/UtilityBar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  // Generic, non-branded metadata; replace in your project.
  title: 'Telecom Infrastructure — Homepage Skeleton',
  description:
    'Minimal scaffold to reproduce a telecom infrastructure homepage layout and behaviors.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Skip to content for keyboard navigation */}
        <a href="#main-content" style={{ position: 'absolute', left: -9999 }}>
          Skip to content
        </a>
        {/* Utility bar above the header (always sticky) */}
        <UtilityBar />
        {/* Sticky header with responsive nav and dropdowns (placeholder) */}
        <Header />
        <main id="main-content" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
