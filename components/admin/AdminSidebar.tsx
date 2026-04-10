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
    <div className="flex flex-col h-full" style={{ background: '#ED1C24' }}>
      <div className="p-6 border-b border-red-100 border-opacity-20">
        <Link href="/admin" onClick={() => setMobileOpen(false)}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: '#fff2', fontFamily: 'Oswald, sans-serif' }}>CA</div>
            <div>
              <p className="font-bold text-sm leading-none" style={{ color: '#fff', fontFamily: 'Oswald, sans-serif' }}>CENTENÁRIOS</p>
              <p className="text-xs mt-0.5 opacity-80" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>Painel Admin</p>
            </div>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const active = isActive(item.href, item.exact)
          return (
            <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${active ? 'bg-white/10 border border-white/20' : 'hover:bg-white/10'}`} aria-current={active ? 'page' : undefined}>
              <item.icon size={18} style={{ color: '#fff' }} />
              <span className="flex-1 text-sm font-medium" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>{item.label}</span>
              {active && <ChevronRight size={14} style={{ color: '#fff' }} />}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-white/20">
        <p className="text-xs opacity-80 truncate mb-3 px-3" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>{userEmail}</p>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-white/10">
          <LogOut size={18} style={{ color: '#fff' }} />
          <span className="text-sm font-medium" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>Sair</span>
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
