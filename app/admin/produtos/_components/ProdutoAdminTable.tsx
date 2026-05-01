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
import { useAdminPath } from '@/hooks/useAdminPath'

export default function ProdutoAdminTable({ produtos }: { produtos: Produto[] }) {
  const [deleteTarget, setDeleteTarget] = useState<Produto | null>(null)
  const [loading, setLoading] = useState(false)
  const { toasts, addToast, removeToast } = useToast()
  const router = useRouter()
  const supabase = getSupabaseClient()
  const adminBase = useAdminPath()

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
      <div className="overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.15)', borderRadius: 16, boxShadow: '0 2px 12px rgba(237,28,36,0.06)' }}>

        {/* ── MOBILE CARDS (< 640 px) ── */}
        <div className="sm:hidden divide-y" style={{ borderColor: 'rgba(237,28,36,0.07)' }}>
          {produtos.length === 0 && (
            <p className="px-5 py-12 text-center text-sm"
              style={{ color: 'rgba(237,28,36,0.35)', fontFamily: 'DM Sans, sans-serif' }}>
              Nenhum produto cadastrado.
            </p>
          )}
          {produtos.map((p, i) => (
            <div key={p.id} className="px-4 py-4 space-y-2.5"
              style={{ background: i % 2 === 0 ? '#FFFFFF' : 'rgba(237,28,36,0.02)' }}>

              {/* Linha 1: foto + nome/categoria */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: 'rgba(237,28,36,0.06)' }}>
                  {p.imagem_url && <Image src={p.imagem_url} alt={p.nome} fill className="object-cover" sizes="48px" />}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm leading-snug truncate"
                    style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>{p.nome}</p>
                  <p className="text-xs mt-0.5"
                    style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>{p.categoria}</p>
                </div>
              </div>

              {/* Linha 2: preço + estoque + badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-sm"
                  style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                  {p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: p.estoque > 0 ? 'rgba(74,222,128,0.10)' : 'rgba(237,28,36,0.08)', color: p.estoque > 0 ? '#16a34a' : '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                  {p.estoque > 0 ? `Est. ${p.estoque}` : 'Esgotado'}
                </span>
                {p.ativo && (
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(237,28,36,0.08)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                    Ativo
                  </span>
                )}
                {p.destaque && (
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: '#ED1C24', color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }}>
                    Destaque
                  </span>
                )}
              </div>

              {/* Linha 3: botões alinhados à direita */}
              <div className="flex justify-end gap-2">
                <Link href={`${adminBase}/produtos/${p.id}`}>
                  <button className="p-1.5 rounded-lg transition hover:scale-110"
                    style={{ background: 'rgba(237,28,36,0.08)' }} aria-label="Editar">
                    <Edit2 size={14} style={{ color: '#ED1C24' }} />
                  </button>
                </Link>
                <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg transition hover:scale-110"
                  style={{ background: 'rgba(237,28,36,0.08)' }} aria-label="Excluir">
                  <Trash2 size={14} style={{ color: '#ED1C24' }} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── DESKTOP TABLE (≥ 640 px) ── */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(237,28,36,0.05)', borderBottom: '1px solid rgba(237,28,36,0.12)' }}>
                {['Foto', 'Nome', 'Categoria', 'Preço', 'Estoque', 'Status', 'Ações'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produtos.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm" style={{ color: 'rgba(237,28,36,0.35)', fontFamily: 'DM Sans, sans-serif' }}>Nenhum produto cadastrado.</td></tr>
              )}
              {produtos.map((p, i) => (
                <tr key={p.id}
                  style={{ background: i % 2 === 0 ? '#FFFFFF' : 'rgba(237,28,36,0.02)', borderBottom: '1px solid rgba(237,28,36,0.07)' }}>
                  <td className="px-5 py-4">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden"
                      style={{ background: 'rgba(237,28,36,0.06)' }}>
                      {p.imagem_url && <Image src={p.imagem_url} alt={p.nome} fill className="object-cover" sizes="48px" />}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium max-w-[180px] truncate"
                    style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>{p.nome}</td>
                  <td className="px-5 py-4 text-xs"
                    style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>{p.categoria}</td>
                  <td className="px-5 py-4 font-semibold"
                    style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                    {p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ background: p.estoque > 0 ? 'rgba(74,222,128,0.10)' : 'rgba(237,28,36,0.08)', color: p.estoque > 0 ? '#16a34a' : '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                      {p.estoque > 0 ? p.estoque : 'Esgotado'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {p.ativo && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(237,28,36,0.08)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>Ativo</span>}
                      {p.destaque && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#ED1C24', color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }}>Destaque</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`${adminBase}/produtos/${p.id}`}>
                        <button className="p-1.5 rounded-lg transition hover:scale-110"
                          style={{ background: 'rgba(237,28,36,0.08)' }} aria-label="Editar">
                          <Edit2 size={14} style={{ color: '#ED1C24' }} />
                        </button>
                      </Link>
                      <button onClick={() => setDeleteTarget(p)} className="p-1.5 rounded-lg transition hover:scale-110"
                        style={{ background: 'rgba(237,28,36,0.08)' }} aria-label="Excluir">
                        <Trash2 size={14} style={{ color: '#ED1C24' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Excluir produto?"
        description={`"${deleteTarget?.nome}" será removido permanentemente.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        loading={loading}
        danger
      />
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  )
}