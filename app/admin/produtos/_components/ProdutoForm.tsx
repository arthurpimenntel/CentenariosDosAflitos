"use client";

import { useState, FormEvent, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Produto, ProdutoFormData } from '@/types'
import { uploadImageAdmin } from '@/lib/upload-client'
import { useToast } from '@/hooks/useToast'
import { useAdminPath } from '@/hooks/useAdminPath'
import Toast from '@/components/ui/Toast'
import { Plus, X, GripVertical, Upload } from 'lucide-react'

const FIELD_STYLE = {
  background: '#FFFFFF',
  border: '1px solid rgba(237,28,36,0.2)',
  color: '#ED1C24',
  fontFamily: 'DM Sans, sans-serif',
}

const SECTION_STYLE = {
  background: '#FFFFFF',
  border: '1px solid rgba(237,28,36,0.12)',
  borderRadius: 16,
  padding: '20px 24px',
  boxShadow: '0 2px 8px rgba(237,28,36,0.04)',
}

const CATEGORIAS = ['Camisas', 'Acessórios', 'Bandeiras', 'Bonés', 'Outros']
const TAMANHOS_PADRAO = ['PP', 'P', 'M', 'G', 'GG', 'XGG', 'ÚNICO']

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative" onClick={() => onChange(!checked)}>
        <div className="w-12 h-6 rounded-full transition-all" style={{ background: checked ? '#ED1C24' : 'rgba(237,28,36,0.12)' }} />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-all" style={{ transform: checked ? 'translateX(24px)' : 'translateX(0)' }} />
      </div>
      <span className="text-sm font-medium" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>{label}</span>
    </label>
  )
}

export default function ProdutoForm({ produto }: { produto?: Produto }) {
  const isEdit = !!produto
  const router = useRouter()
  const adminBase = useAdminPath()
  const { toasts, addToast, removeToast } = useToast()
  const imgInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<ProdutoFormData>({
    nome: produto?.nome ?? '',
    descricao: produto?.descricao ?? '',
    preco: produto?.preco?.toString() ?? '',
    categoria: produto?.categoria ?? CATEGORIAS[0],
    estoque: produto?.estoque?.toString() ?? '0',
    ativo: produto?.ativo ?? true,
    destaque: produto?.destaque ?? false,
    imagem_url: produto?.imagem_url ?? '',
    imagens: produto?.imagens ?? (produto?.imagem_url ? [produto.imagem_url] : []),
    tamanhos: produto?.tamanhos ?? [],
    estoque_por_tamanho: Object.fromEntries(Object.entries(produto?.estoque_por_tamanho ?? {}).map(([k, v]) => [k, String(v)])),
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [customTamanho, setCustomTamanho] = useState('')

  async function handleImgFiles(files: FileList) {
    setUploading(true)
    const newUrls: string[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      try { const url = await uploadImageAdmin(file, 'produtos'); newUrls.push(url) }
      catch { addToast('error', `Erro ao enviar ${file.name}`) }
    }
    if (newUrls.length > 0) setForm(f => ({ ...f, imagens: [...f.imagens, ...newUrls], imagem_url: f.imagens.length === 0 ? newUrls[0] : f.imagem_url }))
    setUploading(false)
  }

  function removeImg(idx: number) {
    setForm(f => { const next = f.imagens.filter((_, i) => i !== idx); return { ...f, imagens: next, imagem_url: next[0] ?? '' } })
  }

  function setPrimary(idx: number) {
    setForm(f => { const next = [...f.imagens]; const [moved] = next.splice(idx, 1); next.unshift(moved); return { ...f, imagens: next, imagem_url: next[0] } })
  }

  function toggleTamanho(tam: string) {
    setForm(f => {
      if (f.tamanhos.includes(tam)) { const novos = f.tamanhos.filter(t => t !== tam); const est = { ...f.estoque_por_tamanho }; delete est[tam]; return { ...f, tamanhos: novos, estoque_por_tamanho: est } }
      return { ...f, tamanhos: [...f.tamanhos, tam], estoque_por_tamanho: { ...f.estoque_por_tamanho, [tam]: '0' } }
    })
  }

  function addCustomTamanho() {
    const tam = customTamanho.trim().toUpperCase()
    if (!tam || form.tamanhos.includes(tam)) return
    setForm(f => ({ ...f, tamanhos: [...f.tamanhos, tam], estoque_por_tamanho: { ...f.estoque_por_tamanho, [tam]: '0' } }))
    setCustomTamanho('')
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    let estoqueTotal = parseInt(form.estoque, 10) || 0
    if (form.tamanhos.length > 0) estoqueTotal = Object.values(form.estoque_por_tamanho).reduce((acc, v) => acc + (parseInt(v, 10) || 0), 0)
    const payload = { nome: form.nome, descricao: form.descricao || null, preco: parseFloat(form.preco), categoria: form.categoria, estoque: estoqueTotal, ativo: form.ativo, destaque: form.destaque, imagem_url: form.imagens[0] ?? form.imagem_url ?? null, imagens: form.imagens, tamanhos: form.tamanhos, estoque_por_tamanho: Object.fromEntries(Object.entries(form.estoque_por_tamanho).map(([k, v]) => [k, parseInt(v, 10) || 0])) }
    try {
      const res = await fetch(isEdit ? `/api/admin/produtos/${produto.id}` : '/api/admin/produtos', { method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      addToast('success', isEdit ? 'Produto atualizado!' : 'Produto criado!')
      setTimeout(() => router.push(`${adminBase}/produtos`), 1000)
    } catch { addToast('error', 'Erro ao salvar.') }
    finally { setSaving(false) }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl outline-none transition-all'
  const labelClass = 'block text-xs font-bold uppercase tracking-widest mb-2'
  const labelStyle = { color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">

        {/* Informações básicas */}
        <div style={SECTION_STYLE}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>Informações básicas</p>
          <div className="space-y-4">
            <div>
              <label className={labelClass} style={labelStyle}>Nome *</label>
              <input required value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className={inputClass} style={FIELD_STYLE} placeholder="Nome do produto" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} style={labelStyle}>Preço (R$) *</label>
                <input required type="number" min="0" step="0.01" value={form.preco} onChange={e => setForm(f => ({ ...f, preco: e.target.value }))} className={inputClass} style={FIELD_STYLE} placeholder="0,00" />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Categoria</label>
                <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))} className={inputClass} style={{ ...FIELD_STYLE, appearance: 'auto' as 'auto' }}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Descrição</label>
              <textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} rows={3} className={inputClass} style={FIELD_STYLE} placeholder="Descrição do produto..." />
            </div>
          </div>
        </div>

        {/* Fotos */}
        <div style={SECTION_STYLE}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
            Fotos do produto <span className="normal-case font-normal" style={{ color: 'rgba(237,28,36,0.4)' }}>— a primeira é a principal</span>
          </p>
          {form.imagens.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
              {form.imagens.map((url, idx) => (
                <div key={url + idx} className="relative group rounded-xl overflow-hidden aspect-square" style={{ background: 'rgba(237,28,36,0.06)' }}>
                  <Image src={url} alt={`Foto ${idx + 1}`} fill className="object-cover" sizes="120px" />
                  {idx === 0 && <div className="absolute top-1.5 left-1.5"><span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#ED1C24', color: '#fff' }}>Principal</span></div>}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {idx !== 0 && <button type="button" onClick={() => setPrimary(idx)} className="px-2 py-1 rounded text-xs font-bold" style={{ background: '#ED1C24', color: '#fff' }}><GripVertical size={12} /></button>}
                    <button type="button" onClick={() => removeImg(idx)} className="p-1.5 rounded-full" style={{ background: 'rgba(237,28,36,0.9)' }}><X size={12} color="#fff" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button type="button" onClick={() => imgInputRef.current?.click()} disabled={uploading}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-60"
            style={{ background: 'rgba(237,28,36,0.06)', border: '1px dashed rgba(237,28,36,0.3)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
            {uploading ? <div className="w-4 h-4 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" /> : <Upload size={16} />}
            {uploading ? 'Enviando...' : 'Adicionar fotos'}
          </button>
          <input ref={imgInputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && handleImgFiles(e.target.files)} />
        </div>

        {/* Tamanhos */}
        <div style={SECTION_STYLE}>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>Tamanhos e Estoque</p>
          <p className="text-xs mb-4" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>Selecione os tamanhos e defina o estoque de cada um. Sem tamanhos, use o campo estoque geral.</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {TAMANHOS_PADRAO.map(tam => {
              const ativo = form.tamanhos.includes(tam)
              return (
                <button key={tam} type="button" onClick={() => toggleTamanho(tam)} className="px-3 py-2 rounded-lg text-sm font-bold transition-all"
                  style={{ background: ativo ? '#ED1C24' : 'rgba(237,28,36,0.06)', color: ativo ? '#FFFFFF' : '#ED1C24', border: `1.5px solid ${ativo ? '#ED1C24' : 'rgba(237,28,36,0.2)'}`, fontFamily: 'DM Sans, sans-serif' }}>
                  {tam}
                </button>
              )
            })}
          </div>
          <div className="flex gap-2 mb-4">
            <input value={customTamanho} onChange={e => setCustomTamanho(e.target.value.toUpperCase())} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTamanho() } }}
              className="flex-1 px-3 py-2 rounded-xl text-sm outline-none" style={{ ...FIELD_STYLE, maxWidth: 120 }} placeholder="Ex: 38, 40..." />
            <button type="button" onClick={addCustomTamanho} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'rgba(237,28,36,0.08)', color: '#ED1C24', border: '1px solid rgba(237,28,36,0.2)', fontFamily: 'DM Sans, sans-serif' }}>
              <Plus size={14} />Adicionar
            </button>
          </div>
          {form.tamanhos.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs mb-2" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>Estoque por tamanho:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {form.tamanhos.map(tam => (
                  <div key={tam} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(237,28,36,0.04)', border: '1px solid rgba(237,28,36,0.12)' }}>
                    <span className="text-sm font-bold w-8 text-center" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>{tam}</span>
                    <input type="number" min="0" value={form.estoque_por_tamanho[tam] ?? '0'} onChange={e => setForm(f => ({ ...f, estoque_por_tamanho: { ...f.estoque_por_tamanho, [tam]: e.target.value } }))}
                      className="flex-1 w-16 text-center outline-none rounded px-2 py-1 text-sm" style={{ background: '#FFFFFF', color: '#ED1C24', border: '1px solid rgba(237,28,36,0.15)', fontFamily: 'DM Sans, sans-serif' }} />
                    <button type="button" onClick={() => toggleTamanho(tam)} className="p-1 rounded opacity-40 hover:opacity-80"><X size={12} style={{ color: '#ED1C24' }} /></button>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
                Estoque total: {form.tamanhos.reduce((acc, t) => acc + (parseInt(form.estoque_por_tamanho[t] ?? '0', 10) || 0), 0)} unidades
              </p>
            </div>
          ) : (
            <div>
              <label className={labelClass} style={labelStyle}>Estoque geral</label>
              <input type="number" min="0" value={form.estoque} onChange={e => setForm(f => ({ ...f, estoque: e.target.value }))} className={inputClass} style={{ ...FIELD_STYLE, maxWidth: 120 }} />
            </div>
          )}
        </div>

        {/* Visibilidade */}
        <div style={SECTION_STYLE}>
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>Visibilidade</p>
          <div className="flex flex-wrap gap-6">
            <Toggle checked={form.ativo} onChange={v => setForm(f => ({ ...f, ativo: v }))} label="Produto ativo" />
            <Toggle checked={form.destaque} onChange={v => setForm(f => ({ ...f, destaque: v }))} label="Destaque na Home" />
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.push(`${adminBase}/produtos`)} className="px-6 py-3 rounded-xl text-sm font-semibold transition hover:scale-[1.02]"
            style={{ background: '#FFFFFF', color: 'rgba(237,28,36,0.5)', border: '1px solid rgba(237,28,36,0.2)', fontFamily: 'DM Sans, sans-serif' }}>
            Cancelar
          </button>
          <button type="submit" disabled={saving || uploading} className="px-8 py-3 rounded-xl text-sm font-semibold disabled:opacity-60 transition hover:scale-[1.02]"
            style={{ background: '#ED1C24', color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif', boxShadow: '0 4px 16px rgba(237,28,36,0.3)' }}>
            {saving ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Salvando...</span> : isEdit ? 'Salvar Alterações' : 'Criar Produto'}
          </button>
        </div>
      </form>
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  )
}