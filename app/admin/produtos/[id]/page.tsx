import { createAdminClient } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import ProdutoForm from '../_components/ProdutoForm'

export default async function EditarProdutoPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { data: produto } = await supabase.from('produtos').select('*').eq('id', params.id).single()
  if (!produto) notFound()
  return <div><h2 className="text-xl font-bold mb-6" style={{ color: '#fff', fontFamily: 'Oswald, sans-serif' }}>Editar Produto</h2><ProdutoForm produto={produto} /></div>
}
