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
import { useAdminPath } from '@/hooks/useAdminPath'

function safeDate(val: string | null | undefined): string {
  if (!val) return '—'
  const d = new Date(val.includes('T') ? val : val + 'T00:00:00')
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function displayDate(n: Noticia): string {
  const fromPublicado = safeDate((n as any).publicado_em)
  if (fromPublicado !== '—') return fromPublicado
  return safeDate((n as any).created_at)
}

export default function NoticiaAdminTable({ noticias: initialNoticias }: { noticias: Noticia[] }) {
  const [noticias, setNoticias] = useState<Noticia[]>(initialNoticias)
  const [deleteTarget, setDeleteTarget] = useState<Noticia | null>(null)
  const [loading, setLoading] = useState(false)
  const { toasts, addToast, removeToast } = useToast()
  const router = useRouter()
  const supabase = getSupabaseClient()
  const adminBase = useAdminPath()

  async function handleDelete() {
    if (!deleteTarget) return
    setLoading(true)
    const id = deleteTarget.id
    // Remove imediatamente do estado local (optimistic)
    setNoticias(prev => prev.filter(n => n.id !== id))
    setDeleteTarget(null)
    const { error } = await supabase.from('noticias').delete().eq('id', id)
    if (error) {
      // Reverte se falhou
      setNoticias(initialNoticias)
      addToast('error', 'Erro ao excluir notícia.')
    } else {
      addToast('success', 'Notícia excluída.')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <>
      <div className="overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.15)', borderRadius: 16, boxShadow: '0 2px 12px rgba(237,28,36,0.06)' }}>

        {/* ── MOBILE CARDS (< 640 px) ── */}
        <div className="sm:hidden divide-y" style={{ borderColor: 'rgba(237,28,36,0.07)' }}>
          {noticias.length === 0 && (
            <p className="px-5 py-12 text-center text-sm" style={{ color: 'rgba(237,28,36,0.35)', fontFamily: 'DM Sans, sans-serif' }}>
              Nenhuma notícia cadastrada.
            </p>
          )}
          {noticias.map((n, i) => (
            <div key={n.id} className="px-4 py-4 space-y-2"
              style={{ background: i % 2 === 0 ? '#FFFFFF' : 'rgba(237,28,36,0.02)' }}>
              <p className="font-medium text-sm leading-snug" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                {n.titulo}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{ background: n.publicado ? 'rgba(74,222,128,0.10)' : 'rgba(237,28,36,0.06)', color: n.publicado ? '#16a34a' : 'rgba(237,28,36,0.5)', border: `1px solid ${n.publicado ? 'rgba(74,222,128,0.25)' : 'rgba(237,28,36,0.15)'}`, fontFamily: 'DM Sans, sans-serif' }}>
                  {n.publicado ? <Eye size={10} /> : <EyeOff size={10} />}
                  {n.publicado ? 'Publicado' : 'Rascunho'}
                </span>
                <span className="text-xs" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
                  {displayDate(n)}
                </span>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Link href={`${adminBase}/noticias/${n.id}`}>
                  <button className="p-1.5 rounded-lg transition hover:scale-110" style={{ background: 'rgba(237,28,36,0.08)' }} aria-label="Editar">
                    <Edit2 size={14} style={{ color: '#ED1C24' }} />
                  </button>
                </Link>
                <button onClick={() => setDeleteTarget(n)} className="p-1.5 rounded-lg transition hover:scale-110" style={{ background: 'rgba(237,28,36,0.08)' }} aria-label="Excluir">
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
                {['Título', 'Status', 'Data', 'Ações'].map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {noticias.length === 0 && (
                <tr><td colSpan={4} className="px-5 py-12 text-center text-sm" style={{ color: 'rgba(237,28,36,0.35)', fontFamily: 'DM Sans, sans-serif' }}>Nenhuma notícia cadastrada.</td></tr>
              )}
              {noticias.map((n, i) => (
                <tr key={n.id} style={{ background: i % 2 === 0 ? '#FFFFFF' : 'rgba(237,28,36,0.02)', borderBottom: '1px solid rgba(237,28,36,0.07)' }}>
                  <td className="px-5 py-4 font-medium max-w-xs truncate" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>{n.titulo}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{ background: n.publicado ? 'rgba(74,222,128,0.10)' : 'rgba(237,28,36,0.06)', color: n.publicado ? '#16a34a' : 'rgba(237,28,36,0.5)', border: `1px solid ${n.publicado ? 'rgba(74,222,128,0.25)' : 'rgba(237,28,36,0.15)'}`, fontFamily: 'DM Sans, sans-serif' }}>
                      {n.publicado ? <Eye size={10} /> : <EyeOff size={10} />}{n.publicado ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs whitespace-nowrap" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
                    {displayDate(n)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`${adminBase}/noticias/${n.id}`}>
                        <button className="p-1.5 rounded-lg transition hover:scale-110" style={{ background: 'rgba(237,28,36,0.08)' }} aria-label="Editar">
                          <Edit2 size={14} style={{ color: '#ED1C24' }} />
                        </button>
                      </Link>
                      <button onClick={() => setDeleteTarget(n)} className="p-1.5 rounded-lg transition hover:scale-110" style={{ background: 'rgba(237,28,36,0.08)' }} aria-label="Excluir">
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
        title="Excluir notícia?"
        description={`"${deleteTarget?.titulo}" será removida permanentemente.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
        loading={loading}
        danger
      />
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  )
}