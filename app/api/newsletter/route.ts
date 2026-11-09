import { NextResponse } from 'next/server';
import { z } from 'zod';
import { addToNewsletter } from '@/lib/store';

export const runtime = 'nodejs';

const schema = z.object({ email: z.string().trim().email() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 });
  await addToNewsletter(parsed.data.email);
  return NextResponse.json({ ok: true });
}
