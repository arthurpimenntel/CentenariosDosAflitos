export const revalidate = 0

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createServerSupabaseClient } from '@/lib/supabase-server'

// ─── Auditoria server-side (bypassa RLS) ─────────────────────────────────────
async function audit(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
  userEmail: string | undefined,
  acao: string,
  tabela: string,
  registroId: string,
  detalhes?: object
) {
  await admin.from('auditoria').insert({
    usuario_id: userId,
    usuario_email: userEmail ?? null,
    acao,
    tabela,
    registro_id: registroId,
    detalhes: detalhes ?? null,
  })
}

export async function GET() {
  const admin = createAdminClient()
  const { data } = await admin
    .from('home_fotos')
    .select('*')
    .eq('ativo', true)
    .order('ordem', { ascending: true })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { imagem_url, ordem } = await req.json()
  if (!imagem_url) return NextResponse.json({ error: 'Missing imagem_url' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('home_fotos')
    .insert({ imagem_url, alt: '', ordem: ordem ?? 0, ativo: true })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  await audit(admin, user.id, user.email, 'insert', 'home_fotos', data.id, { imagem_url })
  return NextResponse.json(data)
}

export async function DELETE(req: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.from('home_fotos').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  await audit(admin, user.id, user.email, 'delete', 'home_fotos', id)
  return NextResponse.json({ success: true })
}

export async function PATCH(req: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, ...fields } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const admin = createAdminClient()
  const { error } = await admin.from('home_fotos').update(fields).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  await audit(admin, user.id, user.email, 'update', 'home_fotos', id, fields)
  return NextResponse.json({ success: true })
}