import type { ReactNode } from 'react'
import { Suspense } from 'react'

// Suspense é OBRIGATÓRIO aqui porque o login/page.tsx usa useSearchParams().
// Sem isso, o Next.js 14 lança erro durante o render no servidor.
export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #2a0000 0%, #1a0000 100%)' }}
        >
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}
