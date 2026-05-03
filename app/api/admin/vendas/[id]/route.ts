export const revalidate = 0

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createServerSupabaseClient } from '@/lib/supabase-server'

async function getUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { status, valor_pago, observacoes } = await req.json()
  const admin = createAdminClient()

  const updates: Record<string, unknown> = {}
  if (status      !== undefined) updates.status      = status
  if (valor_pago  !== undefined) updates.valor_pago  = valor_pago
  if (observacoes !== undefined) updates.observacoes = observacoes

  const { data, error } = await admin.from('vendas').update(updates).eq('id', params.id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  await admin.from('auditoria').insert({
    usuario_id: user.id, usuario_email: user.email ?? null,
    acao: 'update_venda', tabela: 'vendas', registro_id: params.id,
    detalhes: updates,
  })

  return NextResponse.json(data)
}