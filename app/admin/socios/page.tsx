'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import SociosAdminClient from './_components/SociosAdminClient'

function ListSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.1)' }}>
          <div className="w-10 h-10 rounded-full" style={{ background: 'rgba(237,28,36,0.1)' }} />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 rounded" style={{ background: 'rgba(237,28,36,0.08)' }} />
            <div className="h-3 w-24 rounded" style={{ background: 'rgba(237,28,36,0.05)' }} />
          </div>
          <div className="h-5 w-20 rounded-full" style={{ background: 'rgba(237,28,36,0.08)' }} />
        </div>
      ))}
    </div>
  )
}

export default function AdminSociosPage() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status') ?? undefined
  const [socios, setSocios] = useState<any[] | null>(null)

  useEffect(() => {
    setSocios(null) // reset ao trocar filtro
    const url = status ? `/api/admin/socios?status=${status}` : '/api/admin/socios'
    fetch(url)
      .then(r => r.json())
      .then(data => setSocios(data))
      .catch(() => setSocios([]))
  }, [status])

  return socios === null
    ? <ListSkeleton />
    : <SociosAdminClient socios={socios} activeFilter={status} />
}