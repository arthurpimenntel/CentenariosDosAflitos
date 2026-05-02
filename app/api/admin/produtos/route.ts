export const revalidate = 30

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createServerSupabaseClient } from '@/lib/supabase-server'

async function requireAuth() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('produtos')
    .select('*')
    .order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const user = await requireAuth()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const admin = createAdminClient()

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

  // Auditoria
  await admin.from('auditoria').insert({
    usuario_id: user.id,
    usuario_email: user.email,
    acao: 'insert',
    tabela: 'produtos',
    registro_id: data.id,
    detalhes: { nome: data.nome },
  })

  return NextResponse.json(data)
}