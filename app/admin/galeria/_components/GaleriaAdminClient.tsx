'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, Trash2, Plus } from 'lucide-react'
import { GaleriaFoto } from '@/types'
import { uploadImageAdmin } from '@/lib/upload-client'
import { getSupabaseClient } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/ui/Toast'

const CATEGORIAS_INICIAIS = ['geral', 'jogos', 'eventos', 'viagens']

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
    tabela: 'galeria',
    registro_id: registroId,
    detalhes: detalhes ?? null,
  })
}

export default function GaleriaAdminClient({ fotos: initialFotos }: { fotos: GaleriaFoto[] }) {
  const [fotos, setFotos] = useState(initialFotos)
  const [uploading, setUploading] = useState(false)
  const [categorias, setCategorias] = useState<string[]>(CATEGORIAS_INICIAIS)
  const [categoria, setCategoria] = useState('geral')
  const [novaCategoria, setNovaCategoria] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<GaleriaFoto | null>(null)
  const { toasts, addToast, removeToast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = getSupabaseClient()

  function adicionarCategoria() {
    const nova = novaCategoria.trim().toLowerCase()
    if (!nova || categorias.includes(nova)) { setNovaCategoria(''); return }
    setCategorias(prev => [...prev, nova])
    setCategoria(nova)
    setNovaCategoria('')
  }

  async function handleFiles(files: FileList) {
    setUploading(true)
    let successCount = 0
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      try {
        const url = await uploadImageAdmin(file, 'galeria')
        const { data, error } = await supabase
          .from('galeria')
          .insert({ imagem_url: url, categoria, ativo: true, ordem: 0 })
          .select()
          .single()
        if (error) throw error
        // Atualiza estado local imediatamente
        setFotos(prev => [data, ...prev])
        await audit(supabase, 'insert', data.id, { imagem_url: url, categoria })
        successCount++
      } catch {
        addToast('error', `Erro ao enviar ${file.name}`)
      }
    }
    if (successCount > 0) addToast('success', `${successCount} foto(s) adicionada(s)!`)
    setUploading(false)
  }

  async function handleDelete(foto: GaleriaFoto) {
    const { error } = await supabase.from('galeria').delete().eq('id', foto.id)
    if (error) { addToast('error', 'Erro ao excluir foto.'); return }
    setFotos(prev => prev.filter(f => f.id !== foto.id))
    await audit(supabase, 'delete', foto.id, { imagem_url: foto.imagem_url })
    addToast('success', 'Foto excluída.')
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-xl p-6 space-y-4" style={{ border: '1px solid rgba(237,28,36,0.2)', background: 'rgba(58,0,0,0.3)' }}>
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif' }}>Categoria</label>
              <select value={categoria} onChange={e => setCategoria(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(237,28,36,0.25)', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
                {categorias.map(c => <option key={c} value={c} style={{ background: '#2a0000' }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif' }}>Nova categoria</label>
              <div className="flex gap-2">
                <input value={novaCategoria} onChange={e => setNovaCategoria(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), adicionarCategoria())}
                  placeholder="ex: treinos" className="px-3 py-2 rounded-lg text-sm outline-none w-32"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(237,28,36,0.25)', color: '#fff', fontFamily: 'DM Sans, sans-serif' }} />
                <button onClick={adicionarCategoria} disabled={!novaCategoria.trim()}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 transition hover:scale-[1.03]"
                  style={{ background: 'rgba(237,28,36,0.25)', color: '#fff', border: '1px solid rgba(237,28,36,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
                  <Plus size={14} /> Criar
                </button>
              </div>
            </div>
            <button onClick={() => inputRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
              style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
              {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={16} />}
              {uploading ? 'Enviando...' : 'Adicionar Fotos'}
            </button>
          </div>
          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
            onChange={e => e.target.files && handleFiles(e.target.files)} />
        </div>

        {fotos.length === 0 ? (
          <div className="text-center py-16 opacity-40" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>Nenhuma foto na galeria ainda.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {fotos.map(foto => (
              <div key={foto.id} className="relative group rounded-xl overflow-hidden aspect-square" style={{ background: '#3a0000' }}>
                <Image src={foto.imagem_url} alt={foto.titulo ?? ''} fill className="object-cover" sizes="200px" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => setDeleteTarget(foto)} className="p-1.5 rounded-full" style={{ background: '#ED1C24' }}>
                    <Trash2 size={12} color="#fff" />
                  </button>
                </div>
                {foto.categoria && (
                  <div className="absolute bottom-2 left-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(42,0,0,0.8)', color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans, sans-serif' }}>{foto.categoria}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDeleteTarget(null)} />
          <div className="relative rounded-2xl p-6 w-full max-w-sm" style={{ background: '#3a0000', border: '1px solid rgba(237,28,36,0.3)' }}>
            <p className="text-center font-bold mb-4" style={{ color: '#fff', fontFamily: 'Oswald, sans-serif' }}>Excluir esta foto?</p>
            <div className="relative h-32 rounded-xl overflow-hidden mb-6">
              <Image src={deleteTarget.imagem_url} alt="" fill className="object-cover" sizes="300px" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-lg text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>Cancelar</button>
              <button onClick={() => handleDelete(deleteTarget)} className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  )
}