'use client'

import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function WhyJoin() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      className="w-full py-24 px-4 md:px-12"
      style={{ backgroundColor: '#FFFFFF' }}
      ref={ref}
    >
      <div className="max-w-3xl mx-auto text-center">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <p className="font-ultras text-sm tracking-widest uppercase mb-3" style={{ color: 'rgba(237,28,36,0.6)' }}>
            Faça parte
          </p>
          <h2 className="font-ultras font-bold text-4xl md:text-5xl uppercase mb-4" style={{ color: '#ED1C24' }}>
            SEJA MEMBRO ATIVO<br />DA BARRA
          </h2>
          <motion.div
            className="mx-auto mt-5 mb-8"
            style={{ height: 3, width: 48, background: '#ED1C24', transformOrigin: 'center' }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
          <p className="font-body text-lg leading-relaxed max-w-xl mx-auto" style={{ color: 'rgba(237,28,36,0.75)' }}>
            A barra é forte porque tem gente que escolheu vestir a camisa 12 do Náutico com orgulho.
            Seja um dos nossos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
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
              SEJA SÓCIO
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}