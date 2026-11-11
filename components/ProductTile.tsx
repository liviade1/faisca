import Link from 'next/link';
import type { CSSProperties } from 'react';
import { formatBRL } from '@/lib/format';
import { linkCompra } from '@/lib/lojaIntegrada';
import { INSTAGRAM_DM } from '@/lib/negocio';
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
  // A compra é na Loja Integrada: peça sem link lá ainda não está à venda ("Em breve").
  const link = linkCompra(product.slug);
  const emBreve = !link && !product.sobEncomenda;
  const soldOut = isPurchasable(product) && stock === 0;
  const isVela = !product.image && Boolean(product.art);
  const priceLabel = product.sobEncomenda
    ? 'Sob encomenda'
    : emBreve
      ? 'Em breve'
      : !isPurchasable(product)
      ? 'Preço em breve'
      : soldOut
        ? 'Esgotado'
        : formatBRL(product.price);
  const hasPhoto = variant === 'foto' && Boolean(product.photos?.length);

  // O clique leva direto à página da peça na Loja Integrada, para comprar.
  // Peça sob encomenda sem link vai para a conversa no Instagram.
  const externo = link ?? (product.sobEncomenda ? INSTAGRAM_DM : null);
  const className = `product-tile${soldOut ? ' product-tile__soldout' : ''}${product.destaque ? ' product-tile--destaque' : ''}`;
  const style = { '--ground': product.ground ?? 0, '--mesa': product.mesa ?? 160 } as CSSProperties;
  const content = (
    <>
      <div className={`product-tile__media${isVela ? ' product-tile__media--vela' : ''}${hasPhoto ? ' product-tile__media--foto' : ''}`}>
        <ProductMedia product={product} variant={variant === 'mesa' ? 'recorte' : 'foto'} />
      </div>
      <span className="product-tile__text">
        {product.name}
        <br />
        <span className="muted">{priceLabel}</span>
      </span>
    </>
  );

  if (emBreve) {
    return (
      <div className={`${className} product-tile--embreve`} style={style}>
        {content}
      </div>
    );
  }

  if (externo) {
    const novaAba = externo === INSTAGRAM_DM;
    return (
      <a href={externo} className={className} style={style} {...(novaAba ? { target: '_blank', rel: 'noopener' } : {})}>
        {content}
      </a>
    );
  }

  return (
    <Link href={`/produtos/${product.slug}`} className={className} style={style}>
      {content}
    </Link>
  );
}
