'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MessageCircle, Download, X, FileText, Camera } from 'lucide-react'
import { Socio, SocioStatus } from '@/types'
import AdminStatusBadge from '@/components/admin/AdminStatusBadge'
import { getSupabaseClient } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'
import { useAdminPath } from '@/hooks/useAdminPath'
import Toast from '@/components/ui/Toast'

const STATUS_OPTIONS: SocioStatus[] = ['pendente', 'em_conversa', 'aprovado', 'recusado']

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null
  return (
    <div>
      <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>{label}</p>
      <p className="text-sm font-medium" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>{value}</p>
    </div>
  )
}

export default function SociosAdminClient({ socios, activeFilter }: { socios: Socio[]; activeFilter?: string }) {
  const [selected, setSelected] = useState<Socio | null>(null)
  const [obs, setObs] = useState('')
  const [statusEdit, setStatusEdit] = useState<SocioStatus>('pendente')
  const [saving, setSaving] = useState(false)
  const { toasts, addToast, removeToast } = useToast()
  const router = useRouter()
  const supabase = getSupabaseClient()
  const adminBase = useAdminPath()

  const STATUS_FILTERS = [
    { label: 'Todos',       value: '' },
    { label: 'Pendentes',   value: 'pendente' },
    { label: 'Em conversa', value: 'em_conversa' },
    { label: 'Aprovados',   value: 'aprovado' },
    { label: 'Recusados',   value: 'recusado' },
  ]

  useEffect(() => { setSelected(null); setObs(''); setStatusEdit('pendente') }, [activeFilter, socios.length])

  function openDrawer(socio: Socio) { setSelected(socio); setObs(socio.observacoes ?? ''); setStatusEdit(socio.status) }

  async function saveChanges() {
    if (!selected) return
    setSaving(true)
    const { error } = await supabase.from('socios').update({ status: statusEdit, observacoes: obs }).eq('id', selected.id)
    if (error) { addToast('error', 'Erro ao salvar.') }
    else { addToast('success', 'Sócio atualizado!'); setSelected(null); router.refresh() }
    setSaving(false)
  }

  function exportCSV() {
    const headers = ['Nome', 'Email', 'Telefone', 'RG', 'CPF', 'Cidade', 'CEP', 'Endereço', 'Plano', 'Carteirinha', 'Status', 'Data']
    const rows = socios.map(s => [s.nome, s.email, s.telefone, s.rg ?? '', s.cpf ?? '', s.cidade ?? '', s.cep ?? '', s.endereco ?? '', s.plano ?? '', s.carteirinha ?? '', s.status, new Date(s.created_at).toLocaleDateString('pt-BR')])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'socios.csv'; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <>
      <div className="space-y-5">
        {/* Título da seção */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>Últimos Sócios Cadastrados</h2>
          <Link href={`${adminBase}/socios`} className="text-lg font-bold uppercase tracking-widest" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif', letterSpacing: 2 }}>
            VER TODOS
          </Link>
        </div>

        {/* Filtros + CSV */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <Link
                key={f.value}
                href={f.value ? `${adminBase}/socios?status=${f.value}` : `${adminBase}/socios`}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all hover:scale-[1.02]"
                style={{ background: (activeFilter ?? '') === f.value ? '#ED1C24' : '#FFFFFF', color: (activeFilter ?? '') === f.value ? '#FFFFFF' : 'rgba(237,28,36,0.6)', border: `1px solid ${(activeFilter ?? '') === f.value ? '#ED1C24' : 'rgba(237,28,36,0.2)'}`, fontFamily: 'DM Sans, sans-serif', boxShadow: (activeFilter ?? '') === f.value ? '0 2px 12px rgba(237,28,36,0.25)' : 'none' }}>
                {f.label}
              </Link>
            ))}
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition hover:scale-[1.02]"
            style={{ background: '#FFFFFF', color: 'rgba(237,28,36,0.6)', border: '1px solid rgba(237,28,36,0.2)', fontFamily: 'DM Sans, sans-serif' }}>
            <Download size={14} />Exportar CSV
          </button>
        </div>

        {/* Tabela */}
        <div className="overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.15)', borderRadius: 16, boxShadow: '0 2px 12px rgba(237,28,36,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(237,28,36,0.05)', borderBottom: '1px solid rgba(237,28,36,0.12)' }}>
                  {['Nome', 'E-mail', 'Cidade', 'Plano', 'Status', 'Data'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {socios.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-sm" style={{ color: 'rgba(237,28,36,0.35)', fontFamily: 'DM Sans, sans-serif' }}>Nenhum sócio encontrado.</td></tr>
                )}
                {socios.map((s, i) => (
                  <tr key={s.id} onClick={() => openDrawer(s)} className="cursor-pointer transition-colors"
                    style={{ background: i % 2 === 0 ? '#FFFFFF' : 'rgba(237,28,36,0.02)', borderBottom: '1px solid rgba(237,28,36,0.07)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(237,28,36,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = i % 2 === 0 ? '#FFFFFF' : 'rgba(237,28,36,0.02)')}>
                    <td className="px-5 py-4 font-medium" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                      <div className="flex items-center gap-2">
                        {s.foto_url ? (
                          <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                            <Image src={s.foto_url} alt={s.nome} fill className="object-cover" sizes="28px" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#ED1C24' }}>
                            <span className="text-xs font-bold text-white">{s.nome.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        {s.nome}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>{s.email}</td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>{s.cidade ?? '—'}</td>
                    <td className="px-5 py-4">
                      {s.plano && <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: 'rgba(237,28,36,0.08)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>{s.plano}</span>}
                    </td>
                    <td className="px-5 py-4"><AdminStatusBadge status={s.status} /></td>
                    <td className="px-5 py-4 text-xs whitespace-nowrap" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>{new Date(s.created_at).toLocaleDateString('pt-BR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md h-full overflow-y-auto flex flex-col" style={{ background: '#FFFFFF', borderLeft: '1px solid rgba(237,28,36,0.15)', boxShadow: '-8px 0 32px rgba(237,28,36,0.1)' }}>

            {/* Header */}
            <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid rgba(237,28,36,0.1)', background: '#ED1C24' }}>
              <h3 className="font-bold text-lg text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>Detalhes do Sócio</h3>
              <button onClick={() => setSelected(null)} aria-label="Fechar" className="p-1.5 rounded-lg transition hover:bg-white/20">
                <X size={20} color="#fff" />
              </button>
            </div>

            <div className="flex-1 p-6 space-y-4">

              {/* Foto */}
              {selected.foto_url && (
                <div className="flex flex-col gap-4 p-4 rounded-xl" style={{ background: 'rgba(237,28,36,0.03)', border: '1px solid rgba(237,28,36,0.1)' }}>
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={selected.foto_url} alt={selected.nome} fill className="object-cover" sizes="64px" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest mb-0.5 flex items-center gap-1" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}><Camera size={10} />Foto carteirinha</p>
                      <p className="font-bold text-base" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>{selected.nome}</p>
                    </div>
                  </div>
                  <a href={selected.foto_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition hover:scale-[1.02]"
                    style={{ background: 'rgba(237,28,36,0.08)', border: '1px solid rgba(237,28,36,0.2)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                    Abrir foto
                  </a>
                </div>
              )}

              {/* Dados pessoais */}
              <div className="space-y-3 p-4 rounded-xl" style={{ background: 'rgba(237,28,36,0.03)', border: '1px solid rgba(237,28,36,0.08)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>Dados pessoais</p>
                <Field label="Nome completo" value={selected.nome} />
                <Field label="E-mail" value={selected.email} />
                <Field label="Telefone / WhatsApp" value={selected.telefone} />
                <Field label="Data de nascimento" value={selected.data_nascimento ? new Date(selected.data_nascimento).toLocaleDateString('pt-BR') : null} />
                <Field label="RG" value={selected.rg} />
                <Field label="CPF" value={selected.cpf} />
              </div>

              {/* Endereço */}
              <div className="space-y-3 p-4 rounded-xl" style={{ background: 'rgba(237,28,36,0.03)', border: '1px solid rgba(237,28,36,0.08)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>Endereço</p>
                <Field label="Cidade" value={selected.cidade} />
                <Field label="CEP" value={selected.cep} />
                <Field label="Rua e Complemento" value={selected.endereco} />
              </div>

              {/* Associação */}
              <div className="space-y-3 p-4 rounded-xl" style={{ background: 'rgba(237,28,36,0.03)', border: '1px solid rgba(237,28,36,0.08)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>Associação</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>Plano</p>
                    <p className="text-sm capitalize font-semibold" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>{selected.plano ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>Carteirinha</p>
                    <p className="text-sm capitalize font-semibold" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>{selected.carteirinha ?? '—'}</p>
                  </div>
                </div>
                <Field label="Como conheceu" value={selected.como_conheceu} />
                <Field label="Inscrito em" value={new Date(selected.created_at).toLocaleDateString('pt-BR')} />
              </div>

              {/* Comprovante */}
              {selected.comprovante_url && (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(237,28,36,0.03)', border: '1px solid rgba(237,28,36,0.08)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}><FileText size={10} />Comprovante de pagamento</p>
                  <a href={selected.comprovante_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition hover:scale-[1.02]"
                    style={{ background: 'rgba(237,28,36,0.08)', border: '1px solid rgba(237,28,36,0.2)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                    <FileText size={14} />Ver comprovante
                  </a>
                </div>
              )}

              {/* Status */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>Status</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map(s => (
                    <button key={s} onClick={() => setStatusEdit(s)} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02]"
                      style={{ background: statusEdit === s ? '#ED1C24' : 'rgba(237,28,36,0.06)', color: statusEdit === s ? '#FFFFFF' : 'rgba(237,28,36,0.6)', border: `1px solid ${statusEdit === s ? '#ED1C24' : 'rgba(237,28,36,0.15)'}`, fontFamily: 'DM Sans, sans-serif' }}>
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Observações */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>Observações internas</p>
                <textarea value={obs} onChange={e => setObs(e.target.value)} rows={4}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(237,28,36,0.03)', border: '1px solid rgba(237,28,36,0.15)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}
                  placeholder="Anotações internas..." />
              </div>
            </div>

            {/* Rodapé */}
            <div className="p-6 space-y-3" style={{ borderTop: '1px solid rgba(237,28,36,0.1)' }}>
              <a href={`https://wa.me/55${selected.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${selected.nome}! Recebemos seu cadastro nos Centenários dos Aflitos e gostaríamos de conversar com você.`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition hover:scale-[1.01]"
                style={{ background: '#25D366', color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }}>
                <MessageCircle size={16} />Abrir WhatsApp
              </a>
              <button onClick={saveChanges} disabled={saving} className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-60 transition hover:scale-[1.01]"
                style={{ background: '#ED1C24', color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif', boxShadow: '0 4px 16px rgba(237,28,36,0.3)' }}>
                {saving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  )
}