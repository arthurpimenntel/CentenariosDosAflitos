/**
 * Upload de imagens para o admin — via API route (server-side com service_role).
 * Use esta função em client components de admin.
 * Evita expor a SUPABASE_SERVICE_ROLE_KEY no bundle do navegador.
 */

type AdminBucket = 'noticias' | 'produtos' | 'galeria' | 'hero'

export async function uploadImageAdmin(
  file: File,
  bucket: AdminBucket
): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('bucket', bucket)

  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    body: fd,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload falhou' }))
    throw new Error(err.error ?? 'Upload falhou')
  }

  const { url } = await res.json()
  return url
}

export async function deleteImageAdmin(
  bucket: AdminBucket,
  url: string
): Promise<void> {
  const res = await fetch('/api/admin/storage/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bucket, url }),
  })
  // Não lança erro se falhar — imagem órfã não quebra o fluxo
  if (!res.ok) console.warn('Falha ao deletar imagem do storage:', url)
}
