// ─────────────────────────────────────────────────────────────
//  TIPOS BASE
// ─────────────────────────────────────────────────────────────
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type SocioStatus = 'pendente' | 'em_conversa' | 'aprovado' | 'recusado'
export type CarteirinhaOpcao = 'fisica' | 'virtual'
export type PlanoSocio = 'individual' | 'familia'
export type VendaStatus = 'pendente' | 'confirmada' | 'cancelada'

// ─────────────────────────────────────────────────────────────
//  ENTIDADES (Row — o que vem do banco)
// ─────────────────────────────────────────────────────────────
export interface Socio {
  id: string
  nome: string
  email: string
  telefone: string
  data_nascimento: string | null
  cidade: string | null
  como_conheceu: string | null
  status: SocioStatus
  observacoes: string | null
  rg: string | null
  cpf: string | null
  cep: string | null
  endereco: string | null
  foto_url: string | null
  comprovante_url: string | null
  carteirinha: CarteirinhaOpcao | null
  plano: PlanoSocio | null
  created_at: string
  updated_at: string
}

export interface Produto {
  id: string
  nome: string
  descricao: string | null
  preco: number
  categoria: string
  imagem_url: string | null
  imagens: string[]
  tamanhos: string[]
  estoque_por_tamanho: Record<string, number>
  estoque: number | null
  ativo: boolean
  destaque: boolean
  created_at: string
  updated_at: string
}

export interface Noticia {
  id: string
  titulo: string
  slug: string
  resumo: string | null
  conteudo: string | null
  imagem_url: string | null
  publicado: boolean
  publicado_em: string | null
  created_at: string
  updated_at: string
}

export interface GaleriaFoto {
  id: string
  album_id: string | null
  titulo: string | null
  descricao: string | null
  imagem_url: string
  categoria: string
  ordem: number
  ativo: boolean
  created_at: string
}

export interface Album {
  id: string
  nome: string
  descricao: string | null
  capa_url: string | null
  ordem: number
  created_at: string
}

export interface HeroFoto {
  id: string
  imagem_url: string
  ordem: number
  ativo: boolean
  created_at: string
}

export interface HomeFoto {
  id: string
  imagem_url: string
  titulo: string | null
  descricao: string | null
  ordem: number
  ativo: boolean
  created_at: string
}

export interface QuemSomosFoto {
  id: string
  imagem_url: string
  titulo: string | null
  descricao: string | null
  ordem: number
  ativo: boolean
  created_at: string
}

export interface ItemVenda {
  nome: string
  quantidade: number
  preco: number
  tamanho?: string | null
}

export interface Venda {
  id: string
  itens: ItemVenda[]
  valor_total: number
  valor_pago: number | null
  status: VendaStatus
  observacoes: string | null
  whatsapp_url: string | null
  cliente_whatsapp_url: string | null
  telefone_cliente: string | null
  created_at: string
  updated_at: string
}

export interface Auditoria {
  id: string
  usuario_id: string
  usuario_email: string | null
  acao: string
  tabela: string
  registro_id: string
  detalhes: Json | null
  created_at: string
}

// ─────────────────────────────────────────────────────────────
//  TIPOS DE INSERT
// ─────────────────────────────────────────────────────────────
export type SocioInsert = {
  nome: string
  email: string
  telefone: string
  data_nascimento?: string | null
  cidade?: string | null
  como_conheceu?: string | null
  status?: SocioStatus
  observacoes?: string | null
  rg?: string | null
  cpf?: string | null
  cep?: string | null
  endereco?: string | null
  foto_url?: string | null
  comprovante_url?: string | null
  carteirinha?: CarteirinhaOpcao | null
  plano?: PlanoSocio | null
}
export type SocioUpdate = Partial<SocioInsert>

export type ProdutoInsert = {
  nome: string
  descricao?: string | null
  preco: number
  categoria: string
  imagem_url?: string | null
  imagens?: string[]
  tamanhos?: string[]
  estoque_por_tamanho?: Record<string, number>
  estoque?: number
  ativo?: boolean
  destaque?: boolean
}
export type ProdutoUpdate = Partial<ProdutoInsert>

export type NoticiaInsert = {
  titulo: string
  slug: string
  resumo?: string | null
  conteudo?: string | null
  imagem_url?: string | null
  publicado?: boolean
  publicado_em?: string | null
}
export type NoticiaUpdate = Partial<NoticiaInsert>

export type GaleriaFotoInsert = {
  imagem_url: string
  album_id?: string | null
  titulo?: string | null
  descricao?: string | null
  categoria?: string
  ordem?: number
  ativo?: boolean
}
export type GaleriaFotoUpdate = Partial<GaleriaFotoInsert>

export type AlbumInsert = {
  nome: string
  descricao?: string | null
  capa_url?: string | null
  ordem?: number
}
export type AlbumUpdate = Partial<AlbumInsert>

export type HeroFotoInsert = {
  imagem_url: string
  ordem?: number
  ativo?: boolean
}
export type HeroFotoUpdate = Partial<HeroFotoInsert>

export type HomeFotoInsert = {
  imagem_url: string
  titulo?: string | null
  descricao?: string | null
  ordem?: number
  ativo?: boolean
}
export type HomeFotoUpdate = Partial<HomeFotoInsert>

export type QuemSomosFotoInsert = {
  imagem_url: string
  titulo?: string | null
  descricao?: string | null
  ordem?: number
  ativo?: boolean
}
export type QuemSomosFotoUpdate = Partial<QuemSomosFotoInsert>

export type VendaInsert = {
  itens: ItemVenda[]
  valor_total: number
  valor_pago?: number | null
  status?: VendaStatus
  observacoes?: string | null
  whatsapp_url?: string | null
  cliente_whatsapp_url?: string | null
  telefone_cliente?: string | null
}
export type VendaUpdate = Partial<VendaInsert>

// ─────────────────────────────────────────────────────────────
//  SCHEMA DO BANCO (usado pelo cliente Supabase tipado)
// ─────────────────────────────────────────────────────────────
export interface Database {
  public: {
    Tables: {
      socios: {
        Row: Socio
        Insert: SocioInsert
        Update: SocioUpdate
      }
      produtos: {
        Row: Produto
        Insert: ProdutoInsert
        Update: ProdutoUpdate
      }
      noticias: {
        Row: Noticia
        Insert: NoticiaInsert
        Update: NoticiaUpdate
      }
      galeria: {
        Row: GaleriaFoto
        Insert: GaleriaFotoInsert
        Update: GaleriaFotoUpdate
      }
      albums: {
        Row: Album
        Insert: AlbumInsert
        Update: AlbumUpdate
      }
      hero_fotos: {
        Row: HeroFoto
        Insert: HeroFotoInsert
        Update: HeroFotoUpdate
      }
      home_fotos: {
        Row: HomeFoto
        Insert: HomeFotoInsert
        Update: HomeFotoUpdate
      }
      quem_somos_fotos: {
        Row: QuemSomosFoto
        Insert: QuemSomosFotoInsert
        Update: QuemSomosFotoUpdate
      }
      vendas: {
        Row: Venda
        Insert: VendaInsert
        Update: VendaUpdate
      }
      auditoria: {
        Row: Auditoria
        Insert: Omit<Auditoria, 'id' | 'created_at'>
        Update: Partial<Omit<Auditoria, 'id' | 'created_at'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      socio_status: SocioStatus
      venda_status: VendaStatus
    }
  }
}

// ─────────────────────────────────────────────────────────────
//  TIPOS DE FORMULÁRIO
// ─────────────────────────────────────────────────────────────
export interface SocioFormData {
  nome: string
  email: string
  telefone: string
  data_nascimento: string
  cidade: string
  como_conheceu: string
}

export interface ProdutoFormData {
  nome: string
  descricao: string
  preco: string
  categoria: string
  estoque: string
  ativo: boolean
  destaque: boolean
  imagem_url: string
  imagens: string[]
  tamanhos: string[]
  estoque_por_tamanho: Record<string, string>
}

export interface NoticiaFormData {
  titulo: string
  slug: string
  resumo: string
  conteudo: string
  publicado: boolean
  publicado_em: string
  imagem_url: string
}

// ─────────────────────────────────────────────────────────────
//  TIPOS DE UI
// ─────────────────────────────────────────────────────────────
export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

export interface AdminMetrics {
  totalSocios: number
  sociosPendentes: number
  produtosAtivos: number
  noticiasPublicadas: number
}