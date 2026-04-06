'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Zap, Users, MapPin, Calendar, Shield, Heart, ChevronRight } from 'lucide-react'

const beneficios = [
  { icon: Zap, numero: '01', titulo: 'Acesso Antecipado', texto: 'Membros têm prioridade na compra de ingressos para jogos especiais e eventos exclusivos da torcida.' },
  { icon: Users, numero: '02', titulo: 'Comunidade Forte', texto: 'Faça parte de uma rede de mais de 500 apaixonados pelo Timbu espalhados por todo o Brasil.' },
  { icon: MapPin, numero: '03', titulo: 'Caravanas Organizadas', texto: 'Viagens para jogos fora de Recife com preços especiais para membros. Menos estresse, mais festa.' },
  { icon: Calendar, numero: '04', titulo: 'Eventos Exclusivos', texto: 'Confraternizações, encontros antes dos jogos e eventos especiais só para quem é da família.' },
  { icon: Shield, numero: '05', titulo: 'Identidade Oficial', texto: 'Carteirinha de membro, acesso ao uniforme oficial e reconhecimento como parte da barra brava.' },
  { icon: Heart, numero: '06', titulo: 'Pertencimento Real', texto: 'Mais do que torcer, você ajuda a construir a história dos Centenários dos Aflitos.' },
]

const depoimentos = [
  { nome: 'Rafael Souza', cidade: 'Recife — PE', texto: 'Entrei em 2018 e foi a melhor decisão que tomei. A galera é incrível, os jogos são outra experiência completamente diferente.', inicial: 'R' },
  { nome: 'Camila Ferreira', cidade: 'Recife - PE', texto: 'A viagem é tão boa e animada que o clima do jogo fica diferente! Todos muito acolhedores e respeitadores. Amo viajar com essa torcida!', inicial: 'C' },
  { nome: 'Pedro Henrique', cidade: 'João Pessoa — PB', texto: 'Mesmo morando na Paraíba me sinto parte de tudo. A comunidade online e as viagens me conectam ao Náutico de outro jeito. Todo jogo na minha cidade, a torcida vem em peso!', inicial: 'P' },
]

export default function PorQuePage() {
  const ctaRef = useRef(null)
  const ctaInView = useInView(ctaRef, { once: true })
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })
  const benefRef = useRef(null)
  const benefInView = useInView(benefRef, { once: true, margin: '-80px' })
  const [hoveredBenef, setHoveredBenef] = useState<number | null>(null)
  const [hoveredDep, setHoveredDep] = useState<number | null>(null)

  return (
    <main style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO ── fundo vermelho */}
      <section
        className="relative pt-40 pb-24 px-6 overflow-hidden text-center"
        style={{
          background: '#ED1C24',
        }}
        ref={heroRef}
      >
        {/* Escudo marca d'água */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <Image src="/EscudoOficial.png" alt="" width={600} height={600} className="object-contain opacity-[0.06]" />
        </div>

        <motion.div
          className="absolute hidden lg:block"
          style={{ right: '4%', bottom: '5%', width: 170, pointerEvents: 'none', zIndex: 10 }}
          initial={{ opacity: 0, x: 60, rotate: '7deg' }}
          animate={heroInView ? { opacity: 0.9, x: 0, rotate: '7deg' } : {}}
          transition={{ duration: 0.9, delay: 0.6 }}
          whileHover={{ scale: 1.08, rotate: '4deg' }}
        >
          <div className="sticker-float">
            <img src="/stick1.png" alt="Torcedor Centenários" width={180} style={{ mixBlendMode: 'screen' }} />
          </div>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-1.5"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Por que ser Centenários?
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="text-6xl md:text-9xl font-bold uppercase leading-none mb-8"
            style={{ fontFamily: 'Oswald, sans-serif', color: '#FFFFFF' }}
          >
            Ser mais<br />
            <span style={{ color: 'rgba(255,255,255,0.55)', WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>do que</span><br />
            torcer.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, sans-serif' }}
          >
            Ser Centenários é pertencer a algo maior. É raça, família e paixão inabalável pelo Timbu.
          </motion.p>
        </div>
      </section>

      {/* ── BENEFÍCIOS ── fundo branco pontilhado */}
      <section
        className="px-6 py-24"
        style={{
          background: '#FFFFFF',
        }}
        ref={benefRef}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={benefInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="h-[3px] w-16 mb-6" style={{ background: '#ED1C24' }} />
            <h2 className="text-4xl md:text-5xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>
              O que você ganha
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficios.map((b, i) => {
              const hov = hoveredBenef === i
              return (
                <motion.div
                  key={b.titulo}
                  initial={{ opacity: 0, y: 40 }}
                  animate={benefInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative p-8 overflow-hidden cursor-default"
                  style={{
                    background: 'rgba(237,28,36,0.04)',
                    border: `1px solid ${hov ? 'rgba(237,28,36,0.4)' : 'rgba(237,28,36,0.15)'}`,
                    boxShadow: hov ? '0 20px 48px rgba(237,28,36,0.12)' : 'none',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={() => setHoveredBenef(i)}
                  onMouseLeave={() => setHoveredBenef(null)}
                >
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: '#ED1C24', transformOrigin: 'left' }}
                    animate={{ scaleX: hov ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  {/* Número decorativo */}
                  <span
                    className="absolute top-4 right-6 text-5xl font-bold select-none pointer-events-none"
                    style={{ fontFamily: 'Oswald, sans-serif', color: 'rgba(237,28,36,0.06)' }}
                  >
                    {b.numero}
                  </span>

                  <div
                    className="w-14 h-14 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(237,28,36,0.10)' }}
                  >
                    <b.icon size={26} style={{ color: '#ED1C24' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>
                    {b.titulo}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(237,28,36,0.75)', fontFamily: 'DM Sans, sans-serif' }}>
                    {b.texto}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── fundo vermelho */}
      <section
        className="px-6 py-24"
        style={{
          background: '#ED1C24',
        }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif' }}>
              — Quem já é da família diz
            </p>
            <h2 className="text-5xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#FFFFFF' }}>
              Vozes da Torcida
            </h2>
            <div className="w-12 h-[3px] mx-auto mt-5" style={{ background: 'rgba(255,255,255,0.5)' }} />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {depoimentos.map((d, i) => {
              const hov = hoveredDep === i
              return (
                <motion.div
                  key={d.nome}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative p-8 flex flex-col overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: `1px solid ${hov ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)'}`,
                    boxShadow: hov ? '0 20px 48px rgba(0,0,0,0.15)' : 'none',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={() => setHoveredDep(i)}
                  onMouseLeave={() => setHoveredDep(null)}
                >
                  {/* Top line */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: '#FFFFFF', transformOrigin: 'left' }}
                    animate={{ scaleX: hov ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Aspas decorativas */}
                  <span
                    className="absolute top-2 left-4 select-none pointer-events-none font-serif leading-none"
                    style={{ fontSize: 80, color: 'rgba(255,255,255,0.12)', lineHeight: 1 }}
                  >&ldquo;</span>

                  <p className="flex-1 text-base leading-relaxed mb-8 relative z-10" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'DM Sans, sans-serif' }}>
                    {d.texto}
                  </p>

                  <div className="flex items-center gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '1.25rem' }}>
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                      style={{ background: '#FFFFFF', color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}
                    >
                      {d.inicial}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: '#FFFFFF', fontFamily: 'Oswald, sans-serif' }}>{d.nome}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'DM Sans, sans-serif' }}>{d.cidade}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── fundo branco */}
      <section
        ref={ctaRef}
        className="px-6 py-32 relative overflow-hidden"
        style={{
          background: '#FFFFFF',
        }}
      >
        <motion.div
          className="absolute hidden lg:block"
          style={{ right: '5%', bottom: 0, width: 160, pointerEvents: 'none', zIndex: 2 }}
          initial={{ opacity: 0, y: 40, rotate: '8deg' }}
          animate={ctaInView ? { opacity: 0.8, y: 0, rotate: '8deg' } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          whileHover={{ scale: 1.1, rotate: '5deg' }}
        >
          <div className="sticker-float" style={{ animationDelay: '2.5s' }}>
            <img src="/stick2.png" alt="12º Jogador" width={160} style={{ mixBlendMode: 'multiply' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="relative max-w-3xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ background: 'rgba(237,28,36,0.15)' }} />
            <Image src="/EscudoOficial.png" alt="Escudo" width={60} height={60} className="opacity-80" />
            <div className="h-px flex-1" style={{ background: 'rgba(237,28,36,0.15)' }} />
          </div>

          <h2 className="text-5xl md:text-7xl font-bold uppercase leading-none mb-6" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>
            Pronto para fazer<br />
            <span style={{ color: 'rgba(237,28,36,0.4)', WebkitTextStroke: '1px rgba(237,28,36,0.3)' }}>parte?</span>
          </h2>

          <div className="w-12 h-[3px] mx-auto mb-6" style={{ background: '#ED1C24' }} />

          <p className="text-lg mb-12" style={{ color: 'rgba(237,28,36,0.6)', fontFamily: 'DM Sans, sans-serif' }}>
            A inscrição é gratuita. Entraremos em contato pelo WhatsApp.
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-3 px-12 py-5 text-xl font-bold uppercase tracking-widest transition-all"
              style={{
                background: '#ED1C24',
                color: '#FFFFFF',
                fontFamily: 'Oswald, sans-serif',
                boxShadow: '0 8px 32px rgba(237,28,36,0.35)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C41219' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#ED1C24' }}
            >
              Quero ser Centenários
              <ChevronRight size={24} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
