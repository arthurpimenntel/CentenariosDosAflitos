-- ══════════════════════════════════════════════════════════════════
--  PASSO 4 — Produtos de Teste (Seed)
--  Cole no SQL Editor do Supabase e clique Run
--  Insere os 3 produtos de teste para você ver na loja
--  Pode rodar mais de uma vez — usa ON CONFLICT DO NOTHING
-- ══════════════════════════════════════════════════════════════════

INSERT INTO public.produtos
  (id, nome, descricao, preco, categoria, imagem_url, imagens, tamanhos, estoque_por_tamanho, estoque, ativo, destaque)
VALUES
(
  'a1b2c3d4-0001-0001-0001-000000000001',
  'Camisa Centenários 2026 — Titular',
  'A camisa oficial dos Centenários dos Aflitos para a temporada 2026. Listras verticais vermelho e branco, inspirada no uniforme histórico do Timbu. Tecido dry-fit premium com tecnologia de absorção de suor.',
  149.90,
  'Camisas',
  null,
  '[]'::text[],
  ARRAY['P','M','G','GG','XG'],
  '{"P":8,"M":10,"G":7,"GG":4,"XG":1}'::jsonb,
  30,
  true,
  true
),
(
  'a1b2c3d4-0002-0002-0002-000000000002',
  'Camisa Centenários 2026 — Goleiro',
  'Camisa do goleiro edição limitada 2026. Fundo branco com detalhes em vermelho. Ideal para quem quer representar os Centenários com estilo diferenciado. Tecido dry-fit de alta performance.',
  149.90,
  'Camisas',
  null,
  '[]'::text[],
  ARRAY['P','M','G','GG'],
  '{"P":5,"M":6,"G":3,"GG":1}'::jsonb,
  15,
  true,
  false
),
(
  'a1b2c3d4-0003-0003-0003-000000000003',
  'Boné Centenários Snapback',
  'Boné snapback oficial bordado com o escudo dos Centenários dos Aflitos. Aba plana, regulagem traseira em plástico. Edição exclusiva 2026. Tamanho único, serve em todos.',
  79.90,
  'Acessórios',
  null,
  '[]'::text[],
  ARRAY[]::text[],
  '{}'::jsonb,
  20,
  true,
  true
)
ON CONFLICT (id) DO NOTHING;

-- Confirmação
SELECT id, nome, preco, categoria, destaque, estoque FROM public.produtos ORDER BY created_at;
