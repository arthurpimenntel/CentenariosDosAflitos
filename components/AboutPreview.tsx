'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

const SPANS = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
]

// ─── Paleta do lightbox claro ────────────────────────────────────────────────
const LB = {
  bg:          'rgba(240,240,240,0.97)',
  btnClose:    '#ED1C24',
  btnNav:      'rgba(237,28,36,0.10)',
  btnNavBorder:'rgba(237,28,36,0.20)',
  counter:     'rgba(0,0,0,0.35)',
  counterBg:   'rgba(237,28,36,0.08)',
  counterBorder:'rgba(237,28,36,0.18)',
  caption:     'rgba(0,0,0,0.45)',
  thumbInactive: 0.35,
}

interface Foto { id: string; imagem_url: string; alt: string | null }

function Lightbox({ fotos, index, onClose, onPrev, onNext }: {
  fotos: Foto[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ background: LB.bg, backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      {/* Fechar */}
      <button onClick={onClose}
        className="absolute top-5 right-5 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ width: 44, height: 44, background: LB.btnClose }} aria-label="Fechar">
        <X size={18} color="#fff" />
      </button>

      {/* Contador */}
      <div className="absolute top-5 left-5 z-20 px-3 py-1.5 rounded-full"
        style={{ background: LB.counterBg, border: `1px solid ${LB.counterBorder}`, fontFamily: 'Oswald, sans-serif', fontSize: 12, letterSpacing: '0.15em', color: LB.counter }}>
        {index + 1} / {fotos.length}
      </div>

      {/* Anterior */}
      <button onClick={e => { e.stopPropagation(); onPrev() }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ width: 52, height: 52, background: LB.btnNav, border: `1px solid ${LB.btnNavBorder}` }} aria-label="Anterior">
        <ChevronLeft size={22} color="#ED1C24" />
      </button>

      {/* Próxima */}
      <button onClick={e => { e.stopPropagation(); onNext() }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ width: 52, height: 52, background: LB.btnNav, border: `1px solid ${LB.btnNavBorder}` }} aria-label="Próxima">
        <ChevronRight size={22} color="#ED1C24" />
      </button>

      {/* Imagem — ocupa toda a tela disponível. stopPropagation só na imagem para permitir fechar clicando nas laterais */}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex flex-col items-center w-full px-16"
        style={{ maxWidth: '100vw', pointerEvents: 'none' }}
      >
        <div className="relative w-full overflow-hidden"
          style={{ borderRadius: 8, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', border: '1px solid rgba(237,28,36,0.15)', pointerEvents: 'auto' }}
          onClick={e => e.stopPropagation()}>
          <div className="absolute top-0 left-0 right-0 h-[3px] z-10" style={{ background: '#ED1C24' }} />
         <img src={fotos[index].imagem_url} alt={fotos[index].alt ?? ''}
          className="w-full h-auto object-contain" style={{ maxHeight: '72vh', display: 'block', width: '100%' }} />
        </div>
        {fotos[index].alt && (
          <p className="mt-2 text-sm px-1" style={{ fontFamily: 'DM Sans, sans-serif', color: LB.caption, letterSpacing: '0.06em', pointerEvents: 'auto' }}
            onClick={e => e.stopPropagation()}>
            {fotos[index].alt}
          </p>
        )}
      </motion.div>

      {/* Tira de miniaturas */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {fotos.map((f, i) => (
          <button key={i} onClick={e => e.stopPropagation()} className="relative overflow-hidden rounded transition-all"
            style={{ width: i === index ? 48 : 32, height: 32, opacity: i === index ? 1 : LB.thumbInactive, outline: i === index ? '2px solid #ED1C24' : 'none', outlineOffset: 2 }}>
            <Image src={f.imagem_url} alt={f.alt ?? ''} fill className="object-cover" sizes="48px" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function Mosaico({ fotos }: { fotos: Foto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const open  = useCallback((i: number) => setLightboxIndex(i), [])
  const close = useCallback(() => setLightboxIndex(null), [])
  const prev  = useCallback(() => setLightboxIndex(i => i === null ? null : (i - 1 + fotos.length) % fotos.length), [fotos.length])
  const next  = useCallback(() => setLightboxIndex(i => i === null ? null : (i + 1) % fotos.length), [fotos.length])
  const visiveis = fotos.slice(0, 5)

  return (
    <>
      <div className="grid gap-1.5 w-full" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 200px)' }}>
        {visiveis.map((foto, i) => (
          <motion.button key={foto.id} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover="hover" onClick={() => open(i)}
            className={`relative overflow-hidden group focus:outline-none ${SPANS[i] ?? 'col-span-1 row-span-1'}`}
            aria-label={foto.alt ?? `Foto ${i + 1}`}>
            <Image src={foto.imagem_url} alt={foto.alt ?? ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />
            <motion.div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0)' }} variants={{ hover: { background: 'rgba(0,0,0,0.45)' } }} transition={{ duration: 0.3 }} />
            <motion.div className="absolute bottom-0 left-0 right-0" style={{ height: 3, background: '#ED1C24', scaleX: 0, transformOrigin: 'left' }} variants={{ hover: { scaleX: 1 } }} transition={{ duration: 0.35 }} />
            <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0 }} variants={{ hover: { opacity: 1 } }} transition={{ duration: 0.25 }}>
              <div className="flex items-center justify-center" style={{ width: 44, height: 44, background: 'rgba(237,28,36,0.85)', backdropFilter: 'blur(4px)' }}>
                <ZoomIn size={18} color="#fff" />
              </div>
            </motion.div>
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox fotos={visiveis} index={lightboxIndex} onClose={close} onPrev={prev} onNext={next} />
        )}
      </AnimatePresence>
    </>
  )
}

export default function AboutPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [fotos, setFotos] = useState<Foto[]>([])

  useEffect(() => {
    fetch('/api/admin/home-fotos')
      .then(r => r.json())
      .then(data => setFotos(data))
      .catch(() => {})
  }, [])

  return (
    <section className="w-full py-24 px-4 md:px-12 overflow-hidden" style={{ backgroundColor: '#ED1C24' }} ref={ref}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-16">

        <motion.div className="flex-1 lg:w-2/5" initial={{ opacity: 0, x: -40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, ease: 'easeOut' }}>
          <p className="text-sm tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'DM Sans, sans-serif' }}>Quem Somos</p>
          <h2 className="font-bold text-4xl md:text-5xl lg:text-6xl uppercase leading-tight mb-6" style={{ color: '#FFFFFF', fontFamily: 'Oswald, sans-serif' }}>
            A BARRA DO<br />CALDEIRÃO
          </h2>
          <motion.div className="h-[3px] mb-8" style={{ background: 'rgba(255,255,255,0.4)', transformOrigin: 'left', width: '100%' }}
            initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ duration: 0.7, delay: 0.3 }} />
          <div className="space-y-4 max-w-md mb-10">
            <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'DM Sans, sans-serif' }}>
              Os Centenários dos Aflitos surgiu como uma revolução vinda de dentro da arquibancada, com um sentimento em comum: fazer da arquibancada um décimo segundo jogador. E hoje, não se pensa mais no estádio dos Aflitos, sem inevitavelmente pensar na barra do caldeirão.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'DM Sans, sans-serif' }}>
              Dentro e fora de campo, apoiar incondicionalmente é o nosso principal pilar ideológico. Ocupamos não só a bancada, mas também fiscalizando e contribuindo de forma incisiva pelo fortalecimento do Clube Náutico Capibaribe.
            </p>
            <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}>Desde 2012, não se compara.</p>
          </div>
          <Link href="/quem-somos"
            className="inline-flex items-center gap-3 px-8 py-3.5 text-sm tracking-widest uppercase font-bold transition-all duration-200 hover:scale-105"
            style={{ border: '2px solid rgba(255,255,255,0.8)', color: '#FFFFFF', fontFamily: 'Oswald, sans-serif', letterSpacing: '0.12em' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#FFFFFF'; el.style.color = '#ED1C24' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = '#FFFFFF' }}>
            CONHEÇA NOSSA HISTÓRIA
            <ChevronRight size={16} />
          </Link>
        </motion.div>

        <motion.div className="flex-1 lg:w-3/5 w-full" initial={{ opacity: 0, x: 40 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}>
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width: 24, height: 2, background: 'rgba(255,255,255,0.4)' }} />
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>Nossa galeria</span>
          </div>
          {fotos.length > 0
            ? <Mosaico fotos={fotos} />
            : <div className="grid gap-1.5 w-full" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 200px)' }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`rounded animate-pulse ${SPANS[i]}`} style={{ background: 'rgba(255,255,255,0.12)' }} />
                ))}
              </div>
          }
          <p className="mt-3 text-right" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 10, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
            Clique para ampliar
          </p>
        </motion.div>

      </div>
    </section>
  )
}