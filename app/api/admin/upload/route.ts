import { createAdminClient } from '@/lib/supabase-admin'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const formData = await req.formData()
  const file = formData.get('file') as File
  const bucket = formData.get('bucket') as string
  if (!file || !bucket) return NextResponse.json({ error: 'Missing file or bucket' }, { status: 400 })
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const admin = createAdminClient()
  const { error } = await admin.storage.from(bucket).upload(fileName, buffer, { contentType: file.type, upsert: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  const { data } = admin.storage.from(bucket).getPublicUrl(fileName)
  return NextResponse.json({ url: data.publicUrl })
}
