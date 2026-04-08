import { CartProvider } from '@/contexts/CartContext'
import CartDrawer from '@/components/CartDrawer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  )
}
