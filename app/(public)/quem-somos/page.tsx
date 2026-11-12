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

// ─── Paleta do lightbox claro ────────────────────────────────────────────────
const LB = {
  bg:           'rgba(240,240,240,0.97)',
  btnClose:     '#D40000',
  btnNav:       'rgba(212,0,0,0.10)',
  btnNavBorder: 'rgba(212,0,0,0.20)',
  counter:      'rgba(0,0,0,0.40)',
  counterBg:    'rgba(212,0,0,0.08)',
  counterBorder:'rgba(212,0,0,0.18)',
  caption:      'rgba(0,0,0,0.45)',
}

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
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[999] flex items-center justify-center"
      style={{ background: LB.bg, backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      {/* Fechar */}
      <button onClick={onClose}
        className="absolute top-5 right-5 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ width: 44, height: 44, background: LB.btnClose }} aria-label="Fechar">
        <X size={18} color="#fff" />
      </button>

      {/* Contador */}
      <div className="absolute top-5 left-5 z-20 px-3 py-1.5 rounded-full"
        style={{ background: LB.counterBg, border: `1px solid ${LB.counterBorder}`, fontFamily: 'Oswald, sans-serif', fontSize: 12, letterSpacing: '0.15em', color: LB.counter }}>
        {index + 1} / {fotos.length}
      </div>

      {/* Anterior */}
      <button onClick={e => { e.stopPropagation(); onPrev() }}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ width: 52, height: 52, background: LB.btnNav, border: `1px solid ${LB.btnNavBorder}` }} aria-label="Anterior">
        <ChevronLeft size={22} color="#D40000" />
      </button>

      {/* Próxima */}
      <button onClick={e => { e.stopPropagation(); onNext() }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ width: 52, height: 52, background: LB.btnNav, border: `1px solid ${LB.btnNavBorder}` }} aria-label="Próxima">
        <ChevronRight size={22} color="#D40000" />
      </button>

      {/* Imagem — máxima ocupação de tela. O stopPropagation fica só na imagem,
           não no container, para que clicar nas laterais feche o lightbox. */}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.94, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex flex-col items-center w-full px-16"
        style={{ maxWidth: '100vw', pointerEvents: 'none' }}
      >
        <div className="relative w-full overflow-hidden"
          style={{ borderRadius: 8, boxShadow: '0 8px 40px rgba(0,0,0,0.15)', border: '1px solid rgba(212,0,0,0.15)', pointerEvents: 'auto' }}
          onClick={e => e.stopPropagation()}>
          <div className="absolute top-0 left-0 right-0 h-[3px] z-10" style={{ background: '#D40000' }} />
          <img src={fotos[index].imagem_url} alt={fotos[index].alt ?? ''}
            className="w-full h-auto object-contain" style={{ maxHeight: '72vh', display: 'block', width: '100%' }} />
        </div>
        {fotos[index].alt && (
          <p className="mt-2 text-sm px-1" style={{ fontFamily: 'DM Sans, sans-serif', color: LB.caption, letterSpacing: '0.06em', pointerEvents: 'auto' }}
            onClick={e => e.stopPropagation()}>
            {fotos[index].alt}
          </p>
        )}
      </motion.div>

      {/* Miniaturas */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {fotos.map((f, i) => (
          <button key={i} onClick={e => e.stopPropagation()} className="relative overflow-hidden rounded transition-all"
            style={{ width: i === index ? 48 : 32, height: 32, opacity: i === index ? 1 : 0.35, outline: i === index ? '2px solid #D40000' : 'none', outlineOffset: 2 }}>
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
            className={`relative overflow-hidden group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-primary ${SPANS[i] ?? 'col-span-1 row-span-1'}`}
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
              <motion.div className="absolute bottom-3 left-3 right-3" style={{ opacity: 0 }} variants={{ hover: { opacity: 1 } }} transition={{ duration: 0.25 }}>
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
  // ← null = ainda carregando (sem flash), string = URL carregada
  const [heroUrl, setHeroUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/quem-somos-fotos')
      .then(r => r.json())
      .then(({ fotos, heroUrl }) => { setFotos(fotos); setHeroUrl(heroUrl) })
      .catch(() => { setHeroUrl('/torcida1.jpeg') })
  }, [])

  return (
    <main style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          {/* Placeholder vermelho enquanto a URL não carrega — sem flash de imagem errada */}
          {heroUrl === null ? (
            <div className="w-full h-full" style={{ background: '#D40000' }} />
          ) : (
            <Image src={heroUrl} alt="Os Centenários dos Aflitos" fill priority className="object-cover object-center" sizes="100vw" />
          )}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(212,0,0,0.95) 0%, rgba(212,0,0,0.6) 50%, rgba(212,0,0,0.2) 100%)' }} />
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
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="w-full overflow-hidden flex items-center" style={{ background: '#FFFFFF', height: 52, borderTop: '1px solid rgba(212,0,0,0.12)', borderBottom: '1px solid rgba(212,0,0,0.12)' }}>
        <motion.div className="flex whitespace-nowrap" animate={{ x: ['0%', '-50%'] }} transition={{ repeat: Infinity, duration: 18, ease: 'linear' }} style={{ willChange: 'transform' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-8"
              style={{ fontFamily: 'Oswald, sans-serif', fontSize: 15, fontWeight: 700, letterSpacing: '0.18em', color: '#D40000', textTransform: 'uppercase' }}>
              A BARRA DO NÁUTICO - CLUBE NÁUTICO CAPIBARIBE<span style={{ color: 'rgba(212,0,0,0.3)', fontSize: 18 }}>✦</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── HISTÓRIA ── */}
      <section className="px-6 py-24" style={{ background: '#D40000' }}>
        <div className="max-w-3xl mx-auto space-y-14">
          {[
            {
              titulo: 'Nossa História',
              texto: 'No dia 16 de dezembro de 2012, durante um futebol entre amigos e conhecidos, o sentimento comum de revolucionar a arquibancada do Náutico finalmente tomava forma. Ficou decidida a criação d\'Os Centenários dos Aflitos.\n\nApós alguns encontros para ensaios da banda, peladas e reuniões, estreamos na 2ª rodada do Pernambucano 2012 (Náutico 2x1 Serra). Localizados no setor hexa, ao lado das cadeiras, apoiamos os 90 minutos com uma percussão que contava inclusive com uma alfaia — e ali ficou marcado o primeiro jogo. Mudamo-nos posteriormente para a Curva Sul, onde anos antes ficava a antiga Alma Alvirrubra.',
            },
            {
              titulo: 'Barra Brava',
              texto: 'No surgimento, as referências dos fundadores eram das mais diversas: desde as tradicionais torcidas organizadas do Nordeste até a cultura ultras da Europa e as barras bravas sul-americanas. Com o tempo, a influência da cultura das barras foi ficando cada vez mais forte, principalmente através da antiga barra brava do Náutico. A Alma Alvirrubra esteve ativa de 2005 a 2009 como a primeira torcida desse tipo na região, ficando conhecida nos Aflitos por nunca parar de cantar e por músicas que exaltavam o clube.\n\nFoi em 2013, já na Arena Pernambuco, que ficou decidido que seguiríamos como uma barra brava. Ainda assim, as influências regionais nunca foram abandonadas, e o repertório conta com músicas em ritmo de samba, maracatu e funk.\n\nA cultura de barras chegou ao Brasil e influenciou torcidas nos quatro cantos do país — nos Aflitos não foi diferente. O apoio incondicional, músicas cadenciadas, letras empolgantes que exaltam o clube, bandeiras, tirantes, instrumentos de metal e muito mais foram incorporados à ideologia d\'Os Centenários ao longo dos anos.',
            },
            {
              titulo: 'Nova Fase',
              texto: 'Com a ida à Arena Pernambuco, tudo ficou mais difícil do que o imaginado. A distância e a falta de resultados criaram um ambiente em que o torcedor alvirrubro não se sentia pertencente. A temporada de 2013 não foi fácil, mas com muita vontade de fazer acontecer, a torcida se manteve presente em todos os jogos com instrumentos e bandeiras.\n\nDe 2014 a 2018, a torcida precisou se reinventar diversas vezes e, assim, cresceu, amadureceu e conquistou novos membros. Formamos amizades em todo o Nordeste com outras barras: Movimento 90 (ABC-RN), Setor Alvinegro (Ceará-CE), Bravos Regatianos (CRB-AL), Brava Bolívia (Sampaio Corrêa-MA), Setor 31 (Botafogo-PB) e Loucos da Laje (Icasa-CE).\n\nA união dos membros sempre foi o diferencial da barra, e a história continuou sendo escrita em vitórias, derrotas, churrascos, caravanas e vivências. A ideologia se mantém viva para revolucionar a arquibancada do Náutico.',
            },
            {
              titulo: 'De Volta aos Aflitos',
              texto: 'Voltar aos Aflitos foi como reencontrar a alma do Náutico. A empolgação de estar novamente em casa veio junto com o acesso e o título da 3ª divisão, com uma torcida renovada, mais organizada e cheia de disposição.\n\nDurante a pandemia, foram seguidas as recomendações de segurança e distanciamento social, e a barra se manteve ativa como podia — através de faixas estendidas nos Aflitos e ações sociais. Os Centenários dos Aflitos, através de suas lideranças, foram pioneiros e principais articuladores na volta das bandeiras de mastro às arquibancadas pernambucanas, depois de quase 15 anos.\n\nCom o retorno das organizadas e a mudança do Setor Vermelho para o Setor Caldeirão, a barra entrou em uma fase de consolidação e crescimento. No popular Setor Caldeirão, a barra pôde ditar o seu ritmo. Nos últimos anos, o Caldeirão foi palco de diversas festas históricas marcadas na memória da torcida alvirrubra. Continuar contribuindo para que a cultura alvirrubra se mantenha viva, para que os Aflitos sejam cada vez mais difíceis de enfrentar e para apoiar o clube em todas as frentes — é isso que nos une e nos move.',
            },
          ].map((bloco, i) => (
            <motion.div key={bloco.titulo} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6, delay: i * 0.08 }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-[3px] flex-shrink-0" style={{ background: 'rgba(255,255,255,0.5)' }} />
                <h3 className="text-2xl md:text-3xl font-bold uppercase"
                  style={{ fontFamily: 'Oswald, sans-serif', color: '#FFFFFF' }}>{bloco.titulo}</h3>
              </div>
              {bloco.texto.split('\n\n').map((paragrafo, j) => (
                <p key={j} className="leading-relaxed text-sm mb-4 last:mb-0"
                  style={{ color: 'rgba(255,255,255,0.82)', fontFamily: 'DM Sans, sans-serif' }}>
                  {paragrafo}
                </p>
              ))}
            </motion.div>
          ))}
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