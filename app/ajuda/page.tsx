import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { maxInstallments } from '@/lib/config';
import { INSTAGRAM_DM, NEGOCIO, contatoHref, contatoLabel } from '@/lib/negocio';

export const metadata: Metadata = {
  title: 'Ajuda',
  description: 'Envio, trocas e devoluções, cuidados com as velas, pagamento e contato.',
};

type Item = { q: string; a: string; open?: boolean };

export default function AjudaPage() {
  const prazo = NEGOCIO.prazoPostagem ? `em até ${NEGOCIO.prazoPostagem} dias úteis` : 'em poucos dias úteis';
  const parcelas = maxInstallments();
  const topicos: { id: string; titulo: string; itens: Item[] }[] = [
    {
      id: 'envio',
      titulo: 'Envio e prazos',
      itens: [
        { q: 'Para onde vocês enviam?', a: 'Para todo o Brasil. O valor do frete aparece na sacola, antes do pagamento.', open: true },
        { q: 'Em quanto tempo meu pedido chega?', a: `Embalamos e postamos ${prazo} depois da confirmação do pagamento. O prazo de entrega depende do CEP e aparece no e-mail de envio, junto com o código de rastreio.` },
      ],
    },
    {
      id: 'trocas',
      titulo: 'Trocas e devoluções',
      itens: [
        { q: 'Posso desistir da compra?', a: 'Sim. Você tem até 7 dias corridos depois de receber o pedido para desistir, sem precisar explicar o motivo, como garante o Código de Defesa do Consumidor (art. 49). Devolvemos o valor integral, incluindo o frete. Para pedir, fale com a gente pelo contato abaixo com o número do pedido.' },
        { q: 'A peça chegou quebrada. E agora?', a: `Sentimos muito. Mande fotos da caixa e da peça para ${contatoLabel()} assim que receber. Enviamos outra peça, quando houver, ou devolvemos o valor, como você preferir.` },
        { q: 'O pote é diferente da foto?', a: 'Cada pote é uma peça única, modelada e esmaltada à mão, e a foto da página é da própria peça que você recebe. Variações de luz e de tela podem mudar um pouco a cor.' },
      ],
    },
    {
      id: 'cuidados',
      titulo: 'Cuidados com as velas',
      itens: [
        { q: 'Como acender pela primeira vez?', a: 'Apare o pavio em cerca de 5 mm. Na primeira queima, deixe a vela acesa até toda a superfície derreter até a borda, cerca de 2 horas. Isso evita que a cera afunde só no meio.' },
        { q: 'Cuidados de segurança', a: 'Nunca deixe a vela acesa sem ninguém por perto. Mantenha longe de cortinas, crianças e animais, sobre uma superfície que aguente calor. Não queime por mais de 4 horas seguidas e apague quando restar cerca de 1 cm de cera.' },
        { q: 'E o pote, depois?', a: 'Retire o resto da cera com água quente e lave à mão. A maioria dos potes, virada de cabeça para baixo, vira castiçal para as velas de mergulho; os outros podem guardar fósforos, incenso ou uma flor.' },
      ],
    },
    {
      id: 'pagamento',
      titulo: 'Pagamento',
      itens: [
        { q: 'Quais formas de pagamento vocês aceitam?', a: `Pix, cartão de crédito em até ${parcelas}x e boleto, pelo Mercado Pago. Você é levada para o ambiente seguro do Mercado Pago na hora de pagar; os dados do cartão não passam pela Faísca.` },
        { q: 'Quando meu pedido é confirmado?', a: 'Pix confirma em minutos. Boleto pode levar até 3 dias úteis. O Mercado Pago avisa por e-mail assim que o pagamento entra.' },
      ],
    },
  ];

  return (
    <>
      <SiteHeader />
      <main className="wrap inst">
        <span className="label inst__eyebrow">(Ajuda)</span>
        <h1 className="inst__title">Como podemos ajudar?</h1>
        <div className="ajuda">
          <nav aria-label="Tópicos" className="ajuda__nav">
            {topicos.map((t) => (
              <a key={t.id} href={`#${t.id}`}>
                {t.titulo}
              </a>
            ))}
            <a href="#contato">Contato</a>
          </nav>
          <div>
            {topicos.map((t) => (
              <section id={t.id} key={t.id} aria-labelledby={`${t.id}-t`}>
                <h2 id={`${t.id}-t`}>{t.titulo}</h2>
                <div className="ajuda__list">
                  {t.itens.map((i) => (
                    <details key={i.q} open={i.open}>
                      <summary>{i.q}</summary>
                      <p>{i.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
            <section id="contato" className="ajuda__contato" aria-labelledby="contato-t">
              <div>
                <h2 id="contato-t">Contato</h2>
                <p>Não achou o que procurava? Fale com a gente.</p>
              </div>
              <div className="btns">
                {NEGOCIO.email && (
                  <a className="btn btn--primary btn--block" href={contatoHref()}>
                    Escrever para {NEGOCIO.email}
                  </a>
                )}
                <a className={`btn btn--block ${NEGOCIO.email ? 'btn--secondary' : 'btn--primary'}`} href={INSTAGRAM_DM} target="_blank" rel="noopener">
                  Mensagem no Instagram ↗
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
