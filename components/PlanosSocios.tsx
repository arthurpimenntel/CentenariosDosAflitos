'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { CreditCard } from 'lucide-react'
import { useRouter } from 'next/navigation'

const RED = '#ED1C24'

type CarteirinhaOpcao = 'virtual' | 'fisica'
type PlanoId = 'individual' | 'familia'

const BENEFICIOS = [
  { bold: null,    texto: 'Desconto na loja'               },
  { bold: null,    texto: 'Desconto em caravanas'          },
  { bold: null,    texto: 'Sorteios mensais'               },
  { bold: null,    texto: 'Prioridade em eventos'          },
  { bold: null,    texto: 'Carteirinha virtual'             },
  { bold: null,    texto: 'Adesivo exclusivo de sócio 2026'},
  { bold: '+R$16', texto: 'Carteirinha Física'             },
]

const planos = [
  {
    id: 'individual' as PlanoId,
    nome: 'Individual',
    preco: 'R$ 50,00',
    periodo: '/ano',
    detalhe: null as string | null,
  },
  {
    id: 'familia' as PlanoId,
    nome: 'Família',
    preco: 'R$ 40,00',
    periodo: '/pessoa/ano',
    detalhe: 'A partir de 3 pessoas da mesma família' as string | null,
  },
]

function PlanCard({
  plano, index, inView, selected, onSelect,
}: {
  plano: (typeof planos)[0]
  index: number
  inView: boolean
  selected: PlanoId
  onSelect: (id: PlanoId) => void
}) {
  const feat = plano.id === 'familia'
  const isSelected = selected === plano.id

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12 }}
      whileHover={{ y: -8 }}
      onClick={() => onSelect(plano.id)}
      className="relative flex flex-col h-full cursor-pointer"
      style={{
        background: feat ? RED : '#FFFFFF',
        border: feat
          ? isSelected ? '3px solid rgba(255,255,255,0.6)' : `2px solid ${RED}`
          : `${isSelected ? '2px' : '1px'} solid ${isSelected ? RED : 'rgba(237,28,36,0.18)'}`,
        boxShadow: isSelected
          ? feat ? '0 0 0 3px rgba(237,28,36,0.35)' : '0 8px 32px rgba(237,28,36,0.15)'
          : 'none',
      }}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 flex items-center justify-center z-10"
          style={{ width: 22, height: 22, background: feat ? '#FFFFFF' : RED, color: feat ? RED : '#FFFFFF', fontSize: 12, fontWeight: 700 }}>
          ✓
        </div>
      )}
      {!feat && (
        <div className="absolute top-0 left-0 right-0" style={{ height: 4, background: 'rgba(237,28,36,0.25)' }} />
      )}
      <div className="relative flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ height: 96, background: feat ? 'rgba(255,255,255,0.1)' : 'rgba(237,28,36,0.05)', borderBottom: feat ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(237,28,36,0.1)' }}>
        {feat && (
          <div className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 18px, rgba(255,255,255,0.06) 18px, rgba(255,255,255,0.06) 22px)' }} />
        )}
        <Image src="/EscudoOficial.png" alt="Escudo Os Centenários" width={54} height={54} className="object-contain" style={{ opacity: feat ? 0.3 : 0.12 }} />
        <span className="absolute bottom-2 tracking-widest uppercase"
          style={{ fontSize: 9, fontFamily: 'Oswald, sans-serif', fontWeight: 700, letterSpacing: '0.2em', color: feat ? 'rgba(255,255,255,0.5)' : 'rgba(237,28,36,0.35)' }}>
          SEJA SÓCIO
        </span>
      </div>
      <div className="flex flex-col flex-1 p-6">
        <p className="uppercase font-bold mb-0.5"
          style={{ fontFamily: 'Oswald, sans-serif', fontSize: 22, color: feat ? '#FFFFFF' : RED, letterSpacing: '0.04em' }}>
          {plano.nome}
        </p>
        <span className="uppercase tracking-widest block mb-3"
          style={{ fontSize: 10, color: feat ? 'rgba(255,255,255,0.5)' : 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
          Plano Anual
        </span>
        <div className="flex items-baseline gap-1 mb-2">
          <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: 38, fontWeight: 700, color: feat ? '#FFFFFF' : RED, lineHeight: 1 }}>{plano.preco}</span>
          <span style={{ fontSize: 13, color: feat ? 'rgba(255,255,255,0.55)' : 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>{plano.periodo}</span>
        </div>
        <div style={{ minHeight: 28, marginBottom: 4 }}>
          {plano.detalhe && (
            <p className="text-xs italic" style={{ color: feat ? 'rgba(255,255,255,0.6)' : 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
              {plano.detalhe}
            </p>
          )}
        </div>
        <div className="mb-3" style={{ height: 1, background: feat ? 'rgba(255,255,255,0.2)' : 'rgba(237,28,36,0.1)' }} />
        <span className="uppercase tracking-widest block mb-2.5"
          style={{ fontSize: 10, color: feat ? 'rgba(255,255,255,0.45)' : 'rgba(237,28,36,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
          Benefícios Inclusos
        </span>
        <ul className="flex flex-col gap-1.5 flex-1 mb-5">
          {BENEFICIOS.map((b, i) => (
            <li key={i} className="flex items-center gap-2"
              style={{ fontSize: 13, color: feat ? 'rgba(255,255,255,0.9)' : 'rgba(237,28,36,0.75)', fontFamily: 'DM Sans, sans-serif' }}>
              <span className="inline-flex items-center justify-center flex-shrink-0 rounded-full"
                style={{ width: 18, height: 18, background: feat ? 'rgba(255,255,255,0.2)' : 'rgba(237,28,36,0.1)', color: feat ? '#FFFFFF' : RED, fontSize: 10, fontWeight: 700 }}>
                ✓
              </span>
              {b.bold && <strong style={{ color: feat ? '#FFFFFF' : RED, marginRight: 2 }}>{b.bold}</strong>}
              {b.texto}
            </li>
          ))}
        </ul>
        <div className="block w-full py-3.5 text-center uppercase tracking-widest font-bold flex-shrink-0"
          style={{ fontFamily: 'Oswald, sans-serif', fontSize: 11, letterSpacing: '0.12em', background: feat ? '#FFFFFF' : 'rgba(237,28,36,0.07)', color: RED, border: feat ? 'none' : `1px solid rgba(237,28,36,0.3)` }}>
          {isSelected ? '✓ Selecionado' : 'Selecionar'}
        </div>
      </div>
    </motion.div>
  )
}

export default function PlanosSocio() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const router = useRouter()

  const [selectedPlano, setSelectedPlano] = useState<PlanoId>('individual')
  const [carteirinha, setCarteirinha] = useState<CarteirinhaOpcao>('virtual')

  function handleContinuar() {
    router.push(`/cadastro?plano=${selectedPlano}&carteirinha=${carteirinha}&step=2`)

  }

  return (
    <section
      className="w-full pt-3 pb-16 px-4 md:px-12"
      style={{ background: '#FFFFFF', backgroundImage: 'radial-gradient(circle, rgba(237,28,36,0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      ref={ref}
    >
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-12">
          
          <h2 className="uppercase font-bold" style={{ fontFamily: 'Oswald, sans-serif', fontSize: 48, color: RED, lineHeight: 1 }}>PLANOS DE SÓCIO</h2>
          <motion.div className="mx-auto mt-4" style={{ width: 48, height: 3, background: RED, transformOrigin: 'center' }}
            initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 0.6, delay: 0.2 }} />
          <p className="mt-4" style={{ fontSize: 14, color: 'rgba(237,28,36,0.6)', fontFamily: 'DM Sans, sans-serif' }}>
            Aproveite os benefícios exclusivos por menos de R$ 5,00 por mês
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5 items-stretch max-w-2xl mx-auto">
          {planos.map((plano, i) => (
            <PlanCard key={plano.id} plano={plano} index={i} inView={inView} selected={selectedPlano} onSelect={setSelectedPlano} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }} className="mt-5 flex flex-col items-center gap-3">
          <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>Tipo de carteirinha</p>
          <div className="flex gap-3">
            {([
              { id: 'virtual' as CarteirinhaOpcao, label: 'Virtual (Grátis)' },
              { id: 'fisica'  as CarteirinhaOpcao, label: 'Física (+R$16)'   },
            ]).map(opt => (
              <button key={opt.id} onClick={() => setCarteirinha(opt.id)}
                className="px-5 py-3 text-sm font-semibold flex items-center gap-2 transition-all"
                style={{ background: carteirinha === opt.id ? RED : 'rgba(237,28,36,0.04)', color: carteirinha === opt.id ? '#FFFFFF' : RED, border: `1px solid ${carteirinha === opt.id ? RED : 'rgba(237,28,36,0.25)'}`, fontFamily: 'DM Sans, sans-serif' }}>
                <CreditCard size={14} />{opt.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.65 }} className="flex justify-center mt-5">
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={handleContinuar}
            className="flex items-center gap-3 px-10 py-5 text-lg font-bold uppercase tracking-widest text-white"
            style={{ background: RED, fontFamily: 'Oswald, sans-serif', boxShadow: '0 8px 32px rgba(237,28,36,0.35)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C41219' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = RED }}>
            CONTINUAR →
          </motion.button>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.7 }}
          className="text-center mt-4"
          style={{ fontSize: 11, color: 'rgba(237,28,36,0.4)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.06em' }}>
          Planos anuais — pagamento único via Pix ou cartão de crédito
        </motion.p>
      </div>
    </section>
  )
}