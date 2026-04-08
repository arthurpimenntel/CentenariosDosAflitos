'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Produto } from '@/types'

export interface CartItem {
  produto: Produto
  tamanho: string | null
  quantidade: number
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (produto: Produto, tamanho: string | null, quantidade?: number) => void
  removeItem: (produtoId: string, tamanho: string | null) => void
  updateQuantity: (produtoId: string, tamanho: string | null, quantidade: number) => void
  clearCart: () => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = 'centenarios_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch {}
  }, [])

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {}
  }, [items])

  const addItem = useCallback((produto: Produto, tamanho: string | null, quantidade = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.produto.id === produto.id && i.tamanho === tamanho)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], quantidade: updated[idx].quantidade + quantidade }
        return updated
      }
      return [...prev, { produto, tamanho, quantidade }]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((produtoId: string, tamanho: string | null) => {
    setItems(prev => prev.filter(i => !(i.produto.id === produtoId && i.tamanho === tamanho)))
  }, [])

  const updateQuantity = useCallback((produtoId: string, tamanho: string | null, quantidade: number) => {
    if (quantidade <= 0) {
      setItems(prev => prev.filter(i => !(i.produto.id === produtoId && i.tamanho === tamanho)))
    } else {
      setItems(prev => prev.map(i =>
        i.produto.id === produtoId && i.tamanho === tamanho ? { ...i, quantidade } : i
      ))
    }
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantidade, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.produto.preco * i.quantidade, 0)

  return (
    <CartContext.Provider value={{
      items, totalItems, totalPrice,
      addItem, removeItem, updateQuantity, clearCart,
      isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
