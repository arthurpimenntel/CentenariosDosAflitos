'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Upload, Trash2, Plus, ArrowLeft, FolderOpen, Pencil, X } from 'lucide-react'
import { uploadImageAdmin } from '@/lib/upload-client'
import { getSupabaseClient } from '@/lib/supabase'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/ui/Toast'

interface Album {
  id: string
  nome: string
  descricao: string | null
  capa_url: string | null
  ordem: number
  created_at: string
  _count?: number
}

interface Foto {
  id: string
  imagem_url: string
  descricao: string | null
  album_id: string | null
  created_at: string
}

async function audit(supabase: ReturnType<typeof getSupabaseClient>, acao: string, tabela: string, registroId: string, detalhes?: object) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('auditoria').insert({ usuario_id: user.id, usuario_email: user.email, acao, tabela, registro_id: registroId, detalhes: detalhes ?? null })
}

const cardStyle = { border: '1px solid rgba(237,28,36,0.15)', borderRadius: 16, background: '#fff', boxShadow: '0 2px 12px rgba(237,28,36,0.06)' }
const labelSt = { color: 'rgba(237,28,36,0.6)', fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.12em' }
const inputSt = { background: '#fff', border: '1px solid rgba(237,28,36,0.2)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif', borderRadius: 8, padding: '8px 12px', fontSize: 14, outline: 'none', width: '100%' }

function AlbumModal({ album, onSave, onClose }: {
  album?: Album | null
  onSave: (nome: string, descricao: string) => Promise<void>
  onClose: () => void
}) {
  const [nome, setNome] = useState(album?.nome ?? '')
  const [descricao, setDescricao] = useState(album?.descricao ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!nome.trim()) return
    setSaving(true)
    await onSave(nome.trim(), descricao.trim())
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl p-6" style={{ background: '#fff', border: '1px solid rgba(237,28,36,0.2)', boxShadow: '0 16px 48px rgba(237,28,36,0.12)' }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>
            {album ? 'Editar Álbum' : 'Novo Álbum'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-red-50 transition">
            <X size={16} style={{ color: '#ED1C24' }} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block mb-1.5" style={labelSt}>Nome *</label>
            <input value={nome} onChange={e => setNome(e.target.value)} style={inputSt} placeholder="Ex: Acesso à Série B 2026" autoFocus />
          </div>
          <div>
            <label className="block mb-1.5" style={labelSt}>Descrição</label>
            <textarea value={descricao} onChange={e => setDescricao(e.target.value)}
              style={{ ...inputSt, resize: 'none' }} rows={3} placeholder="Descrição opcional do álbum..." />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'rgba(237,28,36,0.06)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={saving || !nome.trim()} className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
            style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
            {saving ? 'Salvando...' : album ? 'Salvar' : 'Criar Álbum'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AlbumFotosView({ album, onBack }: { album: Album; onBack: () => void }) {
  const [fotos, setFotos] = useState<Foto[]>([])
  const [uploading, setUploading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Foto | null>(null)
  const [loading, setLoading] = useState(true)
  const { toasts, addToast, removeToast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = getSupabaseClient()

  const loadFotos = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('galeria').select('*').eq('album_id', album.id).order('created_at', { ascending: false })
    setFotos(data ?? [])
    setLoading(false)
  }, [album.id, supabase])

  useEffect(() => { loadFotos() }, [loadFotos])

  async function handleFiles(files: FileList) {
    setUploading(true)
    let ok = 0
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      try {
        const url = await uploadImageAdmin(file, 'galeria')
        const { data, error } = await supabase.from('galeria')
          .insert({ imagem_url: url, album_id: album.id, ativo: true, ordem: 0 })
          .select().single()
        if (error) throw error
        setFotos(prev => [data, ...prev])
        if (!album.capa_url) {
          await supabase.from('albums').update({ capa_url: url }).eq('id', album.id)
          album.capa_url = url
        }
        await audit(supabase, 'insert', 'galeria', data.id, { imagem_url: url, album_id: album.id })
        ok++
      } catch {
        addToast('error', `Erro ao enviar ${file.name}`)
      }
    }
    if (ok > 0) addToast('success', `${ok} foto(s) adicionada(s)!`)
    setUploading(false)
  }

  async function handleDelete(foto: Foto) {
    const { error } = await supabase.from('galeria').delete().eq('id', foto.id)
    if (error) { addToast('error', 'Erro ao excluir.'); return }
    setFotos(prev => prev.filter(f => f.id !== foto.id))
    await audit(supabase, 'delete', 'galeria', foto.id, { imagem_url: foto.imagem_url, album_id: foto.album_id })
    addToast('success', 'Foto excluída.')
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition hover:scale-[1.02]"
            style={{ background: 'rgba(237,28,36,0.06)', color: '#ED1C24', border: '1px solid rgba(237,28,36,0.15)', fontFamily: 'DM Sans, sans-serif' }}>
            <ArrowLeft size={15} /> Álbuns
          </button>
          <div>
            <h2 className="text-xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>{album.nome}</h2>
            {album.descricao && <p className="text-xs mt-0.5" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>{album.descricao}</p>}
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(237,28,36,0.04)', border: '1px solid rgba(237,28,36,0.12)' }}>
          <button onClick={() => inputRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 transition hover:scale-[1.02]"
            style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
            {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Upload size={15} />}
            {uploading ? 'Enviando...' : 'Adicionar Fotos'}
          </button>
          <p className="text-xs" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
            {fotos.length} foto{fotos.length !== 1 ? 's' : ''} neste álbum
          </p>
          <input ref={inputRef} type="file" multiple accept="image/*" className="hidden"
            onChange={e => e.target.files && handleFiles(e.target.files)} />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 animate-pulse">
            {[...Array(8)].map((_, i) => <div key={i} className="rounded-xl aspect-square" style={{ background: 'rgba(237,28,36,0.08)' }} />)}
          </div>
        ) : fotos.length === 0 ? (
          <div className="text-center py-20 rounded-xl" style={{ border: '2px dashed rgba(237,28,36,0.15)' }}>
            <FolderOpen size={40} className="mx-auto mb-3" style={{ color: 'rgba(237,28,36,0.2)' }} />
            <p className="text-sm" style={{ color: 'rgba(237,28,36,0.4)', fontFamily: 'DM Sans, sans-serif' }}>Álbum vazio. Adicione fotos acima.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {fotos.map(foto => (
              <div key={foto.id} className="relative group rounded-xl overflow-hidden aspect-square" style={{ background: 'rgba(237,28,36,0.04)' }}>
                <img src={foto.imagem_url} alt={foto.descricao ?? ''} className="object-cover w-full h-full" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all rounded-xl" />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => setDeleteTarget(foto)} className="p-1.5 rounded-full" style={{ background: '#ED1C24' }}>
                    <Trash2 size={12} color="#fff" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative rounded-2xl p-6 w-full max-w-xs" style={{ background: '#fff', border: '1px solid rgba(237,28,36,0.2)' }}>
            <p className="text-center font-bold mb-4" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>Excluir esta foto?</p>
            <div className="relative h-28 rounded-xl overflow-hidden mb-5">
              <img src={deleteTarget.imagem_url} alt="" className="object-cover w-full h-full" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(237,28,36,0.06)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>Cancelar</button>
              <button onClick={() => handleDelete(deleteTarget)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  )
}

export default function GaleriaAdminClient() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [albumAberto, setAlbumAberto] = useState<Album | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editAlbum, setEditAlbum] = useState<Album | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Album | null>(null)
  const { toasts, addToast, removeToast } = useToast()
  const supabase = getSupabaseClient()

  const loadAlbums = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('albums').select('*').order('ordem').order('created_at', { ascending: false })
    const albumsComCount = await Promise.all((data ?? []).map(async (a: Album) => {
      const { count } = await supabase.from('galeria').select('id', { count: 'exact', head: true }).eq('album_id', a.id)
      return { ...a, _count: count ?? 0 }
    }))
    setAlbums(albumsComCount)
    setLoading(false)
  }, [supabase])

  useEffect(() => { loadAlbums() }, [loadAlbums])

  async function handleCreateAlbum(nome: string, descricao: string) {
    const { data, error } = await supabase.from('albums')
      .insert({ nome, descricao: descricao || null, ordem: albums.length })
      .select().single()
    if (error) { addToast('error', 'Erro ao criar álbum.'); return }
    await audit(supabase, 'insert', 'albums', data.id, { nome })
    setAlbums(prev => [{ ...data, _count: 0 }, ...prev])
    addToast('success', 'Álbum criado!')
    setShowModal(false)
  }

  async function handleEditAlbum(nome: string, descricao: string) {
    if (!editAlbum) return
    const { error } = await supabase.from('albums')
      .update({ nome, descricao: descricao || null })
      .eq('id', editAlbum.id)
    if (error) { addToast('error', 'Erro ao editar álbum.'); return }
    await audit(supabase, 'update', 'albums', editAlbum.id, { nome, descricao })
    setAlbums(prev => prev.map(a => a.id === editAlbum.id ? { ...a, nome, descricao } : a))
    addToast('success', 'Álbum atualizado!')
    setEditAlbum(null)
  }

  async function handleDeleteAlbum(album: Album) {
    await supabase.from('galeria').update({ album_id: null }).eq('album_id', album.id)
    const { error } = await supabase.from('albums').delete().eq('id', album.id)
    if (error) { addToast('error', 'Erro ao excluir álbum.'); return }
    await audit(supabase, 'delete', 'albums', album.id, { nome: album.nome, fotos_desvinculadas: album._count })
    setAlbums(prev => prev.filter(a => a.id !== album.id))
    addToast('success', 'Álbum excluído. As fotos foram desvinculadas.')
    setDeleteTarget(null)
  }

  if (albumAberto) {
    return <AlbumFotosView album={albumAberto} onBack={() => { setAlbumAberto(null); loadAlbums() }} />
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
            {albums.length} álbum{albums.length !== 1 ? 's' : ''}
          </p>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:scale-[1.02]"
            style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
            <Plus size={15} /> Novo Álbum
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(6)].map((_, i) => <div key={i} className="rounded-xl aspect-video" style={{ background: 'rgba(237,28,36,0.08)' }} />)}
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-24 rounded-xl" style={{ border: '2px dashed rgba(237,28,36,0.15)' }}>
            <FolderOpen size={48} className="mx-auto mb-4" style={{ color: 'rgba(237,28,36,0.2)' }} />
            <p className="text-base font-bold uppercase mb-2" style={{ fontFamily: 'Oswald, sans-serif', color: 'rgba(237,28,36,0.35)' }}>Nenhum álbum ainda</p>
            <p className="text-sm mb-6" style={{ color: 'rgba(237,28,36,0.3)', fontFamily: 'DM Sans, sans-serif' }}>Crie um álbum para começar a adicionar fotos</p>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold mx-auto"
              style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
              <Plus size={15} /> Criar primeiro álbum
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {albums.map(album => (
              <div key={album.id} className="group relative rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
                style={cardStyle} onClick={() => setAlbumAberto(album)}>
                <div className="relative aspect-video overflow-hidden" style={{ background: 'rgba(237,28,36,0.06)' }}>
                  {album.capa_url ? (
                    <img src={album.capa_url} alt={album.nome} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FolderOpen size={32} style={{ color: 'rgba(237,28,36,0.2)' }} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: '#ED1C24' }} />
                </div>
                <div className="p-3">
                  <p className="font-bold text-sm uppercase truncate" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>{album.nome}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
                    {album._count} foto{album._count !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all z-10"
                  onClick={e => e.stopPropagation()}>
                  <button onClick={() => setEditAlbum(album)} className="p-1.5 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(237,28,36,0.2)' }}>
                    <Pencil size={12} style={{ color: '#ED1C24' }} />
                  </button>
                  <button onClick={() => setDeleteTarget(album)} className="p-1.5 rounded-lg"
                    style={{ background: '#ED1C24' }}>
                    <Trash2 size={12} color="#fff" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <AlbumModal onSave={handleCreateAlbum} onClose={() => setShowModal(false)} />}
      {editAlbum && <AlbumModal album={editAlbum} onSave={handleEditAlbum} onClose={() => setEditAlbum(null)} />}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteTarget(null)} />
          <div className="relative rounded-2xl p-6 w-full max-w-sm" style={{ background: '#fff', border: '1px solid rgba(237,28,36,0.2)' }}>
            <p className="font-bold text-lg mb-2 uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>Excluir álbum?</p>
            <p className="text-sm mb-1" style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>
              <strong>"{deleteTarget.nome}"</strong> será excluído.
            </p>
            <p className="text-xs mb-6" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
              As {deleteTarget._count} foto(s) não serão apagadas, apenas desvinculadas do álbum.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(237,28,36,0.06)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>Cancelar</button>
              <button onClick={() => handleDeleteAlbum(deleteTarget)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  )
}