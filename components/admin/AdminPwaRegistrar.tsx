'use client'

import { useEffect, useState } from 'react'
import { useAdminPath } from '@/hooks/useAdminPath'
import { Download, X } from 'lucide-react'

// Extend Window to include the beforeinstallprompt event
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  }
}

/**
 * Handles two jobs:
 * 1. Registers the Admin Service Worker (scoped to the secret admin path)
 * 2. Shows a tasteful "Install App" banner when the browser fires
 *    beforeinstallprompt (Chrome / Edge / Android).
 *
 * This component is only rendered inside app/admin/layout.tsx,
 * so the SW and install prompt NEVER appear on the public site.
 */
export default function AdminPwaRegistrar() {
  const adminPath = useAdminPath()
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // ── 1. Register service worker ──────────────────────────────
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register(`${adminPath}/admin-sw.js`)
        .then((reg) => {
          console.log('[CA-Admin PWA] SW registered — scope:', reg.scope)
        })
        .catch((err) => {
          console.warn('[CA-Admin PWA] SW registration failed:', err)
        })
    }

    // ── 2. Capture install prompt event ────────────────────────
    const handleBeforeInstall = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', () => setDismissed(true))

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [adminPath])

  if (!installPrompt || dismissed) return null

  async function handleInstall() {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setDismissed(true)
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.875rem 1.25rem',
        borderRadius: 14,
        background: '#1a0000',
        border: '1px solid rgba(237,28,36,0.4)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        maxWidth: 'calc(100vw - 2rem)',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: '#ED1C24',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Download size={18} color="#fff" />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: '#fff', fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.2, marginBottom: 2 }}>
          Instalar painel como app
        </p>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.72rem' }}>
          Acesso rápido sem abrir o navegador
        </p>
      </div>

      <button
        onClick={handleInstall}
        style={{
          background: '#ED1C24',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '0.5rem 1rem',
          fontSize: '0.8rem',
          fontWeight: 700,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        Instalar
      </button>

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
        }}
        aria-label="Fechar"
      >
        <X size={16} />
      </button>
    </div>
  )
}