import NoticiaCard from './NoticiaCard'
import { Noticia } from '@/types'

export default function NoticiaGrid({ noticias }: { noticias: Noticia[] }) {
  if (noticias.length === 0) return (
    <div className="text-center py-24" style={{ color: '#BBBBBB', fontFamily: 'DM Sans, sans-serif' }}>
      Nenhuma notícia publicada ainda.
    </div>
  )
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {noticias.map((n, i) => <NoticiaCard key={n.id} noticia={n} index={i} />)}
    </div>
  )
}
