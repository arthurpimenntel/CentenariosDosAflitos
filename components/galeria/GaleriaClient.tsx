'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, FolderOpen, ArrowLeft } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'

interface Album {
  id: string
  nome: string
  descricao: string | null
  capa_url: string | null
  _count: number
}

interface Foto {
  id: string
  imagem_url: string
  descricao: string | null
}

const LB = {
  bg:           'rgba(240,240,240,0.97)',
  btnClose:     '#ED1C24',
  btnNav:       'rgba(237,28,36,0.10)',
  btnNavBorder: 'rgba(237,28,36,0.20)',
  counter:      'rgba(0,0,0,0.40)',
  counterBg:    'rgba(237,28,36,0.08)',
  counterBorder:'rgba(237,28,36,0.18)',
  caption:      'rgba(0,0,0,0.45)',
}

function Lightbox({ fotos, index, onClose, onPrev, onNext }: {
  fotos: Foto[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose, onPrev, onNext])

  const foto = fotos[index]

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ background: LB.bg, backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <button onClick={onClose}
        className="absolute top-5 right-5 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ width: 44, height: 44, background: LB.btnClose }} aria-label="Fechar">
        <X size={18} color="#fff" />
      </button>

      <div className="absolute top-5 left-5 z-20 px-3 py-1.5 rounded-full"
        style={{ background: LB.counterBg, border: `1px solid ${LB.counterBorder}`, fontFamily: 'Oswald, sans-serif', fontSize: 12, letterSpacing: '0.15em', color: LB.counter }}>
        {index + 1} / {fotos.length}
      </div>

      {fotos.length > 1 && (
        <button onClick={e => { e.stopPropagation(); onPrev() }}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{ width: 52, height: 52, background: LB.btnNav, border: `1px solid ${LB.btnNavBorder}` }} aria-label="Anterior">
          <ChevronLeft size={22} color="#ED1C24" />
        </button>
      )}

      {fotos.length > 1 && (
        <button onClick={e => { e.stopPropagation(); onNext() }}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
          style={{ width: 52, height: 52, background: LB.btnNav, border: `1px solid ${LB.btnNavBorder}` }} aria-label="Próxima">
          <ChevronRight size={22} color="#ED1C24" />
        </button>
      )}

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex flex-col items-center w-full px-16"
        style={{ maxWidth: '100vw', pointerEvents: 'none' }}
      >
        <div className="relative w-full overflow-hidden"
          style={{ borderRadius: 8, boxShadow: '0 8px 40px rgba(0,0,0,0.15)', border: '1px solid rgba(237,28,36,0.15)', pointerEvents: 'auto' }}
          onClick={e => e.stopPropagation()}>
          <div className="absolute top-0 left-0 right-0 h-[3px] z-10" style={{ background: '#ED1C24' }} />
          <Image src={foto.imagem_url} alt={foto.descricao || `Foto ${index + 1}`}
            width={1200} height={800}
            className="w-full h-auto object-contain"
            style={{ maxHeight: '88vh', display: 'block' }}
            sizes="100vw" priority />
        </div>
        {foto.descricao && (
          <p className="mt-2 text-sm px-1" style={{ fontFamily: 'DM Sans, sans-serif', color: LB.caption, letterSpacing: '0.06em', pointerEvents: 'auto' }}
            onClick={e => e.stopPropagation()}>
            {foto.descricao}
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}

function AlbumView({ album, onBack }: { album: Album; onBack: () => void }) {
  const [fotos, setFotos] = useState<Foto[]>([])
  const [loading, setLoading] = useState(true)
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  const prev = useCallback(() => setLightboxIdx(i => i === null ? null : (i === 0 ? fotos.length - 1 : i - 1)), [fotos.length])
  const next = useCallback(() => setLightboxIdx(i => i === null ? null : (i === fotos.length - 1 ? 0 : i + 1)), [fotos.length])

  const fetchFotos = useCallback(() => {
    fetch(`/api/admin/galeria?album_id=${album.id}`)
      .then(r => r.json())
      .then(data => { setFotos(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [album.id])

  useEffect(() => { fetchFotos() }, [fetchFotos])

  // Real time — novas fotos aparecem sem recarregar a página
  useEffect(() => {
    const supabase = getSupabaseClient()
    const channel = supabase.channel(`galeria_album_${album.id}`)
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'galeria',
        filter: `album_id=eq.${album.id}`,
      }, () => { fetchFotos() })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [album.id, fetchFotos])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <>
      <div className="mb-8">
        <button onClick={onBack}
          className="inline-flex items-center gap-2 text-sm mb-5 transition-all hover:opacity-70"
          style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
          <ArrowLeft size={15} /> Todos os álbuns
        </button>
        <h2 className="text-4xl md:text-5xl font-bold uppercase leading-none mb-2"
          style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>
          {album.nome}
        </h2>
        {album.descricao && (
          <p className="text-base mb-1" style={{ color: 'rgba(237,28,36,0.6)', fontFamily: 'DM Sans, sans-serif' }}>
            {album.descricao}
          </p>
        )}
        <p className="text-sm" style={{ color: 'rgba(237,28,36,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
          {album._count} foto{album._count !== 1 ? 's' : ''}
        </p>
        <div className="mt-4 h-[3px] w-12" style={{ background: '#ED1C24' }} />
      </div>

      {loading ? (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3 animate-pulse">
          {[...Array(8)].map((_, i) => <div key={i} className="rounded-xl aspect-square break-inside-avoid" style={{ background: 'rgba(237,28,36,0.08)' }} />)}
        </div>
      ) : fotos.length === 0 ? (
        <div className="text-center py-24">
          <FolderOpen size={48} className="mx-auto mb-4" style={{ color: 'rgba(237,28,36,0.15)' }} />
          <p className="text-xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: 'rgba(237,28,36,0.25)' }}>
            Álbum vazio
          </p>
        </div>
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {fotos.map((foto, i) => (
            <motion.div key={foto.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.03 }} className="break-inside-avoid">
              <button onClick={() => setLightboxIdx(i)}
                className="group w-full block overflow-hidden relative rounded-xl"
                style={{ border: '1px solid rgba(237,28,36,0.10)' }}>
                <div className="relative w-full">
                  <Image src={foto.imagem_url} alt={foto.descricao || `Foto ${i + 1}`}
                    width={400} height={300}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }}>
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
      )}

      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox fotos={fotos} index={lightboxIdx} onClose={() => setLightboxIdx(null)} onPrev={prev} onNext={next} />
        )}
      </AnimatePresence>
    </>
  )
}

export default function GaleriaClient({ albums: initialAlbums }: { albums: Album[] }) {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums)
  const [albumAberto, setAlbumAberto] = useState<Album | null>(null)

  // Real time — novos álbuns aparecem sem recarregar a página
  useEffect(() => {
    const supabase = getSupabaseClient()
    const channel = supabase.channel('albums_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'albums' }, async () => {
        // Rebusca os álbuns via API existente
        const res = await fetch('/api/admin/galeria')
        if (res.ok) {
          const data = await res.json()
          setAlbums(data)
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  if (albumAberto) {
    return <AlbumView album={albumAberto} onBack={() => setAlbumAberto(null)} />
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {albums.map((album, i) => (
        <motion.button
          key={album.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setAlbumAberto(album)}
          className="group text-left rounded-xl overflow-hidden transition-all"
          style={{ border: '1px solid rgba(237,28,36,0.12)', boxShadow: '0 2px 12px rgba(237,28,36,0.06)', background: '#fff' }}
        >
          <div className="relative aspect-video overflow-hidden" style={{ background: 'rgba(237,28,36,0.05)' }}>
            {album.capa_url ? (
              <Image src={album.capa_url} alt={album.nome} fill
                className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <FolderOpen size={32} style={{ color: 'rgba(237,28,36,0.2)' }} />
              </div>
            )}
            <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: '#ED1C24' }} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all" />
          </div>

          <div className="p-3">
            <p className="font-bold text-sm uppercase leading-tight truncate"
              style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>
              {album.nome}
            </p>
            {album.descricao && (
              <p className="text-xs mt-0.5 line-clamp-1"
                style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
                {album.descricao}
              </p>
            )}
            <p className="text-xs mt-1" style={{ color: 'rgba(237,28,36,0.35)', fontFamily: 'DM Sans, sans-serif' }}>
              {album._count} foto{album._count !== 1 ? 's' : ''}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  )
}