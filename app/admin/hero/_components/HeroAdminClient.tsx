'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, Trash2, ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react'
import { HeroFoto } from '@/types'
import { uploadImageAdmin } from '@/lib/upload-client'
import { getSupabaseClient } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/ui/Toast'

// Invalida o cache da home e da rota de API após qualquer mutação no hero
async function revalidateHero() {
  await fetch('/api/admin/hero', { method: 'POST' }).catch(() => {})
}

async function audit(
  supabase: ReturnType<typeof getSupabaseClient>,
  acao: string,
  registroId: string,
  detalhes?: object
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('auditoria').insert({
    usuario_id: user.id,
    usuario_email: user.email,
    acao,
    tabela: 'hero_fotos',
    registro_id: registroId,
    detalhes: detalhes ?? null,
  })
}

export default function HeroAdminClient({ fotos: initialFotos }: { fotos: HeroFoto[] }) {
  const [fotos, setFotos] = useState(initialFotos)
  const [uploading, setUploading] = useState(false)
  const { toasts, addToast, removeToast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = getSupabaseClient()

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const url = await uploadImageAdmin(file, 'hero')
      const nextOrdem = fotos.length > 0 ? Math.max(...fotos.map(f => f.ordem)) + 1 : 0
      const { data, error } = await supabase
        .from('hero_fotos')
        .insert({ imagem_url: url, ordem: nextOrdem, ativo: true })
        .select()
        .single()
      if (error) throw error
      // Atualiza estado local imediatamente — sem esperar reload
      setFotos(prev => [...prev, data])
      await Promise.all([
        audit(supabase, 'insert', data.id, { imagem_url: url }),
        revalidateHero(),
      ])
      addToast('success', 'Foto adicionada ao carrossel!')
    } catch {
      addToast('error', 'Erro ao fazer upload.')
    } finally {
      setUploading(false)
    }
  }

  async function toggleAtivo(foto: HeroFoto) {
    const novoAtivo = !foto.ativo
    // Atualiza estado local imediatamente
    setFotos(prev => prev.map(f => f.id === foto.id ? { ...f, ativo: novoAtivo } : f))
    const { error } = await supabase
      .from('hero_fotos')
      .update({ ativo: novoAtivo })
      .eq('id', foto.id)
    if (error) {
      // Reverte se falhou
      setFotos(prev => prev.map(f => f.id === foto.id ? { ...f, ativo: foto.ativo } : f))
      addToast('error', 'Erro ao atualizar.')
      return
    }
    await Promise.all([
      audit(supabase, 'toggle_ativo', foto.id, { ativo: novoAtivo }),
      revalidateHero(),
    ])
  }

  async function move(foto: HeroFoto, dir: 'up' | 'down') {
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
      supabase.from('hero_fotos').update({ ordem: next[idx].ordem }).eq('id', next[idx].id),
      supabase.from('hero_fotos').update({ ordem: next[swapIdx].ordem }).eq('id', next[swapIdx].id),
    ])
    await Promise.all([
      audit(supabase, 'reorder', foto.id, { dir }),
      revalidateHero(),
    ])
  }

  async function handleDelete(foto: HeroFoto) {
    const { error } = await supabase.from('hero_fotos').delete().eq('id', foto.id)
    if (error) { addToast('error', 'Erro ao remover.'); return }
    setFotos(prev => prev.filter(f => f.id !== foto.id))
    await Promise.all([
      audit(supabase, 'delete', foto.id, { imagem_url: foto.imagem_url }),
      revalidateHero(),
    ])
    addToast('success', 'Foto removida.')
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
            style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}
          >
            {uploading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Upload size={16} />}
            {uploading ? 'Enviando...' : 'Adicionar Foto'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>

        {fotos.length === 0 ? (
          <div className="text-center py-16 opacity-40" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
            Nenhuma foto no carrossel.
          </div>
        ) : (
          <div className="space-y-3">
            {fotos.map((foto, i) => (
              <div key={foto.id} className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: 'rgba(58,0,0,0.4)', border: '1px solid rgba(237,28,36,0.2)' }}>
                <div className="relative w-20 h-14 rounded-lg overflow-hidden flex-shrink-0" style={{ background: '#3a0000' }}>
                  <img src={foto.imagem_url} alt={`Hero ${i + 1}`} className="object-cover w-full h-full" />
                  {!foto.ativo && <div className="absolute inset-0 bg-black/60" />}
                </div>
                <div className="text-lg font-bold opacity-30" style={{ color: '#fff', fontFamily: 'Oswald, sans-serif', minWidth: 24 }}>
                  {i + 1}
                </div>
                <div className="flex-1" />
                <div className="flex items-center gap-2">
                  <button onClick={() => move(foto, 'up')} disabled={i === 0}
                    className="p-1.5 rounded-lg disabled:opacity-20" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <ChevronUp size={16} color="#fff" />
                  </button>
                  <button onClick={() => move(foto, 'down')} disabled={i === fotos.length - 1}
                    className="p-1.5 rounded-lg disabled:opacity-20" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <ChevronDown size={16} color="#fff" />
                  </button>
                  <button onClick={() => toggleAtivo(foto)} className="p-1.5 rounded-lg"
                    style={{ background: foto.ativo ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.06)' }}>
                    {foto.ativo
                      ? <Eye size={16} style={{ color: '#4ade80' }} />
                      : <EyeOff size={16} style={{ color: 'rgba(255,255,255,0.4)' }} />}
                  </button>
                  <button onClick={() => handleDelete(foto)} className="p-1.5 rounded-lg"
                    style={{ background: 'rgba(248,113,113,0.1)' }}>
                    <Trash2 size={16} style={{ color: '#f87171' }} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  )
}