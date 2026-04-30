import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

const SIGNED_URL_EXPIRY = 60 * 60 * 24 // 24 horas

function parseStoragePath(url: string) {
  if (!url) return null
  try {
    if (url.startsWith('http')) {
      const parsed = new URL(url)
      const marker = '/storage/v1/object/public/'
      const index = parsed.pathname.indexOf(marker)
      if (index === -1) return null
      const objectPath = parsed.pathname.slice(index + marker.length)
      const [bucket, ...rest] = objectPath.split('/')
      if (!bucket || rest.length === 0) return null
      return { bucket, path: rest.join('/') }
    }
    const [bucket, ...rest] = url.split('/')
    if (!bucket || rest.length === 0) return null
    return { bucket, path: rest.join('/') }
  } catch {
    return null
  }
}

async function resolveSignedUrl(supabase: ReturnType<typeof createAdminClient>, url: string) {
  const parsed = parseStoragePath(url)
  if (!parsed) return url
  const { data, error } = await supabase.storage
    .from(parsed.bucket)
    .createSignedUrl(parsed.path, SIGNED_URL_EXPIRY)
  return error || !data?.signedUrl ? url : data.signedUrl
}

export async function GET(req: NextRequest) {
  const supabase = createAdminClient()
  const status = req.nextUrl.searchParams.get('status')

  let query = supabase
    .from('socios')
    .select('*')
    .order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)

  const { data: socios } = await query

  // Signed URLs geradas em paralelo — roda depois que a página já abriu com skeleton
  const result = await Promise.all(
    (socios ?? []).map(async socio => {
      const [foto_url, comprovante_url] = await Promise.all([
        socio.foto_url ? resolveSignedUrl(supabase, socio.foto_url) : Promise.resolve(null),
        socio.comprovante_url ? resolveSignedUrl(supabase, socio.comprovante_url) : Promise.resolve(null),
      ])
      return { ...socio, foto_url, comprovante_url }
    })
  )

  return NextResponse.json(result)
}