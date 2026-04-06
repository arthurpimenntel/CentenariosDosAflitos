-- ══════════════════════════════════════════════════════════════════
--  PASSO 3 — Storage Buckets + Políticas de Acesso
--  Cole no SQL Editor do Supabase e clique Run
--  ATENÇÃO: cria os buckets se não existirem; não sobrescreve existentes
-- ══════════════════════════════════════════════════════════════════

-- ── Criar buckets ─────────────────────────────────────────────────

-- Bucket público: imagens de notícias
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('noticias', 'noticias', true, 10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Bucket público: imagens de produtos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('produtos', 'produtos', true, 10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Bucket público: fotos da galeria
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('galeria', 'galeria', true, 10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Bucket público: fotos do carrossel hero
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('hero', 'hero', true, 10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

-- Bucket PRIVADO: fotos de rosto dos sócios (só admin acessa)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('socios-fotos', 'socios-fotos', false, 10485760,
  ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Bucket PRIVADO: comprovantes de pagamento (só admin acessa)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('socios-comprovantes', 'socios-comprovantes', false, 15728640,
  ARRAY['image/jpeg','image/png','image/webp','application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- ── Políticas de Storage ──────────────────────────────────────────

-- BUCKETS PÚBLICOS: qualquer um pode fazer SELECT (ler/baixar)
-- Service_role faz tudo (INSERT, UPDATE, DELETE)

-- noticias
DROP POLICY IF EXISTS "noticias_storage_read" ON storage.objects;
CREATE POLICY "noticias_storage_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'noticias');

DROP POLICY IF EXISTS "noticias_storage_write" ON storage.objects;
CREATE POLICY "noticias_storage_write"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'noticias') WITH CHECK (bucket_id = 'noticias');

-- produtos
DROP POLICY IF EXISTS "produtos_storage_read" ON storage.objects;
CREATE POLICY "produtos_storage_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'produtos');

DROP POLICY IF EXISTS "produtos_storage_write" ON storage.objects;
CREATE POLICY "produtos_storage_write"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'produtos') WITH CHECK (bucket_id = 'produtos');

-- galeria
DROP POLICY IF EXISTS "galeria_storage_read" ON storage.objects;
CREATE POLICY "galeria_storage_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'galeria');

DROP POLICY IF EXISTS "galeria_storage_write" ON storage.objects;
CREATE POLICY "galeria_storage_write"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'galeria') WITH CHECK (bucket_id = 'galeria');

-- hero
DROP POLICY IF EXISTS "hero_storage_read" ON storage.objects;
CREATE POLICY "hero_storage_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'hero');

DROP POLICY IF EXISTS "hero_storage_write" ON storage.objects;
CREATE POLICY "hero_storage_write"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'hero') WITH CHECK (bucket_id = 'hero');

-- BUCKETS PRIVADOS: INSERT público (sócio envia no cadastro), SELECT/UPDATE/DELETE só service_role

-- socios-fotos: sócio pode fazer upload, admin gerencia
DROP POLICY IF EXISTS "socios_fotos_insert" ON storage.objects;
CREATE POLICY "socios_fotos_insert"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'socios-fotos');

DROP POLICY IF EXISTS "socios_fotos_service" ON storage.objects;
CREATE POLICY "socios_fotos_service"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'socios-fotos') WITH CHECK (bucket_id = 'socios-fotos');

-- socios-comprovantes: sócio pode fazer upload, admin gerencia
DROP POLICY IF EXISTS "socios_comp_insert" ON storage.objects;
CREATE POLICY "socios_comp_insert"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'socios-comprovantes');

DROP POLICY IF EXISTS "socios_comp_service" ON storage.objects;
CREATE POLICY "socios_comp_service"
  ON storage.objects FOR ALL TO service_role
  USING (bucket_id = 'socios-comprovantes') WITH CHECK (bucket_id = 'socios-comprovantes');

-- ── Confirmação ───────────────────────────────────────────────────
SELECT id, name, public FROM storage.buckets
WHERE id IN ('noticias','produtos','galeria','hero','socios-fotos','socios-comprovantes')
ORDER BY id;
