import { NextResponse } from 'next/server'

/**
 * Serves the PWA Web App Manifest for the admin panel.
 * Dynamically injects the secret admin segment so start_url and scope
 * always point to the correct (secret) URL.
 *
 * Linked ONLY from app/admin/layout.tsx — never from the public site.
 */
export async function GET() {
  const adminSegment = process.env.ADMIN_SECRET_SEGMENT ?? 'admin'
  const adminPath = `/${adminSegment}`

  const manifest = {
    name: 'Centenários Admin',
    short_name: 'CA Admin',
    description: 'Painel Administrativo — Os Centenários dos Aflitos',
    start_url: `${adminPath}/`,
    scope: `${adminPath}/`,
    display: 'standalone',
    background_color: '#1a0000',
    theme_color: '#ED1C24',
    orientation: 'portrait-primary',
    categories: ['productivity'],
    icons: [
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/EscudoOficial.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}