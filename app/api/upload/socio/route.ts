import { createAdminClient } from '@/lib/supabase-admin'
import { NextResponse } from 'next/server'

// Buckets permitidos para uploads de sócios (sem autenticação)
const ALLOWED_BUCKETS = ['socios-fotos', 'socios-comprovantes'] as const
type AllowedBucket = typeof ALLOWED_BUCKETS[number]

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File
  const bucket = formData.get('bucket') as string

  if (!file || !bucket) {
    return NextResponse.json({ error: 'Missing file or bucket' }, { status: 400 })
  }

  if (!ALLOWED_BUCKETS.includes(bucket as AllowedBucket)) {
    return NextResponse.json({ error: 'Bucket not allowed' }, { status: 403 })
  }

  const ALLOWED_TYPES: Record<AllowedBucket, string[]> = {
    'socios-fotos': ['image/jpeg', 'image/png', 'image/webp'],
    'socios-comprovantes': ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  }
  if (!ALLOWED_TYPES[bucket as AllowedBucket].includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
  }

  const MAX_SIZE: Record<AllowedBucket, number> = {
    'socios-fotos': 10 * 1024 * 1024,
    'socios-comprovantes': 15 * 1024 * 1024,
  }
  if (file.size > MAX_SIZE[bucket as AllowedBucket]) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const admin = createAdminClient()
  const { error } = await admin.storage
    .from(bucket)
    .upload(fileName, buffer, { contentType: file.type, upsert: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const { data } = admin.storage.from(bucket).getPublicUrl(fileName)
  return NextResponse.json({
    url: data.publicUrl,
    path: `${bucket}/${fileName}`,
    bucket,
  })
}
