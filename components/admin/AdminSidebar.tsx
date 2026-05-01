'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, FileText, ShoppingBag, Users,
  ImageIcon, Star, LogOut, Menu, X, ChevronRight,
  Home, BookOpen, Shield,
} from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'
import { useAdminPath } from '@/hooks/useAdminPath'

interface NavItem {
  href: string
  icon: React.ElementType
  label: string
  exact?: boolean
}

interface SidebarContentProps {
  navItems: NavItem[]
  userEmail: string
  pathname: string
  onClose: () => void
  onLogout: () => void
}

function SidebarContent({ navItems, userEmail, pathname, onClose, onLogout }: SidebarContentProps) {
  function isActive(href: string, exact = false) {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  return (
    <div className="flex flex-col h-full" style={{ background: '#ED1C24' }}>
      <div className="p-6 border-b border-red-100 border-opacity-20">
        <Link href={navItems[0].href} onClick={onClose}>
          <div className="flex items-center gap-3">
            {/* Logo no lugar do "CA" */}
            <div className="w-10 h-10 flex-shrink-0 relative">
              <Image
                src="/EscudoOficial.png"
                alt="Centenários dos Aflitos"
                fill
                className="object-contain drop-shadow-sm"
                sizes="40px"
              />
            </div>
            <div>
              <p className="font-bold text-sm leading-none" style={{ color: '#fff', fontFamily: 'Oswald, sans-serif' }}>
                CENTENÁRIOS
              </p>
              <p className="text-xs mt-0.5 opacity-80" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
                Painel Admin
              </p>
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                active ? 'bg-white/10 border border-white/20' : 'hover:bg-white/10'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <item.icon size={18} style={{ color: '#fff' }} />
              <span className="flex-1 text-sm font-medium" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
                {item.label}
              </span>
              {active && <ChevronRight size={14} style={{ color: '#fff' }} />}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/20">
        <p className="text-xs opacity-80 truncate mb-3 px-3" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
          {userEmail}
        </p>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-white/10"
        >
          <LogOut size={18} style={{ color: '#fff' }} />
          <span className="text-sm font-medium" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
            Sair
          </span>
        </button>
      </div>
    </div>
  )
}

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const adminBase = useAdminPath()
  const pathname = usePathname()
  const router = useRouter()
  const supabase = getSupabaseClient()

  const navItems: NavItem[] = [
    { href: adminBase,                        icon: LayoutDashboard, label: 'Dashboard',       exact: true },
    { href: `${adminBase}/noticias`,          icon: FileText,        label: 'Notícias'                     },
    { href: `${adminBase}/produtos`,          icon: ShoppingBag,     label: 'Produtos'                     },
    { href: `${adminBase}/socios`,            icon: Users,           label: 'Sócios'                       },
    { href: `${adminBase}/galeria`,           icon: ImageIcon,       label: 'Galeria'                      },
    { href: `${adminBase}/hero`,              icon: Star,            label: 'Hero / Carrossel'             },
    { href: `${adminBase}/home-fotos`,        icon: Home,            label: 'Fotos da Home'                },
    { href: `${adminBase}/quem-somos-fotos`,  icon: BookOpen,        label: 'Fotos Quem Somos'             },
    { href: `${adminBase}/auditoria`,         icon: Shield,          label: 'Auditoria'                    },
  ]

  useEffect(() => {
    navItems.forEach(item => router.prefetch(item.href))
  }, [adminBase]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    router.push(`${adminBase}/login`)
    router.refresh()
  }, [supabase, router, adminBase])

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg lg:hidden"
        style={{ background: '#ED1C24' }}
        aria-label="Abrir menu"
      >
        <Menu size={20} color="#fff" />
      </button>

      <aside className="fixed inset-y-0 left-0 w-64 hidden lg:block z-40 border-r" style={{ borderColor: 'rgba(237,28,36,0.15)' }}>
        <SidebarContent navItems={navItems} userEmail={userEmail} pathname={pathname} onClose={closeMobile} onLogout={handleLogout} />
      </aside>

      <div
        className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        style={{ opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? 'auto' : 'none', transition: 'opacity 0.25s ease' }}
        onClick={closeMobile}
        aria-hidden="true"
      />

      <aside
        className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden"
        style={{ transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.25s ease' }}
        aria-hidden={!mobileOpen}
      >
        <button onClick={closeMobile} className="absolute top-4 right-4 p-1 rounded-lg opacity-60 hover:opacity-100" aria-label="Fechar menu">
          <X size={20} color="#fff" />
        </button>
        <SidebarContent navItems={navItems} userEmail={userEmail} pathname={pathname} onClose={closeMobile} onLogout={handleLogout} />
      </aside>
    </>
  )
}