'use client'

import { useState, useEffect, useCallback } from 'react'
import { ShoppingBag, RefreshCw, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/ui/Toast'
import { getSupabaseClient } from '@/lib/supabase'

type VendaStatus = 'pendente' | 'confirmada' | 'cancelada'

interface ItemVenda {
  nome: string
  quantidade: number
  preco: number
  tamanho?: string | null
}

interface Venda {
  id: string
  created_at: string
  status: VendaStatus
  itens: ItemVenda[]
  valor_total: number
  valor_pago: number | null
  observacoes: string | null
  whatsapp_url: string | null
  cliente_whatsapp_url: string | null
}

const STATUS_CFG: Record<VendaStatus, { label: string; bg: string; color: string }> = {
  pendente:   { label: 'Pendente',   bg: 'rgba(234,179,8,0.12)',   color: '#b45309' },
  confirmada: { label: 'Confirmada', bg: 'rgba(34,197,94,0.12)',   color: '#16a34a' },
  cancelada:  { label: 'Cancelada',  bg: 'rgba(237,28,36,0.10)',   color: '#ED1C24' },
}

function fmt(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function StatusBadge({ status }: { status: VendaStatus }) {
  const c = STATUS_CFG[status]
  return (
    <span className="inline-block px-2.5 py-1 rounded text-xs font-semibold"
      style={{ background: c.bg, color: c.color, fontFamily: 'DM Sans, sans-serif' }}>
      {c.label}
    </span>
  )
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 rounded-xl" style={{ background: 'rgba(237,28,36,0.06)' }} />
      ))}
    </div>
  )
}

export default function VendasAdminPage() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState<string>('')
  const [expandido, setExpandido] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [edits, setEdits] = useState<Record<string, { status: VendaStatus; valor_pago: string; observacoes: string }>>({})
  const { toasts, addToast, removeToast } = useToast()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filtroStatus) params.set('status', filtroStatus)
      const res = await fetch(`/api/admin/vendas?${params}`)
      const data: Venda[] = await res.json()
      setVendas(data)
      const map: typeof edits = {}
      data.forEach(v => {
        map[v.id] = {
          status: v.status,
          valor_pago: v.valor_pago != null ? String(v.valor_pago) : String(v.valor_total),
          observacoes: v.observacoes ?? '',
        }
      })
      setEdits(map)
    } finally {
      setLoading(false)
    }
  }, [filtroStatus])

  useEffect(() => { load() }, [load])

  // Real time — novo pedido aparece automaticamente
  useEffect(() => {
    const supabase = getSupabaseClient()
    const channel = supabase.channel('vendas_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendas' }, () => {
        load()
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [load])

  function setEdit(id: string, field: string, value: string) {
    setEdits(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }))
  }

  async function salvar(venda: Venda) {
    const e = edits[venda.id]
    if (!e) return
    setSaving(venda.id)
    const res = await fetch(`/api/admin/vendas/${venda.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: e.status,
        valor_pago: parseFloat(e.valor_pago.replace(',', '.')) || venda.valor_total,
        observacoes: e.observacoes,
      }),
    })
    if (res.ok) {
      const updated: Venda = await res.json()
      setVendas(prev => prev.map(v => v.id === venda.id ? updated : v))
      addToast('success', 'Venda atualizada!')
      setExpandido(null)
    } else {
      addToast('error', 'Erro ao salvar.')
    }
    setSaving(null)
  }

  const totalConfirmadas = vendas.filter(v => v.status === 'confirmada').reduce((s, v) => s + (v.valor_pago ?? v.valor_total), 0)
  const totalPendentes   = vendas.filter(v => v.status === 'pendente').length
  const totalVendas      = vendas.filter(v => v.status === 'confirmada').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(237,28,36,0.08)' }}>
            <ShoppingBag size={18} style={{ color: '#ED1C24' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none uppercase" style={{ color: '#1a1a1a', fontFamily: 'Oswald, sans-serif' }}>Vendas</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)', fontFamily: 'DM Sans, sans-serif' }}>{vendas.length} pedido(s)</p>
          </div>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
          style={{ background: 'rgba(237,28,36,0.08)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
          <RefreshCw size={14} /> Atualizar
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Receita Confirmada', value: fmt(totalConfirmadas), accent: true },
          { label: 'Vendas Confirmadas', value: String(totalVendas),   accent: false },
          { label: 'Pedidos Pendentes',  value: String(totalPendentes), accent: false },
        ].map(c => (
          <div key={c.label} className="p-4 rounded-xl"
            style={{ background: c.accent ? '#ED1C24' : '#fff', border: '1px solid rgba(237,28,36,0.15)', boxShadow: '0 2px 8px rgba(237,28,36,0.06)' }}>
            <p className="text-2xl font-bold" style={{ fontFamily: 'Oswald, sans-serif', color: c.accent ? '#fff' : '#ED1C24' }}>{c.value}</p>
            <p className="text-xs mt-1" style={{ fontFamily: 'DM Sans, sans-serif', color: c.accent ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.45)' }}>{c.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {[{ label: 'Todos', value: '' }, { label: 'Pendentes', value: 'pendente' }, { label: 'Confirmados', value: 'confirmada' }, { label: 'Cancelados', value: 'cancelada' }].map(f => (
          <button key={f.value} onClick={() => setFiltroStatus(f.value)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{ background: filtroStatus === f.value ? '#ED1C24' : 'rgba(237,28,36,0.06)', color: filtroStatus === f.value ? '#fff' : '#ED1C24', border: `1px solid ${filtroStatus === f.value ? '#ED1C24' : 'rgba(237,28,36,0.18)'}`, fontFamily: 'DM Sans, sans-serif' }}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <Skeleton /> : vendas.length === 0 ? (
        <div className="text-center py-16 opacity-40" style={{ color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>Nenhum pedido encontrado.</div>
      ) : (
        <div className="space-y-3">
          {vendas.map(venda => {
            const e = edits[venda.id] ?? { status: venda.status, valor_pago: String(venda.valor_pago ?? venda.valor_total), observacoes: venda.observacoes ?? '' }
            const aberto = expandido === venda.id

            return (
              <div key={venda.id} className="rounded-xl overflow-hidden"
                style={{ background: '#fff', border: '1px solid rgba(237,28,36,0.12)', boxShadow: '0 2px 8px rgba(237,28,36,0.04)' }}>

                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                  onClick={() => setExpandido(aberto ? null : venda.id)}>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.35)', fontFamily: 'DM Sans, sans-serif' }}>
                      {fmtDate(venda.created_at)}
                    </p>
                    <p className="text-sm font-semibold truncate" style={{ color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>
                      {venda.itens.map(i => i.nome).join(', ')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>{fmt(venda.valor_total)}</p>
                    {venda.valor_pago != null && venda.valor_pago !== venda.valor_total && (
                      <p className="text-xs" style={{ color: '#16a34a', fontFamily: 'DM Sans, sans-serif' }}>pago: {fmt(venda.valor_pago)}</p>
                    )}
                  </div>
                  <StatusBadge status={venda.status} />
                  {aberto ? <ChevronUp size={16} style={{ color: '#ED1C24', flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: '#ED1C24', flexShrink: 0 }} />}
                </div>

                {aberto && (
                  <div className="px-4 pb-4 space-y-4" style={{ borderTop: '1px solid rgba(237,28,36,0.08)' }}>
                    <div className="pt-3 space-y-1">
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>Itens do pedido</p>
                      {venda.itens.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm"
                          style={{ color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>
                          <span>{item.quantidade}× {item.nome}{item.tamanho ? ` (${item.tamanho})` : ''}</span>
                          <span style={{ color: '#ED1C24', fontWeight: 600 }}>{fmt(item.preco * item.quantidade)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {venda.cliente_whatsapp_url && (
                        <a href={venda.cliente_whatsapp_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg"
                          style={{ background: 'rgba(37,211,102,0.12)', color: '#16a34a', fontFamily: 'DM Sans, sans-serif' }}>
                          <ExternalLink size={12} /> Responder cliente no WhatsApp
                        </a>
                      )}
                      {venda.whatsapp_url && (
                        <a href={venda.whatsapp_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg"
                          style={{ background: 'rgba(237,28,36,0.06)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                          <ExternalLink size={12} /> Ver mensagem original
                        </a>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1"
                          style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>Status</label>
                        <select value={e.status} onChange={ev => setEdit(venda.id, 'status', ev.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                          style={{ background: '#fafafa', border: '1px solid rgba(237,28,36,0.2)', color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>
                          <option value="pendente">Pendente</option>
                          <option value="confirmada">Confirmada</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1"
                          style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>Valor pago (R$)</label>
                        <input type="number" step="0.01" min="0" value={e.valor_pago}
                          onChange={ev => setEdit(venda.id, 'valor_pago', ev.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                          style={{ background: '#fafafa', border: '1px solid rgba(237,28,36,0.2)', color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1"
                          style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>Observações</label>
                        <input type="text" value={e.observacoes} placeholder="Ex: desconto dado"
                          onChange={ev => setEdit(venda.id, 'observacoes', ev.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                          style={{ background: '#fafafa', border: '1px solid rgba(237,28,36,0.2)', color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }} />
                      </div>
                    </div>

                    <button onClick={() => salvar(venda)} disabled={saving === venda.id}
                      className="px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-60"
                      style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
                      {saving === venda.id ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}