import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import HeroCarousel from '@/components/HeroCarousel'
import MarqueeBand from '@/components/MarqueeBand'
import AboutPreview from '@/components/AboutPreview'
import WhyJoin from '@/components/WhyJoin'
import FeaturedProducts from '@/components/FeaturedProducts'
import NewsPreview from '@/components/NewsPreview'
import JoinCTA from '@/components/JoinCTA'
import Footer from '@/components/Footer'

export const revalidate = 60

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()

  const [{ data: heroFotos }] = await Promise.all([
    supabase
      .from('hero_fotos')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true }),
  ])

  return (
    <main>
      <Navbar />
      <HeroCarousel fotos={heroFotos ?? []} />
      <MarqueeBand />
      <AboutPreview />
      <WhyJoin />
      <FeaturedProducts />
      <NewsPreview />
      {/* <JoinCTA /> Removido e movido para a página de cadastro */}
      <Footer />
    </main>
  )
}