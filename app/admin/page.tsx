import { createAdminClient } from '@/lib/supabase-admin'
import Link from 'next/link'
import { Users, FileText, ShoppingBag, Clock, Plus, TrendingUp } from 'lucide-react'
import AdminStatusBadge from '@/components/admin/AdminStatusBadge'
import { SocioStatus } from '@/types'

interface Metrics {
  totalSocios: number
  sociosPendentes: number
  produtosAtivos: number
  noticiasPublicadas: number
  ultimosSocios: any[]
}

async function getMetrics(): Promise<Metrics> {
  const supabase = createAdminClient()
  const [socios, pendentes, produtos, noticias, ultimosSocios] = await Promise.all([
    supabase.from('socios').select('id', { count: 'exact', head: true }),
    supabase.from('socios').select('id', { count: 'exact', head: true }).eq('status', 'pendente'),
    supabase.from('produtos').select('id', { count: 'exact', head: true }).eq('ativo', true),
    supabase.from('noticias').select('id', { count: 'exact', head: true }).eq('publicado', true),
    supabase.from('socios').select('id, nome, cidade, status, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  return {
    totalSocios: socios.count ?? 0,
    sociosPendentes: pendentes.count ?? 0,
    produtosAtivos: produtos.count ?? 0,
    noticiasPublicadas: noticias.count ?? 0,
    ultimosSocios: ultimosSocios.data ?? [],
  }
}

export default async function AdminDashboard() {
  const metrics = await getMetrics()

  const cards = [
    { label: 'Total de Sócios', value: metrics.totalSocios, icon: Users, href: '/admin/socios', accent: false },
    { label: 'Aguardando Contato', value: metrics.sociosPendentes, icon: Clock, href: '/admin/socios?status=pendente', accent: true },
    { label: 'Produtos Ativos', value: metrics.produtosAtivos, icon: ShoppingBag, href: '/admin/produtos', accent: false },
    { label: 'Notícias Publicadas', value: metrics.noticiasPublicadas, icon: FileText, href: '/admin/noticias', accent: false },
  ]

  return (
    <div className="space-y-8">
      {/* Boas vindas */}
      <div>
        <h2 className="text-2xl font-bold uppercase tracking-widest mb-1" style={{ fontFamily: 'Oswald, sans-serif', color: '#fff' }}>
          Dashboard
        </h2>
        <p className="text-sm opacity-40" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
          Visão geral do painel Centenários dos Aflitos
        </p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => (
          <Link
            key={card.label}
            href={card.href}
            className="group block p-6 rounded-2xl transition-all duration-300 hover:scale-105"
            style={{
              background: card.accent
                ? 'linear-gradient(135deg, rgba(237,28,36,0.9) 0%, rgba(200,18,25,0.9) 100%)'
                : 'rgba(255,255,255,0.05)',
              border: card.accent ? '1px solid rgba(237,28,36,0.3)' : '1px solid rgba(255,255,255,0.1)',
              boxShadow: card.accent
                ? '0 8px 32px rgba(237,28,36,0.3)'
                : '0 4px 16px rgba(0,0,0,0.1)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon size={24} style={{ color: card.accent ? '#fff' : 'rgba(255,255,255,0.7)' }} />
              <TrendingUp size={16} style={{ color: card.accent ? '#fff' : 'rgba(255,255,255,0.5)' }} />
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: '#fff', fontFamily: 'Oswald, sans-serif' }}>
              {card.value}
            </div>
            <div className="text-sm opacity-70" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
              {card.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Últimos sócios */}
      <div className="bg-white/5 rounded-2xl p-6" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold" style={{ color: '#fff', fontFamily: 'Oswald, sans-serif' }}>
            Últimos Sócios Cadastrados
          </h3>
          <Link
            href="/admin/socios"
            className="text-sm font-semibold uppercase tracking-widest transition-colors hover:text-red-400"
            style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'DM Sans, sans-serif' }}
          >
            Ver todos
          </Link>
        </div>
        <div className="space-y-3">
          {metrics.ultimosSocios.map((socio: any) => (
            <div
              key={socio.id}
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#ED1C24', color: '#fff' }}>
                  {socio.nome.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
                    {socio.nome}
                  </p>
                  <p className="text-sm opacity-60" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
                    {socio.cidade}
                  </p>
                </div>
              </div>
              <AdminStatusBadge status={socio.status as SocioStatus} />
            </div>
          ))}
        </div>
      </div>

      {/* Ações rápidas */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-4 opacity-40" style={{ color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
          Ações rápidas
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/noticias/nova">
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{ background: '#ED1C24', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}
            >
              <Plus size={16} />Nova Notícia
            </button>
          </Link>
          <Link href="/admin/produtos/novo">
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(237,28,36,0.4)', fontFamily: 'DM Sans, sans-serif' }}
            >
              <Plus size={16} />Novo Produto
            </button>
          </Link>
          <Link href="/admin/galeria">
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
              style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(237,28,36,0.2)', fontFamily: 'DM Sans, sans-serif' }}
            >
              <TrendingUp size={16} />Ver Galeria
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
