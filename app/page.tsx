import Link from 'next/link';
import { NotifyForm } from '@/components/NotifyForm';
import { ProductTile } from '@/components/ProductTile';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { PRODUCTS } from '@/lib/products';
import { getAllStock } from '@/lib/store';

// Recalcula o estoque a cada minuto.
export const revalidate = 60;

/** As peças que aparecem na mesa da home (as que têm largura de mesa definida). */
const MESA = PRODUCTS.filter((p) => p.mesa);

export default async function HomePage() {
  const stock = await getAllStock();

  return (
    <>
      <SiteHeader phrase />
      <main>
        <section id="galeria" className="wrap gallery" aria-labelledby="galeria-titulo">
          <div className="gallery__meta label">
            <span>Ritualística do cotidiano</span>
            <span>Objetos de presença</span>
          </div>
          <h1 id="galeria-titulo" className="gallery__title gallery__title--home">
            Utilitários contemplativos
          </h1>
          <div className="mesa">
            {[MESA.slice(0, 7), MESA.slice(7)].map((row, i) => (
              <div className="mesa__row" key={i}>
                {row.map((p) => (
                  <ProductTile key={p.slug} product={p} stock={stock[p.slug]} variant="mesa" />
                ))}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 40 }}>
            <Link href="/loja" className="btn btn--link">
              Ver todos os objetos ({PRODUCTS.length})
            </Link>
          </div>
        </section>

        <section id="rituais" className="rituals" aria-labelledby="gio-titulo">
          <div className="wrap rituals__wrap">
            <div className="rituals__col">
              <div className="rituals__head">
                <div>
                  <span className="label">Em breve</span>
                  <h2 id="gio-titulo" className="rituals__title">
                    Faísca &amp; <i>Gio Soifer</i>
                  </h2>
                </div>
                <p className="rituals__text">
                  Gio Soifer é artista visual cuja prática abrange vídeo, instalação e performance. Trabalha com
                  deslocamento contextual propondo ações-dispositivos que discutem o estar vivo e o corpo como linguagem.
                  Sua prática artística explora táticas de esquiva em uma sociedade marcada pelo desempenho. Faísca e Gio
                  Soifer colaboram para criar um altar para a presença. O castiçal é um corpo de luz no espaço.
                </p>
              </div>
              <NotifyForm lista="gio-soifer" labelledBy="gio-titulo" />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
