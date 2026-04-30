export const revalidate = 30

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('hero_fotos')
    .select('*')
    .order('ordem', { ascending: true })
  return NextResponse.json(data ?? [])
}