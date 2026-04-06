'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { ToastMessage } from '@/types'

interface Props {
  toasts: ToastMessage[]
  onRemove: (id: string) => void
}

const icons = { success: CheckCircle, error: XCircle, info: Info }
const colors = { success: '#22c55e', error: '#ef4444', info: '#3b82f6' }
const bgColors = { success: '#f0fdf4', error: '#fef2f2', info: '#eff6ff' }
const borderColors = { success: 'rgba(34,197,94,0.2)', error: 'rgba(239,68,68,0.2)', info: 'rgba(59,130,246,0.2)' }

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  const Icon = icons[toast.type]
  const color = colors[toast.type]

  useEffect(() => {
    const t = setTimeout(() => onRemove(toast.id), 4000)
    return () => clearTimeout(t)
  }, [toast.id, onRemove])

  return (
    <motion.div
      initial={{ opacity: 0, x: 60, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.95 }}
      className="flex items-center gap-3 px-4 py-3 max-w-sm"
      style={{
        background: bgColors[toast.type],
        border: `1px solid ${borderColors[toast.type]}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
      role="alert"
    >
      <Icon size={18} style={{ color, flexShrink: 0 }} />
      <p className="flex-1 text-sm" style={{ color: '#111111', fontFamily: 'DM Sans, sans-serif' }}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="opacity-40 hover:opacity-80 transition-opacity"
        aria-label="Fechar notificação"
        style={{ color: '#111111' }}
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export default function Toast({ toasts, onRemove }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3" aria-live="polite">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  )
}
