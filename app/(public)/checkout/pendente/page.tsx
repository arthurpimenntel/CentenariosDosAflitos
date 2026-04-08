'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Clock, Home, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CheckoutPendente() {
  const { clearCart } = useCart()

  useEffect(() => {
    // Pagamento pendente (boleto/pix) — limpa o carrinho também
    clearCart()
  }, [clearCart])

  return (
    <main style={{ background: '#FAFAFA', minHeight: '100vh' }}>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center gap-6 max-w-md"
        >
          <Clock size={72} style={{ color: '#f59e0b' }} />
          <h1 className="text-4xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>
            Pagamento Pendente
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(0,0,0,0.55)', fontFamily: 'DM Sans, sans-serif' }}>
            Seu pedido foi recebido e está aguardando a confirmação do pagamento. Se você pagou via boleto ou Pix, a confirmação pode levar até 1 dia útil. Você receberá um e-mail quando o pagamento for aprovado.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-white text-sm" style={{ background: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>
              <Home size={16} />
              Voltar ao início
            </Link>
            <a
              href="https://wa.me/5581989887060"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-sm"
              style={{ border: '1px solid rgba(237,28,36,0.3)', color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}
            >
              <MessageCircle size={16} />
              Dúvidas? WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
