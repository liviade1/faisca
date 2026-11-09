'use client';

import { useEffect } from 'react';
import { useCart } from './CartProvider';

/** Esvazia a sacola quando a pessoa volta do Mercado Pago com o pagamento aprovado. */
export function ClearCartOnSuccess() {
  const { clear, ready } = useCart();
  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);
  return null;
}
