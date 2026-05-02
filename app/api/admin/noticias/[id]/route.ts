import { createAdminClient } from '@/lib/supabase-admin'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

async function requireAuth() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await requireAuth()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('noticias')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await supabase.from('auditoria').insert({
    usuario_id: user.id,
    usuario_email: user.email ?? null,
    acao: 'update',
    tabela: 'noticias',
    registro_id: params.id,
    detalhes: { titulo: body.titulo, publicado: body.publicado },
  })

  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const user = await requireAuth()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()

  // Busca o título antes de deletar para registrar no audit
  const { data: noticia } = await supabase
    .from('noticias')
    .select('titulo')
    .eq('id', params.id)
    .single()

  const { error } = await supabase.from('noticias').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await supabase.from('auditoria').insert({
    usuario_id: user.id,
    usuario_email: user.email ?? null,
    acao: 'delete',
    tabela: 'noticias',
    registro_id: params.id,
    detalhes: { titulo: noticia?.titulo },
  })

  return NextResponse.json({ success: true })
}