import NoticiaForm from '../_components/NoticiaForm'

export default function NovaNoticiaPage() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6" style={{ color: '#fff', fontFamily: 'Oswald, sans-serif' }}>Nova Notícia</h2>
      <NoticiaForm />
    </div>
  )
}
