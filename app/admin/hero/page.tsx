import { createAdminClient } from '@/lib/supabase-admin'
import HeroAdminClient from './_components/HeroAdminClient'

export default async function AdminHeroPage() {
  const supabase = createAdminClient()
  const { data: fotos } = await supabase.from('hero_fotos').select('*').order('ordem', { ascending: true })
  return <HeroAdminClient fotos={fotos ?? []} />
}
