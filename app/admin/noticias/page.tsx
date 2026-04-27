import { createAdminClient } from '@/lib/supabase-admin'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import NoticiaAdminTable from './_components/NoticiaAdminTable'

export default async function AdminNoticiasPage() {
  const supabase = createAdminClient()
  const { data: noticias } = await supabase
    .from('noticias')
    .select('*')
    .order('created_at', { ascending: false })

  const h = await headers()
  const adminBase = h.get('x-admin-base') ?? '/admin'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm opacity-50" style={{ color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>
          {noticias?.length ?? 0} notícias
        </p>
        <Link href={`${adminBase}/noticias/nova`}>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}
          >
            <Plus size={16} />Nova Notícia
          </button>
        </Link>
      </div>
      <NoticiaAdminTable noticias={noticias ?? []} />
    </div>
  )
}