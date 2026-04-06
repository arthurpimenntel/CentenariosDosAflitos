'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { Upload, X, ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface Props {
  currentUrl: string
  onUpload: (file: File) => Promise<void>
  onRemove?: () => void
  label?: string
  accept?: string
  loading?: boolean
}

export default function AdminImageUpload({ currentUrl, onUpload, onRemove, label = 'Imagem', accept = 'image/*', loading = false }: Props) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    await onUpload(file)
  }

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) await handleFile(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif' }}>{label}</label>
      {currentUrl ? (
        <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid rgba(237,28,36,0.3)' }}>
          <div className="relative h-48 w-full">
            <Image src={currentUrl} alt="Preview" fill className="object-cover" sizes="400px" />
          </div>
          {onRemove && (
            <button type="button" onClick={onRemove} className="absolute top-2 right-2 p-1.5 rounded-full" style={{ background: '#ED1C24' }} aria-label="Remover imagem">
              <X size={14} color="#fff" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 h-48 rounded-xl cursor-pointer transition-all"
          style={{ border: `2px dashed ${dragging ? '#ED1C24' : 'rgba(237,28,36,0.3)'}`, background: dragging ? 'rgba(237,28,36,0.05)' : 'rgba(255,255,255,0.02)' }}
          role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter') inputRef.current?.click() }}
        >
          {loading ? (
            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(237,28,36,0.2)', borderTopColor: '#ED1C24' }} />
          ) : (
            <>
              <div className="p-3 rounded-full" style={{ background: 'rgba(237,28,36,0.1)' }}>
                {dragging ? <Upload size={24} style={{ color: '#ED1C24' }} /> : <ImageIcon size={24} style={{ color: 'rgba(255,255,255,0.3)' }} />}
              </div>
              <p className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
                {dragging ? 'Solte aqui' : 'Clique ou arraste uma imagem'}
              </p>
            </>
          )}
        </div>
      )}
      <input ref={inputRef} type="file" accept={accept} onChange={handleChange} className="hidden" />
    </div>
  )
}
