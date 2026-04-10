import { createAdminClient } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import NoticiaForm from '../_components/NoticiaForm'

export default async function EditarNoticiaPage({ params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { data: noticia } = await supabase.from('noticias').select('*').eq('id', params.id).single()
  if (!noticia) notFound()
  return (
    <div>
      <h2 className="text-2xl font-bold uppercase tracking-widest mb-1" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>Editar Notícia</h2>
      <p className="text-sm mb-6" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>{noticia.titulo}</p>
      <NoticiaForm noticia={noticia} />
    </div>
  )
}
