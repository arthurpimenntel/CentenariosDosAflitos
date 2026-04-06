'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, FileText, ShoppingBag, Users, ImageIcon, Star, LogOut, Menu, X, ChevronRight } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/noticias', icon: FileText, label: 'Notícias' },
  { href: '/admin/produtos', icon: ShoppingBag, label: 'Produtos' },
  { href: '/admin/socios', icon: Users, label: 'Sócios' },
  { href: '/admin/galeria', icon: ImageIcon, label: 'Galeria' },
  { href: '/admin/hero', icon: Star, label: 'Hero / Carrossel' },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = getSupabaseClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full" style={{ background: '#1a0000' }}>
      <div className="p-6 border-b" style={{ borderColor: 'rgba(237,28,36,0.2)' }}>
        <Link href="/admin" onClick={() => setMobileOpen(false)}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>CA</div>
            <div>
              <p className="text-white font-bold text-sm leading-none" style={{ fontFamily: 'Oswald, sans-serif' }}>CENTENÁRIOS</p>
              <p className="text-xs mt-0.5 opacity-40" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>Painel Admin</p>
            </div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const active = isActive(item.href, item.exact)
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all" style={{ background: active ? 'rgba(237,28,36,0.15)' : 'transparent', border: active ? '1px solid rgba(237,28,36,0.3)' : '1px solid transparent' }} aria-current={active ? 'page' : undefined}>
              <item.icon size={18} style={{ color: active ? '#ED1C24' : 'rgba(255,255,255,0.4)' }} />
              <span className="flex-1 text-sm font-medium" style={{ color: active ? '#fff' : 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}>{item.label}</span>
              {active && <ChevronRight size={14} style={{ color: '#ED1C24' }} />}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t" style={{ borderColor: 'rgba(237,28,36,0.2)' }}>
        <p className="text-xs opacity-40 truncate mb-3 px-3" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>{userEmail}</p>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-red-900/20">
          <LogOut size={18} style={{ color: 'rgba(255,255,255,0.4)' }} />
          <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}>Sair</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="fixed top-4 left-4 z-50 p-2 rounded-lg lg:hidden" style={{ background: '#ED1C24' }} aria-label="Abrir menu">
        <Menu size={20} color="#fff" />
      </button>
      <aside className="fixed inset-y-0 left-0 w-64 hidden lg:block z-40 border-r" style={{ borderColor: 'rgba(237,28,36,0.15)' }}>
        <SidebarContent />
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'tween', duration: 0.25 }} className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden">
              <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100" aria-label="Fechar menu"><X size={20} color="#fff" /></button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
