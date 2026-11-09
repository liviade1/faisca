import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="wrap status">
        <span className="label muted">(404)</span>
        <h1 className="status__title">Esta página apagou.</h1>
        <p className="pdp__desc">O endereço pode ter mudado, ou a peça saiu da loja.</p>
        <div style={{ marginTop: 40 }}>
          <Link href="/loja" className="btn btn--primary">
            Ver os objetos
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
