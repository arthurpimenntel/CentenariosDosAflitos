'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProdutoCard from './ProdutoCard'
import { Produto } from '@/types'
import { ShoppingBag } from 'lucide-react'

export default function ProdutoGrid({ produtos }: { produtos: Produto[] }) {
  const categorias = ['Todos', ...Array.from(new Set(produtos.map(p => p.categoria)))]
  const [filtro, setFiltro] = useState('Todos')

  const filtered = filtro === 'Todos' ? produtos : produtos.filter(p => p.categoria === filtro)

  if (produtos.length === 0) {
    return (
      <div className="text-center py-32">
        <ShoppingBag size={64} className="mx-auto mb-6" style={{ color: 'rgba(237,28,36,0.2)' }} />
        <p className="text-2xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: 'rgba(237,28,36,0.3)' }}>
          Em breve, novos produtos
        </p>
      </div>
    )
  }

  return (
    <div>
      {categorias.length > 2 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className="px-5 py-2.5 text-sm font-semibold transition-all duration-200"
              style={{
                background: filtro === cat ? '#ED1C24' : 'rgba(237,28,36,0.04)',
                color: filtro === cat ? '#FFFFFF' : '#ED1C24',
                border: `1px solid ${filtro === cat ? '#ED1C24' : 'rgba(237,28,36,0.2)'}`,
                fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={e => { if (filtro !== cat) { (e.currentTarget as HTMLElement).style.borderColor = '#ED1C24'; (e.currentTarget as HTMLElement).style.background = 'rgba(237,28,36,0.08)' } }}
              onMouseLeave={e => { if (filtro !== cat) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(237,28,36,0.2)'; (e.currentTarget as HTMLElement).style.background = 'rgba(237,28,36,0.04)' } }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((p, i) => (
          <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <ProdutoCard produto={p} index={i} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
