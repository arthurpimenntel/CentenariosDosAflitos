# 🔴 OS CENTENÁRIOS DOS AFLITOS — SETUP COMPLETO

## VISÃO GERAL

O projeto Next.js está 100% integrado com o Supabase.
Execute os SQLs da pasta `supabase_setup/` **uma vez** e coloque o `.env.local` na raiz.

---

## PASSO 1 — .env.local na raiz do projeto

Copie o arquivo `.env.local` desta pasta para a **raiz do projeto** (mesma pasta do `package.json`).

> ⚠️ **NUNCA** faça commit deste arquivo. Ele já está no `.gitignore`.

---

## PASSO 2 — Execute os SQLs no Supabase (em ordem)

Acesse **supabase.com → seu projeto → SQL Editor → New query**.
Cole cada arquivo e clique **Run** — um de cada vez, nesta ordem:

| Arquivo | O que faz |
|---|---|
| `01_funcao_set_updated_at.sql` | Cria a função usada pelos triggers de `updated_at` |
| `02_rls_policies.sql` | Configura toda a segurança Row Level Security |
| `03_storage_buckets.sql` | Cria os 6 buckets de armazenamento |
| `04_seed_produtos.sql` | Insere 3 produtos de teste na loja |
| `05_indices_performance.sql` | Índices de performance *(opcional)* |

### Buckets criados

| Bucket | Público | Uso |
|---|---|---|
| `noticias` | ✅ | Imagens das notícias |
| `produtos` | ✅ | Fotos dos produtos |
| `galeria` | ✅ | Fotos da galeria |
| `hero` | ✅ | Fotos do carrossel da home |
| `socios-fotos` | ❌ | Fotos de rosto dos sócios |
| `socios-comprovantes` | ❌ | Comprovantes de pagamento |

---

## PASSO 3 — Criar usuário Admin

1. Supabase → **Authentication → Users → Add user → Create new user**
2. Preencha e-mail e senha
3. Acesse `/admin/login` com essas credenciais

---

## PASSO 4 — Instalar e rodar

```bash
npm install
npm run dev
```

- Site público: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`

---

## COMO APLICAR OS ARQUIVOS NO PROJETO

```bash
# Na raiz do projeto:
cp -r app/        SEU_PROJETO/app/
cp -r components/ SEU_PROJETO/components/
cp -r lib/        SEU_PROJETO/lib/
cp -r hooks/      SEU_PROJETO/hooks/
cp -r types/      SEU_PROJETO/types/
cp middleware.ts  SEU_PROJETO/
cp tailwind.config.ts SEU_PROJETO/
cp next.config.mjs    SEU_PROJETO/
cp .env.local     SEU_PROJETO/
cp .gitignore     SEU_PROJETO/
```

---

## CORREÇÕES APLICADAS (histórico completo)

| Arquivo | Problema | Solução |
|---|---|---|
| `components/Navbar.tsx` | Navbar invisível sobre seções vermelhas nas páginas internas | Adicionada `borderBottom` branca + `boxShadow` que garantem separação visual em qualquer fundo; na home sem scroll usa fundo escuro semitransparente em vez de totalmente transparente |
| `lib/upload.ts` | Usava `SUPABASE_SERVICE_ROLE_KEY` no browser (client components), expondo a chave secreta no bundle | Substituído por reexport de `upload-client.ts` — todos os uploads passam agora pelas API routes server-side |
| `lib/upload-client.ts` | *Novo arquivo* | Upload seguro via `/api/admin/upload` para admin; sem chave secreta no browser |
| `app/api/upload/socio/route.ts` | *Nova rota* | Upload público para sócios (foto + comprovante) sem exigir login |
| `app/api/admin/storage/delete/route.ts` | *Nova rota* | Delete seguro de arquivos no storage via service_role server-side |
| `app/cadastro/page.tsx` | Chamava `/api/admin/upload` (requer login) para upload do comprovante | Atualizado para `/api/upload/socio` |
| `components/galeria/GaleriaClient.tsx` | `foto.url` / `current.url` — campo não existe no banco | Corrigido para `foto.imagem_url` / `current.imagem_url` |
| `app/admin/galeria/_components/GaleriaAdminClient.tsx` | Usava `uploadImage` (service_role no cliente) | Migrado para `uploadImageAdmin` |
| `app/admin/hero/_components/HeroAdminClient.tsx` | Idem | Migrado para `uploadImageAdmin` |
| `app/admin/noticias/_components/NoticiaForm.tsx` | Idem | Migrado para `uploadImageAdmin` |
| `app/admin/produtos/_components/ProdutoForm.tsx` | Idem | Migrado para `uploadImageAdmin` |
| `supabase_setup/02_rls_policies.sql` | Políticas não incluíam `authenticated` → operações admin client-side (DELETE/UPDATE direto) falhavam silenciosamente com RLS ativado | Reescrito: `authenticated` pode fazer tudo nas tabelas admin; anon só pode INSERT em sócios e SELECT em dados públicos |
| `components/FeaturedProducts.tsx` | Campo `slug` no `SEED_PRODUTOS` não existe no tipo `Produto` | Removido |

---

## ARQUITETURA DE SEGURANÇA

```
Usuário público (anon)
  → SELECT: produtos ativos, notícias publicadas, galeria ativa, hero ativo
  → INSERT: socios (formulário de cadastro)
  → INSERT storage: socios-fotos, socios-comprovantes

Admin logado (authenticated — Supabase Auth)
  → SELECT/INSERT/UPDATE/DELETE: todas as tabelas
  → INSERT storage: noticias, produtos, galeria, hero (via /api/admin/upload)
  → DELETE storage: noticias, produtos, galeria, hero (via /api/admin/storage/delete)
  → Gerencia sócios: atualiza status, observações

Service Role (apenas server-side, nunca no browser)
  → Usado pelas API routes: /api/admin/* e /api/upload/socio
  → Bypass completo de RLS
  → NUNCA exposta no bundle do cliente
```

---

## PRODUTOS DE TESTE (seed)

Inseridos automaticamente pelo SQL 04:

| Produto | Preço | Tamanhos | Destaque |
|---|---|---|---|
| Camisa Centenários 2026 — Titular | R$ 149,90 | P/M/G/GG/XG | ✅ |
| Camisa Centenários 2026 — Goleiro | R$ 149,90 | P/M/G/GG | — |
| Boné Centenários Snapback | R$ 79,90 | Único | ✅ |

