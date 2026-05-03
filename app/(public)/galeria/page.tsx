import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GaleriaClient from '@/components/galeria/GaleriaClient'
import { Camera } from 'lucide-react'

export const revalidate = 60

export default async function GaleriaPage() {
  const supabase = await createServerSupabaseClient()

  // Busca álbuns com contagem de fotos
  const { data: albums } = await supabase
    .from('albums')
    .select('*')
    .order('ordem', { ascending: true })
    .order('created_at', { ascending: false })

  // Para cada álbum busca a contagem e a capa
  const albumsComDados = await Promise.all(
    (albums ?? []).map(async (album: any) => {
      const { count } = await supabase
        .from('galeria')
        .select('id', { count: 'exact', head: true })
        .eq('album_id', album.id)
        .eq('ativo', true)
      return { ...album, _count: count ?? 0 }
    })
  )

  const totalFotos = albumsComDados.reduce((acc, a) => acc + a._count, 0)

  return (
    <main style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-16 px-6 overflow-hidden" style={{ background: '#ED1C24' }}>
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: 'rgba(255,255,255,0.3)' }} aria-hidden="true" />
        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5"
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
                <Camera size={12} style={{ color: '#FFFFFF' }} />
                <span className="text-xs font-semibold uppercase tracking-widest text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {totalFotos} fotos · {albumsComDados.length} álbuns
                </span>
              </div>
              <h1 className="text-7xl md:text-9xl font-bold uppercase leading-none"
                style={{ fontFamily: 'Oswald, sans-serif', color: '#FFFFFF' }}>
                Galeria
              </h1>
            </div>
            <p className="text-base max-w-xs leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, sans-serif' }}>
              Os melhores momentos dos Centenários dos Aflitos registrados para a eternidade.
            </p>
          </div>
          <div className="mt-8 h-[3px] w-16" style={{ background: 'rgba(255,255,255,0.5)' }} />
        </div>
      </section>

      {/* ── ÁLBUNS ── */}
      <section className="px-6 py-16 max-w-7xl mx-auto">
        {albumsComDados.length === 0 ? (
          <div className="text-center py-32">
            <Camera size={64} className="mx-auto mb-6" style={{ color: 'rgba(237,28,36,0.2)' }} />
            <p className="text-2xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: 'rgba(237,28,36,0.3)' }}>
              Em breve, fotos incríveis
            </p>
          </div>
        ) : (
          <GaleriaClient albums={albumsComDados} />
        )}
      </section>

      <Footer />
    </main>
  )
}