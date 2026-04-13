'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle, CreditCard } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'


const WHATSAPP_NUMBER = '5581989887060' 

export default function CartDrawer() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, isOpen, closeCart } = useCart()

  // Bloquear scroll ao abrir
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function buildWhatsAppURL() {
    const linhas = items.map(item => {
      const tamanho = item.tamanho ? ` (${item.tamanho})` : ''
      const subtotal = (item.produto.preco * item.quantidade).toLocaleString('pt-BR', {
        style: 'currency', currency: 'BRL',
      })
      return `• ${item.produto.nome}${tamanho} — ${item.quantidade}x — ${subtotal}`
    })

    const total = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    const mensagem = [
      'Olá! Gostaria de fazer um pedido nos Centenários dos Aflitos:',
      '',
      ...linhas,
      '',
      `*Total: ${total}*`,
      '',
      'Por favor, me informe como prosseguir com o pagamento. Obrigado!',
    ].join('\n')

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`
  }

  function handleWhatsApp() {
    closeCart()
    window.open(buildWhatsAppURL(), '_blank')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/60"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.32, ease: 'easeInOut' }}
            className="fixed right-0 top-0 bottom-0 z-[201] flex flex-col w-full max-w-md shadow-2xl"
            style={{ background: '#FFFFFF' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(237,28,36,0.12)', background: '#ED1C24' }}>
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} color="#FFF" />
                <h2 className="font-bold text-lg uppercase tracking-widest text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  Carrinho
                </h2>
                {totalItems > 0 && (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-red-600 bg-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {totalItems}
                  </span>
                )}
              </div>
              <button onClick={closeCart} className="p-2 rounded-full transition hover:bg-white/20" aria-label="Fechar carrinho">
                <X size={20} color="#FFF" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
                  <ShoppingBag size={56} style={{ color: 'rgba(237,28,36,0.18)' }} />
                  <p className="text-base font-semibold uppercase tracking-widest text-center" style={{ color: 'rgba(237,28,36,0.4)', fontFamily: 'Oswald, sans-serif' }}>
                    Seu carrinho está vazio
                  </p>
                  <p className="text-sm text-center" style={{ color: 'rgba(0,0,0,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
                    Adicione produtos da loja para começar
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => {
                    const key = `${item.produto.id}-${item.tamanho}`
                    const img = item.produto.imagens?.[0] ?? item.produto.imagem_url
                    return (
                      <li key={key} className="flex gap-4 py-4" style={{ borderBottom: '1px solid rgba(237,28,36,0.08)' }}>
                        {/* Thumb */}
                        <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded" style={{ background: 'rgba(237,28,36,0.06)' }}>
                          {img ? (
                            <Image src={img} alt={item.produto.nome} fill className="object-cover" sizes="80px" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ShoppingBag size={24} style={{ color: 'rgba(237,28,36,0.2)' }} />
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm leading-snug truncate" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>
                            {item.produto.nome}
                          </p>
                          {item.tamanho && (
                            <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
                              Tamanho: <strong>{item.tamanho}</strong>
                            </p>
                          )}
                          <p className="text-sm font-semibold mt-1" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                            {item.produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>

                          {/* Quantity + Remove */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center" style={{ border: '1px solid rgba(237,28,36,0.25)', borderRadius: 4 }}>
                              <button
                                onClick={() => updateQuantity(item.produto.id, item.tamanho, item.quantidade - 1)}
                                className="px-2 py-1 transition hover:bg-red-50"
                                aria-label="Diminuir quantidade"
                              >
                                <Minus size={12} style={{ color: '#ED1C24' }} />
                              </button>
                              <span className="px-3 text-sm font-semibold" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                                {item.quantidade}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.produto.id, item.tamanho, item.quantidade + 1)}
                                className="px-2 py-1 transition hover:bg-red-50"
                                aria-label="Aumentar quantidade"
                              >
                                <Plus size={12} style={{ color: '#ED1C24' }} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.produto.id, item.tamanho)}
                              className="p-1.5 rounded transition hover:bg-red-50"
                              aria-label="Remover item"
                            >
                              <Trash2 size={14} style={{ color: 'rgba(237,28,36,0.5)' }} />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-bold" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>
                            {(item.produto.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5" style={{ borderTop: '1px solid rgba(237,28,36,0.12)' }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-base font-semibold uppercase tracking-wider" style={{ color: 'rgba(0,0,0,0.6)', fontFamily: 'DM Sans, sans-serif' }}>Total</span>
                  <span className="text-2xl font-bold" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>
                    {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>

                {/* Botão WhatsApp — fluxo atual */}
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-4 font-bold text-base uppercase tracking-widest text-white transition hover:opacity-90 active:scale-95"
                  style={{ background: '#25D366', fontFamily: 'Oswald, sans-serif', boxShadow: '0 4px 20px rgba(37,211,102,0.35)', borderRadius: 4 }}
                >
                  <MessageCircle size={18} />
                  Finalizar pelo WhatsApp
                </button>

                {/* Aviso Mercado Pago — desativado temporariamente */}
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-2 py-3 mt-2 font-semibold text-sm uppercase tracking-widest opacity-30 cursor-not-allowed"
                  style={{
                    background: 'transparent',
                    color: '#ED1C24',
                    border: '1px solid rgba(237,28,36,0.25)',
                    fontFamily: 'DM Sans, sans-serif',
                    borderRadius: 4,
                  }}
                >
                  <CreditCard size={14} />
                  Pagamento online — em breve
                </button>

                <p className="text-xs text-center mt-3" style={{ color: 'rgba(0,0,0,0.35)', fontFamily: 'DM Sans, sans-serif' }}>
                  Você será redirecionado ao WhatsApp com seu pedido pronto
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}