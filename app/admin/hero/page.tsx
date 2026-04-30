'use client'

import { useState, useEffect } from 'react'
import HeroAdminClient from './_components/HeroAdminClient'
import { HeroFoto } from '@/types'

function ListSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'rgba(237,28,36,0.05)', border: '1px solid rgba(237,28,36,0.1)' }}>
          <div className="w-20 h-14 rounded-lg" style={{ background: 'rgba(237,28,36,0.1)' }} />
          <div className="h-4 w-6 rounded" style={{ background: 'rgba(237,28,36,0.08)' }} />
          <div className="flex-1" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="w-8 h-8 rounded-lg" style={{ background: 'rgba(237,28,36,0.08)' }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminHeroPage() {
  const [fotos, setFotos] = useState<HeroFoto[] | null>(null)

  useEffect(() => {
    fetch('/api/admin/hero')
      .then(r => r.json())
      .then(data => setFotos(data))
      .catch(() => setFotos([]))
  }, [])

  return fotos === null ? <ListSkeleton /> : <HeroAdminClient fotos={fotos} />
}