import { NextResponse } from 'next/server';
import { z } from 'zod';
import { flatShippingCents, maxInstallments, siteUrl } from '@/lib/config';
import { hasPaymentProvider, preferences } from '@/lib/mercadopago';
import { getProduct, isPurchasable } from '@/lib/products';
import { getStock, saveOrder, type Order, type OrderItem } from '@/lib/store';

export const runtime = 'nodejs';

const checkoutSchema = z.object({
  items: z
    .array(z.object({ slug: z.string().min(1), quantity: z.number().int().min(1).max(20) }))
    .min(1, 'A sacola está vazia.'),
  customer: z.object({
    name: z.string().trim().min(3, 'Informe seu nome completo.'),
    email: z.string().trim().email('E-mail inválido.'),
    phone: z.string().trim().min(10, 'Telefone com DDD.'),
    cep: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido.'),
    street: z.string().trim().min(2, 'Informe a rua.'),
    number: z.string().trim().min(1, 'Informe o número.'),
    complement: z.string().trim().optional(),
    district: z.string().trim().min(2, 'Informe o bairro.'),
    city: z.string().trim().min(2, 'Informe a cidade.'),
    state: z.string().trim().length(2, 'UF com duas letras.'),
  }),
  note: z.string().trim().max(400).optional(),
});

export async function POST(request: Request) {
  if (!hasPaymentProvider()) {
    return NextResponse.json({ error: 'Pagamento ainda não configurado.' }, { status: 503 });
  }

  const parsed = checkoutSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json({ error: first?.message ?? 'Dados inválidos.' }, { status: 400 });
  }
  const { items, customer, note } = parsed.data;

  // Preço e estoque vêm sempre do servidor, nunca do navegador.
  const orderItems: OrderItem[] = [];
  for (const { slug, quantity } of items) {
    const product = getProduct(slug);
    if (!product || !isPurchasable(product)) {
      return NextResponse.json({ error: 'Um dos produtos não está à venda.' }, { status: 400 });
    }
    const stock = await getStock(slug);
    if (quantity > stock) {
      const msg = stock === 0 ? `${product.name} esgotou.` : `Só restam ${stock} de ${product.name}.`;
      return NextResponse.json({ error: msg }, { status: 409 });
    }
    orderItems.push({ slug, name: product.name, quantity, unitPrice: product.price });
  }

  const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const shipping = flatShippingCents();
  const ref = `FA-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
  const base = siteUrl();
  const now = new Date().toISOString();

  const order: Order = {
    ref,
    status: 'pendente',
    items: orderItems,
    shipping,
    total: subtotal + shipping,
    customer: { ...customer, state: customer.state.toUpperCase() },
    note,
    createdAt: now,
    updatedAt: now,
  };
  await saveOrder(order);

  const [firstName, ...rest] = customer.name.split(' ');
  const phone = customer.phone.replace(/\D/g, '');

  try {
    const preference = await preferences().create({
      body: {
        external_reference: ref,
        items: orderItems.map((i) => ({
          id: i.slug,
          title: i.name,
          quantity: i.quantity,
          unit_price: i.unitPrice / 100,
          currency_id: 'BRL',
        })),
        payer: {
          name: firstName,
          surname: rest.join(' '),
          email: customer.email,
          phone: { area_code: phone.slice(0, 2), number: phone.slice(2) },
        },
        shipments: shipping > 0 ? { cost: shipping / 100, mode: 'not_specified' } : undefined,
        payment_methods: { installments: maxInstallments() },
        back_urls: {
          success: `${base}/pedido/aprovado?ref=${ref}`,
          pending: `${base}/pedido/pendente?ref=${ref}`,
          failure: `${base}/pedido/recusado?ref=${ref}`,
        },
        auto_return: 'approved',
        notification_url: `${base}/api/webhooks/mercadopago`,
        statement_descriptor: 'FAISCA',
        metadata: { ref },
      },
    });

    const url = preference.init_point;
    if (!url) throw new Error('Mercado Pago não retornou o link de pagamento');
    return NextResponse.json({ url, ref });
  } catch (error) {
    console.error('[checkout] erro ao criar preferência', error);
    return NextResponse.json({ error: 'Não conseguimos abrir o pagamento. Tente de novo em instantes.' }, { status: 502 });
  }
}
