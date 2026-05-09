'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'
import { MessageCircle, ShoppingBag, X } from 'lucide-react'
import { Produto } from '@/types'
import { getSupabaseClient } from '@/lib/supabase'

const WHATSAPP_NUMBER = '5581994752001'

export const SEED_PRODUTOS: Produto[] = [
  {
    id: 'seed-1',
    nome: 'Camisa Centenários 2026 — Titular',
    categoria: 'Camisas',
    descricao: 'A camisa oficial dos Centenários dos Aflitos para a temporada 2026. Listras verticais vermelho e branco, inspirada no uniforme histórico do Timbu. Tecido dry-fit premium.',
    preco: 149.90,
    imagem_url: '/torcida1.jpeg',
    imagens: ['/torcida1.jpeg', '/torcida2.jpeg'],
    tamanhos: ['P', 'M', 'G', 'GG', 'XG'],
    estoque: 30,
    estoque_por_tamanho: { P: 8, M: 10, G: 7, GG: 4, XG: 1 },
    destaque: true,
    ativo: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'seed-2',
    nome: 'Camisa Centenários 2026 — Goleiro',
    categoria: 'Camisas',
    descricao: 'Camisa do goleiro edição limitada. Fundo branco com detalhes em vermelho. Ideal para quem quer representar os Centenários com estilo diferenciado. Tecido dry-fit.',
    preco: 149.90,
    imagem_url: '/torcida2.jpeg',
    imagens: ['/torcida2.jpeg', '/torcida3.jpeg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: 15,
    estoque_por_tamanho: { P: 5, M: 6, G: 3, GG: 1 },
    destaque: false,
    ativo: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'seed-3',
    nome: 'Boné Centenários Snapback',
    categoria: 'Acessórios',
    descricao: 'Boné snapback oficial bordado com o escudo dos Centenários dos Aflitos. Aba plana, regulagem traseira. Edição exclusiva 2026. Tamanho único.',
    preco: 79.90,
    imagem_url: '/torcida3.jpeg',
    imagens: ['/torcida3.jpeg'],
    tamanhos: [],
    estoque: 20,
    estoque_por_tamanho: {},
    destaque: true,
    ativo: true,
    created_at: '',
    updated_at: '',
  },
]

interface CardProps {
  produto: Produto
  index: number
  isInView: boolean
  onExpand: (p: Produto) => void
}

function ProdutoCardHome({ produto, index, isInView, onExpand }: CardProps) {
  const [hovered, setHovered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const allImages = produto.imagens?.length > 0 ? produto.imagens : produto.imagem_url ? [produto.imagem_url] : []

  const handleMouseEnter = () => {
    setHovered(true)
    timerRef.current = setTimeout(() => onExpand(produto), 1800)
  }
  const handleMouseLeave = () => {
    setHovered(false)
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      whileHover={{ scale: 1.02, y: -6 }}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(237,28,36,0.04)',
        border: `1px solid ${hovered ? 'rgba(237,28,36,0.4)' : 'rgba(237,28,36,0.15)'}`,
        boxShadow: hovered ? '0 20px 48px rgba(237,28,36,0.12)' : 'none',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        zIndex: hovered ? 10 : 1,
      }}
    >
      <AnimatePresence>
        {hovered && (
          <motion.div className="absolute top-0 left-0 right-0 h-[3px] z-20" style={{ background: '#ED1C24' }}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }} transition={{ duration: 0.3 }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hovered && (
          <motion.div className="absolute top-0 left-0 h-[3px] z-20 opacity-40" style={{ background: '#ED1C24' }}
            initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.8, ease: 'linear' }} exit={{ opacity: 0 }} />
        )}
      </AnimatePresence>

      {/* Imagem */}
      <div className="w-full aspect-square relative overflow-hidden" style={{ background: 'rgba(237,28,36,0.04)' }}>
        {allImages.length > 0 ? (
          <Image src={allImages[0]} alt={produto.nome} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag size={36} style={{ color: 'rgba(237,28,36,0.2)' }} />
          </div>
        )}
        {produto.estoque === 0 && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.85)' }}>
            <span className="px-3 py-1 text-xs font-bold" style={{ background: 'rgba(237,28,36,0.15)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>ESGOTADO</span>
          </div>
        )}
        {produto.destaque && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-xs font-bold uppercase" style={{ background: '#ED1C24', color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }}>Destaque</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>{produto.categoria}</p>
        <h3 className="font-bold text-base leading-snug mb-3" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>{produto.nome}</h3>

        {/* Preço e botão sempre empilhados verticalmente */}
        <div className="flex flex-col gap-2 pt-3" style={{ borderTop: '1px solid rgba(237,28,36,0.1)' }}>
          <span className="text-xl font-bold" style={{ color: produto.estoque > 0 ? '#ED1C24' : 'rgba(237,28,36,0.3)', fontFamily: 'Oswald, sans-serif' }}>
            {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </span>
          {produto.estoque > 0 && (
            <button
              onClick={() => {
                const msg = encodeURIComponent(`Olá! Tenho interesse no produto *${produto.nome}* (${produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}) da loja dos Centenários dos Aflitos.`)
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank')
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold transition-all hover:scale-105 w-full"
              style={{ background: '#ED1C24', color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C41219' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#ED1C24' }}
            >
              <MessageCircle size={12} />
              Interesse
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function ExpandedProduto({ produto, onClose }: { produto: Produto; onClose: () => void }) {
  const allImages = produto.imagens?.length > 0 ? produto.imagens : produto.imagem_url ? [produto.imagem_url] : []

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', handleKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
        <motion.div className="absolute inset-0 backdrop-blur-sm" style={{ background: 'rgba(237,28,36,0.3)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
        <motion.div
          className="relative z-10 w-[90vw] max-w-4xl overflow-hidden"
          style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.2)', boxShadow: '0 32px 80px rgba(237,28,36,0.2)' }}
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.45, ease: [0.34, 1.1, 0.64, 1] }}
        >
          <motion.div className="h-[3px] w-full" style={{ background: '#ED1C24' }} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
          <div className="flex flex-col md:flex-row">
            <motion.div className="w-full md:w-2/3 aspect-square relative overflow-hidden" style={{ background: 'rgba(237,28,36,0.04)' }} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              {allImages.length > 0 ? (
                <Image src={allImages[0]} alt={produto.nome} fill className="object-cover" sizes="60vw" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ShoppingBag size={60} style={{ color: 'rgba(237,28,36,0.2)' }} />
                </div>
              )}
            </motion.div>
            <motion.div className="w-full md:w-1/3 p-8 flex flex-col justify-between" style={{ background: '#FFFFFF' }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
              <div>
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: 'rgba(237,28,36,0.6)', fontFamily: 'DM Sans, sans-serif' }}>{produto.categoria}</p>
                <h2 className="font-bold text-2xl uppercase leading-tight mb-4" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>{produto.nome}</h2>
                <div className="w-8 h-[3px] mb-6" style={{ background: '#ED1C24' }} />
                {produto.descricao && <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(237,28,36,0.75)', fontFamily: 'DM Sans, sans-serif' }}>{produto.descricao}</p>}
                <p className="font-bold text-3xl" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>{produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              </div>
              <div className="mt-8 flex flex-col gap-3">
                <Link href="/loja" className="w-full py-3 text-center font-bold text-sm tracking-widest uppercase text-white transition-all"
                  style={{ background: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C41219' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#ED1C24' }}>
                  VER NA LOJA
                </Link>
                <button onClick={onClose} className="w-full py-3 text-xs tracking-widest uppercase transition-all"
                  style={{ border: '1px solid rgba(237,28,36,0.2)', color: 'rgba(237,28,36,0.6)', fontFamily: 'DM Sans, sans-serif' }}>
                  CONTINUAR
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.button
          className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center transition-all"
          style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.2)' }}
          onClick={onClose}
          initial={{ opacity: 0, rotate: -90 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          aria-label="Fechar"
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#ED1C24'; (e.currentTarget as HTMLElement).style.color = '#FFFFFF' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#FFFFFF'; (e.currentTarget as HTMLElement).style.color = '#ED1C24' }}
        >
          <X size={18} style={{ color: 'inherit' }} />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  )
}

export default function FeaturedProducts() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [expandedProduto, setExpandedProduto] = useState<Produto | null>(null)

  const fetchProdutos = useCallback(async () => {
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('produtos').select('*').eq('ativo', true).eq('destaque', true)
        .order('created_at', { ascending: false }).limit(4)
      if (error) throw error
      setProdutos(data ?? [])
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProdutos() }, [fetchProdutos])

  useEffect(() => {
    const supabase = getSupabaseClient()
    const channel = supabase.channel('produtos_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'produtos' }, () => { fetchProdutos() })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [fetchProdutos])

  const displayProdutos = produtos.length > 0 ? produtos : SEED_PRODUTOS

  return (
    <section className="w-full py-24 px-4 md:px-12" style={{ backgroundColor: '#FFFFFF' }} ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] mb-3" style={{ color: 'rgba(237,28,36,0.6)', fontFamily: 'DM Sans, sans-serif' }}>Loja Oficial</p>
            <h2 className="text-4xl md:text-6xl font-bold uppercase leading-none" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>
              Vista as <span style={{ color: '#ED1C24', WebkitTextStroke: '1px rgba(237,28,36,0.3)' }}>Cores</span>
            </h2>
            <motion.div className="mt-4 h-[3px]" style={{ width: 48, background: '#ED1C24', transformOrigin: 'left' }}
              initial={{ scaleX: 0 }} animate={isInView ? { scaleX: 1 } : {}} transition={{ duration: 0.6, delay: 0.3 }} />
          </div>
          <Link href="/loja"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.03]"
            style={{ border: '1px solid rgba(237,28,36,0.3)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#ED1C24'; el.style.background = '#ED1C24'; el.style.color = '#FFFFFF' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'rgba(237,28,36,0.3)'; el.style.background = 'transparent'; el.style.color = '#ED1C24' }}
          >
            Ver todos os produtos →
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" style={{ isolation: 'isolate' }}>
          {displayProdutos.map((produto, i) => (
            <ProdutoCardHome key={produto.id} produto={produto} index={i} isInView={isInView} onExpand={setExpandedProduto} />
          ))}
        </div>
      </div>

      {expandedProduto && <ExpandedProduto produto={expandedProduto} onClose={() => setExpandedProduto(null)} />}
    </section>
  )
}