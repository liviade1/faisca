/** Centavos → "R$ 180" ou "R$ 180,50" (centavos só aparecem quando existem). */
export function formatBRL(cents: number): string {
  const value = cents / 100;
  const fraction = Number.isInteger(value) ? 0 : 2;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: fraction,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Texto de parcelamento, sem prometer "sem juros" (isso depende da conta Mercado Pago). */
export function installmentsText(cents: number, max: number): string | null {
  if (cents <= 0 || max <= 1) return null;
  return `Em até ${max}x no cartão`;
}
