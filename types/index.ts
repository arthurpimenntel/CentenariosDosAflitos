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
  // Campos extras (precisam da migration SQL para existir no banco)
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
  imagem_url: string | null        // imagem principal (legado / thumb)
  imagens: string[]                // array de URLs — coluna JSONB no banco
  tamanhos: string[]               // ex: ["P","M","G","GG"] — coluna JSONB
  estoque_por_tamanho: Record<string, number> // ex: {"P":5,"M":10} — JSONB
  estoque: number | null                  // total geral (calculado automaticamente)
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
  titulo: string | null
  descricao: string | null
  imagem_url: string
  categoria: string
  ordem: number
  ativo: boolean
  created_at: string
}

export interface HeroFoto {
  id: string
  imagem_url: string
  ordem: number
  ativo: boolean
  created_at: string
}

// ─────────────────────────────────────────────────────────────
//  TIPOS DE INSERT (campos com DEFAULT são opcionais)
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
  titulo?: string | null
  descricao?: string | null
  categoria?: string
  ordem?: number
  ativo?: boolean
}
export type GaleriaFotoUpdate = Partial<GaleriaFotoInsert>

export type HeroFotoInsert = {
  imagem_url: string
  ordem?: number
  ativo?: boolean
}
export type HeroFotoUpdate = Partial<HeroFotoInsert>

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
      hero_fotos: {
        Row: HeroFoto
        Insert: HeroFotoInsert
        Update: HeroFotoUpdate
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      socio_status: SocioStatus
    }
  }
}

// ─────────────────────────────────────────────────────────────
//  TIPOS DE FORMULÁRIO (estado local nos componentes)
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
  estoque_por_tamanho: Record<string, string> // string no form, number no banco
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
