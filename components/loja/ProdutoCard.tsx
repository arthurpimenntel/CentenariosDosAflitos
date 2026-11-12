'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, ChevronLeft, ChevronRight, X, ShoppingCart, ChevronDown } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { Produto } from '@/types'

export default function ProdutoCard({ produto, index = 0 }: { produto: Produto; index?: number }) {
  const allImages = (() => {
    const imgs: string[] = []
    if (produto.imagens && produto.imagens.length > 0) imgs.push(...produto.imagens)
    else if (produto.imagem_url) imgs.push(produto.imagem_url)
    return imgs
  })()

  const [imgIdx, setImgIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [showSizes, setShowSizes] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { addItem } = useCart()

  useEffect(() => { setMounted(true) }, [])

  const tamanhos = produto.tamanhos ?? []
  const estoquePorTamanho = produto.estoque_por_tamanho ?? {}
  const hasTamanhos = tamanhos.length > 0
  const esgotado = (produto.estoque ?? 0) === 0
  const estoqueSelected = selectedSize
    ? (estoquePorTamanho[selectedSize] ?? 0)
    : (produto.estoque ?? 0)

  function prevImg(e: React.MouseEvent) {
    e.stopPropagation()
    setImgIdx(i => (i === 0 ? allImages.length - 1 : i - 1))
  }
  function nextImg(e: React.MouseEvent) {
    e.stopPropagation()
    setImgIdx(i => (i === allImages.length - 1 ? 0 : i + 1))
  }

  function handleAddToCart() {
    addItem(produto, selectedSize)
  }

  const canBuy = !esgotado && (!hasTamanhos || (selectedSize !== null && estoqueSelected > 0))

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ scale: 1.02, y: -6 }}
      whileTap={{ scale: 0.97 }}
      className="group h-full flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="overflow-hidden flex flex-col h-full transition-all duration-300"
        style={{
          background: 'rgba(237,28,36,0.04)',
          border: `1px solid ${hovered ? 'rgba(237,28,36,0.4)' : 'rgba(237,28,36,0.15)'}`,
          boxShadow: hovered ? '0 20px 48px rgba(237,28,36,0.12)' : 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Top accent bar */}
        <motion.div
          className="h-[3px] w-full"
          style={{ background: '#ED1C24', transformOrigin: 'left' }}
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Imagens */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', background: 'rgba(237,28,36,0.04)' }}>
          {allImages.length > 0 ? (
            <>
              <Image
                src={allImages[imgIdx]}
                alt={`${produto.nome} - foto ${imgIdx + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="Abrir imagem em visualização ampliada"
                className="absolute inset-0 z-10"
                style={{ background: 'transparent' }}
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(237,28,36,0.7)' }}
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft size={16} color="#fff" />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(237,28,36,0.7)' }}
                    aria-label="Próxima foto"
                  >
                    <ChevronRight size={16} color="#fff" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={e => { e.stopPropagation(); setImgIdx(i) }}
                        className="transition-all duration-300 rounded-full"
                        style={{
                          width: i === imgIdx ? 20 : 6,
                          height: 6,
                          background: i === imgIdx ? '#ED1C24' : 'rgba(255,255,255,0.7)',
                        }}
                        aria-label={`Foto ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <ShoppingBag size={48} style={{ color: 'rgba(237,28,36,0.15)' }} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {produto.destaque && (
              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider" style={{ background: '#ED1C24', color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }}>
                Destaque
              </span>
            )}
            {esgotado && (
              <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider" style={{ background: 'rgba(237,28,36,0.15)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                Esgotado
              </span>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col flex-1 p-5">
          <p className="text-xs mb-1 uppercase tracking-wider" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
            {produto.categoria}
          </p>
          <h3 className="font-bold text-lg leading-snug mb-2" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>
            {produto.nome}
          </h3>
          {produto.descricao && (
            <p className="text-sm line-clamp-2 mb-3" style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>
              {produto.descricao}
            </p>
          )}

          {/* Tamanhos — só aparecem quando o usuário clicar */}
          {hasTamanhos && !esgotado && (
            <div className="mb-4">
              <button
                onClick={() => setShowSizes(v => !v)}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-0 transition-colors"
                style={{ color: showSizes ? '#ED1C24' : 'rgba(237,28,36,0.55)', fontFamily: 'DM Sans, sans-serif' }}
              >
                {selectedSize ? `Tamanho: ${selectedSize}` : 'Selecionar tamanho'}
                <motion.span animate={{ rotate: showSizes ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} />
                </motion.span>
              </button>

              <AnimatePresence>
                {showSizes && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 pt-3">
                      {tamanhos.map(tam => {
                        const stockTam = estoquePorTamanho[tam] ?? produto.estoque
                        const esgotadoTam = stockTam === 0
                        const isSelected = selectedSize === tam
                        return (
                          <button
                            key={tam}
                            onClick={() => !esgotadoTam && setSelectedSize(isSelected ? null : tam)}
                            disabled={esgotadoTam}
                            title={esgotadoTam ? `${tam} — esgotado` : `${tam} — ${stockTam} disponíveis`}
                            className="h-9 px-2 min-w-[40px] text-xs font-bold transition-all duration-200 disabled:cursor-not-allowed leading-none"
                            style={{
                              background: isSelected ? '#ED1C24' : esgotadoTam ? 'rgba(237,28,36,0.04)' : '#FFFFFF',
                              color: isSelected ? '#FFFFFF' : esgotadoTam ? 'rgba(237,28,36,0.2)' : '#ED1C24',
                              border: `1px solid ${isSelected ? '#ED1C24' : esgotadoTam ? 'rgba(237,28,36,0.1)' : 'rgba(237,28,36,0.3)'}`,
                              fontFamily: 'DM Sans, sans-serif',
                              textDecoration: esgotadoTam ? 'line-through' : 'none',
                            }}
                          >
                            {tam}
                          </button>
                        )
                      })}
                    </div>
                    {selectedSize && estoqueSelected > 0 && (
                      <p className="text-xs mt-2" style={{ color: 'rgba(237,28,36,0.6)', fontFamily: 'DM Sans, sans-serif' }}>
                        {estoqueSelected} disponíveis nesse tamanho
                      </p>
                    )}
                    {selectedSize && estoqueSelected === 0 && (
                      <p className="text-xs mt-2" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                        Tamanho esgotado
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Preço + botão */}
          <div className="mt-auto flex flex-col gap-4 pt-5" style={{ borderTop: '1px solid rgba(237,28,36,0.1)' }}>
            <span
              className="text-2xl font-bold"
              style={{ color: esgotado ? 'rgba(237,28,36,0.3)' : '#ED1C24', fontFamily: 'Oswald, sans-serif' }}
            >
              {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>

            {canBuy ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white"
                style={{
                  background: '#ED1C24',
                  fontFamily: 'DM Sans, sans-serif',
                  boxShadow: '0 4px 16px rgba(237,28,36,0.3)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C41219' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#ED1C24' }}
              >
                <ShoppingCart size={14} />
                Adicionar ao Carrinho
              </motion.button>
            ) : hasTamanhos && !esgotado ? (
              <button
                onClick={() => setShowSizes(true)}
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold transition-all"
                style={{
                  border: '1px solid rgba(237,28,36,0.3)',
                  color: '#ED1C24',
                  fontFamily: 'DM Sans, sans-serif',
                  background: 'rgba(237,28,36,0.03)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(237,28,36,0.06)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(237,28,36,0.03)' }}
              >
                Selecione o tamanho
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {mounted && lightboxOpen && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(240,240,240,0.97)] p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[calc(100vh-2rem)] overflow-hidden rounded-3xl bg-white border border-[rgba(237,28,36,0.15)] shadow-[0_8px_40px_rgba(0,0,0,0.15)]"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-4 top-4 z-20 p-3 rounded-full bg-red-primary text-white transition hover:bg-red-hover"
              aria-label="Fechar visualização"
            >
              <X size={18} />
            </button>

            <div className="relative h-[70vh] sm:h-[75vh]">
              <Image
                src={allImages[imgIdx]}
                alt={`${produto.nome} imagem ampliada ${imgIdx + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImg}
                  className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-red-primary p-3 text-white transition hover:bg-red-hover"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={nextImg}
                  className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-red-primary p-3 text-white transition hover:bg-red-hover"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={e => { e.stopPropagation(); setImgIdx(i) }}
                  className="h-2.5 rounded-full transition-all"
                  style={{
                    width: i === imgIdx ? 32 : 12,
                    background: i === imgIdx ? '#ED1C24' : 'rgba(237,28,36,0.25)',
                  }}
                  aria-label={`Ver imagem ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </motion.div>
  )
}