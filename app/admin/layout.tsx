import type { Metadata, Viewport } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminPwaRegistrar from '@/components/admin/AdminPwaRegistrar'

export const metadata: Metadata = {
  manifest: '/api/admin-manifest',
  title: 'Centenários Admin',
  appleWebApp: {
    capable: true,
    title: 'CA Admin',
    statusBarStyle: 'black-translucent',
  },
}

// Viewport separado — corrige aviso do Next.js e garante modo standalone no iOS
export const viewport: Viewport = {
  themeColor: '#ED1C24',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // ← isso remove a barra de URL no PWA
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="w-full min-h-screen">
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#FFFFFF' }}>
      <AdminSidebar userEmail={user.email ?? ''} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <AdminHeader />
        <main
          className="flex-1 p-6 lg:p-8 overflow-auto"
          style={{ background: '#fafafa' }}
        >
          {children}
        </main>
      </div>
      <AdminPwaRegistrar />
    </div>
  )
}