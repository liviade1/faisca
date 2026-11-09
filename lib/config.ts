/** Configuração lida das variáveis de ambiente (ver .env.example). */

export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (explicit) return explicit;
  // Na Vercel, VERCEL_PROJECT_PRODUCTION_URL e VERCEL_URL vêm sem protocolo.
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:3000';
}

export function maxInstallments(): number {
  const n = Number(process.env.MP_MAX_INSTALLMENTS ?? 3);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

/** Frete fixo em centavos. */
export function flatShippingCents(): number {
  const reais = Number(process.env.FRETE_FIXO ?? 0);
  return Number.isFinite(reais) && reais > 0 ? Math.round(reais * 100) : 0;
}
