'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Heart, Bus, ShoppingBag } from 'lucide-react'

const cards = [
  {
    icon: Heart,
    title: 'IDENTIDADE',
    text: 'Faça parte de uma família que respira vermelho e branco. Aqui você encontra irmãos de torcida.',
  },
  {
    icon: Bus,
    title: 'CARAVANAS',
    text: 'Acompanhe o Náutico onde ele jogar, com organização total, segurança e preços especiais para sócios.',
  },
  {
    icon: ShoppingBag,
    title: 'BENEFÍCIOS',
    text: 'Descontos exclusivos na loja, acesso antecipado a produtos e convites para eventos especiais.',
  },
]

export default function WhyJoin() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  return (
    <section
      className="w-full py-24 px-4 md:px-12"
      style={{
        backgroundColor: '#FFFFFF',
      }}
      ref={ref}
    >
      <div className="max-w-7xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-ultras text-sm tracking-widest uppercase mb-3" style={{ color: 'rgba(237,28,36,0.6)' }}>
            Por Que Fazer Parte?
          </p>
          <h2 className="font-ultras font-bold text-4xl md:text-5xl uppercase" style={{ color: '#ED1C24' }}>
            MUITO MAIS QUE UMA TORCIDA
          </h2>
          <motion.div
            className="mx-auto mt-5"
            style={{ height: 3, background: '#ED1C24', transformOrigin: 'center' }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div style={{ width: 48, margin: '0 auto', height: 3, background: '#ED1C24' }} />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {cards.map((card, i) => {
            const Icon = card.icon
            const hovered = hoveredIdx === i
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ scale: 1.02, y: -6 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden p-8 cursor-default"
                style={{
                  background: 'rgba(237,28,36,0.04)',
                  border: `1px solid ${hovered ? 'rgba(237,28,36,0.4)' : 'rgba(237,28,36,0.15)'}`,
                  boxShadow: hovered ? '0 20px 48px rgba(237,28,36,0.12)' : 'none',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Top accent line */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ background: '#ED1C24', transformOrigin: 'left' }}
                  animate={{ scaleX: hovered ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                <div
                  className="w-14 h-14 flex items-center justify-center mb-6"
                  style={{ background: 'rgba(237,28,36,0.10)' }}
                >
                  <Icon size={24} style={{ color: '#ED1C24' }} aria-hidden="true" />
                </div>
                <h3 className="font-ultras font-bold text-xl tracking-widest mb-3" style={{ color: '#ED1C24' }}>
                  {card.title}
                </h3>
                <p className="font-body leading-relaxed" style={{ color: 'rgba(237,28,36,0.75)' }}>{card.text}</p>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
            <Link
              href="/cadastro"
              className="inline-block px-12 py-4 font-ultras text-sm tracking-widest uppercase transition-all duration-200"
              style={{
                background: '#ED1C24',
                color: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(237,28,36,0.35)',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.background = '#C41219'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(237,28,36,0.5)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.background = '#ED1C24'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(237,28,36,0.35)'
              }}
            >
              QUERO FAZER PARTE
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
