import type { Metadata } from 'next'
import { Oswald, DM_Sans } from 'next/font/google'
import './globals.css'
import ScrollToTop from '@/components/ScrollToTop'  

const oswald = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-oswald',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Os Centenários dos Aflitos | Barra Brava do Náutico',
  description: 'A Barra Brava oficial do Clube Náutico Capibaribe. Fundada em 2012 com a filosofia de apoio incondicional, do início ao fim.',
  keywords: ['Náutico', 'Centenários', 'Barra Brava', 'Torcida Organizada', 'Pernambuco'],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Os Centenários dos Aflitos',
    description: 'Apoio incondicional ao Náutico, do início ao fim.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${oswald.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased">
        <ScrollToTop />
        {children}
      </body>
    </html>
  )
}
