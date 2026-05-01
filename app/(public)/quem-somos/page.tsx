'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronRight, ZoomIn, X, ChevronLeft } from 'lucide-react'

const timeline = [
  { ano: '2012', titulo: 'O Início', texto: 'No dia 16 de dezembro de 2012, num racha entre amigos e conhecidos, ficou decidido o que a gente já sentia fazia tempo: o Náutico precisava de uma torcida diferente. Não foi em reunião de diretoria, não foi com planejamento. Foi na base do sentimento em comum, uma inquietação compartilhada por torcedores que queriam transformar a arquibancada do Náutico.' },
  { ano: '2013', titulo: 'O Primeiro Jogo', texto: 'O primeiro jogo do Pernambucano de 2013, nos Aflitos. Sem muito ensaio, sem muito recurso. Foram cerca de 3 ensaios da banda antes dessa partida. Naqueles primeiros 90 minutos ficou claro que a gente veio pra revolucionar.' },
  { ano: '2013', titulo: 'Quando Era Só Seis', texto: '2013 foi duro dentro de campo. Um dos piores anos da história do clube. A torcida do Náutico foi levada pra Arena Pernambuco, longe de casa, longe de sua torcida. Teve jogo que a gente estava em seis pessoas. E ninguém baixou a bandeira. Ninguém foi embora mais cedo. Ninguém recuou um só jogo.' },
  { ano: '2015–18', titulo: 'Crescimento e Expansão', texto: '2015 trouxe novos adeptos, novas amizades com barras do Nordeste. 2016 começou a ficar perceptível o que estava sendo construído — músicas lançadas na bancada, festas que ficaram na memória. 2017 foi a Série C, com jogos como mandante fora de Recife, no Lacerdão em Caruaru, e a gente sempre esteve lá. 2018 transformou um grupo de líderes em uma diretoria de verdade, com membros, estrutura e responsabilidade real.' },
  { ano: '2019', titulo: 'A Volta pra Casa', texto: 'Voltamos aos Aflitos e buscamos nosso espaço na arquibancada do Eládio, em uma campanha que nos trouxe de volta à Série B com um título coroado em São Luís.' },
  { ano: '2020–22', titulo: 'Resistência na Pandemia', texto: 'Veio 2020. E veio a pandemia. Até 2022, jogo sem público. A gente ergueu nossas faixas em um Eládio vazio. Mantivemos o movimento vivo e ainda mais forte.' },
  { ano: '2023', titulo: 'O Caldeirão', texto: 'Saímos do setor vermelho, mais caro e elitizado, e fomos pro Caldeirão — um setor desativado nos Aflitos que tinha história, onde ficava a antiga barra do Country. Ajudamos a criar o Sócio Caldeirão, com apelo popular, acessível, pra quem ama o Náutico de verdade. Dezenas de bandeiras. Centenas de balões. Milhares de bandeirinhas. O Caldeirão é a nossa casa. Construída por nós, para ser de todos.' },
]

const SPANS = ['col-span-2 row-span-2', 'col-span-1 row-span-1', 'col-span-1 row-span-1', 'col-span-1 row-span-1', 'col-span-1 row-span-1']

interface Foto { id: string; imagem_url: string; alt: string | null }

function Lightbox({ fotos, index, onClose, onPrev, onNext }: {
  fotos: Foto[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose, onPrev, onNext])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(10px)' }} onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ width: 44, height: 44, background: 'rgba(237,28,36,0.9)', border: '1px solid rgba(255,255,255,0.15)' }} aria-label="Fechar">
        <X size={18} color="#fff" />
      </button>
      <div className="absolute top-5 left-5 z-20 px-3 py-1.5 rounded-full"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'Oswald, sans-serif', fontSize: 12, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)' }}>
        {index + 1} / {fotos.length}
      </div>
      <button onClick={e => { e.stopPropagation(); onPrev() }} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }} aria-label="Anterior">
        <ChevronLeft size={22} color="#fff" />
      </button>
      <button onClick={e => { e.stopPropagation(); onNext() }} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }} aria-label="Próxima">
        <ChevronRight size={22} color="#fff" />
      </button>
      <motion.div key={index} initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex flex-col items-center px-3 sm:px-20" style={{ maxWidth: 900, width: '100%' }}
        onClick={e => e.stopPropagation()}>
        <div className="relative w-full overflow-hidden" style={{ borderRadius: 12, boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)' }}>
          <div className="absolute top-0 left-0 right-0 h-[3px] z-10" style={{ background: '#D40000' }} />
          <Image src={fotos[index].imagem_url} alt={fotos[index].alt ?? ''} width={900} height={600}
            className="w-full h-auto object-contain" style={{ maxHeight: '72vh', display: 'block' }} sizes="90vw" priority />
        </div>
        {fotos[index].alt && (
          <div className="flex items-center justify-between w-full mt-3 px-1">
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>
              {fotos[index].alt}
            </p>
          </div>
        )}
      </motion.div>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {fotos.map((f, i) => (
          <button key={i} onClick={e => e.stopPropagation()} className="relative overflow-hidden rounded transition-all"
            style={{ width: i === index ? 48 : 32, height: 32, opacity: i === index ? 1 : 0.4, outline: i === index ? '2px solid #D40000' : 'none', outlineOffset: 2 }}>
            <Image src={f.imagem_url} alt={f.alt ?? ''} fill className="object-cover" sizes="48px" />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

function Mosaico({ fotos }: { fotos: Foto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const open  = useCallback((i: number) => setLightboxIndex(i), [])
  const close = useCallback(() => setLightboxIndex(null), [])
  const prev  = useCallback(() => setLightboxIndex(i => i === null ? null : (i - 1 + fotos.length) % fotos.length), [fotos.length])
  const next  = useCallback(() => setLightboxIndex(i => i === null ? null : (i + 1) % fotos.length), [fotos.length])
  const visiveis = fotos.slice(0, 5)

  return (
    <>
      <div className="grid gap-1.5 w-full" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 220px)' }}>
        {visiveis.map((foto, i) => (
          <motion.button key={foto.id} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover="hover" onClick={() => open(i)}
            className={`relative overflow-hidden group focus:outline-none ${SPANS[i] ?? 'col-span-1 row-span-1'}`}
            aria-label={foto.alt ?? `Foto ${i + 1}`}>
            <Image src={foto.imagem_url} alt={foto.alt ?? ''} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />
            <motion.div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0)' }} variants={{ hover: { background: 'rgba(0,0,0,0.45)' } }} transition={{ duration: 0.3 }} />
            <motion.div className="absolute bottom-0 left-0 right-0" style={{ height: 3, background: '#D40000', scaleX: 0, transformOrigin: 'left' }} variants={{ hover: { scaleX: 1 } }} transition={{ duration: 0.35 }} />
            <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0 }} variants={{ hover: { opacity: 1 } }} transition={{ duration: 0.25 }}>
              <div className="flex items-center justify-center" style={{ width: 44, height: 44, background: 'rgba(212,0,0,0.85)', backdropFilter: 'blur(4px)' }}>
                <ZoomIn size={18} color="#fff" />
              </div>
            </motion.div>
            {foto.alt && (
              <motion.div className="absolute bottom-3 left-3 right-3" style={{ opacity: 0, y: 6 }} variants={{ hover: { opacity: 1, y: 0 } }} transition={{ duration: 0.25 }}>
                <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>{foto.alt}</p>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {lightboxIndex !== null && <Lightbox fotos={visiveis} index={lightboxIndex} onClose={close} onPrev={prev} onNext={next} />}
      </AnimatePresence>
    </>
  )
}

export default function QuemSomosPage() {
  const stickerRef = useRef(null)
  const stickerInView = useInView(stickerRef, { once: true, margin: '-100px' })
  const [fotos, setFotos] = useState<Foto[]>([])
  const [heroUrl, setHeroUrl] = useState('/torcida1.jpeg')

  useEffect(() => {
    fetch('/api/admin/quem-somos-fotos')
      .then(r => r.json())
      .then(({ fotos, heroUrl }) => { setFotos(fotos); setHeroUrl(heroUrl) })
      .catch(() => {})
  }, [])

  return (
    <main style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src={heroUrl} alt="Os Centenários dos Aflitos" fill priority className="object-cover object-center" sizes="100vw" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(212,0,0,0.95) 0%, rgba(212,0,0,0.6) 50%, rgba(212,0,0,0.2) 100%)' }} />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 40px, transparent 40px, transparent 80px)' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 pt-40 w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5"
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>Desde 2012</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-7xl md:text-9xl font-bold uppercase leading-none mb-6 text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
            Quem<br /><span style={{ color: 'rgba(255,255,255,0.6)', WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>Somos</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl max-w-2xl leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, sans-serif' }}>
            Os Centenários dos Aflitos nasceram da paixão genuína pelo Clube Náutico Capibaribe.
            Somos a barra brava que pulsa nas arquibancadas e ecoa pelo Brasil.
          </motion.p>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="w-full overflow-hidden flex items-center" style={{ background: '#FFFFFF', height: 52, borderTop: '1px solid rgba(212,0,0,0.12)', borderBottom: '1px solid rgba(212,0,0,0.12)' }}>
        <motion.div className="flex whitespace-nowrap" animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 18, ease: 'linear' }} style={{ willChange: 'transform' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-8"
              style={{ fontFamily: 'Oswald, sans-serif', fontSize: 15, fontWeight: 700, letterSpacing: '0.18em', color: '#D40000', textTransform: 'uppercase' }}>
              TRADIÇÃO NÃO VENDE NA FARMÁCIA!<span style={{ color: 'rgba(212,0,0,0.3)', fontSize: 18 }}>✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── TIMELINE ── */}
      <section className="px-6 py-24" style={{ background: '#D40000', backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 30px, transparent 30px, transparent 60px)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif' }}>— Nossa trajetória</p>
            <h2 className="text-5xl md:text-6xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#FFFFFF' }}>13 anos de história</h2>
            <div className="w-12 h-[3px] mt-4" style={{ background: 'rgba(255,255,255,0.5)' }} />
          </motion.div>
          <div className="relative">
            {timeline.map((item, i) => (
              <motion.div key={`${item.ano}-${i}`} initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, delay: i * 0.08 }} className="relative flex gap-8 pl-28">
                {i < timeline.length - 1 && <div className="absolute left-12 top-16 bottom-0 w-px" style={{ background: 'rgba(255,255,255,0.2)' }} />}
                <div className="absolute left-0 w-24 h-16 flex flex-col items-center justify-center flex-shrink-0 z-10"
                  style={{ background: '#FFFFFF', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                  <span className="font-bold text-xs leading-none text-center px-1" style={{ color: '#D40000', fontFamily: 'Oswald, sans-serif' }}>{item.ano}</span>
                </div>
                <div className="mb-10 p-6 flex-1" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Oswald, sans-serif', color: '#FFFFFF' }}>{item.titulo}</h3>
                  <p className="leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, sans-serif' }}>{item.texto}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOSAICO ── */}
      <section className="px-6 py-24" style={{ background: '#FFFFFF', backgroundImage: 'radial-gradient(circle, rgba(212,0,0,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'rgba(212,0,0,0.5)', fontFamily: 'DM Sans, sans-serif' }}>— Nossa galeria</p>
            <h2 className="text-5xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#D40000' }}>Momentos que ficam</h2>
            <motion.div className="mt-4" style={{ width: 48, height: 3, background: '#D40000', transformOrigin: 'left' }}
              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} />
            <p className="mt-3 text-sm" style={{ color: 'rgba(212,0,0,0.45)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.06em' }}>Clique em qualquer foto para ampliar</p>
          </motion.div>
          {fotos.length > 0
            ? <Mosaico fotos={fotos} />
            : <div className="grid gap-1.5 w-full" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 220px)' }}>
                {[...Array(5)].map((_, i) => <div key={i} className={`rounded animate-pulse ${SPANS[i]}`} style={{ background: 'rgba(212,0,0,0.08)' }} />)}
              </div>
          }
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pt-10 pb-32 px-6 text-center relative overflow-hidden"
        style={{ background: '#D40000', backgroundImage: 'repeating-linear-gradient(to right, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 30px, transparent 30px, transparent 60px)' }}
        ref={stickerRef}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto relative z-10">
          <Image src="/EscudoOficial.png" alt="Escudo" width={80} height={80} className="mx-auto mb-4 opacity-30" />
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif' }}>O Caldeirão</p>
          <h2 className="text-3xl md:text-6xl font-bold uppercase mb-4 px-4 text-center" style={{ fontFamily: 'Oswald, sans-serif', color: '#FFFFFF' }}>
            Se você acredita na força que vem da arquibancada
          </h2>
          <div className="w-12 h-[3px] mx-auto mb-8" style={{ background: 'rgba(255,255,255,0.5)' }} />
          <p className="mb-10 text-lg" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, sans-serif' }}>Junte-se à barra do Náutico e vista a camisa 12.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block' }}>
            <Link href="/cadastro"
              className="inline-flex items-center gap-3 px-10 py-5 text-xl font-bold uppercase tracking-widest transition-all"
              style={{ background: '#FFFFFF', color: '#D40000', fontFamily: 'Oswald, sans-serif' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.9)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FFFFFF' }}>
              SEJA SÓCIO <ChevronRight size={24} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}