import { createAdminClient } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import NoticiaForm from '../_components/NoticiaForm'

export default async function EditarNoticiaPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { data: noticia } = await supabase.from('noticias').select('*').eq('id', params.id).single()
  if (!noticia) notFound()
  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ color: '#fff', fontFamily: 'Oswald, sans-serif' }}>Editar Notícia</h2>
      <NoticiaForm noticia={noticia} />
    </div>
  )
}
