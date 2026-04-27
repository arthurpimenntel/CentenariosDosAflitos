'use client'
import { usePathname } from 'next/navigation'

/**
 * Returns the current admin base path dynamically from the URL.
 * Works for both '/admin' (local dev) and the secret production path,
 * so internal navigation never needs to know the secret segment.
 *
 * Example:
 *   URL: /98y34by32r7admin3/noticias  →  returns '/98y34by32r7admin3'
 *   URL: /admin/produtos              →  returns '/admin'
 */
export function useAdminPath(): string {
  const pathname = usePathname()
  const segment = pathname.split('/')[1] ?? 'admin'
  return `/${segment}`
}