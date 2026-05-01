'use client'

import { useState, useEffect, useCallback } from 'react'
import { Shield, ChevronLeft, ChevronRight, Filter, RefreshCw } from 'lucide-react'

interface Registro {
  id: string
  usuario_id: string
  usuario_email: string | null
  acao: string
  tabela: string
  registro_id: string
  detalhes: Record<string, unknown> | null
  created_at: string
}

const ACAO_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  insert:     { bg: 'rgba(34,197,94,0.12)',  text: '#16a34a', label: 'Inserção'   },
  update:     { bg: 'rgba(59,130,246,0.12)', text: '#2563eb', label: 'Edição'     },
  update_alt: { bg: 'rgba(59,130,246,0.12)', text: '#2563eb', label: 'Legenda'    },
  delete:     { bg: 'rgba(237,28,36,0.12)',  text: '#ED1C24', label: 'Exclusão'   },
  reorder:    { bg: 'rgba(168,85,247,0.12)', text: '#9333ea', label: 'Reordenado' },
}

function Badge({ acao }: { acao: string }) {
  const c = ACAO_COLORS[acao] ?? { bg: 'rgba(0,0,0,0.06)', text: '#555', label: acao }
  return (
    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold"
      style={{ background: c.bg, color: c.text, fontFamily: 'DM Sans, sans-serif' }}>
      {c.label}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

function Skeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-14 rounded-xl" style={{ background: 'rgba(237,28,36,0.06)' }} />
      ))}
    </div>
  )
}

export default function AuditoriaPage() {
  const [registros, setRegistros] = useState<Registro[]>([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [loading, setLoading]     = useState(true)
  const [filtroTabela, setFiltroTabela] = useState('')
  const [filtroAcao, setFiltroAcao]     = useState('')
  const [detalheAberto, setDetalheAberto] = useState<string | null>(null)

  const perPage = 50
  const totalPages = Math.max(1, Math.ceil(total / perPage))

  const load = useCallback(async (p = page) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(p) })
      if (filtroTabela) params.set('tabela', filtroTabela)
      if (filtroAcao)   params.set('acao', filtroAcao)
      const res = await fetch(`/api/admin/auditoria?${params}`)
      const json = await res.json()
      setRegistros(json.registros ?? [])
      setTotal(json.total ?? 0)
    } finally {
      setLoading(false)
    }
  }, [page, filtroTabela, filtroAcao])

  useEffect(() => { load(1); setPage(1) }, [filtroTabela, filtroAcao]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { load(page) }, [page])                               // eslint-disable-line react-hooks/exhaustive-deps

  function handleFilter() { load(1); setPage(1) }

  return (
    <div className="space-y-6">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(237,28,36,0.08)' }}>
            <Shield size={18} style={{ color: '#ED1C24' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none" style={{ color: '#1a1a1a', fontFamily: 'Oswald, sans-serif' }}>
              AUDITORIA
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
              {total} registro(s) encontrado(s)
            </p>
          </div>
        </div>
        <button onClick={() => load(page)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(237,28,36,0.08)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
          <RefreshCw size={14} />
          Atualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 p-4 rounded-xl"
        style={{ background: '#fff', border: '1px solid rgba(237,28,36,0.12)', boxShadow: '0 2px 12px rgba(237,28,36,0.04)' }}>
        <div className="flex items-center gap-2">
          <Filter size={14} style={{ color: '#ED1C24' }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>
            Filtros
          </span>
        </div>
        <select value={filtroTabela} onChange={e => setFiltroTabela(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-sm outline-none"
          style={{ background: 'rgba(237,28,36,0.05)', border: '1px solid rgba(237,28,36,0.15)', color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>
          <option value="">Todas as tabelas</option>
          <option value="home_fotos">home_fotos</option>
          <option value="quem_somos_fotos">quem_somos_fotos</option>
          <option value="quem_somos_hero">quem_somos_hero</option>
          <option value="noticias">noticias</option>
          <option value="produtos">produtos</option>
          <option value="galeria">galeria</option>
          <option value="hero_fotos">hero_fotos</option>
        </select>
        <select value={filtroAcao} onChange={e => setFiltroAcao(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-sm outline-none"
          style={{ background: 'rgba(237,28,36,0.05)', border: '1px solid rgba(237,28,36,0.15)', color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>
          <option value="">Todas as ações</option>
          <option value="insert">Inserção</option>
          <option value="update">Edição</option>
          <option value="update_alt">Legenda</option>
          <option value="delete">Exclusão</option>
          <option value="reorder">Reordenado</option>
        </select>
        {(filtroTabela || filtroAcao) && (
          <button onClick={() => { setFiltroTabela(''); setFiltroAcao('') }}
            className="px-3 py-1.5 rounded-lg text-xs"
            style={{ background: 'rgba(237,28,36,0.08)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
            Limpar filtros
          </button>
        )}
      </div>

      {/* Tabela / Cards */}
      <div className="rounded-xl overflow-hidden"
        style={{ background: '#fff', border: '1px solid rgba(237,28,36,0.12)', boxShadow: '0 2px 12px rgba(237,28,36,0.04)' }}>

        {/* Cabeçalho da tabela — visível apenas em sm+ */}
        <div className="hidden sm:grid gap-3 px-4 py-3"
          style={{ gridTemplateColumns: '1fr 1fr 90px 1fr 140px', background: 'rgba(237,28,36,0.04)', borderBottom: '1px solid rgba(237,28,36,0.1)' }}>
          {['Usuário', 'Tabela / ID', 'Ação', 'Detalhes', 'Data'].map(h => (
            <span key={h} className="text-xs font-bold uppercase tracking-wider"
              style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div className="p-4"><Skeleton /></div>
        ) : registros.length === 0 ? (
          <div className="text-center py-16 opacity-40"
            style={{ color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif', fontSize: 14 }}>
            Nenhum registro encontrado.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'rgba(237,28,36,0.06)' }}>
            {registros.map(r => (
              <div key={r.id}>

                {/* ── MOBILE CARD (< 640 px) ── */}
                <div className="sm:hidden px-4 py-4 space-y-2">
                  {/* Email em destaque */}
                  <p className="text-sm font-semibold truncate"
                    style={{ color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>
                    {r.usuario_email ?? '—'}
                  </p>
                  {/* Tabela + badge na mesma linha */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold"
                      style={{ color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>
                      {r.tabela}
                    </span>
                    <Badge acao={r.acao} />
                  </div>
                  {/* Registro ID resumido */}
                  <p className="text-xs"
                    style={{ color: 'rgba(0,0,0,0.35)', fontFamily: 'DM Sans, sans-serif' }}>
                    ID: {r.registro_id.slice(0, 16)}…
                  </p>
                  {/* Data */}
                  <p className="text-xs"
                    style={{ color: 'rgba(0,0,0,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
                    {formatDate(r.created_at)}
                  </p>
                  {/* Detalhes expansíveis */}
                  {r.detalhes && (
                    <div>
                      <button
                        onClick={() => setDetalheAberto(detalheAberto === r.id ? null : r.id)}
                        className="text-xs underline underline-offset-2"
                        style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>
                        {detalheAberto === r.id ? 'Fechar detalhes' : 'Ver detalhes'}
                      </button>
                      {detalheAberto === r.id && (
                        <pre className="mt-2 p-2 rounded-lg text-xs overflow-auto w-full"
                          style={{ background: 'rgba(0,0,0,0.04)', color: '#333', fontFamily: 'monospace', maxHeight: 180 }}>
                          {JSON.stringify(r.detalhes, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>

                {/* ── DESKTOP ROW (≥ 640 px) ── */}
                <div className="hidden sm:grid gap-3 px-4 py-3 hover:bg-red-50/30 transition-colors"
                  style={{ gridTemplateColumns: '1fr 1fr 90px 1fr 140px', alignItems: 'start' }}>

                  {/* Usuário */}
                  <div>
                    <p className="text-xs truncate" style={{ color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>
                      {r.usuario_email ?? '—'}
                    </p>
                    <p className="text-xs opacity-30 truncate mt-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {r.usuario_id.slice(0, 8)}…
                    </p>
                  </div>

                  {/* Tabela / ID */}
                  <div>
                    <p className="text-xs font-semibold" style={{ color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>
                      {r.tabela}
                    </p>
                    <p className="text-xs opacity-30 truncate mt-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {r.registro_id.slice(0, 12)}…
                    </p>
                  </div>

                  {/* Ação */}
                  <div><Badge acao={r.acao} /></div>

                  {/* Detalhes */}
                  <div>
                    {r.detalhes ? (
                      <button onClick={() => setDetalheAberto(detalheAberto === r.id ? null : r.id)}
                        className="text-xs underline underline-offset-2"
                        style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>
                        {detalheAberto === r.id ? 'Fechar' : 'Ver detalhes'}
                      </button>
                    ) : (
                      <span className="text-xs opacity-30" style={{ fontFamily: 'DM Sans, sans-serif' }}>—</span>
                    )}
                    {detalheAberto === r.id && r.detalhes && (
                      <pre className="mt-2 p-2 rounded-lg text-xs overflow-auto max-w-xs"
                        style={{ background: 'rgba(0,0,0,0.04)', color: '#333', fontFamily: 'monospace', maxHeight: 120 }}>
                        {JSON.stringify(r.detalhes, null, 2)}
                      </pre>
                    )}
                  </div>

                  {/* Data */}
                  <p className="text-xs" style={{ color: 'rgba(0,0,0,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
                    {formatDate(r.created_at)}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: 'rgba(0,0,0,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm disabled:opacity-30"
              style={{ background: 'rgba(237,28,36,0.08)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
              <ChevronLeft size={14} /> Anterior
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm disabled:opacity-30"
              style={{ background: 'rgba(237,28,36,0.08)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
              Próxima <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}