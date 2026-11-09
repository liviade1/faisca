import { NextResponse } from 'next/server';
import { getAllStock } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Estoque atual de todos os produtos, usado pela sacola para avisar quando algo acaba. */
export async function GET() {
  return NextResponse.json(await getAllStock(), {
    headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' },
  });
}
