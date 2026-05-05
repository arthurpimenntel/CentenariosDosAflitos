'use client'

import Link from 'next/link'

export default function CTALink() {
  return (
    <Link
      href="/cadastro"
      className="px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all hover:scale-105 text-white"
      style={{
        background: '#ED1C24',
        fontFamily: 'Oswald, sans-serif',
        boxShadow: '0 4px 20px rgba(237,28,36,0.35)',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#C41219' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#ED1C24' }}
    >
      Seja Sócio
    </Link>
  )
}
