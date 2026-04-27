import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminPwaRegistrar from '@/components/admin/AdminPwaRegistrar'

// ── PWA metadata — only injected for admin pages ─────────────────
export const metadata: Metadata = {
  manifest: '/api/admin-manifest',
  title: 'Centenários Admin',
  themeColor: '#ED1C24',
  appleWebApp: {
    capable: true,
    title: 'CA Admin',
    statusBarStyle: 'black-translucent',
  },
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
      <div className="min-h-screen flex" style={{ background: '#FFFFFF' }}>
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
      {/*
        AdminPwaRegistrar:
        • Registers the service worker scoped to the secret admin path
        • Shows "Install App" banner (only Chrome/Edge/Android)
        • NEVER rendered on the public site
      */}
      <AdminPwaRegistrar />
    </div>
  )
}