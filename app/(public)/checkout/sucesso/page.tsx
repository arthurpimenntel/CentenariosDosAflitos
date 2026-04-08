'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CheckCircle, ShoppingBag, Home } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CheckoutSucesso() {
  const { clearCart } = useCart()

  useEffect(() => {
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
          <CheckCircle size={72} style={{ color: '#22c55e' }} />
          <h1 className="text-4xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>
            Pagamento Confirmado!
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(0,0,0,0.55)', fontFamily: 'DM Sans, sans-serif' }}>
            Seu pedido foi recebido com sucesso. Em breve você receberá a confirmação no e-mail informado. Obrigado pelo apoio aos Centenários!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link href="/loja" className="inline-flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-white text-sm" style={{ background: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>
              <ShoppingBag size={16} />
              Ver mais produtos
            </Link>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-sm transition-colors" style={{ border: '1px solid rgba(237,28,36,0.3)', color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>
              <Home size={16} />
              Início
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
