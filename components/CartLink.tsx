'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export function CartLink({ current = false }: { current?: boolean }) {
  const { count, ready } = useCart();
  return (
    <Link href="/sacola" aria-current={current ? 'page' : undefined}>
      Sacola ({ready ? count : 0})
    </Link>
  );
}
