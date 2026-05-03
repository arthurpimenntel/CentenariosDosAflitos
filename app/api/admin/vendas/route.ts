export const revalidate = 0

import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  const admin = createAdminClient()
  const status = req.nextUrl.searchParams.get('status')
  let query = admin.from('vendas').select('*').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data ?? [])
}

export async function POST(req: Request) {
  const { itens, valor_total, whatsapp_url, cliente_whatsapp_url, telefone_cliente } = await req.json()
  if (!itens || !valor_total) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('vendas')
    .insert({
      itens,
      valor_total,
      valor_pago: valor_total,
      whatsapp_url,
      cliente_whatsapp_url: cliente_whatsapp_url ?? null,
      telefone_cliente: telefone_cliente ?? null,
      status: 'pendente',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  await admin.from('auditoria').insert({
    usuario_id: '00000000-0000-0000-0000-000000000000',
    usuario_email: 'sistema',
    acao: 'insert', tabela: 'vendas', registro_id: data.id,
    detalhes: { valor_total, telefone_cliente: telefone_cliente ?? null },
  })
  return NextResponse.json(data, { status: 201 })
}