'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Edit2, Trash2 } from 'lucide-react'
import { Produto } from '@/types'
import { getSupabaseClient } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'

export default function ProdutoAdminTable({ produtos }: { produtos: Produto[] }) {
  const [deleteTarget, setDeleteTarget] = useState<Produto | null>(null)
  const [loading, setLoading] = useState(false)
  const { toasts, addToast, removeToast } = useToast()
  const router = useRouter()
  const supabase = getSupabaseClient()

  async function handleDelete() {
    if (!deleteTarget) return
    setLoading(true)
    const { error } = await supabase.from('produtos').delete().eq('id', deleteTarget.id)
    if (error) addToast('error', 'Erro ao excluir produto.')
    else { addToast('success', 'Produto excluído.'); router.refresh() }
    setDeleteTarget(null)
    setLoading(false)
  }

  return (
    <>
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(237,28,36,0.2)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#1a0000', borderBottom: '1px solid rgba(237,28,36,0.2)' }}>
                {['Foto', 'Nome', 'Categoria', 'Preço', 'Estoque', 'Status', 'Ações'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produtos.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans, sans-serif' }}>Nenhum produto cadastrado.</td></tr>}
              {produtos.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? 'rgba(58,0,0,0.3)' : 'rgba(42,0,0,0.3)', borderBottom: '1px solid rgba(237,28,36,0.08)' }}>
                  <td className="px-4 py-3"><div className="relative w-12 h-12 rounded-lg overflow-hidden" style={{ background: '#3a0000' }}>{p.imagem_url && <Image src={p.imagem_url} alt={p.nome} fill className="object-cover" sizes="48px" />}</div></td>
                  <td className="px-4 py-3 font-medium max-w-[180px] truncate" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>{p.nome}</td>
                  <td className="px-4 py-3 text-xs opacity-60" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>{p.categoria}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>{p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                  <td className="px-4 py-3"><span className="inline-block px-2 py-0.5 rounded text-xs font-semibold" style={{ background: p.estoque > 0 ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)', color: p.estoque > 0 ? '#4ade80' : '#f87171', fontFamily: 'DM Sans, sans-serif' }}>{p.estoque > 0 ? p.estoque : 'Esgotado'}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-1.5">{p.ativo && <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80', fontFamily: 'DM Sans, sans-serif' }}>Ativo</span>}{p.destaque && <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(237,28,36,0.15)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>Destaque</span>}</div></td>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Link href={`/admin/produtos/${p.id}`}><button className="p-1.5 rounded-lg" style={{ background: 'rgba(237,28,36,0.15)' }}><Edit2 size={14} style={{ color: '#ED1C24' }} /></button></Link><button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg" style={{ background: 'rgba(248,113,113,0.1)' }}><Trash2 size={14} style={{ color: '#f87171' }} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Excluir produto?" description={`"${deleteTarget?.nome}" será removido permanentemente.`} confirmLabel="Excluir" onConfirm={handleDelete} loading={loading} danger />
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  )
}
