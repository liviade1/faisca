'use client';

import Link from 'next/link';
import { useState } from 'react';
import { INSTAGRAM_DM } from '@/lib/negocio';
import { useCart } from './CartProvider';

/** Quantidade + "Adicionar à sacola" na página de produto. */
export function AddToCart({
  slug,
  stock,
  purchasable,
  sobEncomenda,
  priceLabel,
}: {
  slug: string;
  stock: number;
  purchasable: boolean;
  /** Peça feita sob encomenda: o botão abre a conversa no Instagram. */
  sobEncomenda?: boolean;
  /** Preço formatado, mostrado no botão da barra fixa do celular. */
  priceLabel?: string;
}) {
  const { add, items } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i.slug === slug)?.quantity ?? 0;
  const available = Math.max(0, stock - inCart);

  if (sobEncomenda) {
    return (
      <div className="buy">
        <a className="btn btn--primary btn--block" href={INSTAGRAM_DM} target="_blank" rel="noopener">
          Encomendar pelo Instagram ↗
        </a>
        <p className="buy__note">Feito sob encomenda. Mande uma mensagem para combinarmos medidas, prazo e valor.</p>
      </div>
    );
  }

  if (!purchasable) {
    return (
      <div className="buy">
        <button type="button" className="btn btn--primary btn--block" disabled>
          Em breve
        </button>
        <p className="buy__note">Esta peça entra na próxima fornada. Siga @atelierfaisca no Instagram para saber primeiro.</p>
      </div>
    );
  }

  if (stock <= 0) {
    return (
      <div className="buy">
        <button type="button" className="btn btn--primary btn--block" disabled>
          Esgotado
        </button>
        <p className="buy__note">Esta fornada acabou. Siga @atelierfaisca no Instagram para saber quando sair a próxima.</p>
      </div>
    );
  }

  return (
    <div className="buy">
      <div className="buy__row">
        <div className="qty" role="group" aria-label="Quantidade">
          <button
            type="button"
            aria-label="Diminuir quantidade"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            −
          </button>
          <output aria-live="polite">{quantity}</output>
          <button
            type="button"
            aria-label="Aumentar quantidade"
            onClick={() => setQuantity((q) => Math.min(available, q + 1))}
            disabled={quantity >= available}
          >
            +
          </button>
        </div>
        <button
          type="button"
          className="btn btn--primary btn--block"
          disabled={available === 0}
          onClick={() => {
            add(slug, quantity);
            setAdded(true);
            setQuantity(1);
          }}
        >
          <span className="buy__full">Adicionar à sacola</span>
          <span className="buy__short">
            Adicionar{priceLabel ? <> <span aria-hidden="true" style={{ opacity: 0.5 }}>·</span> {priceLabel}</> : null}
          </span>
        </button>
      </div>
      {added ? (
        <p className="buy__done" role="status">
          Na sacola. <Link href="/sacola">Ver sacola →</Link>
        </p>
      ) : stock <= 3 ? (
        <p className="buy__note buy__note--scarce">Restam {stock} nesta fornada</p>
      ) : null}
      {available === 0 && <p className="buy__note">Você já colocou todas as peças disponíveis na sacola.</p>}
    </div>
  );
}
