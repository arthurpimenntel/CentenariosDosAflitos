'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { Noticia } from '@/types'
import { useState } from 'react'

export default function NoticiaCard({ noticia, index = 0 }: { noticia: Noticia; index?: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -6 }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/noticias/${noticia.slug}`} className="group block">
        <div
          className="overflow-hidden transition-all duration-300"
          style={{
            background: 'rgba(237,28,36,0.04)',
            border: `1px solid ${hovered ? 'rgba(237,28,36,0.4)' : 'rgba(237,28,36,0.15)'}`,
            boxShadow: hovered ? '0 20px 48px rgba(237,28,36,0.12)' : 'none',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
        >
          {/* Imagem */}
          <div className="relative h-52 overflow-hidden" style={{ background: 'rgba(237,28,36,0.04)' }}>
            {noticia.imagem_url ? (
              <Image
                src={noticia.imagem_url}
                alt={noticia.titulo}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-106"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold opacity-10" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>CA</span>
              </div>
            )}
            {/* Red top bar reveals on hover */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[3px]"
              style={{ background: '#ED1C24', transformOrigin: 'left' }}
              animate={{ scaleX: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              aria-hidden="true"
            />
          </div>

          {/* Conteúdo */}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3" style={{ color: 'rgba(237,28,36,0.5)' }}>
              <Calendar size={12} aria-hidden="true" style={{ color: '#ED1C24' }} />
              <time className="text-xs" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {noticia.publicado_em
                  ? new Date(noticia.publicado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                  : '—'}
              </time>
            </div>

            <h2
              className="text-lg font-bold leading-snug mb-2 line-clamp-2 transition-colors"
              style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}
            >
              {noticia.titulo}
            </h2>

            {noticia.resumo && (
              <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>
                {noticia.resumo}
              </p>
            )}

            <div
              className="mt-4 flex items-center gap-1 text-xs font-semibold transition-all"
              style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}
            >
              Ler mais
              <motion.span
                animate={{ x: hovered ? 4 : 0 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >→</motion.span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
