import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const code  = searchParams.get('code')
  const token = searchParams.get('token')
  const type  = searchParams.get('type') // 'invite' | 'recovery' | etc.

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  // Fluxo PKCE (code) — mais comum no @supabase/ssr
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Redireciona para a página de definição de senha no admin
      return NextResponse.redirect(`${origin}/admin/set-password`)
    }
  }

  // Fluxo legacy com token direto (invite via email)
  if (token && type === 'invite') {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'invite',
    })
    if (!error) {
      return NextResponse.redirect(`${origin}/admin/set-password`)
    }
  }

  // Qualquer erro redireciona para o admin com aviso
  return NextResponse.redirect(`${origin}/admin?error=auth`)
}