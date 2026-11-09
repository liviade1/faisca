import Link from 'next/link';
import { CartLink } from './CartLink';

/**
 * Barra do topo, fixa ao rolar. Na home, `phrase` mostra a frase de navegação logo abaixo.
 * `current` sublinha o link da página atual.
 */
export function SiteHeader({ phrase = false, current }: { phrase?: boolean; current?: 'loja' | 'sacola' }) {
  return (
    <>
      <header className={`site-header${phrase ? ' site-header--phrase' : ''}`}>
        <div className="topbar label">
          <Link href="/" className="topbar__logo" aria-label="Faísca — início">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-ameixa.png" alt="Faísca" width={150} height={32} />
          </Link>
          <span className="muted hide-sm">Utilitários contemplativos · Feitos à mão em Curitiba</span>
          <nav aria-label="Principal" className="topbar__links">
            <Link href="/loja" aria-current={current === 'loja' ? 'page' : undefined}>
              Loja
            </Link>
            <CartLink current={current === 'sacola'} />
          </nav>
        </div>
      </header>
      {phrase && (
        <div className="phrase-wrap">
          <p className="phrase">
            A Faísca faz objetos para transformar os hábitos de todo dia em pequenos{' '}
            <Link href="/#rituais" className="phrase-link serif italic" style={{ letterSpacing: '-0.01em' }}>
              rituais
            </Link>
            .
          </p>
        </div>
      )}
    </>
  );
}
