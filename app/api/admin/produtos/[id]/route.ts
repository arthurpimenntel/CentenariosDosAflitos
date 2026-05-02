import { createAdminClient } from '@/lib/supabase-admin'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

async function audit(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  userEmail: string | undefined,
  acao: string,
  registroId: string,
  detalhes?: object
) {
  await admin.from('auditoria').insert({
    usuario_id: userId,
    usuario_email: userEmail ?? null,
    acao,
    tabela: 'produtos',
    registro_id: registroId,
    detalhes: detalhes ?? null,
  })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const admin = createAdminClient()

  const { data, error } = await admin
    .from('produtos')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await audit(admin, user.id, user.email, 'update', params.id, body)

  return NextResponse.json(data)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  // Busca o produto antes de deletar para registrar no audit
  const { data: produto } = await admin
    .from('produtos')
    .select('nome, imagem_url')
    .eq('id', params.id)
    .single()

  const { error } = await admin.from('produtos').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await audit(admin, user.id, user.email, 'delete', params.id, { nome: produto?.nome, imagem_url: produto?.imagem_url })

  return NextResponse.json({ success: true })
}