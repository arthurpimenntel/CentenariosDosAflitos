'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Noticia } from '@/types'
import { getSupabaseClient } from '@/lib/supabase'

const FALLBACK: Noticia[] = [
  { id: '1', titulo: 'Caravana para o Clássico das Multidões', resumo: 'Os Centenários organizam mais uma caravana para o maior clássico pernambucano. Vagas limitadas, garanta a sua!', conteudo: '', imagem_url: '/torcida1.jpeg', publicado_em: '2026-02-21', slug: 'caravana-classico-multidoes', publicado: true, created_at: '', updated_at: '' },
  { id: '2', titulo: 'Novos produtos chegam à loja oficial', resumo: 'Camisa, bucket hat e ecobag com a identidade dos Centenários já disponíveis para os sócios em primeira mão.', conteudo: '', imagem_url: '/torcida2.jpeg', publicado_em: '2026-03-08', slug: 'novos-produtos-loja-oficial', publicado: true, created_at: '', updated_at: '' },
  { id: '3', titulo: 'Aniversário de 13 anos: uma história de paixão', resumo: 'Em 2025 completamos 13 anos de apoio incondicional ao Timbu. Confira como foi a festa de aniversário.', conteudo: '', imagem_url: '/torcida3.jpeg', publicado_em: '2025-10-20', slug: 'aniversario-13-anos', publicado: true, created_at: '', updated_at: '' },
]

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

const SLIDE_DURATION = 5000

const SLIDE_VARIANTS = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: '0%', opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

export default function NewsPreview() {
  const [noticias, setNoticias] = useState<Noticia[]>([])
  const [loading, setLoading] = useState(true)
  const posts = noticias.length > 0 ? noticias : FALLBACK
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchNoticias = useCallback(async () => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('noticias')
        .select('*')
        .eq('publicado', true)
        .order('publicado_em', { ascending: false })
        .limit(3)
      if (error) throw error
      setNoticias(data ?? [])
    } catch (error) {
      console.error('Erro ao buscar notícias:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNoticias()
  }, [fetchNoticias])

  useEffect(() => {
    const supabase = getSupabaseClient()
    const channel = supabase
      .channel('noticias_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'noticias' }, () => {
        fetchNoticias()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchNoticias])

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir)
    setCurrent(index)
  }, [])

  const next = useCallback(() => { goTo((current + 1) % posts.length, 1) }, [current, goTo, posts.length])
  const prev = useCallback(() => { goTo((current - 1 + posts.length) % posts.length, -1) }, [current, goTo, posts.length])

  useEffect(() => {
    if (paused || posts.length <= 1) return
    timerRef.current = setTimeout(() => next(), SLIDE_DURATION)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, paused, next, posts.length])

  const post = posts[current]

  return (
    <section
      className="w-full py-24 px-4 md:px-12"
      style={{
        background: '#ED1C24',
      }}
      ref={ref}
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-ultras text-sm tracking-widest uppercase mb-3" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Últimas Novidades
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl uppercase" style={{ color: '#FFFFFF' }}>
            FIQUE POR DENTRO
          </h2>
          <motion.div
            className="mt-4 h-[3px]"
            style={{ background: 'rgba(255,255,255,0.5)', width: 48, transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative overflow-hidden" style={{ minHeight: '420px' }}>
            <AnimatePresence custom={direction} mode="wait">
              <motion.article
                key={post.id}
                custom={direction}
                variants={SLIDE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                className="w-full"
              >
                <div
                  className="flex flex-col md:flex-row gap-0 overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.10)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {/* Imagem */}
                  <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden min-h-[280px]">
                    {post.imagem_url ? (
                      <Image src={post.imagem_url} alt={post.titulo} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
                    ) : (
                      <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.05)' }} />
                    )}
                    {/* Counter badge */}
                    <div className="absolute top-4 left-4" style={{ background: '#FFFFFF' }}>
                      <span className="font-display text-xs tracking-widest px-3 py-1 block" style={{ color: '#ED1C24' }}>
                        {String(current + 1).padStart(2, '0')} / {String(posts.length).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    {post.publicado_em && (
                      <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        <Calendar size={12} aria-hidden="true" />
                        <time dateTime={post.publicado_em}>{formatDate(post.publicado_em)}</time>
                      </div>
                    )}

                    <motion.div
                      className="h-[3px] mb-5"
                      style={{ background: 'rgba(255,255,255,0.5)' }}
                      initial={{ width: 0 }}
                      animate={{ width: '3rem' }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    />

                    <h3 className="font-display font-bold text-2xl md:text-3xl uppercase leading-tight mb-5" style={{ color: '#FFFFFF' }}>
                      {post.titulo}
                    </h3>
                    {post.resumo && (
                      <p className="font-body text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
                        {post.resumo}
                      </p>
                    )}
                    <Link
                      href={`/noticias/${post.slug}`}
                      className="self-start inline-flex items-center gap-2 px-6 py-3 font-display text-xs tracking-widest uppercase transition-colors duration-200"
                      style={{ background: '#FFFFFF', color: '#ED1C24' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.88)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FFFFFF' }}
                    >
                      LER MAIS
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                      >→</motion.span>
                    </Link>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          {/* Controles */}
          <div className="flex items-center justify-between mt-6 px-1">
            <div className="flex gap-2">
              {posts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > current ? 1 : -1)}
                  className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
                  style={{
                    width: i === current ? '2rem' : '0.75rem',
                    background: i === current ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
                  }}
                  aria-label={`Ir para notícia ${i + 1}`}
                >
                  {i === current && !paused && (
                    <motion.div
                      className="absolute inset-y-0 left-0"
                      style={{ background: 'rgba(255,255,255,0.5)' }}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
                      key={`progress-${current}`}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {[prev, next].map((fn, idx) => (
                <button
                  key={idx}
                  onClick={fn}
                  className="w-10 h-10 flex items-center justify-center transition-all duration-200"
                  style={{ border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)' }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = '#FFFFFF'
                    ;(e.currentTarget as HTMLElement).style.color = '#FFFFFF'
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)'
                    ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                  aria-label={idx === 0 ? 'Notícia anterior' : 'Próxima notícia'}
                >
                  {idx === 0 ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link
            href="/noticias"
            className="inline-block px-10 py-3 font-display text-sm tracking-widest uppercase transition-all duration-200 hover:scale-105"
            style={{ border: '2px solid rgba(255,255,255,0.7)', color: '#FFFFFF' }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.background = '#FFFFFF'
              ;(e.currentTarget as HTMLElement).style.color = '#ED1C24'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = '#FFFFFF'
            }}
          >
            VER TODAS AS NOTÍCIAS
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
