'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react'
import { Noticia } from '@/types'
import { getSupabaseClient } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/ui/Toast'
import Modal from '@/components/ui/Modal'

export default function NoticiaAdminTable({ noticias }: { noticias: Noticia[] }) {
  const [deleteTarget, setDeleteTarget] = useState<Noticia | null>(null)
  const [loading, setLoading] = useState(false)
  const { toasts, addToast, removeToast } = useToast()
  const router = useRouter()
  const supabase = getSupabaseClient()

  async function handleDelete() {
    if (!deleteTarget) return
    setLoading(true)
    const { error } = await supabase.from('noticias').delete().eq('id', deleteTarget.id)
    if (error) { addToast('error', 'Erro ao excluir notícia.') } else { addToast('success', 'Notícia excluída.'); router.refresh() }
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
                {['Título', 'Status', 'Data', 'Ações'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {noticias.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Sans, sans-serif' }}>Nenhuma notícia cadastrada.</td></tr>}
              {noticias.map((n, i) => (
                <tr key={n.id} style={{ background: i % 2 === 0 ? 'rgba(58,0,0,0.3)' : 'rgba(42,0,0,0.3)', borderBottom: '1px solid rgba(237,28,36,0.08)' }}>
                  <td className="px-4 py-3 font-medium max-w-xs truncate" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>{n.titulo}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: n.publicado ? 'rgba(74,222,128,0.12)' : 'rgba(255,255,255,0.06)', color: n.publicado ? '#4ade80' : 'rgba(255,255,255,0.4)', border: `1px solid ${n.publicado ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.1)'}`, fontFamily: 'DM Sans, sans-serif' }}>
                      {n.publicado ? <Eye size={10} /> : <EyeOff size={10} />}{n.publicado ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs opacity-50 whitespace-nowrap" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>{n.publicado_em ? new Date(n.publicado_em).toLocaleDateString('pt-BR') : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/noticias/${n.id}`}><button className="p-1.5 rounded-lg" style={{ background: 'rgba(237,28,36,0.15)' }} aria-label="Editar"><Edit2 size={14} style={{ color: '#ED1C24' }} /></button></Link>
                      <button onClick={() => setDeleteTarget(n)} className="p-1.5 rounded-lg" style={{ background: 'rgba(248,113,113,0.1)' }} aria-label="Excluir"><Trash2 size={14} style={{ color: '#f87171' }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Excluir notícia?" description={`"${deleteTarget?.titulo}" será removida permanentemente.`} confirmLabel="Excluir" onConfirm={handleDelete} loading={loading} danger />
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  )
}
