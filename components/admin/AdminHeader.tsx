'use client'

import { usePathname } from 'next/navigation'
import { useAdminPath } from '@/hooks/useAdminPath'

export default function AdminHeader() {
  const pathname = usePathname()
  const adminBase = useAdminPath()

  const titles: Record<string, string> = {
    [adminBase]:                   'Dashboard',
    [`${adminBase}/noticias`]:     'Notícias',
    [`${adminBase}/produtos`]:     'Produtos',
    [`${adminBase}/socios`]:       'Sócios',
    [`${adminBase}/galeria`]:      'Galeria',
    [`${adminBase}/hero`]:         'Hero / Carrossel',
  }

  function getTitle(path: string): string {
    if (titles[path]) return titles[path]
    for (const [key, label] of Object.entries(titles)) {
      if (path.startsWith(key) && key !== adminBase) return label
    }
    return 'Admin'
  }

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center px-4 lg:px-8 border-b"
      style={{
        background: '#ED1C24',
        borderColor: 'rgba(237,28,36,0.15)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="ml-10 lg:ml-0">
        <h1
          className="text-lg font-bold uppercase tracking-widest"
          style={{ fontFamily: 'Oswald, sans-serif', color: '#fff' }}
        >
          {getTitle(pathname)}
        </h1>
      </div>
    </header>
  )
}