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

  return (
    <>
      {/* Filtros de categoria */}
      {categorias.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-10">
          <button
            onClick={() => setFiltro(null)}
            className="px-5 py-2 text-sm font-semibold uppercase tracking-wider transition-all"
            style={{
              background: !filtro ? '#ED1C24' : 'rgba(237,28,36,0.04)',
              color: !filtro ? '#FFFFFF' : '#ED1C24',
              border: `1px solid ${!filtro ? '#ED1C24' : 'rgba(237,28,36,0.2)'}`,
              fontFamily: 'DM Sans, sans-serif',
            }}
            onMouseEnter={e => { if (filtro !== null) { (e.currentTarget as HTMLElement).style.borderColor = '#ED1C24'; (e.currentTarget as HTMLElement).style.background = 'rgba(237,28,36,0.08)' } }}
            onMouseLeave={e => { if (filtro !== null) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(237,28,36,0.2)'; (e.currentTarget as HTMLElement).style.background = 'rgba(237,28,36,0.04)' } }}
          >
            Todas
          </button>
          {categorias.map(cat => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className="px-5 py-2 text-sm font-semibold uppercase tracking-wider capitalize transition-all"
              style={{
                background: filtro === cat ? '#ED1C24' : 'rgba(237,28,36,0.04)',
                color: filtro === cat ? '#FFFFFF' : '#ED1C24',
                border: `1px solid ${filtro === cat ? '#ED1C24' : 'rgba(237,28,36,0.2)'}`,
                fontFamily: 'DM Sans, sans-serif',
              }}
              onMouseEnter={e => { if (filtro !== cat) { (e.currentTarget as HTMLElement).style.borderColor = '#ED1C24'; (e.currentTarget as HTMLElement).style.background = 'rgba(237,28,36,0.08)' } }}
              onMouseLeave={e => { if (filtro !== cat) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(237,28,36,0.2)'; (e.currentTarget as HTMLElement).style.background = 'rgba(237,28,36,0.04)' } }}
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
              className="group w-full block overflow-hidden relative"
              style={{ border: '1px solid rgba(237,28,36,0.12)' }}
            >
              <div className="relative w-full">
                <Image
                  src={foto.imagem_url}
                  alt={foto.descricao || `Foto ${i + 1}`}
                  width={400}
                  height={300}
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Red overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'rgba(237,28,36,0.35)' }}
                />
                {/* Top bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                  style={{ background: '#ED1C24' }}
                />
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {current && lightboxIdx !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: 'rgba(237,28,36,0.92)' }}
              onClick={() => setLightboxIdx(null)}
            />

            <motion.div
              className="relative z-10 max-w-5xl w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={current.imagem_url}
                alt={current.descricao || 'Foto galeria'}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              {current.descricao && (
                <p className="mt-3 text-center text-sm" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'DM Sans, sans-serif' }}>
                  {current.descricao}
                </p>
              )}
            </motion.div>

            {/* Controles */}
            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center transition-all"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFFFFF' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FFFFFF'; (e.currentTarget as HTMLElement).style.color = '#ED1C24' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = '#FFFFFF' }}
            >
              <X size={18} />
            </button>

            {filtered.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center transition-all"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFFFFF' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FFFFFF'; (e.currentTarget as HTMLElement).style.color = '#ED1C24' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = '#FFFFFF' }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center transition-all"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFFFFF' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FFFFFF'; (e.currentTarget as HTMLElement).style.color = '#ED1C24' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLElement).style.color = '#FFFFFF' }}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Contador */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <span className="text-xs font-bold text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {lightboxIdx + 1} / {filtered.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
