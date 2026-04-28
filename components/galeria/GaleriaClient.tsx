'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { GaleriaFoto } from '@/types'

export default function GaleriaClient({ fotos, categorias }: { fotos: GaleriaFoto[]; categorias: string[] }) {
  const [filtro, setFiltro] = useState<string | null>(null)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const filtered = filtro ? fotos.filter(f => f.categoria === filtro) : fotos
  const current = lightboxIdx !== null ? filtered[lightboxIdx] : null

  const prev = useCallback(() => setLightboxIdx(i => (i !== null ? (i === 0 ? filtered.length - 1 : i - 1) : null)), [filtered.length])
  const next = useCallback(() => setLightboxIdx(i => (i !== null ? (i === filtered.length - 1 ? 0 : i + 1) : null)), [filtered.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (lightboxIdx === null) return
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setLightboxIdx(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIdx, prev, next])

  // lock scroll when lightbox open
  useEffect(() => {
    if (lightboxIdx !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [lightboxIdx])

  return (
    <>
      {/* Filtros de categoria */}
      {categorias.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-10">
          <button
            onClick={() => setFiltro(null)}
            className="px-5 py-2 text-sm font-semibold uppercase tracking-wider transition-all rounded-full"
            style={{
              background: !filtro ? '#ED1C24' : 'rgba(237,28,36,0.04)',
              color: !filtro ? '#FFFFFF' : '#ED1C24',
              border: `1px solid ${!filtro ? '#ED1C24' : 'rgba(237,28,36,0.2)'}`,
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            Todas
          </button>
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className="px-5 py-2 text-sm font-semibold uppercase tracking-wider capitalize transition-all rounded-full"
              style={{
                background: filtro === cat ? '#ED1C24' : 'rgba(237,28,36,0.04)',
                color: filtro === cat ? '#FFFFFF' : '#ED1C24',
                border: `1px solid ${filtro === cat ? '#ED1C24' : 'rgba(237,28,36,0.2)'}`,
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid masonry */}
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {filtered.map((foto, i) => (
          <motion.div
            key={foto.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="break-inside-avoid"
          >
            <button
              onClick={() => setLightboxIdx(i)}
              className="group w-full block overflow-hidden relative rounded-xl"
              style={{ border: '1px solid rgba(237,28,36,0.10)' }}
            >
              <div className="relative w-full">
                <Image
                  src={foto.imagem_url}
                  alt={foto.descricao || `Foto ${i + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
                >
                  {foto.descricao && (
                    <p className="text-white text-xs font-medium line-clamp-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      {foto.descricao}
                    </p>
                  )}
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Lightbox premium */}
      <AnimatePresence>
  {current && lightboxIdx !== null && (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(10px)' }}
      onClick={() => setLightboxIdx(null)}
    >
      {/* Botão fechar */}
      <button
        onClick={() => setLightboxIdx(null)}
        className="absolute top-5 right-5 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ width: 44, height: 44, background: 'rgba(237,28,36,0.9)', border: '1px solid rgba(255,255,255,0.15)' }}
        aria-label="Fechar"
      >
        <X size={18} color="#fff" />
      </button>

      {/* Contador */}
      <div className="absolute top-5 left-5 z-20 px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'Oswald, sans-serif', fontSize: 12, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)' }}>
        {lightboxIdx + 1} / {filtered.length}
      </div>

      {/* Botão prev */}
      {filtered.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); prev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
          aria-label="Anterior"
        >
          <ChevronLeft size={22} color="#fff" />
        </button>
      )}

      {/* Botão next */}
      {filtered.length > 1 && (
        <button
          onClick={e => { e.stopPropagation(); next() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
          aria-label="Próxima"
        >
          <ChevronRight size={22} color="#fff" />
        </button>
      )}

      {/* Imagem */}
      <motion.div
        key={lightboxIdx}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex flex-col items-center px-3 sm:px-20"
        style={{ maxWidth: 900, width: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative w-full overflow-hidden" style={{ borderRadius: 12, boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)' }}>
          <div className="absolute top-0 left-0 right-0 h-[3px] z-10" style={{ background: '#ED1C24' }} />
          <Image
            src={current.imagem_url}
            alt={current.descricao || `Foto ${lightboxIdx + 1}`}
            width={900}
            height={600}
            className="w-full h-auto object-contain"
            style={{ maxHeight: '72vh', display: 'block' }}
            sizes="90vw"
            priority
          />
        </div>
        {/* Legenda abaixo da imagem */}
        <div className="flex items-center justify-between w-full mt-3 px-1">
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>
            {current.descricao || ''}
          </p>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
    </>
  )
}