'use client'

import { useState, useEffect } from 'react'
import GaleriaAdminClient from './_components/GaleriaAdminClient'

export default function AdminGaleriaPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => { setLoading(false) }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl aspect-video" style={{ background: 'rgba(237,28,36,0.08)' }} />
        ))}
      </div>
    )
  }

  return <GaleriaAdminClient />
}