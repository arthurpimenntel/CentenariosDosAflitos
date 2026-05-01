'use client'

import { useState, useEffect } from 'react'
import FotosAdminClient, { FotoSimples } from './_components/FotosAdminClient'

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.08)' }}>
          <div className="w-16 h-12 rounded-lg" style={{ background: 'rgba(237,28,36,0.08)' }} />
          <div className="w-6 h-4 rounded" style={{ background: 'rgba(237,28,36,0.06)' }} />
          <div className="flex-1 h-8 rounded-lg" style={{ background: 'rgba(237,28,36,0.05)' }} />
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, j) => <div key={j} className="w-8 h-8 rounded-lg" style={{ background: 'rgba(237,28,36,0.06)' }} />)}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminHomeFotosPage() {
  const [fotos, setFotos] = useState<FotoSimples[] | null>(null)

  useEffect(() => {
    fetch('/api/admin/home-fotos')
      .then(r => r.json())
      .then(data => setFotos(data))
      .catch(() => setFotos([]))
  }, [])

  return fotos === null ? <Skeleton /> : (
    <FotosAdminClient fotos={fotos} tabela="home_fotos" titulo="Mosaico da Home" />
  )
}