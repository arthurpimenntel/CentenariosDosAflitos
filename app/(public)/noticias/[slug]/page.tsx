import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CTALink from '@/components/CTALink'
import { Calendar, ArrowLeft, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const revalidate = 60

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase.from('noticias').select('titulo, resumo').eq('slug', params.slug).single()
  return { title: data?.titulo ?? 'Notícia', description: data?.resumo ?? '' }
}

function formatDate(val: string | null | undefined): string | null {
  if (!val) return null
  const d = new Date(val.includes('T') ? val : val + 'T00:00:00')
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function parseLinks(text: string | null) {
  if (!text) return null
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  return parts.map((part, i) => {
    if (/^https?:\/\/[^\s]+$/.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: '#ED1C24',
            fontWeight: 600,
            textDecoration: 'underline',
            wordBreak: 'break-all',
          }}
        >
          {part}
        </a>
      )
    }
    return part
  })
}

export default async function NoticiaPage({ params }: { params: { slug: string } }) {
  const supabase = await createServerSupabaseClient()
  const { data: noticia } = await supabase
    .from('noticias')
    .select('*')
    .eq('slug', params.slug)
    .eq('publicado', true)
    .single()

  if (!noticia) notFound()

  const dataFormatada = formatDate(noticia.publicado_em)
  const tempoLeitura = noticia.conteudo ? Math.max(1, Math.ceil(noticia.conteudo.split(' ').length / 200)) : 1

  return (
    <main style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO COM IMAGEM ── overlay vermelho */}
      <div className="relative h-[65vh] min-h-[440px] overflow-hidden">
        {noticia.imagem_url ? (
          <Image
            src={noticia.imagem_url}
            alt={noticia.titulo}
            fill priority
            className="object-cover object-center"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0" style={{ background: '#ED1C24' }} />
        )}

        {/* Overlay vermelho */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(237,28,36,0.95) 0%, rgba(237,28,36,0.55) 50%, rgba(237,28,36,0.2) 100%)' }}
        />

        <div className="absolute inset-x-0 bottom-0 max-w-3xl mx-auto px-6 pb-12 pt-32">
          <Link href="/noticias" className="inline-flex items-center gap-2 group mb-8">
            <ArrowLeft size={16} style={{ color: 'rgba(255,255,255,0.8)' }} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-sm uppercase tracking-widest font-semibold" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, sans-serif' }}>
              Voltar às notícias
            </span>
          </Link>

          <div className="flex items-center gap-6 mb-5">
            {dataFormatada && (
              <div className="flex items-center gap-2">
                <Calendar size={13} style={{ color: 'rgba(255,255,255,0.6)' }} />
                <time className="text-sm" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans, sans-serif' }}>
                  {dataFormatada}
                </time>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock size={13} style={{ color: 'rgba(255,255,255,0.6)' }} />
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans, sans-serif' }}>
                {tempoLeitura} min de leitura
              </span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight" style={{ fontFamily: 'Oswald, sans-serif', color: '#FFFFFF' }}>
            {noticia.titulo}
          </h1>
        </div>
      </div>

      {/* ── CONTEÚDO ── */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-1" style={{ background: '#ED1C24' }} />
          <div className="w-4 h-1" style={{ background: 'rgba(237,28,36,0.25)' }} />
        </div>

        {noticia.resumo && (
          <p
            className="text-xl md:text-2xl leading-relaxed mb-10 font-medium"
            style={{ color: 'rgba(237,28,36,0.85)', fontFamily: 'DM Sans, sans-serif', borderLeft: '3px solid #ED1C24', paddingLeft: '1.25rem' }}
          >
            {noticia.resumo}
          </p>
        )}

        <div
          className="text-base leading-[1.9] whitespace-pre-wrap"
          style={{ color: 'rgba(237,28,36,0.8)', fontFamily: 'DM Sans, sans-serif' }}
        >
          {parseLinks(noticia.conteudo)}
        </div>

        <div
          className="mt-16 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          style={{ borderTop: '1px solid rgba(237,28,36,0.15)' }}
        >
          <Link href="/noticias" className="inline-flex items-center gap-2 group">
            <ArrowLeft size={16} style={{ color: '#ED1C24' }} className="transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-sm uppercase tracking-widest font-semibold" style={{ color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
              Mais notícias
            </span>
          </Link>
          <CTALink />
        </div>
      </div>

      <Footer />
    </main>
  )
}