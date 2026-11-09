import { NextResponse } from 'next/server';
import { z } from 'zod';
import { LISTAS_AVISO, addToWaitlist, getWaitlist } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  email: z.string().trim().email().max(200),
  lista: z.enum(LISTAS_AVISO),
  // Campo escondido no formulário: pessoas não preenchem, robôs sim.
  site: z.string().max(0).optional(),
});

/** Inscreve um e-mail numa lista de aviso. */
export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Confira o e-mail e tente de novo.' }, { status: 400 });
  }
  await addToWaitlist(parsed.data.lista, parsed.data.email);
  return NextResponse.json({ ok: true });
}

/**
 * Baixa a lista em CSV: /api/avise-me?lista=gio-soifer&token=SEU_ADMIN_TOKEN
 * O token é a variável de ambiente ADMIN_TOKEN (uma senha longa que só vocês sabem).
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const admin = process.env.ADMIN_TOKEN;
  if (!admin || params.get('token') !== admin) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }
  const lista = z.enum(LISTAS_AVISO).safeParse(params.get('lista') ?? 'gio-soifer');
  if (!lista.success) return NextResponse.json({ error: 'Lista desconhecida.' }, { status: 400 });

  const rows = await getWaitlist(lista.data);
  const csv = ['email,data_inscricao', ...rows.map((r) => `${r.email},${r.data}`)].join('\n');
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="avise-${lista.data}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
