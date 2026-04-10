'use client'

import { usePathname } from 'next/navigation'

const titles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/noticias': 'Notícias',
  '/admin/produtos': 'Produtos',
  '/admin/socios': 'Sócios',
  '/admin/galeria': 'Galeria',
  '/admin/hero': 'Hero / Carrossel',
}

function getTitle(pathname: string): string {
  if (titles[pathname]) return titles[pathname]
  for (const [key, label] of Object.entries(titles)) {
    if (pathname.startsWith(key) && key !== '/admin') return label
  }
  return 'Admin'
}

export default function AdminHeader() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-30 h-16 flex items-center px-4 lg:px-8 border-b" style={{ background: '#ED1C24', borderColor: 'rgba(237,28,36,0.15)', backdropFilter: 'blur(12px)' }}>
      <div className="ml-10 lg:ml-0">
        <h1 className="text-lg font-bold uppercase tracking-widest" style={{ fontFamily: 'Oswald, sans-serif', color: '#fff' }}>
          {getTitle(pathname)}
        </h1>
      </div>
    </header>
  )
}
