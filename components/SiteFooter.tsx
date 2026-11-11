import { INSTAGRAM_URL, TIKTOK_URL } from '@/lib/negocio';

export { INSTAGRAM_URL, TIKTOK_URL };

/**
 * Rodapé único de todas as páginas, como no layout: logo grande e as redes sociais.
 * Sem links institucionais, sem razão social, CNPJ, cidade ou "©" (retirados no layout em 11/11).
 */
export function SiteFooter() {
  return (
    <footer className="site-footer" data-theme="dark">
      <div className="wrap footer__inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-rodape.png" alt="Faísca" className="footer__logo" width={1229} height={473} />
        <div className="footer__nav">
          <nav aria-label="Redes sociais" className="footer__social">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener">
              Instagram ↗
            </a>
            <a href={TIKTOK_URL} target="_blank" rel="noopener">
              TikTok ↗
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
