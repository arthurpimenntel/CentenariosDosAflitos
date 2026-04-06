'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Noticia, NoticiaFormData } from '@/types'
import { generateSlug } from '@/lib/slug'
import { uploadImageAdmin } from '@/lib/upload-client'
import { useToast } from '@/hooks/useToast'
import Toast from '@/components/ui/Toast'
import AdminImageUpload from '@/components/admin/AdminImageUpload'

const FIELD_STYLE = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(237,28,36,0.25)', color: '#fff', fontFamily: 'DM Sans, sans-serif' } as const

export default function NoticiaForm({ noticia }: { noticia?: Noticia }) {
  const isEdit = !!noticia
  const router = useRouter()
  const { toasts, addToast, removeToast } = useToast()
  const [form, setForm] = useState<NoticiaFormData>({ titulo: noticia?.titulo ?? '', slug: noticia?.slug ?? '', resumo: noticia?.resumo ?? '', conteudo: noticia?.conteudo ?? '', publicado: noticia?.publicado ?? false, publicado_em: noticia?.publicado_em ? noticia.publicado_em.slice(0, 10) : '', imagem_url: noticia?.imagem_url ?? '' })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  function handleTituloChange(value: string) {
    setForm(f => ({ ...f, titulo: value, slug: isEdit ? f.slug : generateSlug(value) }))
  }

  async function handleImageUpload(file: File) {
    setUploading(true)
    try { const url = await uploadImageAdmin(file, 'noticias'); setForm(f => ({ ...f, imagem_url: url })) }
    catch { addToast('error', 'Erro ao fazer upload da imagem.') }
    finally { setUploading(false) }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    const payload = { titulo: form.titulo, slug: form.slug, resumo: form.resumo || null, conteudo: form.conteudo || null, imagem_url: form.imagem_url || null, publicado: form.publicado, publicado_em: form.publicado && form.publicado_em ? new Date(form.publicado_em).toISOString() : null }
    try {
      const res = await fetch(isEdit ? `/api/admin/noticias/${noticia.id}` : '/api/admin/noticias', { method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      addToast('success', isEdit ? 'Notícia atualizada!' : 'Notícia criada!')
      setTimeout(() => router.push('/admin/noticias'), 1000)
    } catch { addToast('error', 'Erro ao salvar. Tente novamente.') }
    finally { setSaving(false) }
  }

  const inputClass = "w-full px-4 py-3 rounded-lg outline-none transition-all placeholder-white/20"
  const labelClass = "block text-xs font-semibold uppercase tracking-widest mb-2"
  const labelStyle = { color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif' }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div><label className={labelClass} style={labelStyle}>Título *</label><input required value={form.titulo} onChange={e => handleTituloChange(e.target.value)} className={inputClass} style={FIELD_STYLE} placeholder="Título da notícia" /></div>
        <div><label className={labelClass} style={labelStyle}>Slug (URL)</label><input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputClass} style={FIELD_STYLE} placeholder="gerado-automaticamente" /></div>
        <AdminImageUpload currentUrl={form.imagem_url} onUpload={handleImageUpload} onRemove={() => setForm(f => ({ ...f, imagem_url: '' }))} label="Imagem de Capa" loading={uploading} />
        <div><label className={labelClass} style={labelStyle}>Resumo</label><textarea value={form.resumo} onChange={e => setForm(f => ({ ...f, resumo: e.target.value }))} rows={3} className={inputClass} style={FIELD_STYLE} placeholder="Breve descrição para preview..." /></div>
        <div><label className={labelClass} style={labelStyle}>Conteúdo</label><textarea value={form.conteudo} onChange={e => setForm(f => ({ ...f, conteudo: e.target.value }))} rows={12} className={inputClass} style={FIELD_STYLE} placeholder="Texto completo da notícia..." /></div>
        <div className="flex flex-wrap gap-6 items-start">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input type="checkbox" checked={form.publicado} onChange={e => setForm(f => ({ ...f, publicado: e.target.checked }))} className="sr-only" />
              <div className="w-12 h-6 rounded-full transition-all" style={{ background: form.publicado ? '#ED1C24' : 'rgba(255,255,255,0.1)' }} />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-all" style={{ transform: form.publicado ? 'translateX(24px)' : 'translateX(0)' }} />
            </div>
            <span className="text-sm" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>Publicar</span>
          </label>
          {form.publicado && <div><label className={labelClass} style={labelStyle}>Data de publicação</label><input type="date" value={form.publicado_em} onChange={e => setForm(f => ({ ...f, publicado_em: e.target.value }))} className={inputClass} style={{ ...FIELD_STYLE, colorScheme: 'dark' }} /></div>}
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.push('/admin/noticias')} className="px-6 py-3 rounded-lg text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>Cancelar</button>
          <button type="submit" disabled={saving || uploading} className="px-8 py-3 rounded-lg text-sm font-semibold disabled:opacity-60" style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
            {saving ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Salvando...</span> : isEdit ? 'Salvar Alterações' : 'Criar Notícia'}
          </button>
        </div>
      </form>
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  )
}
