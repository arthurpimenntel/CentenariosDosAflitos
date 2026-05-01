'use client'

import { useState, useEffect } from 'react'
import FotosAdminClient, { FotoSimples } from '../home-fotos/_components/FotosAdminClient'

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="rounded-xl p-5 h-56" style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.08)' }} />
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

export default function AdminQuemSomosFotosPage() {
  const [fotos, setFotos] = useState<FotoSimples[] | null>(null)
  const [heroUrl, setHeroUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    fetch('/api/admin/quem-somos-fotos')
      .then(r => r.json())
      .then(({ fotos, heroUrl }) => { setFotos(fotos); setHeroUrl(heroUrl) })
      .catch(() => { setFotos([]); setHeroUrl('/torcida1.jpeg') })
  }, [])

  return fotos === null ? <Skeleton /> : (
    <FotosAdminClient
      fotos={fotos}
      tabela="quem_somos_fotos"
      titulo="Mosaico do Quem Somos"
      heroUrl={heroUrl}
    />
  )
}