import { createAdminClient } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import ProdutoForm from '../_components/ProdutoForm'

export default async function EditarProdutoPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { data: produto } = await supabase.from('produtos').select('*').eq('id', params.id).single()
  if (!produto) notFound()
  const supabase = createAdminClient()
  const { data: produto } = await supabase.from('produtos').select('*').eq('id', params.id).single()
  if (!produto) notFound()
  return (
    <div>
      <h2 className="text-2xl font-bold uppercase tracking-widest mb-1" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>Editar Produto</h2>
      <p className="text-sm mb-6" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>{produto.nome}</p>
      <ProdutoForm produto={produto} />
    </div>
  )
}
