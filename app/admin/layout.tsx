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
      {/*
        AdminSidebar fica FORA do hidden lg:flex para que o botão sanduíche
        e o drawer mobile sempre existam no DOM, mesmo em telas pequenas.
        Em desktop, o próprio AdminSidebar se posiciona como fixed/sticky via aside.
      */}
      <AdminSidebar userEmail={user.email ?? ''} />

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8 overflow-auto" style={{ background: '#fafafa' }}>
          {children}
        </main>
      </div>
    </div>
  )
}