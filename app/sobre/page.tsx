import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { INSTAGRAM_URL } from '@/lib/negocio';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'A Faísca faz utilitários contemplativos: velas em potes de cerâmica modelados à mão, em Curitiba.',
};

const PASSOS = [
  { n: '01', titulo: 'Modelamos', texto: 'Cada pote é feito à mão, um a um. Nenhum sai igual ao outro.', foto: '/images/produtos/anciao-alcas/2.webp', alt: 'Pote de terracota com alças, ainda sem vela' },
  { n: '02', titulo: 'Pintamos', texto: 'Os desenhos e esmaltes são aplicados à mão antes da queima final.', foto: '/images/produtos/anciao-rio/2.webp', alt: 'Pote de terracota pintado com faixas azul e verde' },
  { n: '03', titulo: 'Acendemos', texto: 'Vertemos o blend de ceras naturais com o perfume autoral e testamos a queima de cada fornada.', foto: '/images/produtos/potinho/1.webp', alt: 'Vela pronta numa tigela de terracota' },
];

export default function SobrePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="wrap sobre-hero">
          <div>
            <span className="label inst__eyebrow">(Sobre a Faísca)</span>
            <h1 style={{ marginTop: 28 }}>
              O instante em que <span className="italic">o fósforo pega.</span>
            </h1>
            <p>
              A Faísca faz utilitários contemplativos: velas em potes de cerâmica modelados à mão, velas de mergulho em
              cera de abelha e alguns objetos que pedem uma chama por perto.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/produtos/castical/2.webp" alt="Uma vela fina acesa num castiçal de chão, contra uma parede de reboco terracota" />
        </section>

        <section className="sobre-manifesto">
          <div className="wrap">
            <h2>
              Já que vai fazer, <span className="italic">faz bonito.</span>
            </h2>
            <div>
              <p>
                A gente acredita que os gestos de todo dia merecem atenção. O café, a mesa posta, o banho, a leitura antes
                de dormir: nada disso precisa mudar. Só precisa ser feito com um pouco mais de presença.
              </p>
              <p>
                Uma vela é uma ampulheta de cera. Acender é escolher um tempo. Apagar é encerrar. E quando a cera acaba, o
                pote fica: virado de cabeça para baixo, ele vira castiçal para as velas de mergulho.
              </p>
            </div>
          </div>
        </section>

        <section className="wrap sobre-passos">
          <div className="sobre-passos__head">
            <h2>Como fazemos</h2>
            <span className="label inst__eyebrow">Do barro à chama</span>
          </div>
          <ol>
            {PASSOS.map((p) => (
              <li className="sobre-passo" key={p.n}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.foto} alt={p.alt} loading="lazy" />
                <span className="label">{p.n}</span>
                <strong>{p.titulo}</strong>
                <span>{p.texto}</span>
              </li>
            ))}
          </ol>
          <div className="sobre-cta">
            <Link href="/loja" className="btn btn--primary">
              Ver os objetos
            </Link>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener" className="btn btn--secondary">
              @atelierfaisca ↗
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
