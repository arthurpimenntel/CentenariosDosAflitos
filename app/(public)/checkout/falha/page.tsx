'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { XCircle, RotateCcw, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CheckoutFalha() {
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
          <XCircle size={72} style={{ color: '#ef4444' }} />
          <h1 className="text-4xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>
            Pagamento não realizado
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'rgba(0,0,0,0.55)', fontFamily: 'DM Sans, sans-serif' }}>
            Houve um problema ao processar seu pagamento. Isso pode ter ocorrido por saldo insuficiente, dados incorretos ou recusa do banco. Seus itens ainda estão no carrinho — tente novamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Link href="/checkout" className="inline-flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-white text-sm" style={{ background: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>
              <RotateCcw size={16} />
              Tentar novamente
            </Link>
            <a
              href="https://wa.me/5581989887060"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-sm"
              style={{ border: '1px solid rgba(237,28,36,0.3)', color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}
            >
              <MessageCircle size={16} />
              Falar no WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
