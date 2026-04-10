import NoticiaForm from '../_components/NoticiaForm'

export default function NovaNoticiaPage() {
  return (
    <div>
    <h2 className="text-2xl font-bold uppercase tracking-widest mb-1" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>Nova Notícia</h2>
      <p className="text-sm mb-6" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>Preencha os campos abaixo para criar uma nova notícia</p>
      <NoticiaForm />
    </div>
  )
}
