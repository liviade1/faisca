import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductTile } from '@/components/ProductTile';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { CATEGORIES, isCategory, productsByCategory, type Category } from '@/lib/products';
import { getAllStock } from '@/lib/store';

export const metadata: Metadata = { title: 'Loja' };
export const revalidate = 60;

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams;
  const active: Category | undefined = isCategory(categoria) ? categoria : undefined;
  const products = productsByCategory(active);
  const stock = await getAllStock();

  return (
    <>
      <SiteHeader current="loja" />
      <main className="wrap gallery">
        <div className="gallery__meta label">
          <span className="hide-sm">(Loja)</span>
          <span>
            {products.length} {products.length === 1 ? 'peça' : 'peças'}
          </span>
        </div>
        {/* Celular: título curto e filtros em pílula que rolam para o lado */}
        <div className="show-sm loja-sm">
          <h1 className="loja-sm__title">Loja</h1>
          <nav aria-label="Categorias" className="chips">
            <Link href="/loja" className="chip" aria-current={!active ? 'page' : undefined}>
              Tudo
            </Link>
            {(Object.keys(CATEGORIES) as Category[]).map((c) => (
              <Link key={c} href={`/loja?categoria=${c}`} className="chip" aria-current={active === c ? 'page' : undefined}>
                {CATEGORIES[c]}
              </Link>
            ))}
          </nav>
        </div>
        <h1 className="gallery__title hide-sm">
          <Link href="/loja" aria-current={!active ? 'page' : undefined}>
            Tudo,
          </Link>{' '}
          {(Object.keys(CATEGORIES) as Category[]).map((c, i, all) => (
            <span key={c}>
              <Link href={`/loja?categoria=${c}`} aria-current={active === c ? 'page' : undefined}>
                {CATEGORIES[c]}
                {i < all.length - 1 ? ',' : '.'}
              </Link>{' '}
            </span>
          ))}
        </h1>
        <div className="shop-grid shop-grid--wide">
          {products.map((p) => (
            <ProductTile key={p.slug} product={p} stock={stock[p.slug]} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
