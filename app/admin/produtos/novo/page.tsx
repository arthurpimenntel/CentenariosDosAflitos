"use client"
import ProdutoForm from '../_components/ProdutoForm'
export default function NovoProdutoPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold uppercase tracking-widest mb-1" style={{ color: '#ED1C24', fontFamily: 'Oswald, sans-serif' }}>Novo Produto</h2>
      <p className="text-sm mb-6" style={{ color: 'rgba(237,28,36,0.45)', fontFamily: 'DM Sans, sans-serif' }}>Preencha os campos abaixo para cadastrar um novo produto</p>
      <ProdutoForm />
    </div>
  )
}

