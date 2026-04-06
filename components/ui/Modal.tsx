'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  confirmLabel?: string
  onConfirm: () => void
  loading?: boolean
  danger?: boolean
}

export default function Modal({ open, onClose, title, description, confirmLabel = 'Confirmar', onConfirm, loading, danger }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative p-6 w-full max-w-sm bg-white"
            style={{ border: '1px solid #EEEEEE', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
          >
            {/* Red top accent */}
            <div className="absolute top-0 left-0 right-0 h-1" style={{ background: '#ED1C24' }} />

            {danger && (
              <div className="flex justify-center mb-4">
                <div className="p-3" style={{ background: 'rgba(239,68,68,0.08)' }}>
                  <AlertTriangle size={24} style={{ color: '#ef4444' }} />
                </div>
              </div>
            )}
            <h3 id="modal-title" className="text-lg font-bold text-center mb-2" style={{ color: '#111111', fontFamily: 'Oswald, sans-serif' }}>{title}</h3>
            {description && <p className="text-sm text-center mb-6" style={{ color: '#555555', fontFamily: 'DM Sans, sans-serif' }}>{description}</p>}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2.5 text-sm font-semibold transition-all"
                style={{ border: '1px solid #EEEEEE', color: '#555555', fontFamily: 'DM Sans, sans-serif', background: '#F7F7F7' }}
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 py-2.5 text-sm font-semibold disabled:opacity-60 text-white transition-all"
                style={{ background: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}
              >
                {loading ? <div className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
