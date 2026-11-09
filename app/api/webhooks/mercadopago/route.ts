import { NextResponse } from 'next/server';
import { isValidWebhookSignature, payments, toOrderStatus } from '@/lib/mercadopago';
import { applyPaymentStatus } from '@/lib/store';

export const runtime = 'nodejs';

/**
 * Avisos de pagamento do Mercado Pago.
 * Cadastre https://SEU-DOMINIO/api/webhooks/mercadopago no painel, evento "Pagamentos".
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const body = (await request.json().catch(() => ({}))) as { type?: string; data?: { id?: string | number } };

  const type = url.searchParams.get('type') ?? body.type;
  const dataId = url.searchParams.get('data.id') ?? (body.data?.id != null ? String(body.data.id) : null);

  if (type !== 'payment' || !dataId) {
    // Outros tipos de aviso não interessam à loja; responde 200 para não haver reenvio.
    return NextResponse.json({ ok: true, ignored: true });
  }

  const valid = isValidWebhookSignature({
    signature: request.headers.get('x-signature'),
    requestId: request.headers.get('x-request-id'),
    dataId,
  });
  if (!valid) return NextResponse.json({ error: 'assinatura inválida' }, { status: 401 });

  try {
    // Nunca confie no corpo do aviso: busca o pagamento direto na API.
    const payment = await payments().get({ id: dataId });
    const ref = payment.external_reference;
    if (!ref) return NextResponse.json({ ok: true, ignored: true });

    await applyPaymentStatus(ref, toOrderStatus(payment.status), String(payment.id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[webhook] erro ao processar pagamento', dataId, error);
    // 500 faz o Mercado Pago tentar de novo mais tarde.
    return NextResponse.json({ error: 'erro ao processar' }, { status: 500 });
  }
}
