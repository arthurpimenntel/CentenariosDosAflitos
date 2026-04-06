'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { Heart, Shield, Flame, Users, Trophy, Star, ChevronRight } from 'lucide-react'

const timeline = [
  { ano: '2012', titulo: 'O Início', texto: 'Um grupo de apaixonados pelo Náutico se reúne pela primeira vez nas arquibancadas dos Aflitos com um sonho: criar uma torcida organizada de verdade.' },
  { ano: '2014', titulo: 'Primeiros Passos', texto: 'A torcida ganha nome, cores e identidade. Os primeiros uniformes são confeccionados e a presença nos jogos começa a crescer.' },
  { ano: '2016', titulo: 'Crescimento', texto: 'Ultrapassamos 200 membros ativos. A festa nas arquibancadas passa a ser referência no futebol pernambucano.' },
  { ano: '2018', titulo: 'Viagens', texto: 'Primeiras caravanas organizadas para jogos fora de Recife. A família Centenários começa a se espalhar pelo Nordeste.' },
  { ano: '2020', titulo: 'Resistência', texto: 'Mesmo sem jogos presenciais, a comunidade se mantém unida pelas redes sociais e eventos virtuais.' },
  { ano: '2026', titulo: 'Hoje', texto: 'Mais de 500 membros, presença em todo o Brasil e um compromisso inabalável com o Timbu.' },
]

const valores = [
  { icon: Heart, titulo: 'Paixão', texto: 'Amor incondicional ao Clube Náutico Capibaribe, em todas as divisões e momentos.' },
  { icon: Shield, titulo: 'Lealdade', texto: 'Ao clube, aos companheiros e à história de mais de um século de tradição!' },
  { icon: Flame, titulo: 'Intensidade', texto: 'Dentro e fora dos estádios, representamos o Timbu com garra e vibração.' },
  { icon: Users, titulo: 'Família', texto: 'Mais do que torcida, somos uma comunidade que se apoia dentro e fora do futebol.' },
  { icon: Trophy, titulo: 'Orgulho', texto: 'Carregamos a tradição centenária do Náutico como uma honra e responsabilidade.' },
  { icon: Star, titulo: 'Respeito', texto: 'Somos exemplo de organização, disciplina e amor ao esporte.' },
]

const stats = [
  { numero: '2012', label: 'Fundação' },
  { numero: '500+', label: 'Membros ativos' },
  { numero: '13+', label: 'Anos de história' },
  { numero: '90 min', label: 'De apoio incondicional' },
]

function TimelineItem({ item, index }: { item: typeof timeline[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isRed = index % 2 === 0

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="relative flex gap-8 pl-24"
    >
      <div className="absolute left-10 top-8 bottom-0 w-px" style={{ background: 'rgba(212,0,0,0.2)' }} />
      <div
        className="absolute left-0 w-20 h-20 rounded-full flex flex-col items-center justify-center flex-shrink-0 z-10"
        style={{ background: '#D40000', boxShadow: '0 4px 20px rgba(212,0,0,0.35)' }}
      >
        <span className="font-ultras font-bold text-sm text-white leading-none">{item.ano}</span>
      </div>
      <div
        className="mb-10 p-6 flex-1"
        style={{
          background: isRed ? 'rgba(212,0,0,0.04)' : '#FFFFFF',
          border: '1px solid rgba(212,0,0,0.15)',
        }}
      >
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif', color: '#D40000' }}>
          {item.titulo}
        </h3>
        <p className="leading-relaxed text-sm" style={{ color: 'rgba(212,0,0,0.75)', fontFamily: 'DM Sans, sans-serif' }}>
          {item.texto}
        </p>
      </div>
    </motion.div>
  )
}

export default function QuemSomosPage() {
  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true })
  const stickerRef = useRef(null)
  const stickerInView = useInView(stickerRef, { once: true, margin: '-100px' })
  const valoresRef = useRef(null)
  const valoresInView = useInView(valoresRef, { once: true, margin: '-80px' })
  const [hoveredValor, setHoveredValor] = useState<number | null>(null)

  return (
    <main style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/torcida1.jpeg" alt="Os Centenários dos Aflitos" fill priority className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(212,0,0,0.95) 0%, rgba(212,0,0,0.6) 50%, rgba(212,0,0,0.2) 100%)' }} />
          {/* Listras camisa */}
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 40px, transparent 40px, transparent 80px)' }} />
        </div>

        <motion.div
          className="absolute hidden lg:block"
          style={{ right: '6%', bottom: '10%', width: 160, pointerEvents: 'none', zIndex: 10 }}
          initial={{ opacity: 0, x: 40, rotate: '8deg' }}
          animate={{ opacity: 0.9, x: 0, rotate: '8deg' }}
          transition={{ duration: 0.9, delay: 0.6 }}
          whileHover={{ scale: 1.1, rotate: '5deg' }}
        >
          <div className="sticker-float">
            <img src="/stick2.png" alt="12º Jogador" width={160} style={{ mixBlendMode: 'screen' }} />
          </div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-40 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>Desde 2012</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-7xl md:text-9xl font-bold uppercase leading-none mb-6 text-white" style={{ fontFamily: 'Oswald, sans-serif' }}
          >
            Quem<br />
            <span style={{ color: 'rgba(255,255,255,0.6)', WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>Somos</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, sans-serif' }}
          >
            Os Centenários dos Aflitos nasceram da paixão genuína pelo Clube Náutico Capibaribe.
            Somos a barra brava que pulsa nas arquibancadas e ecoa pelo Brasil.
          </motion.p>
        </div>
      </section>

      {/* ── NÚMEROS ── fundo branco pontilhado */}
      <section
        ref={statsRef}
        className="py-16 px-6"
        style={{
          background: '#FFFFFF',
          backgroundImage: 'radial-gradient(circle, rgba(212,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6"
              style={{ border: '1px solid rgba(212,0,0,0.12)' }}
            >
              <p className="text-5xl md:text-6xl font-bold mb-1" style={{ fontFamily: 'Oswald, sans-serif', color: '#D40000' }}>
                {s.numero}
              </p>
              <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(212,0,0,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HISTÓRIA / TIMELINE ── fundo vermelho */}
      <section
        className="px-6 py-24"
        style={{
          background: '#D40000',
          backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 30px, transparent 30px, transparent 60px)',
        }}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif' }}>— Nossa trajetória</p>
            <h2 className="text-5xl md:text-6xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#FFFFFF' }}>
              13 anos de história
            </h2>
            <div className="w-12 h-[3px] mt-4" style={{ background: 'rgba(255,255,255,0.5)' }} />
          </motion.div>

          {/* Timeline com fundo branco sobre vermelho */}
          <div className="relative">
            {timeline.map((item, i) => (
              <motion.div
                key={item.ano}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="relative flex gap-8 pl-24"
              >
                <div className="absolute left-10 top-8 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.2)' }} />
                <div
                  className="absolute left-0 w-20 h-20 rounded-full flex flex-col items-center justify-center flex-shrink-0 z-10"
                  style={{ background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                >
                  <span className="font-ultras font-bold text-sm leading-none" style={{ color: '#D40000' }}>{item.ano}</span>
                </div>
                <div
                  className="mb-10 p-6 flex-1"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif', color: '#FFFFFF' }}>
                    {item.titulo}
                  </h3>
                  <p className="leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, sans-serif' }}>
                    {item.texto}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALORES ── fundo branco */}
      <section
        className="px-6 py-24"
        style={{
          background: '#FFFFFF',
          backgroundImage: 'radial-gradient(circle, rgba(212,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        ref={valoresRef}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(212,0,0,0.5)', fontFamily: 'DM Sans, sans-serif' }}>— O que nos move</p>
            <h2 className="text-5xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#D40000' }}>Nossos Valores</h2>
            <motion.div
              className="mx-auto mt-5"
              style={{ width: 48, height: 3, background: '#D40000', transformOrigin: 'center' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {valores.map((v, i) => {
              const hov = hoveredValor === i
              return (
                <motion.div
                  key={v.titulo}
                  initial={{ opacity: 0, y: 30 }}
                  animate={valoresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ scale: 1.02, y: -6 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative p-8 overflow-hidden cursor-default"
                  style={{
                    background: 'rgba(212,0,0,0.04)',
                    border: `1px solid ${hov ? 'rgba(212,0,0,0.4)' : 'rgba(212,0,0,0.15)'}`,
                    boxShadow: hov ? '0 20px 48px rgba(212,0,0,0.12)' : 'none',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={() => setHoveredValor(i)}
                  onMouseLeave={() => setHoveredValor(null)}
                >
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: '#D40000', transformOrigin: 'left' }}
                    animate={{ scaleX: hov ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div
                    className="w-14 h-14 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(212,0,0,0.10)' }}
                  >
                    <v.icon size={26} style={{ color: '#D40000' }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Oswald, sans-serif', color: '#D40000' }}>
                    {v.titulo}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(212,0,0,0.75)', fontFamily: 'DM Sans, sans-serif' }}>
                    {v.texto}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── fundo vermelho */}
      <section
        className="py-32 px-6 text-center relative overflow-hidden"
        style={{
          background: '#D40000',
          backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 30px, transparent 30px, transparent 60px)',
        }}
        ref={stickerRef}
      >
        <motion.div
          className="absolute hidden lg:block"
          style={{ right: '5%', bottom: 0, width: 180, pointerEvents: 'none', zIndex: 2 }}
          initial={{ opacity: 0, y: 40, rotate: '8deg' }}
          animate={stickerInView ? { opacity: 0.85, y: 0, rotate: '8deg' } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          whileHover={{ scale: 1.06, rotate: '5deg' }}
        >
          <div className="sticker-float" style={{ animationDelay: '1s' }}>
            <img src="/stick1.png" alt="Torcedor Centenários" width={180} style={{ mixBlendMode: 'screen' }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto relative z-10"
        >
          <Image src="/EscudoOficial.png" alt="Escudo" width={80} height={80} className="mx-auto mb-8 opacity-30" />
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif' }}>Faça parte</p>
          <h2 className="text-5xl md:text-6xl font-bold uppercase mb-4" style={{ fontFamily: 'Oswald, sans-serif', color: '#FFFFFF' }}>
            Faça parte da história
          </h2>
          <div className="w-12 h-[3px] mx-auto mb-8" style={{ background: 'rgba(255,255,255,0.5)' }} />
          <p className="mb-10 text-lg" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, sans-serif' }}>
            Seja Centenários. Apoio incondicional, do início ao fim.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
            <Link
              href="/cadastro"
              className="inline-flex items-center gap-3 px-10 py-5 text-xl font-bold uppercase tracking-widest transition-all"
              style={{ background: '#FFFFFF', color: '#D40000', fontFamily: 'Oswald, sans-serif' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.9)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FFFFFF' }}
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
