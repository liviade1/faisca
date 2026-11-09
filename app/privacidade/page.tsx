import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { NEGOCIO, contatoHref, contatoLabel } from '@/lib/negocio';

export const metadata: Metadata = { title: 'Privacidade', description: 'Como a Faísca trata os seus dados.' };

export default function PrivacidadePage() {
  const empresa = [NEGOCIO.razaoSocial, NEGOCIO.cnpj && `CNPJ ${NEGOCIO.cnpj}`].filter(Boolean).join(', ');
  return (
    <>
      <SiteHeader />
      <main className="wrap inst">
        <div className="priv">
          <span className="label inst__eyebrow">(Política de privacidade)</span>
          <h1 className="inst__title">Seus dados, com cuidado.</h1>
          <p className="inst__sub" style={{ marginBottom: 40 }}>
            Atualizada em novembro de 2026{empresa ? ` · ${empresa}` : ''}
          </p>
          <section>
            <h2>Quais dados coletamos</h2>
            <p>
              Nome, e-mail, telefone e endereço de entrega, que você informa ao fazer um pedido; e o seu e-mail, se
              assinar nossas novidades ou pedir para ser avisado quando uma peça ou colaboração estiver disponível. Os dados de pagamento (cartão, Pix, boleto) são digitados direto no Mercado Pago
              e não passam por nós.
            </p>
          </section>
          <section>
            <h2>Para que usamos</h2>
            <p>Para processar e entregar o seu pedido, falar com você sobre ele e, se você pedir, enviar novidades. Não vendemos seus dados.</p>
          </section>
          <section>
            <h2>Com quem compartilhamos</h2>
            <p>
              Com o Mercado Pago, para o pagamento; com os Correios ou a transportadora, para a entrega; e com os serviços
              que hospedam o site e guardam os pedidos (Vercel e Upstash).
            </p>
          </section>
          <section>
            <h2>Por quanto tempo guardamos</h2>
            <p>
              Os dados do pedido ficam guardados pelo tempo exigido pelas obrigações legais e fiscais ligadas à venda. O
              e-mail das novidades fica até você pedir para sair. O e-mail de um aviso (“avise-me quando estiver
              disponível”) é usado só para esse aviso e apagado depois que ele é enviado.
            </p>
          </section>
          <section>
            <h2>Seus direitos</h2>
            <p>
              Pela Lei Geral de Proteção de Dados, você pode pedir acesso, correção ou exclusão dos seus dados, e cancelar
              o recebimento de e-mails a qualquer momento.
            </p>
          </section>
          <div className="priv__box">
            Dúvidas sobre seus dados? Fale com a gente em <a href={contatoHref()}>{contatoLabel()}</a>.
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
