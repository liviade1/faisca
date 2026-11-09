import Link from 'next/link';
import { INSTAGRAM_URL, NEGOCIO, TIKTOK_URL } from '@/lib/negocio';

export { INSTAGRAM_URL, TIKTOK_URL };

/** Rodapé único de todas as páginas: logo, páginas institucionais, redes e dados da empresa. */
export function SiteFooter() {
  const legal = [NEGOCIO.razaoSocial, NEGOCIO.cnpj && `CNPJ ${NEGOCIO.cnpj}`].filter(Boolean).join(' · ');
  return (
    <footer className="site-footer" data-theme="dark">
      <div className="wrap footer__inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/logo-rodape.png" alt="Faísca" className="footer__logo" width={1229} height={473} />
        <div className="footer__nav">
          <nav aria-label="Institucional" className="footer__links">
            <Link href="/sobre">Sobre</Link>
          </nav>
          <nav aria-label="Redes sociais" className="footer__social">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener">
              Instagram ↗
            </a>
            <a href={TIKTOK_URL} target="_blank" rel="noopener">
              TikTok ↗
            </a>
          </nav>
        </div>
        <div className="footer__legal">
          <span>© {new Date().getFullYear()} Faísca — utilitários contemplativos</span>
          {legal && <span>{legal}</span>}
          <span>{NEGOCIO.endereco}</span>
        </div>
      </div>
    </footer>
  );
}
