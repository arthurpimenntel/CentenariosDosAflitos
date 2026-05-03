import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NoticiaGrid from '@/components/noticias/NoticiaGrid'
import Link from 'next/link'
import { Newspaper } from 'lucide-react'
import NoticiaGridClient from '@/components/noticias/NoticiaGridClient'


export const revalidate = 60

export default async function NoticiasPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = Number(searchParams.page ?? '1')
  const perPage = 6
  const from = (page - 1) * perPage

  const supabase = await createServerSupabaseClient()
  const { data: noticias, count } = await supabase
    .from('noticias')
    .select('*', { count: 'exact' })
    .eq('publicado', true)
    .order('publicado_em', { ascending: false })
    .range(from, from + perPage - 1)

  const totalPages = Math.ceil((count ?? 0) / perPage)

  const destaque = page === 1 && noticias && noticias.length > 0 ? noticias[0] : null
  const restantes = page === 1 && destaque ? noticias!.slice(1) : noticias ?? []

  return (
    <main style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        className="relative pt-40 pb-16 px-6 overflow-hidden"
        style={{
          background: '#ED1C24',
        }}
      >
        {/* Barra lateral branca */}
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: 'rgba(255,255,255,0.3)' }} aria-hidden="true" />

        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'DM Sans, sans-serif' }}>
                — Fique por dentro
              </p>
              <h1 className="text-7xl md:text-9xl font-bold uppercase leading-none" style={{ fontFamily: 'Oswald, sans-serif', color: '#FFFFFF' }}>
                Notícias
              </h1>
            </div>
            <p className="text-base max-w-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, sans-serif' }}>
              Tudo sobre os Centenários dos Aflitos e o Clube Náutico Capibaribe.
            </p>
          </div>
          <div className="mt-8 h-[3px] w-16" style={{ background: 'rgba(255,255,255,0.5)' }} />
        </div>
      </section>

      {/* ── NOTÍCIA EM DESTAQUE ── */}
      {destaque && (
        <section className="px-6 pt-12 pb-6 max-w-6xl mx-auto">
          <Link
            href={`/noticias/${destaque.slug}`}
            className="group block overflow-hidden relative img-zoom-wrapper"
            style={{ border: '1px solid rgba(237,28,36,0.15)', boxShadow: '0 4px 24px rgba(237,28,36,0.08)' }}
          >
            <div className="relative h-72 md:h-[440px]">
              {destaque.imagem_url ? (
                <img
                  src={destaque.imagem_url}
                  alt={destaque.titulo}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'rgba(237,28,36,0.04)' }}>
                  <Newspaper size={80} style={{ color: 'rgba(237,28,36,0.2)' }} />
                </div>
              )}
              {/* Overlay vermelho na base */}
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(237,28,36,0.92) 0%, rgba(237,28,36,0.4) 50%, transparent 100%)' }}
              />
              <div className="absolute inset-x-0 bottom-0 p-8">
                <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 text-xs font-semibold uppercase tracking-widest" style={{ background: '#FFFFFF', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}>
                  Em Destaque
                </div>
                <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-3 text-white" style={{ fontFamily: 'Oswald, sans-serif' }}>
                  {destaque.titulo}
                </h2>
                {destaque.resumo && (
                  <p className="text-sm md:text-base max-w-2xl" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, sans-serif' }}>
                    {destaque.resumo}
                  </p>
                )}
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* ── GRID ── */}
      <section
        className="px-6 pb-16 pt-6 max-w-6xl mx-auto"
      >
        {restantes.length > 0 && (
          <>
            {destaque && (
              <p className="text-xs uppercase tracking-widest mb-8" style={{ color: 'rgba(237,28,36,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
                — Mais notícias
              </p>
            )}
            <NoticiaGridClient noticiasIniciais={restantes} />

          </>
        )}

        {(noticias ?? []).length === 0 && (
          <div className="text-center py-32">
            <Newspaper size={64} className="mx-auto mb-6" style={{ color: 'rgba(237,28,36,0.2)' }} />
            <p className="text-2xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: 'rgba(237,28,36,0.3)' }}>
              Nenhuma notícia publicada
            </p>
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-16">
            {page > 1 && (
              <Link
                href={`/noticias?page=${page - 1}`}
                className="px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all hover:scale-105"
                style={{ border: '1px solid rgba(237,28,36,0.25)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ED1C24'; (e.currentTarget as HTMLElement).style.background = 'rgba(237,28,36,0.05)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(237,28,36,0.25)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                ← Anterior
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <Link
                key={p}
                href={`/noticias?page=${p}`}
                className="w-10 h-10 flex items-center justify-center text-sm font-semibold transition-all hover:scale-105"
                style={{
                  background: p === page ? '#ED1C24' : 'rgba(237,28,36,0.04)',
                  color: p === page ? '#FFFFFF' : '#ED1C24',
                  border: `1px solid ${p === page ? '#ED1C24' : 'rgba(237,28,36,0.2)'}`,
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={`/noticias?page=${page + 1}`}
                className="px-5 py-2.5 text-sm font-semibold uppercase tracking-wider transition-all hover:scale-105"
                style={{ border: '1px solid rgba(237,28,36,0.25)', color: '#ED1C24', fontFamily: 'DM Sans, sans-serif' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ED1C24'; (e.currentTarget as HTMLElement).style.background = 'rgba(237,28,36,0.05)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(237,28,36,0.25)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                Próxima →
              </Link>
            )}
          </div>
        )}
      </section>

      <Footer />
    </main>
  )
}
