import { createAdminClient } from '@/lib/supabase-admin'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Verificar autenticação
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const admin = createAdminClient()

  // Garantir que campos JSONB tenham valores padrão
  const payload = {
    ...body,
    imagens: body.imagens ?? [],
    tamanhos: body.tamanhos ?? [],
    estoque_por_tamanho: body.estoque_por_tamanho ?? {},
  }

  const { data, error } = await admin
    .from('produtos')
    .insert(payload)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
