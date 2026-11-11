import type { Metadata } from 'next';
import { CartView } from '@/components/CartView';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { redirect } from 'next/navigation';
import { flatShippingCents } from '@/lib/config';
import { linkCarrinho } from '@/lib/lojaIntegrada';

export const metadata: Metadata = { title: 'Sacola', robots: { index: false } };

export default function CartPage() {
  // Compra pela Loja Integrada: a sacola é a de lá.
  const carrinho = linkCarrinho();
  if (carrinho) redirect(carrinho);

  return (
    <>
      <SiteHeader current="sacola" />
      <main className="wrap">
        <h1 className="page-title">Sacola</h1>
        <CartView shipping={flatShippingCents()} />
      </main>
      <SiteFooter />
    </>
  );
}
