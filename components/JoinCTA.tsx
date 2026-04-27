'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function JoinCTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      className="w-full py-28 px-4 md:px-12 text-center relative overflow-hidden"
      style={{ backgroundColor: '#FFFFFF' }}
      ref={ref}
    >
      {/* Círculos decorativos */}
      <div className="absolute -top-40 -left-20 w-96 h-96 rounded-full opacity-5 pointer-events-none" style={{ background: '#ED1C24' }} aria-hidden="true" />
      <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full opacity-5 pointer-events-none" style={{ background: '#ED1C24' }} aria-hidden="true" />

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <Image src="/EscudoOficial.png" alt="Escudo Os Centenários" width={90} height={90} className="object-contain opacity-20" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }}
          className="font-ultras text-sm tracking-widest uppercase mb-4"
          style={{ color: 'rgba(237,28,36,0.6)' }}
        >
          Junte-se à família
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
          className="font-ultras font-bold text-5xl md:text-7xl lg:text-8xl uppercase leading-none mb-6"
          style={{ color: '#ED1C24', textShadow: '0 4px 20px rgba(237,28,36,0.15)' }}
        >
          SEJA UM<br />CENTENÁRIOS
        </motion.h2>

        <motion.div
          className="mx-auto mb-6"
          style={{ width: 48, height: 3, background: '#ED1C24', transformOrigin: 'center' }}
          initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ duration: 0.6, delay: 0.35 }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 }}
          className="font-body text-lg md:text-xl mb-10 max-w-lg mx-auto"
          style={{ color: 'rgba(237,28,36,0.75)' }}
        >
          Apoio incondicional, do início ao fim. Faça parte desta história.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
            <Link
              href="/cadastro"
              className="inline-block px-14 py-5 font-ultras font-bold text-base tracking-widest uppercase transition-all duration-200"
              style={{ background: '#ED1C24', color: '#FFFFFF', boxShadow: '0 8px 32px rgba(237,28,36,0.35)' }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.background = '#C41219'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(237,28,36,0.5)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.background = '#ED1C24'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(237,28,36,0.35)'
              }}
            >
              CADASTRE-SE AGORA
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}