import { NextRequest, NextResponse } from 'next/server'

// Webhook do Mercado Pago — recebe notificações de pagamento
// Documentação: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    // MP envia type: 'payment' com data.id quando um pagamento ocorre
    if (body.type === 'payment' && body.data?.id) {
      const paymentId = body.data.id

      // Consulta detalhes do pagamento na API do MP
      const payRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (payRes.ok) {
        const payment = await payRes.json()
        console.log(`[MP Webhook] Pagamento ${paymentId} — status: ${payment.status}`, {
          externalRef: payment.external_reference,
          valor: payment.transaction_amount,
          status: payment.status,
          statusDetail: payment.status_detail,
          pagador: payment.payer?.email,
        })

        // ── Aqui você pode:
        //    1. Salvar o pedido no Supabase
        //    2. Atualizar estoque dos produtos
        //    3. Enviar e-mail de confirmação
        //    Exemplo:
        // if (payment.status === 'approved') {
        //   await salvarPedido(payment)
        // }
      }
    }

    // MP espera HTTP 200 para confirmar recebimento
    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    console.error('[MP Webhook] Error:', err)
    // Retorna 200 mesmo em erro para evitar reenvios infinitos do MP
    return NextResponse.json({ received: true }, { status: 200 })
  }
}

// MP também envia GET para validar a URL
export async function GET() {
  return NextResponse.json({ ok: true })
}
