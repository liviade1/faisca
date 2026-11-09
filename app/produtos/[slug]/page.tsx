import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AddToCart } from '@/components/AddToCart';
import { ProductMedia } from '@/components/ProductMedia';
import { ProductTile } from '@/components/ProductTile';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { maxInstallments, siteUrl } from '@/lib/config';
import { formatBRL, installmentsText } from '@/lib/format';
import { NEGOCIO } from '@/lib/negocio';
import { CATEGORIES, PRODUCTS, getProduct, isPurchasable } from '@/lib/products';
import { getAllStock } from '@/lib/store';

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.tagline} ${product.description}`.slice(0, 160),
    openGraph: {
      title: `${product.name} · Faísca`,
      description: product.tagline,
      ...(product.photos?.[0] ? { images: [{ url: product.photos[0].src, alt: product.photos[0].alt }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const stockMap = await getAllStock();
  const stock = stockMap[product.slug] ?? 0;
  const purchasable = isPurchasable(product);
  const isVela = !product.image && Boolean(product.art);
  const related = product.pairsWith.map(getProduct).filter((p): p is NonNullable<typeof p> => Boolean(p));
  const installments = installmentsText(product.price, maxInstallments());

  // Dados estruturados para o Google mostrar preço e disponibilidade.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    brand: { '@type': 'Brand', name: 'Faísca' },
    ...(product.photos && product.photos.length > 0 ? { image: product.photos.map((ph) => `${siteUrl()}${ph.src}`) } : {}),
    ...(purchasable && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'BRL',
        price: (product.price / 100).toFixed(2),
        availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
      },
    }),
  };

  return (
    <>
      <SiteHeader current="loja" />
      <main className="wrap pdp-page">
        <nav className="crumbs label" aria-label="Caminho">
          <Link href="/loja">Loja</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/loja?categoria=${product.category}`}>{CATEGORIES[product.category]}</Link>
        </nav>

        <article className="pdp">
          {product.photos && product.photos.length > 0 ? (
            <div className="pdp__gallery" aria-label={`Fotos de ${product.name}`}>
              {product.photos.map((photo, i) => (
                <figure className="pdp__photo" key={photo.src}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.src} alt={photo.alt} loading={i === 0 ? 'eager' : 'lazy'} />
                  {product.photos!.length > 1 && (
                    <figcaption className="pdp__count label" aria-hidden="true">
                      {i + 1}/{product.photos!.length}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          ) : (
            <div className={`pdp__media${isVela ? ' pdp__media--vela' : ''}`}>
              <ProductMedia product={product} />
            </div>
          )}

          <div className="pdp__info">
            <div>
              <span className="label muted">
                ({product.maker} · {product.edition})
              </span>
              <h1 className="pdp__name">{product.name}</h1>
              <p className="pdp__tagline">{product.tagline}</p>
            </div>

            <div className="pdp__price">
              <strong>{product.sobEncomenda ? 'Sob encomenda' : purchasable ? formatBRL(product.price) : 'Preço em breve'}</strong>
              {purchasable && installments && <span className="muted">{installments}</span>}
            </div>

            <AddToCart
              slug={product.slug}
              stock={stock}
              purchasable={purchasable}
              sobEncomenda={product.sobEncomenda}
              priceLabel={purchasable ? formatBRL(product.price) : undefined}
            />

            <p className="pdp__desc">{product.description}</p>

            <dl className="spec">
              {product.details.map((d) => (
                <div key={d.label}>
                  <dt>{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>

            <div>
              <details className="fold" open>
                <summary>O ritual</summary>
                <p>{product.ritual}</p>
              </details>
              <details className="fold">
                <summary>{product.care.title}</summary>
                <p>{product.care.text}</p>
              </details>
              <details className="fold">
                <summary>Envio</summary>
                <p>
                  Cada peça é embalada à mão em Curitiba e enviada para todo o Brasil
                  {NEGOCIO.prazoPostagem ? ` em até ${NEGOCIO.prazoPostagem} dias úteis` : ''} depois da confirmação do
                  pagamento. O código de rastreio chega no seu e-mail. <Link href="/ajuda#envio">Mais sobre envio</Link>
                </p>
              </details>
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section className="related" aria-labelledby="combina-titulo">
            <div className="related__head">
              <h2 id="combina-titulo" className="related__title">
                Combina com
              </h2>
              <Link href="/loja" className="btn btn--link">
                Ver tudo
              </Link>
            </div>
            <div className="shop-grid">
              {related.map((p) => (
                <ProductTile key={p.slug} product={p} stock={stockMap[p.slug]} />
              ))}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
