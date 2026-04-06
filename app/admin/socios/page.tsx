import { createAdminClient } from '@/lib/supabase-admin'
import SociosAdminClient from './_components/SociosAdminClient'

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
  const storagePath = parseStoragePath(url)
  if (!storagePath) return url

  const { data, error } = await supabase.storage
    .from(storagePath.bucket)
    .createSignedUrl(storagePath.path, SIGNED_URL_EXPIRY)

  if (error || !data?.signedUrl) {
    return url
  }

  return data.signedUrl
}

export default async function AdminSociosPage({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = createAdminClient()
  let query = supabase.from('socios').select('*').order('created_at', { ascending: false })
  if (searchParams.status) query = query.eq('status', searchParams.status)
  const { data: socios } = await query

  const sociosWithSignedUrls = await Promise.all(
    (socios ?? []).map(async socio => ({
      ...socio,
      foto_url: socio.foto_url ? await resolveSignedUrl(supabase, socio.foto_url) : null,
      comprovante_url: socio.comprovante_url ? await resolveSignedUrl(supabase, socio.comprovante_url) : null,
    }))
  )

  return <SociosAdminClient socios={sociosWithSignedUrls} activeFilter={searchParams.status} />
}
