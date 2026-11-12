# Os Centenários dos Aflitos — Site oficial da Barra Brava do Náutico

Site institucional e loja oficial da torcida **Os Centenários dos Aflitos** (Clube Náutico Capibaribe), desenvolvido como Trabalho Prático de **Design UX/UI e Arquitetura de Interface** (ADS).

**Site no ar:** https://www.abarradonautico.com.br

## Visão geral

O produto reúne a presença digital da torcida em um único site responsivo:

- **Início:** carrossel de fotos, quem somos, planos de sócio, produtos em destaque e últimas notícias.
- **Quem Somos** e **Galeria:** história da torcida e álbuns de fotos com visualização ampliada (lightbox).
- **Notícias:** listagem e página de cada notícia.
- **Loja:** catálogo, carrinho e checkout (Mercado Pago ou finalização por WhatsApp).
- **Seja Sócio:** cadastro com escolha de plano e tipo de carteirinha.
- **Painel administrativo** (acesso restrito): gestão de notícias, produtos, galeria, sócios e vendas.

## Tecnologias e justificativas

| Tecnologia | Por que foi escolhida |
|---|---|
| **Next.js 14 (App Router)** | Rotas por pastas, renderização no servidor, SEO (metadata e sitemap) e otimização de imagens e fontes. |
| **TypeScript** | Tipagem dos dados (`types/index.ts`), com menos erros entre os componentes e as respostas do banco. |
| **Tailwind CSS 3** | Framework de estilização moderno, mobile-first, com breakpoints (`sm:`, `md:`, `lg:`) para a responsividade. |
| **Supabase** | Banco PostgreSQL, Storage de imagens e autenticação do painel, com segurança por RLS (Row Level Security). |
| **Framer Motion** | Animações e transições de entrada dos componentes. |
| **Lucide React** | Ícones SVG leves e consistentes. |
| **Mercado Pago** | Pagamento online da loja (checkout e webhook de confirmação). |
| **Vercel** | Hospedagem e publicação contínua a partir do GitHub. |

## Arquitetura de componentes

```
app/(public)/     páginas públicas (Início, Quem Somos, Galeria, Notícias, Loja, Cadastro, Checkout)
app/admin/        painel administrativo
app/api/          rotas de API (checkout, webhook do Mercado Pago, uploads)
components/       componentes reutilizáveis
  loja/           ProdutoCard, ProdutoGrid
  noticias/       NoticiaCard, NoticiaGrid
  galeria/        GaleriaClient
  ui/             Toast, Modal
contexts/         CartContext (estado global do carrinho)
lib/              clientes do Supabase e utilitários
types/            tipos TypeScript
```

Principais componentes: `Navbar`, `Footer`, `HeroCarousel`, `MarqueeBand`, `AboutPreview`, `WhyJoin`, `PlanosSocios`, `FeaturedProducts`, `NewsPreview`, `CartButton`, `CartDrawer` e `DatePicker`. As páginas apenas compõem esses blocos, e nenhuma delas é um arquivo único e estático.

### Independência de telas e fontes de dados

Cada módulo da interface busca os próprios dados e trata as próprias falhas:

- `FeaturedProducts` consulta apenas a tabela `produtos`.
- `NewsPreview` consulta apenas a tabela `noticias`.
- `HeroCarousel` recebe `hero_fotos` do servidor, e `AboutPreview` e `GaleriaClient` carregam as próprias fotos.
- Cada um usa `try/catch` (ou `.catch`) e estado de carregamento próprio. Se uma fonte falhar, o erro fica restrito àquela seção e o restante da página continua funcionando.
- O carrinho é um contexto global (`CartContext`) montado no layout público e persistido no navegador. Ele não depende da listagem de produtos: se o catálogo falhar, os itens já adicionados continuam no carrinho.
- Pagamento (`/api/checkout`) e confirmação (`/api/webhook/mercadopago`) são rotas de API separadas da interface. A origem dos dados (Supabase, rotas `/api` ou outros serviços) pode ser trocada sem alterar a estrutura visual dos componentes.

## Design System no código

- **Variáveis CSS** em `app/globals.css` (`:root`): cores (`--red`, `--red-hover`, `--red-bright`, `--white` e variações de opacidade), fontes (`--font-display`, `--font-body`) e sombras.
- **Tailwind** em `tailwind.config.ts`: cores `red.primary`, `red.hover`, `red.bright` e `navy.accent`, e famílias `display` e `body`.
- **Tipografia:** Oswald (títulos) e DM Sans (texto), carregadas com `next/font`.
- **Identidade:** vermelho oficial do Náutico (`#ED1C24`) e branco, aplicados em todas as páginas.

## Responsividade

Layout mobile-first com os breakpoints do Tailwind, grids adaptáveis e menu hambúrguer no mobile. A interface foi pensada para desktop, tablet e smartphone.

## Acessibilidade (WCAG)

- Idioma do documento definido: `<html lang="pt-BR">`.
- Estrutura semântica com `<header>`, `<nav aria-label="Navegação principal">`, `<main>`, `<section>` e `<footer>`.
- Imagens com atributo `alt`. Elementos decorativos usam `aria-hidden="true"` (faixa em loop, ícones e formas de fundo).
- Botões que só têm ícone usam `aria-label` (fechar, anterior, próxima, carrinho e menu).
- Modais usam `role="dialog"` e `aria-modal`, e os avisos (toasts) usam `role="alert"` e `aria-live`.
- Elementos interativos construídos com `<button>`, `<a>`/`Link` e campos nativos, o que permite navegação pela tecla **Tab**, com indicador de foco visível. Os lightboxes fecham com **Esc**.

## Navegação (rotas principais)

| Rota | Tela |
|---|---|
| `/` | Início |
| `/quem-somos` | Quem Somos |
| `/galeria` | Galeria |
| `/noticias` e `/noticias/[slug]` | Notícias e detalhe |
| `/loja` | Loja |
| `/cadastro` | Seja Sócio |
| `/checkout`, `/checkout/sucesso`, `/checkout/pendente`, `/checkout/falha` | Fluxo de compra |

## Como executar localmente

**Pré-requisitos:** Node.js 18.17 ou superior, npm e um projeto no [Supabase](https://supabase.com).

1. Clone o repositório e instale as dependências:

```bash
git clone https://github.com/arthurpimenntel/CentenariosDosAflitos.git
cd CentenariosDosAflitos
npm install
```

2. Crie o arquivo `.env.local` na raiz do projeto (ele não é versionado) com as variáveis:

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública (anon) do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço, usada apenas no servidor |
| `ADMIN_SECRET_SEGMENT` | Segmento secreto da rota do painel administrativo |
| `NEXT_PUBLIC_BASE_URL` | URL base do site (sem barra no final) |
| `MERCADOPAGO_ACCESS_TOKEN` | Token da aplicação no Mercado Pago |
| `MERCADOPAGO_WEBHOOK_SECRET` | Segredo de validação do webhook |

3. No SQL Editor do Supabase, execute em ordem os arquivos de `supabase_setup/` (`01` a `05`: função de `updated_at`, políticas RLS, buckets, produtos de teste e índices) e, depois, `MIGRATION_SQL.sql`. Esses scripts pressupõem que as tabelas do projeto já existam.

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Acesse http://localhost:3000. Para gerar a versão de produção, use `npm run build` e `npm start`.

> Para avaliar a interface sem configurar o banco, use o link do site no ar, no início deste documento.

## Autor

Desenvolvido por [Arthur Falcão](https://www.arthurfalcaodev.com).
