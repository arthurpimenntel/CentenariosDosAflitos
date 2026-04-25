'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function AboutPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      className="w-full py-24 px-4 md:px-12 overflow-hidden"
      style={{ backgroundColor: '#ED1C24' }}
      ref={ref}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">

        {/* Text */}
        <motion.div
          className="flex-1 lg:w-3/5"
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p className="font-ultras text-sm tracking-widest uppercase mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Quem Somos
          </p>
          <h2 className="font-ultras font-bold text-4xl md:text-5xl lg:text-6xl uppercase leading-tight mb-6" style={{ color: '#FFFFFF' }}>
            NÓS TORCEMOS<br />COM ALMA
          </h2>
          {/* Linha animada */}
          <motion.div
            className="h-[3px] mb-8"
            style={{ background: 'rgba(255,255,255,0.5)', transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          />

          <div className="space-y-4 max-w-xl mb-8">
            <p className="font-body text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Hoje não se pensa na arquibancada dos Aflitos sem pensar n'Os Centenários dos Aflitos.
              O que nos une é simples: não importa o que aconteça, com a barra o Náutico sempre jogará com 12 em campo.
              Nunca foi sobre resultado, nunca será. Sempre estaremos lá defendendo as nossas cores.
            </p>
            <p className="font-body text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Na arquibancada é onde o coração pulsa, 90 minutos de vida pelo Náutico. No Setor Caldeirão,
              a regra é clara: apoiar o Náutico até o fim, aconteça o que acontecer.
            </p>
            <p className="font-body text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
              Fora do estádio, estamos ativos. Defendemos o clube em todas as frentes, ocupamos espaços
              e pensamos no Náutico, dando voz à torcida alvirrubra e fazendo o melhor para o nosso clube.
            </p>
            <p className="font-body text-sm font-semibold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Desde 2012, não se compara.
            </p>
          </div>

          <div className="flex gap-10 mb-10">
            {[
              { num: '2012', label: 'Fundação' },
              { num: '+500', label: 'Sócios' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-ultras font-bold text-3xl" style={{ color: '#FFFFFF' }}>{stat.num}</p>
                <p className="font-body text-sm tracking-widest uppercase mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          <Link
            href="/quem-somos"
            className="inline-block px-8 py-3 font-ultras text-sm tracking-widest uppercase transition-all duration-200 hover:scale-105"
            style={{ border: '2px solid rgba(255,255,255,0.8)', color: '#FFFFFF' }}
            onMouseEnter={e => {
              ;(e.currentTarget as HTMLElement).style.background = '#FFFFFF'
              ;(e.currentTarget as HTMLElement).style.color = '#ED1C24'
            }}
            onMouseLeave={e => {
              ;(e.currentTarget as HTMLElement).style.background = 'transparent'
              ;(e.currentTarget as HTMLElement).style.color = '#FFFFFF'
            }}
          >
            CONHEÇA NOSSA HISTÓRIA
          </Link>
        </motion.div>

        {/* Image */}
        <motion.div
          className="flex-1 lg:w-2/5 w-full h-80 md:h-[480px] relative"
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        >
          <div
            className="w-full h-full relative overflow-hidden"
            style={{ clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)' }}
          >
            <Image
              src="/torcida3.jpeg"
              alt="Torcida Os Centenários no Estádio dos Aflitos"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, rgba(237,28,36,0.3) 0%, transparent 60%)' }}
              aria-hidden="true"
            />
          </div>
          <div
            className="absolute -bottom-3 left-0 h-1"
            style={{ width: '60%', background: 'rgba(255,255,255,0.5)' }}
            aria-hidden="true"
          />
        </motion.div>

      </div>
    </section>
  )
}