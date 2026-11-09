import type { Product } from '@/lib/products';
import { VesselArt } from './VesselArt';

/**
 * A imagem do produto.
 * - `recorte`: a peça sem fundo (mesa da home, sacola). Sem recorte, usa a primeira foto.
 * - `foto`: a primeira foto de estúdio (Loja). Sem foto, usa o recorte.
 */
export function ProductMedia({ product, variant = 'recorte' }: { product: Product; variant?: 'recorte' | 'foto' }) {
  const photo = product.photos?.[0];
  if (variant === 'foto' && photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo.src} alt={photo.alt} loading="lazy" className="media--foto" />;
  }
  if (product.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={product.image} alt={product.imageAlt} loading="lazy" />;
  }
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo.src} alt={photo.alt} loading="lazy" className="media--foto" />;
  }
  if (product.art) return <VesselArt art={product.art} label={product.imageAlt} />;
  return null;
}
