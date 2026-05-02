// SEM revalidate — hero precisa sempre estar fresco para o carrossel público
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('hero_fotos')
    .select('*')
    .order('ordem', { ascending: true })
  return NextResponse.json(data ?? [])
}

// Chamado pelo HeroAdminClient após insert/delete/reorder para invalidar o cache da home
export async function POST() {
  revalidatePath('/')
  revalidatePath('/api/admin/hero')
  return NextResponse.json({ ok: true })
}