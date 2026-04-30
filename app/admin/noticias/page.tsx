'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import NoticiaAdminTable from './_components/NoticiaAdminTable'
import { useAdminPath } from '@/hooks/useAdminPath'
import { Noticia } from '@/types'

// Skeleton da tabela — exibido enquanto os dados carregam
function TableSkeleton() {
  return (
    <div className="overflow-hidden animate-pulse" style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.15)', borderRadius: 16 }}>
      <div style={{ background: 'rgba(237,28,36,0.05)', borderBottom: '1px solid rgba(237,28,36,0.12)', padding: '1rem 1.25rem' }}>
        <div className="h-3 w-48 rounded" style={{ background: 'rgba(237,28,36,0.12)' }} />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4" style={{ borderBottom: '1px solid rgba(237,28,36,0.07)' }}>
          <div className="h-4 rounded flex-1" style={{ background: 'rgba(237,28,36,0.06)' }} />
          <div className="h-5 w-20 rounded-full" style={{ background: 'rgba(237,28,36,0.06)' }} />
          <div className="h-4 w-24 rounded" style={{ background: 'rgba(237,28,36,0.06)' }} />
          <div className="h-7 w-16 rounded-lg" style={{ background: 'rgba(237,28,36,0.06)' }} />
        </div>
      ))}
    </div>
  )
}

export default function AdminNoticiasPage() {
  const adminBase = useAdminPath()
  const [noticias, setNoticias] = useState<Noticia[] | null>(null)

  useEffect(() => {
    fetch('/api/admin/noticias')
      .then(r => r.json())
      .then(data => setNoticias(data))
      .catch(() => setNoticias([]))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm opacity-50" style={{ color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>
          {noticias === null ? '...' : `${noticias.length} notícias`}
        </p>
        <Link href={`${adminBase}/noticias/nova`}>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}
          >
            <Plus size={16} />Nova Notícia
          </button>
        </Link>
      </div>
      {noticias === null ? <TableSkeleton /> : <NoticiaAdminTable noticias={noticias} />}
    </div>
  )
}