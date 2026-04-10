import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="min-h-screen flex" style={{ background: '#FFFFFF' }}>
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#FFFFFF' }}>
      {/* Sidebar vermelha */}
      <div
        className="hidden lg:flex flex-col h-screen sticky top-0"
        style={{ width: 240, background: '#ED1C24', flexShrink: 0 }}
      >
        <AdminSidebar userEmail={user.email ?? ''} />
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8 overflow-auto" style={{ background: '#fafafa' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
    