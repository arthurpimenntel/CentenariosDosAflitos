'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { HeroFoto } from '@/types'

const FALLBACK_PHOTOS = [
  { id: 'f1', imagem_url: '/torcida1.jpeg', ordem: 0, ativo: true, created_at: '' },
  { id: 'f2', imagem_url: '/torcida2.jpeg', ordem: 1, ativo: true, created_at: '' },
  { id: 'f3', imagem_url: '/torcida3.jpeg', ordem: 2, ativo: true, created_at: '' },
]

const INTERVAL = 9000

interface Props { fotos?: HeroFoto[] }

export default function HeroCarousel({ fotos }: Props) {
  const photos = (fotos && fotos.length > 0) ? fotos : FALLBACK_PHOTOS
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => { setCurrent(idx); setTransitioning(false) }, 800)
  }, [transitioning])

  useEffect(() => {
    if (photos.length <= 1) return
    const timer = setInterval(() => { goTo((current + 1) % photos.length) }, INTERVAL)
    return () => clearInterval(timer)
  }, [current, goTo, photos.length])

  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.15, duration: 0.7, ease: "easeOut" },
    }),
  }

  return (
    <section className="relative h-screen w-full overflow-hidden" aria-label="Hero">
      {/* Background slides */}
      {photos.map((photo, idx) => (
        <div
          key={photo.id}
          className="absolute inset-0 transition-opacity duration-[1500ms]"
          style={{ opacity: idx === current ? 1 : 0 }}
        >
          <Image
            src={photo.imagem_url}
            alt={`Os Centenários dos Aflitos - foto ${idx + 1}`}
            fill priority={idx === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlay vermelho dramático */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: 'linear-gradient(to bottom, rgba(237,28,36,0.55) 0%, rgba(140,0,0,0.82) 100%)' }}
        aria-hidden="true"
      />

      {/* Stick1 — à direita */}
      <motion.div
        className="absolute z-20 hidden md:block"
        style={{ right: '4%', bottom: '8%', width: 200, pointerEvents: 'none', rotate: '6deg' }}
        initial={{ opacity: 0, x: 60, rotate: '6deg' }}
        animate={{ opacity: 0.92, x: 0, rotate: '6deg' }}
        transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
        whileHover={{ scale: 1.08, rotate: '4deg' }}
      >
        <div className="sticker-float">
          <img src="/stick1.png" alt="Torcedor Centenários" width={200} style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 4px 16px rgba(237,28,36,0.6))' }} />
        </div>
      </motion.div>

      {/* Stick2 — à esquerda */}
      <motion.div
        className="absolute z-20 hidden lg:block"
        style={{ left: '3%', bottom: '12%', width: 160, pointerEvents: 'none', rotate: '-8deg' }}
        initial={{ opacity: 0, x: -60, rotate: '-8deg' }}
        animate={{ opacity: 0.88, x: 0, rotate: '-8deg' }}
        transition={{ duration: 1, delay: 1.1, ease: 'easeOut' }}
        whileHover={{ scale: 1.1, rotate: '-5deg' }}
      >
        <div className="sticker-float" style={{ animationDelay: '1.5s' }}>
          <img src="/stick2.png" alt="12° Jogador" width={160} style={{ mixBlendMode: 'screen', filter: 'drop-shadow(0 4px 16px rgba(237,28,36,0.6))' }} />
        </div>
      </motion.div>

      {/* Hero content */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <motion.p
          custom={0} variants={textVariants} initial="hidden" animate="visible"
          className="font-ultras text-sm md:text-base tracking-[0.5em] uppercase mb-6"
          style={{ color: 'rgba(255,255,255,0.85)' }}
        >
          Barra Brava do Clube Náutico Capibaribe
        </motion.p>

        <motion.h1
          custom={1} variants={textVariants} initial="hidden" animate="visible"
          className="font-ultras font-bold text-6xl md:text-8xl lg:text-9xl uppercase leading-none mb-4 text-white"
          style={{ textShadow: '0 4px 32px rgba(0,0,0,0.3)' }}
        >
          OS<br />
          <span style={{ color: '#FFFFFF', WebkitTextStroke: '2px rgba(255,255,255,0.4)' }}>CENTENÁRIOS</span>
        </motion.h1>

        {/* Linha decorativa */}
        <motion.div
          custom={1.5} variants={textVariants} initial="hidden" animate="visible"
          className="w-24 h-[3px] mb-6"
          style={{ background: 'rgba(255,255,255,0.6)' }}
        />

        <motion.p
          custom={2} variants={textVariants} initial="hidden" animate="visible"
          className="font-body text-base md:text-xl mb-10"
          style={{ color: 'rgba(255,255,255,0.8)' }}
        >
          Apoio incondicional — do início ao fim. Desde 2012.
        </motion.p>

        <motion.div
          custom={3} variants={textVariants} initial="hidden" animate="visible"
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/cadastro"
            className="px-8 py-4 font-ultras text-sm tracking-widest uppercase transition-all duration-200 hover:scale-105"
            style={{
              background: '#FFFFFF',
              color: '#ED1C24',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.9)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FFFFFF' }}
          >
            SEJA SÓCIO
          </Link>
          <Link
            href="/quem-somos"
            className="px-8 py-4 border-2 border-white font-ultras text-sm tracking-widest uppercase text-white hover:bg-white hover:text-[#ED1C24] hover:scale-105 transition-all duration-200"
          >
            NOSSA HISTÓRIA
          </Link>
        </motion.div>
      </div>

      {/* Slide indicators */}
      {photos.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3" role="tablist">
          {photos.map((_, idx) => (
            <button
              key={idx} role="tab"
              aria-selected={idx === current}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => goTo(idx)}
              className="h-1.5 rounded-full transition-all duration-500"
              style={{
                width: idx === current ? '2rem' : '0.75rem',
                background: idx === current ? '#FFFFFF' : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      )}

      {/* Scroll arrow */}
      <div className="absolute bottom-8 right-8 z-20 bounce-arrow" aria-hidden="true">
        <ChevronDown size={28} className="text-white/70" />
      </div>
    </section>
  )
}
