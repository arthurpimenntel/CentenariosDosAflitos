import { createAdminClient } from '@/lib/supabase-admin'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import ProdutoAdminTable from './_components/ProdutoAdminTable'

export default async function AdminProdutosPage() {
  const supabase = createAdminClient()
  const { data: produtos } = await supabase
    .from('produtos')
    .select('*')
    .order('created_at', { ascending: false })

  const h = await headers()
  const adminBase = h.get('x-admin-base') ?? '/admin'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm opacity-50" style={{ color: '#1a1a1a', fontFamily: 'DM Sans, sans-serif' }}>
          {produtos?.length ?? 0} produtos
        </p>
        <Link href={`${adminBase}/produtos/novo`}>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}
          >
            <Plus size={16} />Novo Produto
          </button>
        </Link>
      </div>
      <ProdutoAdminTable produtos={produtos ?? []} />
    </div>
  )
}