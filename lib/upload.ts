/**
 * @deprecated Use `uploadImageAdmin` de `@/lib/upload-client` em client components.
 *
 * Este módulo existia para upload direto via Supabase SDK com service_role key,
 * o que expunha a chave secreta no bundle do navegador.
 *
 * Todos os uploads agora passam pela API route `/api/admin/upload` (admin)
 * ou `/api/upload/socio` (cadastro público), que rodam server-side com segurança.
 */

export { uploadImageAdmin as uploadImage } from '@/lib/upload-client'

/** @deprecated Use `deleteImageAdmin` de `@/lib/upload-client` */
export async function deleteImage(_bucket: string, _url: string): Promise<void> {
  console.warn('deleteImage() deprecated — use deleteImageAdmin() from @/lib/upload-client')
}
