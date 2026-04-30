'use client'

import { useState, useEffect } from 'react'
import GaleriaAdminClient from './_components/GaleriaAdminClient'
import { GaleriaFoto } from '@/types'

function GridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 animate-pulse">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="rounded-xl aspect-square" style={{ background: 'rgba(237,28,36,0.08)' }} />
      ))}
    </div>
  )
}

export default function AdminGaleriaPage() {
  const [fotos, setFotos] = useState<GaleriaFoto[] | null>(null)

  useEffect(() => {
    fetch('/api/admin/galeria')
      .then(r => r.json())
      .then(data => setFotos(data))
      .catch(() => setFotos([]))
  }, [])

  return fotos === null ? <GridSkeleton /> : <GaleriaAdminClient fotos={fotos} />
}