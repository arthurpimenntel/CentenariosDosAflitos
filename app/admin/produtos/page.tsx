'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ProdutoAdminTable from './_components/ProdutoAdminTable'
import { useAdminPath } from '@/hooks/useAdminPath'
import { Produto } from '@/types'

function TableSkeleton() {
  return (
    <div className="overflow-hidden animate-pulse" style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.15)', borderRadius: 16 }}>
      <div style={{ background: 'rgba(237,28,36,0.05)', borderBottom: '1px solid rgba(237,28,36,0.12)', padding: '1rem 1.25rem' }}>
        <div className="h-3 w-48 rounded" style={{ background: 'rgba(237,28,36,0.12)' }} />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4" style={{ borderBottom: '1px solid rgba(237,28,36,0.07)' }}>
          <div className="w-12 h-12 rounded-xl" style={{ background: 'rgba(237,28,36,0.06)' }} />
          <div className="h-4 rounded flex-1" style={{ background: 'rgba(237,28,36,0.06)' }} />
          <div className="h-4 w-20 rounded" style={{ background: 'rgba(237,28,36,0.06)' }} />
          <div className="h-4 w-16 rounded" style={{ background: 'rgba(237,28,36,0.06)' }} />
          <div className="h-5 w-16 rounded-full" style={{ background: 'rgba(237,28,36,0.06)' }} />
          <div className="h-5 w-12 rounded-full" style={{ background: 'rgba(237,28,36,0.06)' }} />
          <div className="h-7 w-16 rounded-lg" style={{ background: 'rgba(237,28,36,0.06)' }} />
        </div>
      ))}
    </div>
  )
}

export default function AdminProdutosPage() {
  const adminBase = useAdminPath()
  const [produtos, setProdutos] = useState<Produto[] | null>(null)

  useEffect(() => {
    fetch('/api/admin/produtos')
      .then(r => r.json())
      .then(data => setProdutos(data))
      .catch(() => setProdutos([]))
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm opacity-50" style={{ color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>
          {produtos === null ? '...' : `${produtos.length} produtos`}
        </p>
        <Link href={`${adminBase}/produtos/novo`}>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}
          >
            <Plus size={16} />Novo Produto
          </button>
        </Link>
      </div>
      {produtos === null ? <TableSkeleton /> : <ProdutoAdminTable produtos={produtos} />}
    </div>
  )
}