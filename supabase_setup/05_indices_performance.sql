-- ══════════════════════════════════════════════════════════════════
--  PASSO 5 — Índices de Performance (opcional mas recomendado)
--  Cole no SQL Editor do Supabase e clique Run
-- ══════════════════════════════════════════════════════════════════

-- Produtos: busca por ativo+destaque (home page)
CREATE INDEX IF NOT EXISTS idx_produtos_ativo_destaque
  ON public.produtos(ativo, destaque);

-- Produtos: ordenação por created_at
CREATE INDEX IF NOT EXISTS idx_produtos_created_at
  ON public.produtos(created_at DESC);

-- Notícias: busca por publicado (páginas públicas)
CREATE INDEX IF NOT EXISTS idx_noticias_publicado
  ON public.noticias(publicado, publicado_em DESC);

-- Notícias: busca por slug (página individual)
CREATE INDEX IF NOT EXISTS idx_noticias_slug
  ON public.noticias(slug) WHERE publicado = true;

-- Galeria: busca por ativo+ordem
CREATE INDEX IF NOT EXISTS idx_galeria_ativo_ordem
  ON public.galeria(ativo, ordem ASC);

-- Hero: busca por ativo+ordem
CREATE INDEX IF NOT EXISTS idx_hero_ativo_ordem
  ON public.hero_fotos(ativo, ordem ASC);

-- Sócios: busca por status (admin)
CREATE INDEX IF NOT EXISTS idx_socios_status
  ON public.socios(status, created_at DESC);

-- Sócios: busca por email (evitar duplicatas)
CREATE INDEX IF NOT EXISTS idx_socios_email
  ON public.socios(email);

SELECT 'Índices criados com sucesso.' AS resultado;
