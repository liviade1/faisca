import Link from 'next/link';
import type { CSSProperties } from 'react';
import { formatBRL } from '@/lib/format';
import { isPurchasable, type Product } from '@/lib/products';
import { ProductMedia } from './ProductMedia';

export function ProductTile({
  product,
  stock,
  variant = 'foto',
}: {
  product: Product;
  stock?: number;
  /** `mesa`: recorte apoiado na linha (home). `foto`: foto de estúdio (Loja, "Combina com"). */
  variant?: 'mesa' | 'foto';
}) {
  const soldOut = isPurchasable(product) && stock === 0;
  const isVela = !product.image && Boolean(product.art);
  const priceLabel = product.sobEncomenda
    ? 'Sob encomenda'
    : !isPurchasable(product)
      ? 'Preço em breve'
      : soldOut
        ? 'Esgotado'
        : formatBRL(product.price);
  const hasPhoto = variant === 'foto' && Boolean(product.photos?.length);

  return (
    <Link
      href={`/produtos/${product.slug}`}
      className={`product-tile${soldOut ? ' product-tile__soldout' : ''}${product.destaque ? ' product-tile--destaque' : ''}`}
      style={{ '--ground': product.ground ?? 0, '--mesa': product.mesa ?? 160 } as CSSProperties}
    >
      <div className={`product-tile__media${isVela ? ' product-tile__media--vela' : ''}${hasPhoto ? ' product-tile__media--foto' : ''}`}>
        <ProductMedia product={product} variant={variant === 'mesa' ? 'recorte' : 'foto'} />
      </div>
      <span className="product-tile__text">
        {product.name}
        <br />
        <span className="muted">{priceLabel}</span>
      </span>
    </Link>
  );
}
