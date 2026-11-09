import type { Metadata } from 'next';
import { CartView } from '@/components/CartView';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { flatShippingCents } from '@/lib/config';

export const metadata: Metadata = { title: 'Sacola', robots: { index: false } };

export default function CartPage() {
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
