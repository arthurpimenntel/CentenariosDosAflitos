'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, Trash2, ChevronUp, ChevronDown, ImageIcon } from 'lucide-react'
import { uploadImageAdmin } from '@/lib/upload-client'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/ui/Toast'

export interface FotoSimples {
  id: string
  imagem_url: string
  alt: string | null
  ordem: number
  ativo: boolean
  created_at: string
}

interface Props {
  fotos: FotoSimples[]
  tabela: 'home_fotos' | 'quem_somos_fotos'
  titulo: string
  heroUrl?: string
}

function apiPath(tabela: Props['tabela']) {
  return tabela === 'home_fotos'
    ? '/api/admin/home-fotos'
    : '/api/admin/quem-somos-fotos'
}

export default function FotosAdminClient({ fotos: initialFotos, tabela, titulo, heroUrl: initialHeroUrl }: Props) {
  const [fotos, setFotos] = useState(initialFotos)
  const [uploading, setUploading] = useState(false)
  const [uploadingHero, setUploadingHero] = useState(false)
  const [heroUrl, setHeroUrl] = useState(initialHeroUrl ?? null)
  const [deleteTarget, setDeleteTarget] = useState<FotoSimples | null>(null)
  const { toasts, addToast, removeToast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const heroInputRef = useRef<HTMLInputElement>(null)
  const temHero = tabela === 'quem_somos_fotos'
  const api = apiPath(tabela)

  // ─── Upload de fotos do mosaico ─────────────────────────────────────────────
  async function handleFiles(files: FileList) {
    setUploading(true)
    let ok = 0
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      try {
        const url = await uploadImageAdmin(file, 'galeria')
        const nextOrdem = fotos.length > 0 ? Math.max(...fotos.map(f => f.ordem)) + 1 : 0
        const res = await fetch(api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imagem_url: url, ordem: nextOrdem }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Erro ao salvar foto' }))
          throw new Error(err.error ?? 'Erro ao salvar foto')
        }
        const data: FotoSimples = await res.json()
        setFotos(prev => [...prev, data])
        ok++
      } catch (e) {
        addToast('error', `Erro ao enviar ${file.name}: ${e instanceof Error ? e.message : ''}`)
      }
    }
    if (ok > 0) addToast('success', `${ok} foto(s) adicionada(s)!`)
    setUploading(false)
  }

  // ─── Upload do hero ───────────────────────────────────────────────────────────
  async function handleHeroFile(file: File) {
    if (!file.type.startsWith('image/')) return
    setUploadingHero(true)
    try {
      const url = await uploadImageAdmin(file, 'galeria')
      const res = await fetch(api, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagem_url: url }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Erro ao salvar hero' }))
        throw new Error(err.error ?? 'Erro ao salvar hero')
      }
      setHeroUrl(url)
      addToast('success', 'Foto do hero atualizada!')
    } catch (e) {
      addToast('error', `Erro ao atualizar hero: ${e instanceof Error ? e.message : ''}`)
    } finally {
      setUploadingHero(false)
    }
  }

  // ─── Excluir foto ────────────────────────────────────────────────────────────
  async function handleDelete(foto: FotoSimples) {
    const res = await fetch(api, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: foto.id }),
    })
    if (!res.ok) { addToast('error', 'Erro ao excluir.'); return }
    setFotos(prev => prev.filter(f => f.id !== foto.id))
    addToast('success', 'Foto excluída.')
    setDeleteTarget(null)
  }

  // ─── Reordenar ───────────────────────────────────────────────────────────────
  async function move(foto: FotoSimples, dir: 'up' | 'down') {
    const idx = fotos.findIndex(f => f.id === foto.id)
    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= fotos.length) return
    const next = [...fotos]
    const tempOrdem = next[idx].ordem
    next[idx] = { ...next[idx], ordem: next[swapIdx].ordem }
    next[swapIdx] = { ...next[swapIdx], ordem: tempOrdem }
    ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
    setFotos(next)
    await Promise.all([
      fetch(api, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: next[idx].id, ordem: next[idx].ordem }) }),
      fetch(api, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: next[swapIdx].id, ordem: next[swapIdx].ordem }) }),
    ])
  }

  // ─── Editar legenda ──────────────────────────────────────────────────────────
  async function updateAlt(foto: FotoSimples, alt: string) {
    setFotos(prev => prev.map(f => f.id === foto.id ? { ...f, alt } : f))
  }

  async function saveAlt(foto: FotoSimples) {
    await fetch(api, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: foto.id, alt: foto.alt }),
    })
  }

  return (
    <>
      <div className="space-y-8">

        {/* ── Hero (só Quem Somos) ─────────────────────────────────────────── */}
        {temHero && (
          <div className="rounded-xl p-5 space-y-4" style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.15)', boxShadow: '0 2px 12px rgba(237,28,36,0.06)' }}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-sm font-bold" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>FOTO DO HERO</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)', fontFamily: 'DM Sans, sans-serif' }}>Imagem de fundo da seção principal da página Quem Somos</p>
              </div>
              <button
                onClick={() => heroInputRef.current?.click()}
                disabled={uploadingHero}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60 transition-all hover:scale-[1.02]"
                style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}
              >
                {uploadingHero
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <ImageIcon size={15} />}
                {uploadingHero ? 'Enviando...' : 'Trocar foto'}
              </button>
              <input ref={heroInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files?.[0] && handleHeroFile(e.target.files[0])} />
            </div>
            {heroUrl && (
              <div className="relative w-full h-40 rounded-xl overflow-hidden" style={{ background: 'rgba(237,28,36,0.05)' }}>
                <Image src={heroUrl} alt="Hero atual" fill className="object-cover object-center" sizes="600px" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(212,0,0,0.4) 0%, transparent 60%)' }} />
                <span className="absolute bottom-3 left-3 text-xs font-semibold uppercase tracking-widest text-white" style={{ fontFamily: 'DM Sans, sans-serif', opacity: 0.8 }}>
                  Foto atual
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Mosaico ──────────────────────────────────────────────────────── */}
        <div className="rounded-xl p-5 space-y-5" style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.15)', boxShadow: '0 2px 12px rgba(237,28,36,0.06)' }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="text-sm font-bold" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>MOSAICO — {titulo.toUpperCase()}</p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(0,0,0,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
                {fotos.length} foto(s) · A 1ª ocupa o espaço duplo (destaque)
              </p>
            </div>
            <button
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60 transition-all hover:scale-[1.02]"
              style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}
            >
              {uploading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Upload size={15} />}
              {uploading ? 'Enviando...' : 'Adicionar Fotos'}
            </button>
            <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
              onChange={e => e.target.files && handleFiles(e.target.files)} />
          </div>

          {fotos.length === 0 ? (
            <div className="text-center py-12 opacity-40" style={{ color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>
              Nenhuma foto adicionada ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {fotos.map((foto, i) => (
                <div key={foto.id} className="p-3 rounded-xl"
                  style={{ background: i === 0 ? 'rgba(237,28,36,0.03)' : '#fafafa', border: `1px solid ${i === 0 ? 'rgba(237,28,36,0.15)' : 'rgba(237,28,36,0.08)'}` }}>

                  {/* ── MOBILE LAYOUT (< 640 px): 3 linhas ── */}
                  <div className="sm:hidden space-y-2">

                    {/* Linha 1: thumbnail + número */}
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ background: 'rgba(237,28,36,0.06)' }}>
                        <Image src={foto.imagem_url} alt={foto.alt ?? ''} fill className="object-cover" sizes="64px" />
                      </div>
                      <div className="flex-shrink-0 text-center" style={{ minWidth: 28 }}>
                        <span className="text-base font-bold"
                          style={{ color: 'rgba(237,28,36,0.3)', fontFamily: 'Oswald, sans-serif' }}>{i + 1}</span>
                        {i === 0 && (
                          <div className="text-xs leading-none mt-0.5"
                            style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>★</div>
                        )}
                      </div>
                    </div>

                    {/* Linha 2: input de legenda — largura total */}
                    <input
                      type="text"
                      value={foto.alt ?? ''}
                      onChange={e => updateAlt(foto, e.target.value)}
                      onBlur={() => saveAlt(foto)}
                      placeholder="Legenda (opcional)"
                      className="w-full px-3 py-1.5 rounded-lg text-sm outline-none"
                      style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.12)', color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}
                    />

                    {/* Linha 3: botões alinhados à direita */}
                    <div className="flex justify-end items-center gap-1.5">
                      <button onClick={() => move(foto, 'up')} disabled={i === 0}
                        className="p-1.5 rounded-lg disabled:opacity-20"
                        style={{ background: 'rgba(237,28,36,0.06)' }}>
                        <ChevronUp size={15} style={{ color: '#ED1C24' }} />
                      </button>
                      <button onClick={() => move(foto, 'down')} disabled={i === fotos.length - 1}
                        className="p-1.5 rounded-lg disabled:opacity-20"
                        style={{ background: 'rgba(237,28,36,0.06)' }}>
                        <ChevronDown size={15} style={{ color: '#ED1C24' }} />
                      </button>
                      <button onClick={() => setDeleteTarget(foto)}
                        className="p-1.5 rounded-lg"
                        style={{ background: 'rgba(237,28,36,0.06)' }}>
                        <Trash2 size={15} style={{ color: '#ED1C24' }} />
                      </button>
                    </div>
                  </div>

                  {/* ── DESKTOP LAYOUT (≥ 640 px): linha original ── */}
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ background: 'rgba(237,28,36,0.06)' }}>
                      <Image src={foto.imagem_url} alt={foto.alt ?? ''} fill className="object-cover" sizes="64px" />
                    </div>

                    <div className="flex-shrink-0 text-center" style={{ minWidth: 28 }}>
                      <span className="text-base font-bold"
                        style={{ color: 'rgba(237,28,36,0.3)', fontFamily: 'Oswald, sans-serif' }}>{i + 1}</span>
                      {i === 0 && (
                        <div className="text-xs leading-none mt-0.5"
                          style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>★</div>
                      )}
                    </div>

                    <input
                      type="text"
                      value={foto.alt ?? ''}
                      onChange={e => updateAlt(foto, e.target.value)}
                      onBlur={() => saveAlt(foto)}
                      placeholder="Legenda (opcional)"
                      className="flex-1 px-3 py-1.5 rounded-lg text-sm outline-none"
                      style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.12)', color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif', minWidth: 0 }}
                    />

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => move(foto, 'up')} disabled={i === 0}
                        className="p-1.5 rounded-lg disabled:opacity-20"
                        style={{ background: 'rgba(237,28,36,0.06)' }}>
                        <ChevronUp size={15} style={{ color: '#ED1C24' }} />
                      </button>
                      <button onClick={() => move(foto, 'down')} disabled={i === fotos.length - 1}
                        className="p-1.5 rounded-lg disabled:opacity-20"
                        style={{ background: 'rgba(237,28,36,0.06)' }}>
                        <ChevronDown size={15} style={{ color: '#ED1C24' }} />
                      </button>
                      <button onClick={() => setDeleteTarget(foto)}
                        className="p-1.5 rounded-lg"
                        style={{ background: 'rgba(237,28,36,0.06)' }}>
                        <Trash2 size={15} style={{ color: '#ED1C24' }} />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal exclusão — sem alterações */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteTarget(null)} />
          <div className="relative rounded-2xl p-6 w-full max-w-sm" style={{ background: '#FFFFFF', border: '1px solid rgba(237,28,36,0.2)' }}>
            <p className="text-center font-bold mb-4" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>Excluir esta foto?</p>
            <div className="relative h-32 rounded-xl overflow-hidden mb-6">
              <Image src={deleteTarget.imagem_url} alt="" fill className="object-cover" sizes="300px" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-lg text-sm"
                style={{ background: 'rgba(237,28,36,0.06)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                Cancelar
              </button>
              <button onClick={() => handleDelete(deleteTarget)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  )
}