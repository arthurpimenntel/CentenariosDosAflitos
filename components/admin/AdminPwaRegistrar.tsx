'use client'

import { useEffect, useState } from 'react'
import { useAdminPath } from '@/hooks/useAdminPath'
import { Download, X } from 'lucide-react'

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  }
}

export default function AdminPwaRegistrar() {
  const adminPath = useAdminPath()
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(`${adminPath}/admin-sw.js`)
        .then((reg) => console.log('[CA-Admin PWA] SW registered — scope:', reg.scope))
        .catch((err) => console.warn('[CA-Admin PWA] SW registration failed:', err))
    }

    const handleBeforeInstall = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', () => setDismissed(true))
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [adminPath])

  if (!installPrompt || dismissed) return null

  async function handleInstall() {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setDismissed(true)
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '1rem',
      right: '1rem',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.875rem 1rem',
      borderRadius: 16,
      background: '#1a0000',
      border: '1px solid rgba(237,28,36,0.4)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      fontFamily: 'DM Sans, sans-serif',
    }}>
      {/* Ícone */}
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: '#ED1C24',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Download size={20} color="#fff" />
      </div>

      {/* Texto */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.3, margin: 0, whiteSpace: 'nowrap' }}>
          Instalar painel como app
        </p>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: 0, whiteSpace: 'nowrap' }}>
          Acesso rápido sem o navegador
        </p>
      </div>

      {/* Botão instalar */}
      <button
        onClick={handleInstall}
        style={{
          background: '#ED1C24',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '0.55rem 1.1rem',
          fontSize: '0.82rem',
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        Instalar
      </button>

      {/* Fechar */}
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.25rem',
          color: 'rgba(255,255,255,0.4)',
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
        }}
        aria-label="Fechar"
      >
        <X size={16} />
      </button>
    </div>
  )
}