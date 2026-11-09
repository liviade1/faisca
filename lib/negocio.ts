/**
 * Dados da empresa exibidos no rodapé, na Ajuda e na Privacidade.
 * Preencha nas variáveis de ambiente da Vercel (ver .env.example). Razão social,
 * CNPJ e e-mail são obrigatórios por lei para vender pela internet (Decreto 7.962/2013).
 */
export const NEGOCIO = {
  razaoSocial: process.env.NEXT_PUBLIC_RAZAO_SOCIAL?.trim() || '',
  cnpj: process.env.NEXT_PUBLIC_CNPJ?.trim() || '',
  email: process.env.NEXT_PUBLIC_EMAIL_CONTATO?.trim() || '',
  endereco: process.env.NEXT_PUBLIC_ENDERECO?.trim() || 'Curitiba, PR',
  /** Dias úteis para postar depois da confirmação do pagamento. */
  prazoPostagem: process.env.NEXT_PUBLIC_PRAZO_POSTAGEM?.trim() || '',
};

export const INSTAGRAM_URL = 'https://www.instagram.com/atelierfaisca/';
export const INSTAGRAM_DM = 'https://ig.me/m/atelierfaisca';
export const TIKTOK_URL = 'https://www.tiktok.com/@atelierfaisca';

/** Onde a pessoa fala com a Faísca: e-mail se houver, senão a DM do Instagram. */
export function contatoHref(): string {
  return NEGOCIO.email ? `mailto:${NEGOCIO.email}` : INSTAGRAM_DM;
}
export function contatoLabel(): string {
  return NEGOCIO.email || 'nossa DM no Instagram (@atelierfaisca)';
}
