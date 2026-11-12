'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import CartButton from '@/components/CartButton'

const navLinks = [
  { label: 'Início', href: '/' },
  { label: 'Quem Somos', href: '/quem-somos' },
  { label: 'Galeria', href: '/galeria' },
  { label: 'Notícias', href: '/noticias' },
  { label: 'Loja', href: '/loja' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isHome = pathname === '/'
  const transparent = isHome && !scrolled
  const isRedBackground = !transparent && isHome
  const textColor = transparent || isRedBackground ? '#FFFFFF' : '#ED1C24'
  const textColorMuted = transparent || isRedBackground ? 'rgba(255,255,255,0.78)' : 'rgba(237,28,36,0.7)'

  return (
    <>
      <header>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
        style={{
          background: transparent ? 'rgba(0,0,0,0.35)' : isRedBackground ? '#ED1C24' : '#FFFFFF',
          borderBottom: transparent ? 'none' : isRedBackground ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(0,0,0,0.1)',
          boxShadow: transparent ? 'none' : isRedBackground ? '0 2px 24px rgba(0,0,0,0.25)' : '0 2px 24px rgba(0,0,0,0.1)',
          backdropFilter: transparent ? 'blur(4px)' : 'none',
        }}
        aria-label="Navegação principal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0" aria-label="Os Centenários dos Aflitos">
              <Image
                src="/EscudoOficial.png"
                alt="Escudo Os Centenários dos Aflitos"
                width={48}
                height={48}
                className="object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-sm md:w-[56px] md:h-[56px]"
              />
              <div className="flex flex-col leading-none">
                <span
                  className="font-ultras font-bold text-sm lg:text-base tracking-widest uppercase whitespace-nowrap"
                  style={{ color: textColor, letterSpacing: '0.12em', textShadow: transparent || isRedBackground ? '0 1px 4px rgba(0,0,0,0.3)' : 'none' }}
                >
                  OS CENTENÁRIOS
                </span>
                <span
                  className="font-ultras text-[10px] lg:text-xs tracking-[0.3em] uppercase"
                  style={{ color: transparent || isRedBackground ? 'rgba(255,255,255,0.72)' : 'rgba(237,28,36,0.7)', textShadow: transparent || isRedBackground ? '0 1px 4px rgba(0,0,0,0.3)' : 'none' }}
                >
                  DOS AFLITOS
                </span>
              </div>
            </Link>

            {/* Links desktop */}
            <div className="hidden md:flex items-center gap-3 lg:gap-6 xl:gap-7">
              {navLinks.map((link) => {
                const active = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-ultras text-xs lg:text-sm tracking-wider lg:tracking-widest uppercase relative group transition-colors duration-200 whitespace-nowrap"
                    style={{
                      color: active ? textColor : textColorMuted,
                      textShadow: transparent || isRedBackground ? '0 1px 4px rgba(0,0,0,0.2)' : 'none',
                    }}
                  >
                    {link.label}
                    <span
                      className="absolute -bottom-1 left-0 h-[2px] transition-all duration-300"
                      style={{ width: active ? '100%' : '0', opacity: active ? 1 : 0, background: textColor }}
                    />
                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-300 opacity-70" style={{ background: textColor }} />
                  </Link>
                )
              })}

              {/* CTA */}
              <Link
                href="/cadastro"
                className="ml-1 px-3 py-2 lg:px-5 lg:py-2.5 font-ultras text-xs lg:text-sm font-bold tracking-widest uppercase transition-all duration-200 hover:scale-105 whitespace-nowrap flex-shrink-0"
                style={{
                  background: '#FFFFFF',
                  color: '#ED1C24',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => {
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.90)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)'
                }}
                onMouseLeave={e => {
                  ;(e.currentTarget as HTMLElement).style.background = '#FFFFFF'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)'
                }}
              >
                SEJA SÓCIO
              </Link>
              <CartButton textColor={textColor} />
            </div>

            {/* Hamburger mobile */}
            <div className="md:hidden flex items-center gap-1">
              <CartButton textColor={textColor} />
              <button
                className="p-2 transition-colors rounded"
                style={{ color: textColor }}
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>
      </header>

      {/* Menu mobile — fullscreen */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.32, ease: 'easeInOut' }}
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-7"
            style={{ background: '#ED1C24' }}
          >
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'rgba(255,255,255,0.15)' }} />

            <Image src="/EscudoOficial.png" alt="Escudo" width={68} height={68} className="object-contain mb-2 opacity-90" />

            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-ultras text-2xl tracking-widest uppercase transition-all duration-200 hover:opacity-100"
                  style={{
                    color: pathname === link.href ? '#FFFFFF' : 'rgba(255,255,255,0.72)',
                    borderBottom: pathname === link.href ? '2px solid rgba(255,255,255,0.5)' : '2px solid transparent',
                    paddingBottom: '2px',
                  }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: navLinks.length * 0.06 }}
            >
              <Link
                href="/cadastro"
                onClick={() => setMenuOpen(false)}
                className="px-8 py-3 font-ultras text-lg font-bold tracking-widest uppercase transition-all hover:scale-105"
                style={{ background: '#FFFFFF', color: '#ED1C24', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
              >
                SEJA SÓCIO
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}