import { createServerSupabaseClient } from '@/lib/supabase-server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ProdutoGrid from '@/components/loja/ProdutoGrid'
import { ShoppingBag } from 'lucide-react'

export const revalidate = 60

// Produtos seed inline para evitar import de client module
const SEED_PRODUTOS = [
  {
    id: 'seed-1',
    nome: 'Camisa Centenários 2026 — Titular',
    categoria: 'Camisas',
    descricao: 'A camisa oficial dos Centenários dos Aflitos para a temporada 2026. Listras verticais vermelho e branco, inspirada no uniforme histórico do Timbu. Tecido dry-fit premium.',
    preco: 149.90,
    imagem_url: '/torcida1.jpeg',
    imagens: ['/torcida1.jpeg', '/torcida2.jpeg'],
    tamanhos: ['P', 'M', 'G', 'GG', 'XG'],
    estoque: 30,
    estoque_por_tamanho: { P: 8, M: 10, G: 7, GG: 4, XG: 1 },
    destaque: true,
    ativo: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'seed-2',
    nome: 'Camisa Centenários 2026 — Goleiro',
    categoria: 'Camisas',
    descricao: 'Camisa do goleiro edição limitada. Fundo branco com detalhes em vermelho. Ideal para quem quer representar os Centenários com estilo diferenciado. Tecido dry-fit.',
    preco: 149.90,
    imagem_url: '/torcida2.jpeg',
    imagens: ['/torcida2.jpeg', '/torcida3.jpeg'],
    tamanhos: ['P', 'M', 'G', 'GG'],
    estoque: 15,
    estoque_por_tamanho: { P: 5, M: 6, G: 3, GG: 1 },
    destaque: false,
    ativo: true,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'seed-3',
    nome: 'Boné Centenários Snapback',
    categoria: 'Acessórios',
    descricao: 'Boné snapback oficial bordado com o escudo dos Centenários dos Aflitos. Aba plana, regulagem traseira. Edição exclusiva 2026. Tamanho único.',
    preco: 79.90,
    imagem_url: '/torcida3.jpeg',
    imagens: ['/torcida3.jpeg'],
    tamanhos: [],
    estoque: 20,
    estoque_por_tamanho: {},
    destaque: true,
    ativo: true,
    created_at: '',
    updated_at: '',
  },
]

export default async function LojaPage() {
  const supabase = await createServerSupabaseClient()
  const { data: produtos } = await supabase
    .from('produtos')
    .select('*')
    .eq('ativo', true)
    .order('destaque', { ascending: false })
    .order('created_at', { ascending: false })

  // Usa seed quando não há produtos no banco
  const displayProdutos = (produtos && produtos.length > 0) ? produtos : SEED_PRODUTOS

  const total = displayProdutos.length
  let emEstoque = 0
  for (const p of displayProdutos) {
    if ((p.estoque ?? 0) > 0) emEstoque++
  }

  return (
    <main style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section
        className="relative pt-40 pb-20 px-6 overflow-hidden"
        style={{
          background: '#ED1C24',
        }}
      >
        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
                <ShoppingBag size={12} style={{ color: '#FFFFFF' }} />
                <span className="text-xs font-semibold uppercase tracking-widest text-white" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {emEstoque} produtos disponíveis
                </span>
              </div>
              <h1 className="text-7xl md:text-9xl font-bold uppercase leading-none" style={{ fontFamily: 'Oswald, sans-serif', color: '#FFFFFF' }}>
                Loja<br />
                <span style={{ color: 'rgba(255,255,255,0.6)', WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>Oficial</span>
              </h1>
            </div>
            <div className="max-w-xs">
              <p className="text-base leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'DM Sans, sans-serif' }}>
                Vista as cores dos Centenários. Produtos exclusivos para quem carrega o Náutico no peito.
              </p>
              <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
                Pedidos via WhatsApp
              </p>
            </div>
          </div>
          <div className="mt-8 h-[3px] w-16" style={{ background: 'rgba(255,255,255,0.5)' }} />
        </div>
      </section>

      {/* ── GRID ── */}
      <section
        className="px-6 py-16 max-w-7xl mx-auto"
      >
        {total === 0 ? (
          <div className="text-center py-32">
            <ShoppingBag size={64} className="mx-auto mb-6" style={{ color: 'rgba(237,28,36,0.2)' }} />
            <p className="text-2xl font-bold uppercase" style={{ fontFamily: 'Oswald, sans-serif', color: 'rgba(237,28,36,0.3)' }}>
              Em breve, novos produtos
            </p>
          </div>
        ) : (
          <ProdutoGrid produtos={displayProdutos} />
        )}
      </section>

      <Footer />
    </main>
  )
}
