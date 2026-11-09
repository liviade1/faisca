import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ClearCartOnSuccess } from '@/components/ClearCartOnSuccess';
import { INSTAGRAM_URL, SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = { title: 'Pedido', robots: { index: false } };

const COPY = {
  aprovado: {
    label: '(Pedido confirmado)',
    title: 'Obrigada. A chama já está a caminho.',
    text: 'Recebemos o seu pagamento. Vamos embalar tudo à mão e mandar o código de rastreio para o seu e-mail.',
  },
  pendente: {
    label: '(Pagamento em análise)',
    title: 'Quase lá.',
    text: 'Seu pagamento ainda está sendo processado. Se você pagou com Pix ou boleto, pode levar alguns minutos. Avisamos por e-mail assim que confirmar.',
  },
  recusado: {
    label: '(Pagamento não aprovado)',
    title: 'O pagamento não passou.',
    text: 'Nada foi cobrado. Sua sacola continua salva: você pode tentar de novo com outro meio de pagamento.',
  },
} as const;

type Status = keyof typeof COPY;

export default async function OrderStatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ status: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { status } = await params;
  const { ref } = await searchParams;
  if (!(status in COPY)) notFound();
  const copy = COPY[status as Status];

  return (
    <>
      <SiteHeader />
      <main className="wrap status">
        {status === 'aprovado' && <ClearCartOnSuccess />}
        <svg viewBox="335 5 605 595" aria-hidden="true" className="status__spark">
          <polygon
            fill="#AD9317"
            points="638,10 662,265 877,125 693,305 935,385 683,352 770,595 637,375 507,595 593,352 340,385 583,305 400,125 613,265"
          />
        </svg>
        <span className="label muted">{copy.label}</span>
        <h1 className="status__title">{copy.title}</h1>
        <p className="pdp__desc">{copy.text}</p>
        {ref && (
          <div className="status__ref">
            <span className="muted">Pedido</span>
            <strong>{ref}</strong>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 32, maxWidth: 420 }}>
          {status === 'recusado' ? (
            <Link href="/sacola" className="btn btn--primary btn--block">
              Voltar para a sacola
            </Link>
          ) : (
            <Link href="/loja" className="btn btn--primary btn--block">
              Continuar na loja
            </Link>
          )}
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="btn btn--link" style={{ alignSelf: 'center' }}>
            Acompanhe o ateliê no Instagram
          </a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
