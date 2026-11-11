/**
 * Compras pela Loja Integrada.
 *
 * O site mostra as peças; a compra (sacola, frete, pagamento) acontece na Loja Integrada.
 * Ao clicar numa peça, a pessoa vai direto para a página daquela peça na Loja Integrada.
 *
 * Como preencher:
 * 1. O endereço da loja já está aqui (https://faisca-192.lojaintegrada.com.br). Se mudar
 *    (ex.: domínio próprio), cadastre NEXT_PUBLIC_LOJA_INTEGRADA_URL na Vercel, sem barra no final.
 * 2. Abaixo, cole o link de cada peça (no painel da Loja Integrada: Catálogo › Produtos ›
 *    abrir o produto › "Ver na loja", e copie o endereço). Peça com link vazio aparece no
 *    site como "Em breve" e não leva a lugar nenhum, até o link ser preenchido.
 *
 * Sem NEXT_PUBLIC_LOJA_INTEGRADA_URL e sem links, o site volta a usar as próprias páginas
 * de produto, sacola e o Mercado Pago (o modo antigo continua no código).
 */

export const LOJA_INTEGRADA_URL = (process.env.NEXT_PUBLIC_LOJA_INTEGRADA_URL || 'https://faisca-192.lojaintegrada.com.br').trim().replace(/\/+$/, '');

/** Link de cada peça na Loja Integrada. Chave = nome da peça no site (slug em lib/products.ts). */
export const LINKS_LOJA_INTEGRADA: Record<string, string> = {
  ambi: 'https://faisca-192.lojaintegrada.com.br/ambi',
  redondinho: 'https://faisca-192.lojaintegrada.com.br/redondinho',
  'vulcao-azul': 'https://faisca-192.lojaintegrada.com.br/vulcao-azul',
  potinho: 'https://faisca-192.lojaintegrada.com.br/potinho',
  'anciao-rio': 'https://faisca-192.lojaintegrada.com.br/anciao-rio',
  'anciao-colar': 'https://faisca-192.lojaintegrada.com.br/anciao-colar',
  'anciao-alcas': 'https://faisca-192.lojaintegrada.com.br/anciao-alcas',
  'vulcao-p': 'https://faisca-192.lojaintegrada.com.br/vulcao-p',
  'vulcao-m': 'https://faisca-192.lojaintegrada.com.br/vulcao-m',
  'vulcao-g': 'https://faisca-192.lojaintegrada.com.br/vulcao-g',
  'vulcao-gg': 'https://faisca-192.lojaintegrada.com.br/vulcao-gg',
  'vulcao-prata': 'https://faisca-192.lojaintegrada.com.br/vulcao-prata',
  'vulcao-verde': 'https://faisca-192.lojaintegrada.com.br/vulcao-verde',
};

/** A compra acontece na Loja Integrada? (loja configurada ou pelo menos um link preenchido) */
export function usaLojaIntegrada(): boolean {
  return Boolean(LOJA_INTEGRADA_URL) || Object.values(LINKS_LOJA_INTEGRADA).some(Boolean);
}

/** Para onde vai o clique numa peça. `null` = usar a página de produto do próprio site. */
export function linkCompra(slug: string): string | null {
  return LINKS_LOJA_INTEGRADA[slug]?.trim() || null;
}

/** Sacola (carrinho) da Loja Integrada. */
export function linkCarrinho(): string | null {
  return LOJA_INTEGRADA_URL ? `${LOJA_INTEGRADA_URL}/carrinho/index` : null;
}
