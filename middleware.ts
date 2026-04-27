import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// ── Admin secret path ─────────────────────────────────────────────
// Define ADMIN_SECRET_SEGMENT=98y34by32r7admin3 in .env.local
const ADMIN_SEGMENT = process.env.ADMIN_SECRET_SEGMENT ?? 'admin'
const SECRET_ADMIN = `/${ADMIN_SEGMENT}`
const SECRET_LOGIN = `/${ADMIN_SEGMENT}/login`

// ── Simple in-memory rate limiter for login ───────────────────────
interface RateEntry { count: number; resetAt: number }
const loginAttempts = new Map<string, RateEntry>()
const RATE_MAX = 5
const RATE_WINDOW_MS = 15 * 60 * 1000 // 15 min

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    return false
  }
  if (entry.count >= RATE_MAX) return true
  entry.count++
  return false
}

// ── Middleware ────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Block any direct access to /admin/* — return generic 404
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new NextResponse(null, { status: 404 })
  }

  // 2. Only process our secret admin routes from here on
  const isAdminRoute =
    pathname === SECRET_ADMIN || pathname.startsWith(`${SECRET_ADMIN}/`)
  if (!isAdminRoute) return NextResponse.next()

  // 3. Rate-limit login page
  if (pathname === SECRET_LOGIN) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Muitas tentativas. Aguarde 15 minutos.' },
        {
          status: 429,
          headers: {
            'Retry-After': '900',
            'X-RateLimit-Limit': String(RATE_MAX),
          },
        }
      )
    }
    return NextResponse.next()
  }

  // 4. Auth check for all other secret admin routes
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-admin-base', SECRET_ADMIN)

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL(SECRET_LOGIN, request.url)
    if (pathname.startsWith(SECRET_ADMIN)) {
      loginUrl.searchParams.set('redirect', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  supabaseResponse.headers.set('x-admin-base', SECRET_ADMIN)
  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
}