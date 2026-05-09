'use client'

import { useState, useRef, useEffect, Suspense, FormEvent, ChangeEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {CheckCircle, ChevronRight, Upload, X, FileImage, CreditCard, Banknote, Sticker} from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Zap, Calendar, Bus, ShoppingBag } from 'lucide-react'
import DatePicker from '@/components/DatePicker'

type CarteirinhaOpcao = 'fisica' | 'virtual'
type PlanoSocio = 'individual' | 'familia'

interface FormData {
  nome: string; email: string; telefone: string; data_nascimento: string
  cidade: string; cep: string; endereco: string; rg: string; cpf: string
  como_conheceu: string; carteirinha: CarteirinhaOpcao; plano: PlanoSocio
}
type FieldError = Partial<Record<keyof FormData | 'foto', string>>

const COMO_CONHECEU = ['Na arquibancada', 'Através de um amigo', 'No Instagram', 'Já frequento', 'Outro',]

const beneficiosDetalhados = [
  { icon: ShoppingBag, titulo: 'Desconto na Loja',      texto: 'Descontos e produtos exclusivos lançados pela barra.' },
  { icon: Bus,         titulo: 'Desconto em Caravanas', texto: 'Tenha desconto e condições especiais em caravanas organizadas.' },
  { icon: Zap,         titulo: 'Sorteios Mensais',      texto: 'Sorteios mensais entre associados de produtos, serviços e muito mais.' },
  { icon: Calendar,    titulo: 'Prioridade em Eventos', texto: 'Prioridade em eventos e confraternizações para associados.' },
  { icon: Sticker, titulo: 'Adesivo Sócio 2026',        texto: 'Pra quem vive a arquibancada e representa em qualquer lugar.' },
  { icon: CreditCard,  titulo: 'Carteirinha de Sócio',  texto: 'Carteirinha de sócio virtual gratuita. Física +R$16,00.' },
]

const BENEFICIOS = [
  { bold: null,    texto: 'Desconto na loja'               },
  { bold: null,    texto: 'Desconto em caravanas'          },
  { bold: null,    texto: 'Sorteios mensais'               },
  { bold: null,    texto: 'Prioridade em eventos'          },
  { bold: null,    texto: 'Carteirinha virtual'             },
  { bold: null,    texto: 'Adesivo exclusivo de sócio 2026'},
  { bold: '+R$16', texto: 'Carteirinha Física'             },
]

const PLANOS = [
  { id: 'individual' as PlanoSocio, nome: 'Individual', preco: 'R$ 50,00', detalhe: null as string | null },
  { id: 'familia'    as PlanoSocio, nome: 'Família',    preco: 'R$ 40,00', detalhe: 'A partir de 3 pessoas da mesma família' as string | null },
]

// ─── Componente Chave Pix ────────────────────────────────────────────────────
function PixKey() {
  const [copied, setCopied] = useState(false)
  const chave = 'oscentenarios1901@gmail.com'

  function handleCopy() {
    navigator.clipboard.writeText(chave).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div className="overflow-hidden" style={{ border: '1px solid rgba(237,28,36,0.2)', borderRadius: 12 }}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#ED1C24' }}>
        <Banknote size={14} color="#fff" />
        <span className="text-xs font-bold uppercase tracking-widest text-white"
          style={{ fontFamily: 'DM Sans, sans-serif' }}>
          Chave Pix — Faça o pagamento antes de continuar
        </span>
      </div>

      {/* Body */}
      <div style={{ background: 'rgba(237,28,36,0.03)' }}>
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Tipo */}
          <div className="flex-shrink-0">
            <p className="text-xs mb-0.5" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
              Tipo
            </p>
            <p className="text-xs font-bold uppercase tracking-wider"
              style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
              E-mail
            </p>
          </div>

          {/* Divider */}
          <div className="flex-shrink-0 w-px h-8" style={{ background: 'rgba(237,28,36,0.15)' }} />

          {/* Chave */}
          <div className="flex-1 min-w-0">
            <p className="text-xs mb-0.5" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
              Chave
            </p>
            <p className="text-sm font-semibold truncate"
              style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
              {chave}
            </p>
          </div>

          {/* Botão copiar */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all hover:scale-[1.03] active:scale-[0.97]"
            style={{
              borderRadius: 8,
              background: copied ? 'rgba(74,222,128,0.12)' : 'rgba(237,28,36,0.08)',
              color: copied ? '#16a34a' : '#ED1C24',
              border: `1px solid ${copied ? 'rgba(74,222,128,0.3)' : 'rgba(237,28,36,0.2)'}`,
              fontFamily: 'DM Sans, sans-serif',
              minWidth: 90,
              transition: 'all 0.2s ease',
            }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="ok" className="flex items-center gap-1.5"
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#16a34a" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Copiado!
                </motion.span>
              ) : (
                <motion.span key="copy" className="flex items-center gap-1.5"
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="#ED1C24" strokeWidth="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                      stroke="#ED1C24" strokeWidth="2" />
                  </svg>
                  Copiar
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Footer hint */}
        <div className="px-4 pb-3">
          <p className="text-xs" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
            Após o pagamento, anexe o comprovante no campo abaixo.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Validação ────────────────────────────────────────────────────────────────
function validate(form: FormData, fotoFile: File | null): FieldError {
  const errors: FieldError = {}
  if (!form.nome.trim())
    errors.nome = 'Nome é obrigatório'
  if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'E-mail inválido'
  if (!form.telefone.trim() || form.telefone.replace(/\D/g, '').length < 11)
    errors.telefone = 'Telefone inválido (DDD + 9 + 8 dígitos)'
  if (!form.rg.trim())
    errors.rg = 'RG é obrigatório'
  if (!form.cpf.trim() || form.cpf.replace(/\D/g, '').length < 11)
    errors.cpf = 'CPF é obrigatório'
  if (!form.data_nascimento)
    errors.data_nascimento = 'Data de nascimento é obrigatória'
  if (!form.cidade.trim())
    errors.cidade = 'Cidade é obrigatória'
  if (!form.cep.trim() || form.cep.replace(/\D/g, '').length < 8)
    errors.cep = 'CEP é obrigatório'
  if (!form.endereco.trim())
    errors.endereco = 'Endereço é obrigatório'
  if (!form.como_conheceu)
    errors.como_conheceu = 'Selecione como nos conheceu'
  if (!fotoFile)
    errors.foto = 'Foto de rosto é obrigatória'
  return errors
}

function formatPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return `(${d}`
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  return v
}

function formatCPF(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

function formatCEP(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 8)
  if (d.length <= 5) return d
  return `${d.slice(0, 5)}-${d.slice(5)}`
}

async function uploadFile(file: File, bucket: 'socios-fotos' | 'socios-comprovantes'): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('bucket', bucket)
  const res = await fetch('/api/upload/socio', { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload falhou')
  const { url } = await res.json()
  return url
}

const inputBase = 'w-full px-4 py-3.5 outline-none transition-all text-sm'
const labelBase = 'block text-xs font-semibold uppercase tracking-widest mb-2'

function inputSt(hasError: boolean) {
  return {
    background: '#FFFFFF',
    border: `1px solid ${hasError ? '#ED1C24' : 'rgba(237,28,36,0.25)'}`,
    color: '#ED1C24',
    fontFamily: 'DM Sans, sans-serif',
    boxShadow: hasError ? '0 0 0 2px rgba(237,28,36,0.1)' : 'none',
  }
}

const RED = '#ED1C24'

function PlanCard({
  plano, index, selectedPlano, onSelect,
}: {
  plano: (typeof PLANOS)[0]; index: number
  selectedPlano: PlanoSocio; onSelect: (id: PlanoSocio) => void
}) {
  const feat = plano.id === 'familia'
  const isSelected = selectedPlano === plano.id

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.2 + index * 0.12 }}
      whileHover={{ y: -8 }} whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(plano.id)}
      className="relative flex flex-col h-full cursor-pointer"
      style={{
        background: feat ? RED : '#FFFFFF',
        border: feat
          ? isSelected ? '3px solid rgba(255,255,255,0.6)' : `2px solid ${RED}`
          : `${isSelected ? '2px' : '1px'} solid ${isSelected ? RED : 'rgba(237,28,36,0.18)'}`,
        boxShadow: isSelected
          ? feat ? '0 0 0 3px rgba(237,28,36,0.35)' : '0 8px 32px rgba(237,28,36,0.15)'
          : 'none',
      }}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 flex items-center justify-center z-10"
          style={{ width: 22, height: 22, background: feat ? '#FFFFFF' : RED, color: feat ? RED : '#FFFFFF', fontSize: 12, fontWeight: 700 }}>✓</div>
      )}
      {!feat && <div className="absolute top-0 left-0 right-0" style={{ height: 4, background: 'rgba(237,28,36,0.25)' }} />}

      <div className="relative flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ height: 96, background: feat ? 'rgba(255,255,255,0.1)' : 'rgba(237,28,36,0.05)', borderBottom: feat ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(237,28,36,0.1)' }}>
        {feat && <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 18px, rgba(255,255,255,0.06) 18px, rgba(255,255,255,0.06) 22px)' }} />}
        <Image src="/EscudoOficial.png" alt="Escudo Os Centenários" width={54} height={54} className="object-contain" style={{ opacity: feat ? 0.3 : 0.12 }} />
        <span className="absolute bottom-2 tracking-widest uppercase"
          style={{ fontSize: 9, fontFamily: 'Oswald, sans-serif', fontWeight: 700, letterSpacing: '0.2em', color: feat ? 'rgba(255,255,255,0.5)' : 'rgba(237,28,36,0.35)' }}>
          SEJA SÓCIO
        </span>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <p className="uppercase font-bold mb-0.5" style={{ fontFamily: 'Oswald, sans-serif', fontSize: 22, color: feat ? '#FFFFFF' : RED, letterSpacing: '0.04em' }}>{plano.nome}</p>
        <span className="uppercase tracking-widest block mb-3" style={{ fontSize: 10, color: feat ? 'rgba(255,255,255,0.5)' : 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>Plano Anual</span>
        <div className="flex items-baseline gap-1 mb-2">
          <span style={{ fontFamily: 'Oswald, sans-serif', fontSize: 38, fontWeight: 700, color: feat ? '#FFFFFF' : RED, lineHeight: 1 }}>{plano.preco}</span>
          <span style={{ fontSize: 13, color: feat ? 'rgba(255,255,255,0.55)' : 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
            {plano.id === 'familia' ? '/pessoa/ano' : '/ano'}
          </span>
        </div>
        <div style={{ minHeight: 28, marginBottom: 4 }}>
          {plano.detalhe && (
            <p className="text-xs italic" style={{ color: feat ? 'rgba(255,255,255,0.6)' : 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>{plano.detalhe}</p>
          )}
        </div>
        <div className="mb-3" style={{ height: 1, background: feat ? 'rgba(255,255,255,0.2)' : 'rgba(237,28,36,0.1)' }} />
        <span className="uppercase tracking-widest block mb-2.5" style={{ fontSize: 10, color: feat ? 'rgba(255,255,255,0.45)' : 'rgba(237,28,36,0.4)', fontFamily: 'DM Sans, sans-serif' }}>Benefícios Inclusos</span>
        <ul className="flex flex-col gap-1.5 flex-1">
          {BENEFICIOS.map((b, i) => (
            <li key={i} className="flex items-center gap-2" style={{ fontSize: 13, color: feat ? 'rgba(255,255,255,0.9)' : 'rgba(237,28,36,0.75)', fontFamily: 'DM Sans, sans-serif' }}>
              <span className="inline-flex items-center justify-center flex-shrink-0 rounded-full"
                style={{ width: 18, height: 18, background: feat ? 'rgba(255,255,255,0.2)' : 'rgba(237,28,36,0.1)', color: feat ? '#FFFFFF' : RED, fontSize: 10, fontWeight: 700 }}>✓</span>
              {b.bold && <strong style={{ color: feat ? '#FFFFFF' : RED, marginRight: 2 }}>{b.bold}</strong>}
              {b.texto}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

function JoinCTAStatic() {
  return (
    <section className="w-full py-28 px-4 md:px-12 text-center relative overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="absolute -top-40 -left-20 w-96 h-96 rounded-full opacity-5 pointer-events-none" style={{ background: '#ED1C24' }} aria-hidden="true" />
      <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full opacity-5 pointer-events-none" style={{ background: '#ED1C24' }} aria-hidden="true" />
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex justify-center mb-6">
          <img src="/EscudoOficial.png" alt="Escudo Os Centenários" width={90} height={90} className="object-contain opacity-20 mx-auto" />
        </div>
        <p className="font-ultras text-sm tracking-widest uppercase mb-4" style={{ color: 'rgba(237,28,36,0.6)' }}>Junte-se à família</p>
        <h2 className="font-ultras font-bold text-5xl md:text-7xl lg:text-8xl uppercase leading-none mb-6" style={{ color: '#ED1C24', textShadow: '0 4px 20px rgba(237,28,36,0.15)' }}>
          SEJA UM<br />CENTENÁRIOS
        </h2>
        <div className="mx-auto mb-6" style={{ width: 48, height: 3, background: '#ED1C24' }} />
        <p className="font-body text-lg md:text-xl mb-10 max-w-lg mx-auto" style={{ color: 'rgba(237,28,36,0.75)' }}>
          Apoio incondicional, do início ao fim. Faça parte desta história.
        </p>
        <span className="inline-block px-14 py-5 font-ultras font-bold text-base tracking-widest uppercase" style={{ background: '#ED1C24', color: '#FFFFFF', boxShadow: '0 8px 32px rgba(237,28,36,0.35)' }}>
          CADASTRE-SE AGORA
        </span>
      </div>
    </section>
  )
}

function CadastroPageInner() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<1 | 2>(1)
  const [form, setForm] = useState<FormData>({
    nome: '', email: '', telefone: '', data_nascimento: '',
    cidade: '', cep: '', endereco: '', rg: '', cpf: '',
    como_conheceu: '', carteirinha: 'virtual', plano: 'individual',
  })
  const [errors, setErrors] = useState<FieldError>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const [fotoPreview, setFotoPreview] = useState<string | null>(null)
  const [comprovanteFile, setComprovanteFile] = useState<File | null>(null)
  const [comprovanteName, setComprovanteName] = useState<string | null>(null)
  const [uploadingFoto, setUploadingFoto] = useState(false)
  const [uploadingComp, setUploadingComp] = useState(false)
  const fotoRef = useRef<HTMLInputElement>(null)
  const comprovanteRef = useRef<HTMLInputElement>(null)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const plano = searchParams.get('plano') as PlanoSocio | null
    const carteirinha = searchParams.get('carteirinha') as CarteirinhaOpcao | null
    const stepParam = searchParams.get('step')
    if (plano && ['individual', 'familia'].includes(plano)) setForm(f => ({ ...f, plano }))
    if (carteirinha && ['virtual', 'fisica'].includes(carteirinha)) setForm(f => ({ ...f, carteirinha }))
    if (stepParam === '2') setStep(2)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [step])

  function set(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => { const n = { ...e }; delete n[field]; return n })
  }

  function handleFotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setFotoFile(file); setFotoPreview(URL.createObjectURL(file))
    if (errors.foto) setErrors(e => { const n = { ...e }; delete n.foto; return n })
  }

  function handleComprovanteChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setComprovanteFile(file); setComprovanteName(file.name)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const fieldErrors = validate(form, fotoFile)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      setTimeout(() => {
        const el = document.querySelector('[data-error="true"]')
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }
    if (!comprovanteFile) { setServerError('Anexe o comprovante de pagamento.'); return }
    setLoading(true); setServerError(null)
    try {
      let foto_url: string | null = null
      if (fotoFile) { setUploadingFoto(true); foto_url = await uploadFile(fotoFile, 'socios-fotos'); setUploadingFoto(false) }
      setUploadingComp(true)
      const comprovante_url = await uploadFile(comprovanteFile, 'socios-comprovantes')
      setUploadingComp(false)
      const { error } = await supabase.from('socios').insert([{
        nome: form.nome.trim(), email: form.email.trim().toLowerCase(), telefone: form.telefone,
        data_nascimento: form.data_nascimento || null, cidade: form.cidade.trim(),
        como_conheceu: form.como_conheceu || null, rg: form.rg.trim(),
        cpf: form.cpf.trim() || null, cep: form.cep.trim() || null,
        endereco: form.endereco.trim() || null, foto_url, comprovante_url,
        carteirinha: form.carteirinha, plano: form.plano, status: 'pendente',
      } as import('@/types').SocioInsert])
      if (error) {
        setServerError(error.code === '23505' ? 'Este e-mail já está cadastrado.' : 'Erro ao enviar. Tente novamente.')
      } else { setSuccess(true) }
    } catch { setServerError('Erro ao enviar. Tente novamente.') }
    finally { setLoading(false); setUploadingFoto(false); setUploadingComp(false) }
  }

  if (!success && step === 1) {
    return (
      <main style={{ background: '#FFFFFF', minHeight: '100vh' }}>
        <Navbar />
        <JoinCTAStatic />
        <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-16" style={{ background: '#FFFFFF' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5" style={{ background: '#ED1C24' }}>
              <span className="text-xs font-semibold uppercase tracking-widest text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>Sócio 2026</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-4" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>Escolha seu plano</h1>
            <p className="text-base max-w-lg mx-auto" style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>
              O pagamento é feito via Pix ou cartão de crédito (até 6x via MercadoPago).
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mb-10 px-6 py-4 text-center"
            style={{ background: 'rgba(237,28,36,0.04)', border: '1px solid rgba(237,28,36,0.2)', maxWidth: 480 }}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Banknote size={16} style={{ color: '#ED1C24' }} />
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>Pix</span>
            </div>
            <p className="text-sm font-mono" style={{ color: '#ED1C24' }}>oscentenarios1901@gmail.com</p>
            <p className="text-xs mt-1" style={{ color: 'rgba(237,28,36,0.55)', fontFamily: 'DM Sans, sans-serif' }}>Após pagar, anexe o comprovante no formulário</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 w-full max-w-2xl items-stretch">
            {PLANOS.map((plano, i) => (
              <PlanCard key={plano.id} plano={plano} index={i} selectedPlano={form.plano} onSelect={(id) => setForm(f => ({ ...f, plano: id }))} />
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 flex flex-col items-center gap-4">
            <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>Tipo de carteirinha</p>
            <div className="flex gap-3">
              {([
                { id: 'virtual' as CarteirinhaOpcao, label: 'Virtual (Grátis)' },
                { id: 'fisica'  as CarteirinhaOpcao, label: 'Física (+R$16)'   },
              ]).map(opt => (
                <button key={opt.id} onClick={() => setForm(f => ({ ...f, carteirinha: opt.id }))}
                  className="px-5 py-3 text-sm font-semibold flex items-center gap-2 transition-all"
                  style={{ background: form.carteirinha === opt.id ? RED : 'rgba(237,28,36,0.04)', color: form.carteirinha === opt.id ? '#FFFFFF' : RED, border: `1px solid ${form.carteirinha === opt.id ? RED : 'rgba(237,28,36,0.25)'}`, fontFamily: 'DM Sans, sans-serif' }}>
                  <CreditCard size={14} />{opt.label}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ display: 'inline-block', marginTop: '2.5rem' }}>
            <button onClick={() => setStep(2)}
              className="flex items-center gap-3 px-10 py-5 text-lg font-bold uppercase tracking-widest text-white"
              style={{ background: RED, fontFamily: 'Oswald, sans-serif', boxShadow: '0 8px 32px rgba(237,28,36,0.35)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C41219' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = RED }}>
              Continuar <ChevronRight size={22} />
            </button>
          </motion.div>

          <p className="mt-6 text-xs text-center max-w-sm" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
            * Em até 15 dias sua filiação estará disponível. Dúvidas? Entre em contato pelo Instagram.
          </p>
        </section>
        <Footer />
      </main>
    )
  }

  if (success) {
    return (
      <main style={{ background: '#FFFFFF', minHeight: '100vh' }}>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
              className="inline-flex items-center justify-center w-28 h-28 rounded-full mb-8"
              style={{ background: 'rgba(237,28,36,0.08)', border: '2px solid rgba(237,28,36,0.3)' }}>
              <CheckCircle size={56} style={{ color: '#ED1C24' }} />
            </motion.div>
            <div className="w-16 h-[3px] mx-auto mb-6" style={{ background: '#ED1C24' }} />
            <h2 className="text-5xl font-bold mb-4 uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: '#ED1C24' }}>CADASTRO CONCLUÍDO!</h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(237,28,36,0.75)', fontFamily: 'DM Sans, sans-serif' }}>
              Em um prazo de até 15 dias sua filiação estará concluída. Você será contatado pela Comissão de Sócios da torcida pelo WhatsApp para homologação oficial. 🔴⚪
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: '#ED1C24' }} />
              <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>Apoio incondicional, do início ao fim</span>
              <div className="w-2 h-2 rounded-full" style={{ background: '#ED1C24' }} />
            </div>
          </motion.div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />
      <div className="min-h-screen flex flex-col lg:flex-row pt-20">
        <div className="relative lg:w-5/12 flex flex-col justify-end p-10 lg:p-16 overflow-hidden min-h-[40vh] lg:min-h-screen" style={{ background: RED }}>
          <div className="relative z-10">
            <div className="mb-8"><Image src="/EscudoOficial.png" alt="Escudo" width={120} height={120} className="opacity-90" /></div>
            <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif' }}>— SEJA SÓCIO</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold uppercase leading-none mb-6 text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>BEM-VINDO À BARRA DO<br /> CALDEIRÃO</h1>
            <p className="text-base leading-relaxed mb-8 max-w-xs" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'DM Sans, sans-serif' }}>
              Preencha o formulário. Em até 15 dias sua filiação estará disponível.
            </p>
            <div className="p-4 mb-6" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'DM Sans, sans-serif' }}>Plano selecionado</p>
              <p className="font-bold text-lg text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
                {form.plano === 'individual' ? 'Individual — R$ 50,00/ano' : 'Família — R$ 40,00/pessoa/ano'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'DM Sans, sans-serif' }}>
                Carteirinha {form.carteirinha === 'fisica' ? 'física (+R$16)' : 'virtual (grátis)'}
              </p>
            </div>
            <button onClick={() => setStep(1)} className="text-xs underline opacity-60 hover:opacity-100 transition-opacity text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>← Alterar plano</button>
            <div className="space-y-3 mt-8">
              {beneficiosDetalhados.map((b, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)' }}><b.icon size={18} style={{ color: '#FFFFFF' }} /></div>
                  <div>
                    <span className="text-base font-bold block" style={{ color: '#fff', fontFamily: 'Oswald, sans-serif' }}>{b.titulo}</span>
                    <span className="text-sm block" style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'DM Sans, sans-serif' }}>{b.texto}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center px-6 py-16 bg-white">
          <div className="w-full max-w-xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-3xl font-bold uppercase mb-1" style={{ fontFamily: 'Oswald, sans-serif', color: RED }}>Cadastro Oficial 2026</h2>
              <p className="text-sm mb-2" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>* Todos os campos são obrigatórios</p>
              <div className="w-12 h-[3px] mb-8" style={{ background: RED }} />
              <div className="p-6 md:p-8" style={{ border: '1px solid rgba(237,28,36,0.15)', boxShadow: '0 4px 24px rgba(237,28,36,0.06)' }}>
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Nome */}
                  <div data-error={!!errors.nome || undefined}>
                    <label className={labelBase} style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>Nome completo *</label>
                    <input value={form.nome} onChange={e => set('nome', e.target.value)} className={inputBase} style={inputSt(!!errors.nome)} placeholder="Seu nome completo" />
                    {errors.nome && <p className="text-xs mt-1.5" style={{ color: RED, fontFamily: 'DM Sans, sans-serif' }}>{errors.nome}</p>}
                  </div>

                  {/* Telefone */}
                  <div data-error={!!errors.telefone || undefined}>
                    <label className={labelBase} style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>
                      Número de contato * <span className="normal-case" style={{ color: 'rgba(237,28,36,0.4)' }}>(DDD + 9 + 8 dígitos)</span>
                    </label>
                    <input value={form.telefone} onChange={e => set('telefone', formatPhone(e.target.value))} className={inputBase} style={inputSt(!!errors.telefone)} placeholder="(81) 99999-9999" />
                    {errors.telefone && <p className="text-xs mt-1.5" style={{ color: RED, fontFamily: 'DM Sans, sans-serif' }}>{errors.telefone}</p>}
                  </div>

                  {/* Email */}
                  <div data-error={!!errors.email || undefined}>
                    <label className={labelBase} style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>E-mail *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={inputBase} style={inputSt(!!errors.email)} placeholder="seu@email.com" />
                    {errors.email && <p className="text-xs mt-1.5" style={{ color: RED, fontFamily: 'DM Sans, sans-serif' }}>{errors.email}</p>}
                  </div>

                  {/* RG + CPF */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div data-error={!!errors.rg || undefined}>
                      <label className={labelBase} style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>RG *</label>
                      <input value={form.rg} onChange={e => set('rg', e.target.value)} className={inputBase} style={inputSt(!!errors.rg)} placeholder="0000000" />
                      {errors.rg && <p className="text-xs mt-1.5" style={{ color: RED, fontFamily: 'DM Sans, sans-serif' }}>{errors.rg}</p>}
                    </div>
                    <div data-error={!!errors.cpf || undefined}>
                      <label className={labelBase} style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>CPF *</label>
                      <input value={form.cpf} onChange={e => set('cpf', formatCPF(e.target.value))} className={inputBase} style={inputSt(!!errors.cpf)} placeholder="000.000.000-00" />
                      {errors.cpf && <p className="text-xs mt-1.5" style={{ color: RED, fontFamily: 'DM Sans, sans-serif' }}>{errors.cpf}</p>}
                    </div>
                  </div>

                  {/* Data nascimento + Cidade */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div data-error={!!errors.data_nascimento || undefined}>
                      <label className={labelBase} style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>Data de nascimento *</label>
                      <DatePicker value={form.data_nascimento} onChange={val => set('data_nascimento', val)} maxDate={new Date()} />
                      {errors.data_nascimento && <p className="text-xs mt-1.5" style={{ color: RED, fontFamily: 'DM Sans, sans-serif' }}>{errors.data_nascimento}</p>}
                    </div>
                    <div data-error={!!errors.cidade || undefined}>
                      <label className={labelBase} style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>Cidade *</label>
                      <input value={form.cidade} onChange={e => set('cidade', e.target.value)} className={inputBase} style={inputSt(!!errors.cidade)} placeholder="Sua cidade" />
                      {errors.cidade && <p className="text-xs mt-1.5" style={{ color: RED, fontFamily: 'DM Sans, sans-serif' }}>{errors.cidade}</p>}
                    </div>
                  </div>

                  {/* CEP + Endereço */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div data-error={!!errors.cep || undefined}>
                      <label className={labelBase} style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>CEP *</label>
                      <input value={form.cep} onChange={e => set('cep', formatCEP(e.target.value))} className={inputBase} style={inputSt(!!errors.cep)} placeholder="00000-000" />
                      {errors.cep && <p className="text-xs mt-1.5" style={{ color: RED, fontFamily: 'DM Sans, sans-serif' }}>{errors.cep}</p>}
                    </div>
                    <div data-error={!!errors.endereco || undefined}>
                      <label className={labelBase} style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>Rua e Complemento *</label>
                      <input value={form.endereco} onChange={e => set('endereco', e.target.value)} className={inputBase} style={inputSt(!!errors.endereco)} placeholder="Rua, nº, apto" />
                      {errors.endereco && <p className="text-xs mt-1.5" style={{ color: RED, fontFamily: 'DM Sans, sans-serif' }}>{errors.endereco}</p>}
                    </div>
                  </div>

                  {/* Como conheceu */}
                  <div data-error={!!errors.como_conheceu || undefined}>
                    <label className={labelBase} style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>Como nos conheceu? *</label>
                    <select value={form.como_conheceu} onChange={e => set('como_conheceu', e.target.value)} className={inputBase} style={inputSt(!!errors.como_conheceu)}>
                      <option value="">Selecione...</option>
                      {COMO_CONHECEU.map(op => <option key={op} value={op}>{op}</option>)}
                    </select>
                    {errors.como_conheceu && <p className="text-xs mt-1.5" style={{ color: RED, fontFamily: 'DM Sans, sans-serif' }}>{errors.como_conheceu}</p>}
                  </div>

                  {/* Foto */}
                  <div data-error={!!errors.foto || undefined}>
                    <label className={labelBase} style={{ color: 'rgba(237,28,36,0.7)', fontFamily: 'DM Sans, sans-serif' }}>Foto de rosto para carteira virtual *</label>
                    <div className="relative overflow-hidden cursor-pointer transition-all"
                      style={{ border: `1px dashed ${errors.foto ? RED : 'rgba(237,28,36,0.3)'}`, background: errors.foto ? 'rgba(237,28,36,0.04)' : 'rgba(237,28,36,0.02)', boxShadow: errors.foto ? '0 0 0 2px rgba(237,28,36,0.1)' : 'none' }}
                      onClick={() => fotoRef.current?.click()}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = RED }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = errors.foto ? RED : 'rgba(237,28,36,0.3)' }}>
                      {fotoPreview ? (
                        <div className="relative h-40">
                          <Image src={fotoPreview} alt="Foto preview" fill className="object-cover" sizes="300px" />
                          <button type="button" onClick={e => { e.stopPropagation(); setFotoFile(null); setFotoPreview(null) }} className="absolute top-2 right-2 p-1.5" style={{ background: RED }}>
                            <X size={12} color="#fff" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 py-8">
                          <div className="p-3" style={{ background: 'rgba(237,28,36,0.08)' }}><FileImage size={22} style={{ color: 'rgba(237,28,36,0.4)' }} /></div>
                          <p className="text-sm" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>Clique para enviar foto (máx. 10 MB)</p>
                        </div>
                      )}
                    </div>
                    {errors.foto && <p className="text-xs mt-1.5" style={{ color: RED, fontFamily: 'DM Sans, sans-serif' }}>{errors.foto}</p>}
                    <input ref={fotoRef} type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
                  </div>

                  {/* ── CHAVE PIX ── */}
                  <PixKey />

                  {/* Comprovante */}
                  <div>
                    <label className={labelBase} style={{ color: RED, fontFamily: 'DM Sans, sans-serif' }}>Comprovante de pagamento *</label>
                    <div className="relative cursor-pointer flex items-center gap-4 px-5 py-4 transition-all"
                      style={{ border: `1px dashed ${comprovanteFile ? RED : 'rgba(237,28,36,0.3)'}`, background: comprovanteFile ? 'rgba(237,28,36,0.04)' : 'rgba(237,28,36,0.02)' }}
                      onClick={() => comprovanteRef.current?.click()}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = RED }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = comprovanteFile ? RED : 'rgba(237,28,36,0.3)' }}>
                      <div className="p-2" style={{ background: 'rgba(237,28,36,0.08)' }}><Upload size={18} style={{ color: RED }} /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: comprovanteFile ? RED : 'rgba(237,28,36,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
                          {comprovanteName ?? 'Clique para anexar o comprovante'}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(237,28,36,0.4)', fontFamily: 'DM Sans, sans-serif' }}>Imagem ou PDF — máx. 10 MB</p>
                      </div>
                      {comprovanteFile && (
                        <button type="button" onClick={e => { e.stopPropagation(); setComprovanteFile(null); setComprovanteName(null) }} className="p-1.5 flex-shrink-0" style={{ background: 'rgba(237,28,36,0.1)' }}>
                          <X size={12} style={{ color: RED }} />
                        </button>
                      )}
                    </div>
                    <input ref={comprovanteRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleComprovanteChange} />
                  </div>

                  {serverError && (
                    <p className="text-sm text-center py-3" style={{ color: RED, background: 'rgba(237,28,36,0.06)', border: '1px solid rgba(237,28,36,0.2)', fontFamily: 'DM Sans, sans-serif' }}>{serverError}</p>
                  )}

                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={loading}
                    className="w-full py-4 font-bold uppercase tracking-widest text-lg flex items-center justify-center gap-3 mt-2 text-white disabled:opacity-60"
                    style={{ background: loading ? '#C41219' : RED, fontFamily: 'Oswald, sans-serif', boxShadow: '0 8px 32px rgba(237,28,36,0.3)' }}
                    onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#C41219' }}
                    onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = RED }}>
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {uploadingFoto ? 'Enviando foto...' : uploadingComp ? 'Enviando comprovante...' : 'Salvando...'}
                      </div>
                    ) : (
                      <><span>CONCLUIR</span><ChevronRight size={20} /></>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default function CadastroPage() {
  return (
    <Suspense fallback={null}>
      <CadastroPageInner />
    </Suspense>
  )
}