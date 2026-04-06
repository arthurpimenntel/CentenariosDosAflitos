import { createAdminClient } from '@/lib/supabase-admin'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

const ALLOWED_BUCKETS = ['noticias', 'produtos', 'galeria', 'hero'] as const
type Bucket = typeof ALLOWED_BUCKETS[number]

export async function POST(req: Request) {
  // Verificar autenticação
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { bucket, url } = await req.json()
  if (!bucket || !url) return NextResponse.json({ error: 'Missing bucket or url' }, { status: 400 })
  if (!ALLOWED_BUCKETS.includes(bucket as Bucket)) return NextResponse.json({ error: 'Invalid bucket' }, { status: 400 })

  const admin = createAdminClient()
  // Extrair path do arquivo a partir da URL pública
  const path = (url as string).split(`/${bucket}/`)[1]
  if (!path) return NextResponse.json({ error: 'Invalid url' }, { status: 400 })

  const { error } = await admin.storage.from(bucket).remove([path])
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ success: true })
}
