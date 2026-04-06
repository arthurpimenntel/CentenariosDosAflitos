-- ══════════════════════════════════════════════════════════════════
--  PASSO 2 — Row Level Security (RLS) + Políticas
--  Cole no SQL Editor do Supabase e clique Run
-- ══════════════════════════════════════════════════════════════════

-- ── Habilitar RLS em todas as tabelas ─────────────────────────────
ALTER TABLE public.socios          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noticias        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galeria         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_fotos      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_imagens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produto_tamanhos ENABLE ROW LEVEL SECURITY;

-- ══════════════════════════════════════════════════════════════════
--  SOCIOS
-- ══════════════════════════════════════════════════════════════════

-- Qualquer pessoa (anon) pode inserir novo sócio (formulário público)
DROP POLICY IF EXISTS "socios_insert_public" ON public.socios;
CREATE POLICY "socios_insert_public"
  ON public.socios FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin (authenticated = logado no Supabase Auth) pode SELECT, UPDATE, DELETE
DROP POLICY IF EXISTS "socios_select_admin" ON public.socios;
CREATE POLICY "socios_select_admin"
  ON public.socios FOR SELECT
  TO authenticated, service_role
  USING (true);

DROP POLICY IF EXISTS "socios_update_admin" ON public.socios;
CREATE POLICY "socios_update_admin"
  ON public.socios FOR UPDATE
  TO authenticated, service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "socios_delete_admin" ON public.socios;
CREATE POLICY "socios_delete_admin"
  ON public.socios FOR DELETE
  TO authenticated, service_role
  USING (true);

-- ══════════════════════════════════════════════════════════════════
--  PRODUTOS
-- ══════════════════════════════════════════════════════════════════

-- Qualquer pessoa lê produtos ativos (loja pública)
DROP POLICY IF EXISTS "produtos_select_public" ON public.produtos;
CREATE POLICY "produtos_select_public"
  ON public.produtos FOR SELECT
  TO anon, authenticated, service_role
  USING (ativo = true OR auth.role() IN ('authenticated','service_role'));

-- Admin gerencia tudo
DROP POLICY IF EXISTS "produtos_all_admin" ON public.produtos;
CREATE POLICY "produtos_all_admin"
  ON public.produtos FOR ALL
  TO authenticated, service_role
  USING (true) WITH CHECK (true);

-- ══════════════════════════════════════════════════════════════════
--  PRODUTO_IMAGENS e PRODUTO_TAMANHOS
-- ══════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "prod_imgs_select_public" ON public.produto_imagens;
CREATE POLICY "prod_imgs_select_public"
  ON public.produto_imagens FOR SELECT
  TO anon, authenticated, service_role
  USING (true);

DROP POLICY IF EXISTS "prod_imgs_all_admin" ON public.produto_imagens;
CREATE POLICY "prod_imgs_all_admin"
  ON public.produto_imagens FOR ALL
  TO authenticated, service_role
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "prod_tam_select_public" ON public.produto_tamanhos;
CREATE POLICY "prod_tam_select_public"
  ON public.produto_tamanhos FOR SELECT
  TO anon, authenticated, service_role
  USING (true);

DROP POLICY IF EXISTS "prod_tam_all_admin" ON public.produto_tamanhos;
CREATE POLICY "prod_tam_all_admin"
  ON public.produto_tamanhos FOR ALL
  TO authenticated, service_role
  USING (true) WITH CHECK (true);

-- ══════════════════════════════════════════════════════════════════
--  NOTICIAS
-- ══════════════════════════════════════════════════════════════════

-- Público lê só notícias publicadas; admin lê tudo
DROP POLICY IF EXISTS "noticias_select_public" ON public.noticias;
CREATE POLICY "noticias_select_public"
  ON public.noticias FOR SELECT
  TO anon
  USING (publicado = true);

DROP POLICY IF EXISTS "noticias_select_admin" ON public.noticias;
CREATE POLICY "noticias_select_admin"
  ON public.noticias FOR SELECT
  TO authenticated, service_role
  USING (true);

-- Admin gerencia tudo
DROP POLICY IF EXISTS "noticias_all_admin" ON public.noticias;
CREATE POLICY "noticias_all_admin"
  ON public.noticias FOR ALL
  TO authenticated, service_role
  USING (true) WITH CHECK (true);

-- ══════════════════════════════════════════════════════════════════
--  GALERIA
-- ══════════════════════════════════════════════════════════════════

-- Público lê só fotos ativas
DROP POLICY IF EXISTS "galeria_select_public" ON public.galeria;
CREATE POLICY "galeria_select_public"
  ON public.galeria FOR SELECT
  TO anon
  USING (ativo = true);

DROP POLICY IF EXISTS "galeria_all_admin" ON public.galeria;
CREATE POLICY "galeria_all_admin"
  ON public.galeria FOR ALL
  TO authenticated, service_role
  USING (true) WITH CHECK (true);

-- ══════════════════════════════════════════════════════════════════
--  HERO_FOTOS
-- ══════════════════════════════════════════════════════════════════

-- Público lê só fotos ativas
DROP POLICY IF EXISTS "hero_select_public" ON public.hero_fotos;
CREATE POLICY "hero_select_public"
  ON public.hero_fotos FOR SELECT
  TO anon
  USING (ativo = true);

DROP POLICY IF EXISTS "hero_all_admin" ON public.hero_fotos;
CREATE POLICY "hero_all_admin"
  ON public.hero_fotos FOR ALL
  TO authenticated, service_role
  USING (true) WITH CHECK (true);

-- ── Confirmação final ─────────────────────────────────────────────
SELECT
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('socios','produtos','noticias','galeria','hero_fotos','produto_imagens','produto_tamanhos')
ORDER BY tablename, cmd;
