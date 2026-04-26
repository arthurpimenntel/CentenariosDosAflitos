'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

// ── Galeria de fotos do mosaico ───────────────────────────────────────────────
const fotos = [
  { src: '/torcida3.jpeg', alt: 'Torcida Os Centenários', span: 'col-span-2 row-span-2' },
  { src: '/torcida2.jpeg', alt: 'Caldeirão em chamas',    span: 'col-span-1 row-span-1' },
  { src: '/torcida1.jpeg', alt: 'Bandeiras e fumaça',     span: 'col-span-1 row-span-1' },
  { src: '/torcida4.jpeg', alt: 'Setor Caldeirão',        span: 'col-span-1 row-span-1' },
  { src: '/torcida5.jpeg', alt: 'Festa na arquibancada',  span: 'col-span-1 row-span-1' },
]

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
  fotos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  fotos: typeof fotos
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.96)' }}
      onClick={onClose}
    >
      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-10 flex items-center justify-center transition-all hover:scale-110"
        style={{
          width: 44, height: 44,
          background: 'rgba(237,28,36,0.9)',
          backdropFilter: 'blur(8px)',
        }}
        aria-label="Fechar"
      >
        <X size={18} color="#fff" />
      </button>

      {/* Counter */}
      <div
        className="absolute top-5 left-5 z-10 px-3 py-1.5"
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(8px)',
          fontFamily: 'Oswald, sans-serif',
          fontSize: 12,
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        {index + 1} / {fotos.length}
      </div>

      {/* Prev */}
      <button
        onClick={e => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 z-10 flex items-center justify-center transition-all hover:scale-110 hover:bg-white/10"
        style={{
          width: 52, height: 52,
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
        }}
        aria-label="Anterior"
      >
        <ChevronLeft size={22} color="#fff" />
      </button>

      {/* Next */}
      <button
        onClick={e => { e.stopPropagation(); onNext() }}
        className="absolute right-4 z-10 flex items-center justify-center transition-all hover:scale-110 hover:bg-white/10"
        style={{
          width: 52, height: 52,
          border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
        }}
        aria-label="Próxima"
      >
        <ChevronRight size={22} color="#fff" />
      </button>

      {/* Image */}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-5xl mx-16"
        style={{ aspectRatio: '16/9' }}
        onClick={e => e.stopPropagation()}
      >
        <Image
          src={fotos[index].src}
          alt={fotos[index].alt}
          fill
          className="object-contain"
          sizes="90vw"
          priority
        />
        {/* Caption */}
        <div
          className="absolute bottom-0 left-0 right-0 px-6 py-4"
          style={{
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 13,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.08em',
          }}
        >
          {fotos[index].alt}
        </div>
      </motion.div>

      {/* Thumbnail strip */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {fotos.map((f, i) => (
          <button
            key={i}
            onClick={e => { e.stopPropagation() }}
            className="relative overflow-hidden transition-all"
            style={{
              width: i === index ? 48 : 32,
              height: 32,
              opacity: i === index ? 1 : 0.4,
              outline: i === index ? '2px solid #ED1C24' : 'none',
              outlineOffset: 2,
            }}
          >
            <Image src={f.src} alt={f.alt} fill className="object-cover" sizes="48px" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

// ── Mosaico ───────────────────────────────────────────────────────────────────
function Mosaico() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const open  = useCallback((i: number) => setLightboxIndex(i), [])
  const close  = useCallback(() => setLightboxIndex(null), [])
  const prev   = useCallback(() => setLightboxIndex(i => i === null ? null : (i - 1 + fotos.length) % fotos.length), [])
  const next   = useCallback(() => setLightboxIndex(i => i === null ? null : (i + 1) % fotos.length), [])

  return (
    <>
      {/* Grid mosaico */}
      <div
        className="grid gap-1.5 w-full"
        style={{
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(2, 200px)',
        }}
      >
        {fotos.map((foto, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover="hover"
            onClick={() => open(i)}
            className={`relative overflow-hidden group focus:outline-none ${foto.span}`}
            aria-label={`Abrir foto: ${foto.alt}`}
          >
            <Image
              src={foto.src}
              alt={foto.alt}
              fill
              className="object-cover transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            {/* Dark overlay */}
            <motion.div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,0,0)' }}
              variants={{ hover: { background: 'rgba(0,0,0,0.45)' } }}
              transition={{ duration: 0.3 }}
            />
            {/* Red accent line — bottom */}
            <motion.div
              className="absolute bottom-0 left-0 right-0"
              style={{ height: 3, background: '#ED1C24', scaleX: 0, transformOrigin: 'left' }}
              variants={{ hover: { scaleX: 1 } }}
              transition={{ duration: 0.35 }}
            />
            {/* Zoom icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: 0 }}
              variants={{ hover: { opacity: 1 } }}
              transition={{ duration: 0.25 }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 44, height: 44,
                  background: 'rgba(237,28,36,0.85)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <ZoomIn size={18} color="#fff" />
              </div>
            </motion.div>
            {/* Caption on hover */}
            <motion.div
              className="absolute bottom-3 left-3 right-3"
              style={{ opacity: 0, y: 6 }}
              variants={{ hover: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.25 }}
            >
              <p
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.8)',
                  textTransform: 'uppercase',
                }}
              >
                {foto.alt}
              </p>
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            fotos={fotos}
            index={lightboxIndex}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AboutPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      className="w-full py-24 px-4 md:px-12 overflow-hidden"
      style={{ backgroundColor: '#ED1C24' }}
      ref={ref}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-16">

        {/* ── Text col ── */}
        <motion.div
          className="flex-1 lg:w-2/5"
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p
            className="text-sm tracking-widest uppercase mb-4"
            style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'DM Sans, sans-serif' }}
          >
            Quem Somos
          </p>
          <h2
            className="font-bold text-4xl md:text-5xl lg:text-6xl uppercase leading-tight mb-6"
            style={{ color: '#FFFFFF', fontFamily: 'Oswald, sans-serif' }}
          >
            NÓS TORCEMOS<br />COM ALMA
          </h2>

          <motion.div
            className="h-[3px] mb-8"
            style={{ background: 'rgba(255,255,255,0.4)', transformOrigin: 'left', width: '100%' }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          />

          <div className="space-y-4 max-w-md mb-10">
            <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'DM Sans, sans-serif' }}>
              Hoje não se pensa na arquibancada dos Aflitos sem pensar n'Os Centenários dos Aflitos.
              O que nos une é simples: não importa o que aconteça, com a barra o Náutico sempre jogará com 12 em campo.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'DM Sans, sans-serif' }}>
              Na arquibancada é onde o coração pulsa, 90 minutos de vida pelo Náutico. No Setor Caldeirão,
              a regra é clara: apoiar o Náutico até o fim, aconteça o que acontecer.
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'DM Sans, sans-serif' }}>
              Fora do estádio, estamos ativos. Defendemos o clube em todas as frentes, ocupamos espaços
              e fazemos o melhor para o nosso clube.
            </p>
            <p
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}
            >
              Desde 2012, não se compara.
            </p>
          </div>

          <Link
            href="/quem-somos"
            className="inline-flex items-center gap-3 px-8 py-3.5 text-sm tracking-widest uppercase font-bold transition-all duration-200 hover:scale-105"
            style={{
              border: '2px solid rgba(255,255,255,0.8)',
              color: '#FFFFFF',
              fontFamily: 'Oswald, sans-serif',
              letterSpacing: '0.12em',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = '#FFFFFF'
              el.style.color = '#ED1C24'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.background = 'transparent'
              el.style.color = '#FFFFFF'
            }}
          >
            CONHEÇA NOSSA HISTÓRIA
            <ChevronRight size={16} />
          </Link>
        </motion.div>

        {/* ── Mosaico col ── */}
        <motion.div
          className="flex-1 lg:w-3/5 w-full"
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        >
          {/* Label acima do mosaico */}
          <div className="flex items-center gap-3 mb-3">
            <div style={{ width: 24, height: 2, background: 'rgba(255,255,255,0.4)' }} />
            <span
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 10,
                letterSpacing: '0.2em',
                color: 'rgba(255,255,255,0.45)',
                textTransform: 'uppercase',
              }}
            >
              Nossa galeria
            </span>
          </div>
          <Mosaico />
          <p
            className="mt-3 text-right"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 10,
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase',
            }}
          >
            Clique para ampliar
          </p>
        </motion.div>

      </div>
    </section>
  )
}