import 'server-only';
import crypto from 'node:crypto';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import type { OrderStatus } from './store';

function client(): MercadoPagoConfig {
  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) throw new Error('MP_ACCESS_TOKEN não configurado');
  return new MercadoPagoConfig({ accessToken, options: { timeout: 10_000 } });
}

export function hasPaymentProvider(): boolean {
  return Boolean(process.env.MP_ACCESS_TOKEN);
}

export function preferences(): Preference {
  return new Preference(client());
}

export function payments(): Payment {
  return new Payment(client());
}

/** Status do Mercado Pago → status do pedido. */
export function toOrderStatus(mpStatus: string | undefined): OrderStatus {
  switch (mpStatus) {
    case 'approved':
      return 'aprovado';
    case 'rejected':
      return 'recusado';
    case 'cancelled':
      return 'cancelado';
    case 'refunded':
    case 'charged_back':
      return 'devolvido';
    default:
      // pending, in_process, authorized, in_mediation
      return 'pendente';
  }
}

/**
 * Confere a assinatura do webhook (cabeçalho x-signature).
 * https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
export function isValidWebhookSignature(params: {
  signature: string | null;
  requestId: string | null;
  dataId: string | null;
}): boolean {
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!secret) {
    // Sem segredo configurado não dá para validar. Em produção, configure MP_WEBHOOK_SECRET.
    console.warn('[webhook] MP_WEBHOOK_SECRET ausente: assinatura não verificada');
    return process.env.NODE_ENV !== 'production';
  }
  const { signature, requestId, dataId } = params;
  if (!signature || !dataId) return false;

  const parts = Object.fromEntries(
    signature.split(',').map((part) => {
      const [key, ...rest] = part.trim().split('=');
      return [key, rest.join('=')];
    }),
  );
  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const id = /^[a-z0-9]+$/i.test(dataId) ? dataId.toLowerCase() : dataId;
  let manifest = `id:${id};`;
  if (requestId) manifest += `request-id:${requestId};`;
  manifest += `ts:${ts};`;

  const expected = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(v1);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
