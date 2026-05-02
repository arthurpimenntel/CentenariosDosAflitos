
ALTER TABLE public.produtos
  ADD COLUMN IF NOT EXISTS imagens jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tamanhos jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS estoque_por_tamanho jsonb NOT NULL DEFAULT '{}'::jsonb;


ALTER TABLE public.socios
  ADD COLUMN IF NOT EXISTS rg text,
  ADD COLUMN IF NOT EXISTS cpf text,
  ADD COLUMN IF NOT EXISTS cep text,
  ADD COLUMN IF NOT EXISTS endereco text,
  ADD COLUMN IF NOT EXISTS foto_url text,
  ADD COLUMN IF NOT EXISTS comprovante_url text,
  ADD COLUMN IF NOT EXISTS carteirinha text,
  ADD COLUMN IF NOT EXISTS plano text;


SELECT
  'produtos' AS tabela,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'produtos'
  AND column_name IN ('imagens','tamanhos','estoque_por_tamanho')
UNION ALL
SELECT
  'socios' AS tabela,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'socios'
  AND column_name IN ('rg','cpf','cep','endereco','foto_url','comprovante_url','carteirinha','plano')
ORDER BY tabela, column_name;
