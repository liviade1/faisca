import type { Metadata, Viewport } from 'next';
import { CartProvider } from '@/components/CartProvider';
import { siteUrl } from '@/lib/config';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: 'Faísca — utilitários contemplativos',
    template: '%s · Faísca',
  },
  description:
    'Velas em potes de cerâmica modelados à mão e objetos para transformar os hábitos de todo dia em pequenos rituais. Feitos em Curitiba.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Faísca',
  },
};

export const viewport: Viewport = {
  themeColor: '#F1EEDF',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
