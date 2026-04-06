import { createAdminClient } from '@/lib/supabase-admin'
import GaleriaAdminClient from './_components/GaleriaAdminClient'

export default async function AdminGaleriaPage() {
  const supabase = createAdminClient()
  const { data: fotos } = await supabase
    .from('galeria')
    .select('*')
    .order('created_at', { ascending: false })

  return <GaleriaAdminClient fotos={fotos ?? []} />
}