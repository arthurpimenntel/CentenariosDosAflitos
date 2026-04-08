'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  textColor?: string
}

export default function CartButton({ textColor = '#FFFFFF' }: Props) {
  const { totalItems, openCart } = useCart()

  return (
    <button
      onClick={openCart}
      aria-label={`Carrinho — ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}`}
      className="relative p-2 transition hover:scale-110"
      style={{ color: textColor }}
    >
      <ShoppingCart size={22} />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
            style={{ background: '#FFFFFF', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}
          >
            {totalItems > 9 ? '9+' : totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
