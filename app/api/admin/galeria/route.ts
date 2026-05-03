import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const albumId = req.nextUrl.searchParams.get('album_id')

  let query = supabase
    .from('galeria')
    .select('id, imagem_url, descricao, album_id, created_at')
    .eq('ativo', true)
    .order('ordem', { ascending: true })
    .order('created_at', { ascending: false })

  if (albumId) {
    query = query.eq('album_id', albumId)
  }

  const { data, error } = await query

  if (error) return NextResponse.json([], { status: 500 })
  return NextResponse.json(data ?? [])
}