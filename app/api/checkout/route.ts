import { NextRequest, NextResponse } from 'next/server'

// Mercado Pago Checkout Pro API
// Documentação: https://www.mercadopago.com.br/developers/pt/docs/checkout-pro

interface CartItem {
  produtoId: string
  nome: string
  quantidade: number
  preco: number
  tamanho: string | null
  imagemUrl: string | null
}

interface CheckoutBody {
  items: CartItem[]
  compradorEmail?: string
  compradorNome?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: CheckoutBody = await req.json()

    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 })
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!accessToken) {
      return NextResponse.json({ error: 'Configuração de pagamento ausente' }, { status: 500 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://centenariosdosaflitos.vercel.app'

    // Monta items para a preferência MP
    const mpItems = body.items.map((item) => ({
      id: item.produtoId,
      title: item.tamanho ? `${item.nome} — Tam. ${item.tamanho}` : item.nome,
      quantity: item.quantidade,
      unit_price: Number(item.preco),
      currency_id: 'BRL',
      ...(item.imagemUrl ? { picture_url: item.imagemUrl.startsWith('/') ? `${baseUrl}${item.imagemUrl}` : item.imagemUrl } : {}),
    }))

    const preference: Record<string, unknown> = {
      items: mpItems,
      back_urls: {
        success: `${baseUrl}/checkout/sucesso`,
        failure: `${baseUrl}/checkout/falha`,
        pending: `${baseUrl}/checkout/pendente`,
      },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/webhook/mercadopago`,
      statement_descriptor: 'OS CENTENARIOS',
      external_reference: `centenarios-${Date.now()}`,
    }

    if (body.compradorEmail) {
      preference.payer = {
        email: body.compradorEmail,
        name: body.compradorNome ?? undefined,
      }
    }

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(preference),
    })

    if (!mpRes.ok) {
      const err = await mpRes.text()
      console.error('Mercado Pago error:', err)
      return NextResponse.json({ error: 'Erro ao criar preferência de pagamento' }, { status: 502 })
    }

    const mpData = await mpRes.json()

    return NextResponse.json({
      preferenceId: mpData.id,
      initPoint: mpData.init_point,         // URL de pagamento (produção)
      sandboxInitPoint: mpData.sandbox_init_point, // URL de pagamento (sandbox)
    })
  } catch (err) {
    console.error('Checkout API error:', err)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
