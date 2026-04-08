'use client'

import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag, CreditCard, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CheckoutPage() {
  const { items, totalPrice, totalItems } = useCart()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handlePagar() {
    if (!nome.trim() || !email.trim()) {
      setErro('Preencha seu nome e e-mail para continuar.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErro('Digite um e-mail válido.')
      return
    }
    setErro('')
    setLoading(true)

    try {
      const body = {
        items: items.map(i => ({
          produtoId: i.produto.id,
          nome: i.produto.nome,
          quantidade: i.quantidade,
          preco: i.produto.preco,
          tamanho: i.tamanho,
          imagemUrl: i.produto.imagens?.[0] ?? i.produto.imagem_url ?? null,
        })),
        compradorNome: nome,
        compradorEmail: email,
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok || !data.initPoint) {
        setErro(data.error ?? 'Erro ao iniciar pagamento. Tente novamente.')
        setLoading(false)
        return
      }

      // Redireciona para o Checkout Pro do Mercado Pago
      window.location.href = data.initPoint
    } catch {
      setErro('Erro de conexão. Verifique sua internet e tente novamente.')
      setLoading(false)
    }
  }

  return (
    <main style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-32 pb-16">

        {/* Header */}
        <div className="mb-10">
          <Link href="/loja" className="inline-flex items-center gap-2 text-sm mb-4 transition-colors hover:opacity-80" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
            <ArrowLeft size={16} />
            Voltar à Loja
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>
            Finalizar Compra
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <ShoppingBag size={64} style={{ color: 'rgba(237,28,36,0.15)' }} />
            <p className="text-xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: 'rgba(237,28,36,0.4)' }}>
              Seu carrinho está vazio
            </p>
            <Link href="/loja" className="mt-2 px-6 py-3 font-bold uppercase tracking-widest text-white text-sm" style={{ background: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>
              Ver Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Formulário */}
            <div className="lg:col-span-3 space-y-6">
              <div className="p-6" style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.12)' }}>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-5" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>
                  Seus Dados
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={e => setNome(e.target.value)}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3 text-sm outline-none transition-all"
                      style={{
                        border: '1px solid rgba(237,28,36,0.2)',
                        fontFamily: 'DM Sans, sans-serif',
                        color: '#111',
                        background: '#FAFAFA',
                      }}
                      onFocus={e => { (e.target as HTMLElement).style.borderColor = '#ED1C24' }}
                      onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(237,28,36,0.2)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(0,0,0,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
                      E-mail *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 text-sm outline-none transition-all"
                      style={{
                        border: '1px solid rgba(237,28,36,0.2)',
                        fontFamily: 'DM Sans, sans-serif',
                        color: '#111',
                        background: '#FAFAFA',
                      }}
                      onFocus={e => { (e.target as HTMLElement).style.borderColor = '#ED1C24' }}
                      onBlur={e => { (e.target as HTMLElement).style.borderColor = 'rgba(237,28,36,0.2)' }}
                    />
                    <p className="text-xs mt-1.5" style={{ color: 'rgba(0,0,0,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
                      O Mercado Pago enviará a confirmação para este e-mail.
                    </p>
                  </div>
                </div>
              </div>

              {/* Aviso segurança */}
              <div className="flex items-start gap-3 px-4 py-3" style={{ background: 'rgba(237,28,36,0.04)', border: '1px solid rgba(237,28,36,0.12)' }}>
                <ShieldCheck size={18} style={{ color: '#ED1C24', flexShrink: 0, marginTop: 2 }} />
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(0,0,0,0.55)', fontFamily: 'DM Sans, sans-serif' }}>
                  Pagamento processado com segurança pelo <strong>Mercado Pago</strong>. Aceitamos Pix, cartão de crédito, débito e boleto bancário. Seus dados são protegidos com criptografia SSL.
                </p>
              </div>

              {erro && (
                <p className="text-sm px-4 py-3 font-semibold" style={{ background: 'rgba(237,28,36,0.08)', color: '#ED1C24', border: '1px solid rgba(237,28,36,0.2)', fontFamily: 'DM Sans, sans-serif' }}>
                  {erro}
                </p>
              )}

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                onClick={handlePagar}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 font-bold text-base uppercase tracking-widest text-white transition-opacity"
                style={{
                  background: loading ? 'rgba(237,28,36,0.6)' : '#ED1C24',
                  fontFamily: 'Oswald, sans-serif',
                  boxShadow: loading ? 'none' : '0 4px 24px rgba(237,28,36,0.35)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Redirecionando para pagamento...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pagar com Mercado Pago
                  </>
                )}
              </motion.button>

              {/* Logo MP */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(0,0,0,0.3)', fontFamily: 'DM Sans, sans-serif' }}>
                  Pagamento seguro por
                </p>
                <svg width="100" height="18" viewBox="0 0 220 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text x="0" y="30" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="24" fill="#009EE3">Mercado</text>
                  <text x="110" y="30" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="24" fill="#009EE3">Pago</text>
                </svg>
              </div>
            </div>

            {/* Resumo do pedido */}
            <div className="lg:col-span-2">
              <div className="p-6 sticky top-24" style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.12)' }}>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-5 pb-4" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24', borderBottom: '1px solid rgba(237,28,36,0.1)' }}>
                  Resumo ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
                </h2>

                <ul className="space-y-4 mb-6">
                  {items.map(item => {
                    const img = item.produto.imagens?.[0] ?? item.produto.imagem_url
                    const key = `${item.produto.id}-${item.tamanho}`
                    return (
                      <li key={key} className="flex gap-3">
                        <div className="relative w-14 h-14 flex-shrink-0 overflow-hidden" style={{ background: 'rgba(237,28,36,0.06)', borderRadius: 4 }}>
                          {img && <Image src={img} alt={item.produto.nome} fill className="object-cover" sizes="56px" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-snug truncate" style={{ color: '#111', fontFamily: 'DM Sans, sans-serif' }}>
                            {item.produto.nome}
                          </p>
                          {item.tamanho && (
                            <p className="text-xs" style={{ color: 'rgba(0,0,0,0.45)', fontFamily: 'DM Sans, sans-serif' }}>Tam. {item.tamanho}</p>
                          )}
                          <p className="text-xs" style={{ color: 'rgba(0,0,0,0.45)', fontFamily: 'DM Sans, sans-serif' }}>Qtd: {item.quantidade}</p>
                        </div>
                        <p className="text-sm font-bold flex-shrink-0" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>
                          {(item.produto.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </li>
                    )
                  })}
                </ul>

                <div className="pt-4 flex justify-between items-center" style={{ borderTop: '1px solid rgba(237,28,36,0.1)' }}>
                  <span className="font-semibold uppercase tracking-wider text-sm" style={{ color: 'rgba(0,0,0,0.55)', fontFamily: 'DM Sans, sans-serif' }}>Total</span>
                  <span className="text-2xl font-bold" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>
                    {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
