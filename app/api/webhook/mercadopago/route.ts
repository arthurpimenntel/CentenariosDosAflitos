import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/**
 * Verifica a assinatura HMAC-SHA256 enviada pelo Mercado Pago.
 * Docs: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
function verifySignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  if (!secret) return true // se não configurou, não bloqueia (dev mode)

  const xSignature = req.headers.get('x-signature') ?? ''
  const xRequestId = req.headers.get('x-request-id') ?? ''
  const dataId     = new URL(req.url).searchParams.get('data.id') ?? ''

  // Formato: ts=<timestamp>,v1=<hash>
  const parts: Record<string, string> = {}
  xSignature.split(',').forEach(part => {
    const [k, v] = part.split('=')
    if (k && v) parts[k.trim()] = v.trim()
  })

  const ts   = parts['ts']  ?? ''
  const hash = parts['v1']  ?? ''
  if (!ts || !hash) return false

  const template = `id:${dataId};request-id:${xRequestId};ts:${ts};`
  const expected = crypto
    .createHmac('sha256', secret)
    .update(template)
    .digest('hex')

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expected))
}

export async function POST(req: NextRequest) {
  try {
    const rawBody    = await req.text()
    const body       = JSON.parse(rawBody)
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    // Rejeita se a assinatura for inválida
    if (!verifySignature(req, rawBody)) {
      console.warn('[MP Webhook] Assinatura inválida — requisição ignorada.')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    if (body.type === 'payment' && body.data?.id) {
      const paymentId = body.data.id

      const payRes = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )

      if (payRes.ok) {
        const payment = await payRes.json()
        console.log(`[MP Webhook] Pagamento ${paymentId} — status: ${payment.status}`, {
          externalRef: payment.external_reference,
          valor:       payment.transaction_amount,
          status:      payment.status,
          statusDetail:payment.status_detail,
          pagador:     payment.payer?.email,
        })

        // Aqui você pode:
        // 1. Salvar o pedido no Supabase
        // 2. Atualizar estoque dos produtos
        // 3. Enviar e-mail de confirmação
        // if (payment.status === 'approved') { await salvarPedido(payment) }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (err) {
    console.error('[MP Webhook] Error:', err)
    return NextResponse.json({ received: true }, { status: 200 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}