export const revalidate = 0

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(req: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const tabela  = searchParams.get('tabela')  ?? ''
  const acao    = searchParams.get('acao')    ?? ''
  const page    = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const perPage = 50

  const admin = createAdminClient()
  let query = admin
    .from('auditoria')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1)

  if (tabela) query = query.eq('tabela', tabela)
  if (acao)   query = query.eq('acao', acao)

  const { data, error, count } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ registros: data ?? [], total: count ?? 0, page, perPage })
}