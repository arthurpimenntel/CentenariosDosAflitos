export const revalidate = 30

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from('produtos')
    .select('*')
    .order('created_at', { ascending: false })
  return NextResponse.json(data ?? [])
}