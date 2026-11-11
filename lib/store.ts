import 'server-only';
import { Redis } from '@upstash/redis';
import { usaLojaIntegrada } from './lojaIntegrada';
import { PRODUCTS, getProduct } from './products';

/**
 * Banco da loja: estoque, pedidos e lista de e-mails, num Redis (Upstash).
 *
 * Na Vercel: Storage → Upstash for Redis → Connect to project. A integração cria
 * KV_REST_API_URL e KV_REST_API_TOKEN. Sem o banco, a loja funciona com o estoque
 * fixo do catálogo (lib/products.ts), mas não desconta vendas nem guarda pedidos.
 */

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const redis: Redis | null = url && token ? new Redis({ url, token }) : null;

export function hasDatabase(): boolean {
  return redis !== null;
}

const stockKey = (slug: string) => `estoque:${slug}`;
const orderKey = (ref: string) => `pedido:${ref}`;

/** Estoque atual. No primeiro acesso, o banco é preenchido com o valor do catálogo. */
export async function getStock(slug: string): Promise<number> {
  const product = getProduct(slug);
  if (!product) return 0;
  // Com a Loja Integrada, as vendas acontecem lá: o site usa o número de lib/products.ts.
  if (!redis || usaLojaIntegrada()) return product.stock;
  await redis.set(stockKey(slug), product.stock, { nx: true });
  const value = await redis.get<number>(stockKey(slug));
  return typeof value === 'number' ? value : Number(value ?? 0);
}

export async function getAllStock(): Promise<Record<string, number>> {
  const entries = await Promise.all(PRODUCTS.map(async (p) => [p.slug, await getStock(p.slug)] as const));
  return Object.fromEntries(entries);
}

/** Desconta o estoque de um pedido aprovado. Nunca deixa o número abaixo de zero. */
async function decrementStock(items: OrderItem[]): Promise<void> {
  if (!redis) return;
  for (const item of items) {
    await getStock(item.slug); // garante que a chave existe
    const left = await redis.decrby(stockKey(item.slug), item.quantity);
    if (left < 0) await redis.set(stockKey(item.slug), 0);
  }
}

/** Para repor o estoque de uma fornada nova: chame com o novo número de peças. */
export async function setStock(slug: string, quantity: number): Promise<void> {
  if (!redis) return;
  await redis.set(stockKey(slug), Math.max(0, Math.floor(quantity)));
}

export type OrderItem = { slug: string; name: string; quantity: number; unitPrice: number };

export type OrderStatus = 'pendente' | 'aprovado' | 'recusado' | 'cancelado' | 'devolvido';

export type Customer = {
  name: string;
  email: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
};

export type Order = {
  ref: string;
  status: OrderStatus;
  items: OrderItem[];
  shipping: number;
  total: number;
  customer: Customer;
  note?: string;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
};

export async function saveOrder(order: Order): Promise<void> {
  if (!redis) {
    console.info('[pedido] sem banco configurado; pedido não salvo', order.ref);
    return;
  }
  await redis.set(orderKey(order.ref), order);
  await redis.zadd('pedidos', { score: Date.parse(order.createdAt), member: order.ref });
}

export async function getOrder(ref: string): Promise<Order | null> {
  if (!redis) return null;
  return (await redis.get<Order>(orderKey(ref))) ?? null;
}

/**
 * Atualiza o status de um pedido a partir do pagamento. Idempotente: o Mercado Pago
 * pode avisar o mesmo pagamento várias vezes, mas o estoque só é descontado uma vez.
 */
export async function applyPaymentStatus(ref: string, status: OrderStatus, paymentId: string): Promise<void> {
  if (!redis) {
    console.info('[pagamento] sem banco configurado', { ref, status, paymentId });
    return;
  }
  const order = await getOrder(ref);
  if (!order) {
    console.warn('[pagamento] pedido não encontrado', ref);
    return;
  }

  if (status === 'aprovado') {
    // Só o primeiro aviso de aprovação desconta o estoque.
    const first = await redis.set(`estoque-baixado:${ref}`, paymentId, { nx: true });
    if (first) await decrementStock(order.items);
  }

  await redis.set(orderKey(ref), { ...order, status, paymentId, updatedAt: new Date().toISOString() });
}

export async function addToNewsletter(email: string): Promise<void> {
  if (!redis) {
    console.info('[newsletter] sem banco configurado', email);
    return;
  }
  await redis.sadd('newsletter', email.toLowerCase());
}

/**
 * Listas de "avise-me quando estiver disponível".
 * Cada lista é um conjunto no Redis, na chave `avise:<lista>` (ex.: `avise:gio-soifer`),
 * e guarda também a data de inscrição de cada e-mail em `avise:<lista>:datas`.
 */
export const LISTAS_AVISO = ['gio-soifer'] as const;
export type ListaAviso = (typeof LISTAS_AVISO)[number];

export async function addToWaitlist(lista: ListaAviso, email: string): Promise<void> {
  const value = email.trim().toLowerCase();
  if (!redis) {
    console.info(`[avise-me:${lista}] sem banco configurado`, value);
    return;
  }
  const isNew = await redis.sadd(`avise:${lista}`, value);
  if (isNew) await redis.hset(`avise:${lista}:datas`, { [value]: new Date().toISOString() });
}

export async function getWaitlist(lista: ListaAviso): Promise<{ email: string; data: string }[]> {
  if (!redis) return [];
  const [emails, datas] = await Promise.all([
    redis.smembers(`avise:${lista}`),
    redis.hgetall<Record<string, string>>(`avise:${lista}:datas`),
  ]);
  return emails
    .map((email) => ({ email, data: datas?.[email] ?? '' }))
    .sort((a, b) => a.data.localeCompare(b.data));
}
