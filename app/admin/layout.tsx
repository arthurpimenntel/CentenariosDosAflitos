import { createServerSupabaseClient } from '@/lib/supabase-server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Para /admin/login, mostrar sem sidebar
    return (
      <div className="min-h-screen flex" style={{ background: '#2a0000' }}>
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#2a0000' }}>
      <AdminSidebar userEmail={user.email ?? ''} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <AdminHeader />
        <main className="flex-1 p-4 lg:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
