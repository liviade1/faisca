import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Faísca — Utilitários contemplativos',
  description: 'Objetos de fogo e luz feitos à mão por um coletivo de artistas da presença.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F2EEE1',
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
