'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ChevronDown, Calendar } from 'lucide-react'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const DIAS_SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const RED = '#ED1C24'

function getDiasDoMes(ano: number, mes: number) {
  const primeiro = new Date(ano, mes, 1).getDay() // 0=Dom
  const total    = new Date(ano, mes + 1, 0).getDate()
  return { primeiro, total }
}

function parseISO(val: string): { ano: number; mes: number; dia: number } | null {
  if (!val) return null
  const [a, m, d] = val.split('-').map(Number)
  if (!a || !m || !d) return null
  return { ano: a, mes: m - 1, dia: d }
}

function toISO(ano: number, mes: number, dia: number) {
  return `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
}

interface DatePickerProps {
  value: string            // "YYYY-MM-DD" ou ""
  onChange: (val: string) => void
  hasError?: boolean
  placeholder?: string
  maxDate?: Date
}

export default function DatePicker({
  value,
  onChange,
  hasError = false,
  placeholder = 'dd/mm/aaaa',
  maxDate,
}: DatePickerProps) {
  const parsed = parseISO(value)
  const hoje   = new Date()

  const [open,      setOpen]      = useState(false)
  const [viewMes,   setViewMes]   = useState(parsed?.mes  ?? hoje.getMonth())
  const [viewAno,   setViewAno]   = useState(parsed?.ano  ?? hoje.getFullYear())
  const [modoAno,   setModoAno]   = useState(false)
  const [direcao,   setDirecao]   = useState<1 | -1>(1) // animação de slide
  const ref = useRef<HTMLDivElement>(null)

  // Fecha ao clicar fora
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setModoAno(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  // Sincroniza view quando value muda externamente
  useEffect(() => {
    if (parsed) { setViewMes(parsed.mes); setViewAno(parsed.ano) }
  }, [value])

  function navMes(dir: 1 | -1) {
    setDirecao(dir)
    setViewMes(m => {
      const novoMes = m + dir
      if (novoMes > 11) { setViewAno(a => a + 1); return 0 }
      if (novoMes < 0)  { setViewAno(a => a - 1); return 11 }
      return novoMes
    })
  }

  function selecionarDia(dia: number) {
    const max = maxDate ?? hoje
    const data = new Date(viewAno, viewMes, dia)
    if (data > max) return
    onChange(toISO(viewAno, viewMes, dia))
    setOpen(false)
    setModoAno(false)
  }

  function isDiaSelecionado(dia: number) {
    return parsed?.ano === viewAno && parsed?.mes === viewMes && parsed?.dia === dia
  }

  function isDiaHoje(dia: number) {
    return hoje.getFullYear() === viewAno && hoje.getMonth() === viewMes && hoje.getDate() === dia
  }

  function isDiaDesabilitado(dia: number) {
    const max = maxDate ?? hoje
    return new Date(viewAno, viewMes, dia) > max
  }

  // Label do input
  const labelExibido = parsed
    ? `${String(parsed.dia).padStart(2, '0')}/${String(parsed.mes + 1).padStart(2, '0')}/${parsed.ano}`
    : ''

  const { primeiro, total } = getDiasDoMes(viewAno, viewMes)

  // Anos para o seletor (1930 → ano atual)
  const anoAtual   = hoje.getFullYear()
  const anosLista  = Array.from({ length: anoAtual - 1929 }, (_, i) => anoAtual - i)

  // Ref do container de anos para scroll automático
  const anosRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (modoAno && anosRef.current) {
      const btn = anosRef.current.querySelector(`[data-ano="${viewAno}"]`) as HTMLElement | null
      if (btn) btn.scrollIntoView({ block: 'center', behavior: 'instant' })
    }
  }, [modoAno])

  return (
    <div ref={ref} className="relative w-full select-none">
      {/* ── INPUT ── */}
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setModoAno(false) }}
        className="w-full flex items-center justify-between px-4 py-3.5 text-sm text-left transition-all outline-none"
        style={{
          background: '#FFFFFF',
          border: `1px solid ${hasError ? RED : open ? RED : 'rgba(237,28,36,0.25)'}`,
          color: labelExibido ? RED : 'rgba(237,28,36,0.35)',
          fontFamily: 'DM Sans, sans-serif',
          boxShadow: hasError ? '0 0 0 2px rgba(237,28,36,0.1)' : open ? '0 0 0 2px rgba(237,28,36,0.08)' : 'none',
        }}
      >
        <span>{labelExibido || placeholder}</span>
        <Calendar size={16} style={{ color: open ? RED : 'rgba(237,28,36,0.35)', flexShrink: 0 }} />
      </button>

      {/* ── DROPDOWN ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-0 right-0 z-[200] mt-1 overflow-hidden"
            style={{
              background: '#FFFFFF',
              border: `1px solid ${RED}`,
              boxShadow: '0 16px 48px rgba(237,28,36,0.15), 0 4px 12px rgba(0,0,0,0.08)',
              minWidth: 280,
            }}
          >
            {/* ── HEADER: mês/ano ── */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid rgba(237,28,36,0.1)', background: RED }}
            >
              <button
                type="button"
                onClick={() => navMes(-1)}
                disabled={modoAno}
                className="flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30"
                style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.15)' }}
              >
                <ChevronLeft size={16} color="#fff" />
              </button>

              <button
                type="button"
                onClick={() => setModoAno(m => !m)}
                className="flex items-center gap-1.5 transition-all hover:opacity-80"
                style={{ fontFamily: 'Oswald, sans-serif', fontSize: 15, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.05em' }}
              >
                {MESES[viewMes].toUpperCase()} {viewAno}
                <ChevronDown
                  size={14}
                  color="#fff"
                  style={{ transform: modoAno ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                />
              </button>

              <button
                type="button"
                onClick={() => navMes(1)}
                disabled={modoAno}
                className="flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30"
                style={{ width: 28, height: 28, background: 'rgba(255,255,255,0.15)' }}
              >
                <ChevronRight size={16} color="#fff" />
              </button>
            </div>

            {/* ── SELETOR DE ANO ── */}
            <AnimatePresence>
              {modoAno && (
                <motion.div
                  ref={anosRef}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 200, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-y-auto"
                  style={{ borderBottom: '1px solid rgba(237,28,36,0.12)' }}
                >
                  <div className="grid grid-cols-3 gap-1 p-3">
                    {anosLista.map(ano => (
                      <button
                        key={ano}
                        data-ano={ano}
                        type="button"
                        onClick={() => { setViewAno(ano); setModoAno(false) }}
                        className="py-2 text-sm font-semibold transition-all"
                        style={{
                          fontFamily: 'DM Sans, sans-serif',
                          background: ano === viewAno ? RED : 'transparent',
                          color: ano === viewAno ? '#FFFFFF' : ano === anoAtual ? RED : 'rgba(237,28,36,0.7)',
                          border: ano === anoAtual && ano !== viewAno ? `1px solid rgba(237,28,36,0.25)` : '1px solid transparent',
                          fontWeight: ano === viewAno ? 700 : 400,
                        }}
                      >
                        {ano}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── CALENDÁRIO ── */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${viewAno}-${viewMes}`}
                initial={{ opacity: 0, x: direcao * 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direcao * -20 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="px-3 pb-3 pt-2"
              >
                {/* Dias da semana */}
                <div className="grid grid-cols-7 mb-1">
                  {DIAS_SEMANA.map((d, i) => (
                    <div key={i} className="flex items-center justify-center py-1"
                      style={{ fontFamily: 'Oswald, sans-serif', fontSize: 11, fontWeight: 600, color: 'rgba(237,28,36,0.4)', letterSpacing: '0.08em' }}>
                      {d}
                    </div>
                  ))}
                </div>

                {/* Células */}
                <div className="grid grid-cols-7 gap-y-0.5">
                  {/* Espaços vazios antes do dia 1 */}
                  {Array.from({ length: primeiro }).map((_, i) => (
                    <div key={`e-${i}`} />
                  ))}

                  {Array.from({ length: total }, (_, i) => i + 1).map(dia => {
                    const selecionado  = isDiaSelecionado(dia)
                    const ehHoje       = isDiaHoje(dia)
                    const desabilitado = isDiaDesabilitado(dia)

                    return (
                      <button
                        key={dia}
                        type="button"
                        disabled={desabilitado}
                        onClick={() => selecionarDia(dia)}
                        className="relative flex items-center justify-center transition-all"
                        style={{
                          height: 34,
                          fontFamily: 'DM Sans, sans-serif',
                          fontSize: 13,
                          fontWeight: selecionado ? 700 : ehHoje ? 600 : 400,
                          background: selecionado ? RED : 'transparent',
                          color: selecionado
                            ? '#FFFFFF'
                            : desabilitado
                            ? 'rgba(237,28,36,0.2)'
                            : ehHoje
                            ? RED
                            : 'rgba(30,10,10,0.75)',
                          cursor: desabilitado ? 'not-allowed' : 'pointer',
                          outline: ehHoje && !selecionado ? `1px solid rgba(237,28,36,0.35)` : 'none',
                        }}
                        onMouseEnter={e => {
                          if (!selecionado && !desabilitado)
                            (e.currentTarget as HTMLElement).style.background = 'rgba(237,28,36,0.08)'
                        }}
                        onMouseLeave={e => {
                          if (!selecionado)
                            (e.currentTarget as HTMLElement).style.background = 'transparent'
                        }}
                      >
                        {dia}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ── RODAPÉ ── */}
            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderTop: '1px solid rgba(237,28,36,0.1)' }}
            >
              <button
                type="button"
                onClick={() => { onChange(''); setOpen(false); setModoAno(false) }}
                className="text-xs font-semibold uppercase tracking-wider transition-all hover:opacity-70"
                style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMes(hoje.getMonth())
                  setViewAno(hoje.getFullYear())
                  setModoAno(false)
                  selecionarDia(hoje.getDate())
                }}
                className="text-xs font-semibold uppercase tracking-wider transition-all hover:opacity-70"
                style={{ color: RED, fontFamily: 'DM Sans, sans-serif' }}
              >
                Hoje
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}