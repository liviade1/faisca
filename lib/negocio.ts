/**
 * Dados da empresa usados na Ajuda e na Privacidade (o rodapé não mostra esses dados).
 * Preencha nas variáveis de ambiente da Vercel (ver .env.example). Razão social,
 * CNPJ e e-mail são obrigatórios por lei para vender pela internet (Decreto 7.962/2013).
 */
/**
 * CPF nunca aparece no site. A razão social de MEI costuma vir com o CPF da dona no
 * final (ex.: "NOME SOBRENOME 00000000000"); aqui qualquer sequência no formato de
 * CPF (11 dígitos, com ou sem pontos e traço) é retirada antes de ir para a página.
 */
const CPF = /\b\d{3}\.?\d{3}\.?\d{3}[-.\s]?\d{2}\b/g;
function semCpf(value: string | undefined): string {
  return (value ?? '').replace(CPF, '').replace(/\s{2,}/g, ' ').replace(/[\s,·-]+$/, '').trim();
}

/** Só mostra o número se for um CNPJ (14 dígitos). Um CPF digitado aqui por engano fica de fora. */
function soCnpj(value: string | undefined): string {
  const v = (value ?? '').trim();
  return v.replace(/\D/g, '').length === 14 ? v : '';
}

export const NEGOCIO = {
  razaoSocial: semCpf(process.env.NEXT_PUBLIC_RAZAO_SOCIAL),
  cnpj: soCnpj(process.env.NEXT_PUBLIC_CNPJ),
  email: process.env.NEXT_PUBLIC_EMAIL_CONTATO?.trim() || '',
  endereco: semCpf(process.env.NEXT_PUBLIC_ENDERECO) || 'Curitiba, PR',
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
