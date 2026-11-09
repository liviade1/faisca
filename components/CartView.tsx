'use client';

import Link from 'next/link';
import { useEffect, useState, type FormEvent } from 'react';
import { formatBRL } from '@/lib/format';
import { getProduct } from '@/lib/products';
import { useCart } from './CartProvider';
import { ProductMedia } from './ProductMedia';

type Field = {
  name: string;
  label: string;
  span?: 2 | 3 | 4;
  /** No celular, ocupa meia linha (CEP/Número, Cidade/UF). */
  half?: boolean;
  type?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric';
  autoComplete?: string;
  required?: boolean;
};

const FIELDS: Field[] = [
  { name: 'name', label: 'Nome completo', autoComplete: 'name', required: true },
  { name: 'email', label: 'E-mail', span: 3, type: 'email', inputMode: 'email', autoComplete: 'email', required: true },
  { name: 'phone', label: 'Telefone com DDD', span: 3, type: 'tel', inputMode: 'tel', autoComplete: 'tel', required: true },
  { name: 'cep', label: 'CEP', span: 3, half: true, inputMode: 'numeric', autoComplete: 'postal-code', required: true },
  { name: 'number', label: 'Número', span: 3, half: true, inputMode: 'numeric', required: true },
  { name: 'street', label: 'Rua', autoComplete: 'address-line1', required: true },
  { name: 'complement', label: 'Complemento', autoComplete: 'address-line2' },
  { name: 'district', label: 'Bairro', required: true },
  { name: 'city', label: 'Cidade', span: 4, half: true, autoComplete: 'address-level2', required: true },
  { name: 'state', label: 'UF', span: 2, half: true, autoComplete: 'address-level1', required: true },
];

export function CartView({ shipping }: { shipping: number }) {
  const { items, subtotal, setQuantity, remove, ready } = useCart();
  const [stock, setStock] = useState<Record<string, number> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/estoque')
      .then((r) => (r.ok ? r.json() : null))
      .then(setStock)
      .catch(() => setStock(null));
  }, []);

  // Preenche rua, bairro e cidade a partir do CEP (ViaCEP, serviço público e gratuito).
  async function fillFromCep(cep: string, form: HTMLFormElement) {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return;
    try {
      const data = await fetch(`https://viacep.com.br/ws/${digits}/json/`).then((r) => r.json());
      if (data.erro) return;
      const set = (name: string, value: string) => {
        const input = form.elements.namedItem(name) as HTMLInputElement | null;
        if (input && !input.value) input.value = value;
      };
      set('street', data.logradouro ?? '');
      set('district', data.bairro ?? '');
      set('city', data.localidade ?? '');
      set('state', data.uf ?? '');
    } catch {
      /* sem problema: a pessoa preenche à mão */
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSending(true);
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    const { note, ...customer } = data;
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customer, note: note || undefined }),
      });
      const body = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !body.url) throw new Error(body.error ?? 'Não foi possível abrir o pagamento.');
      window.location.href = body.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Algo deu errado. Tente de novo.');
      setSending(false);
    }
  }

  if (!ready) return <div className="empty" aria-busy="true" />;

  if (items.length === 0) {
    return (
      <div className="empty">
        <p className="pdp__desc">Sua sacola está vazia.</p>
        <Link href="/loja" className="btn btn--primary">
          Ver os objetos
        </Link>
      </div>
    );
  }

  const total = subtotal + shipping;
  const overStock = items.some((i) => stock && i.quantity > (stock[i.slug] ?? 0));

  return (
    <div className="cart">
      <div>
        {items.map((item) => {
          const product = getProduct(item.slug);
          if (!product) return null;
          const left = stock?.[item.slug];
          return (
            <div className="cart-line" key={item.slug}>
              <Link
                href={`/produtos/${product.slug}`}
                className="cart-line__media"
                aria-label={product.name}
              >
                <ProductMedia product={product} />
              </Link>
              <div>
                <Link href={`/produtos/${product.slug}`} className="cart-line__name">
                  {product.name}
                </Link>
                <div className="cart-line__actions">
                  <div className="qty" role="group" aria-label={`Quantidade de ${product.name}`}>
                    <button
                      type="button"
                      aria-label="Diminuir"
                      onClick={() => setQuantity(item.slug, item.quantity - 1)}
                    >
                      −
                    </button>
                    <output>{item.quantity}</output>
                    <button
                      type="button"
                      aria-label="Aumentar"
                      disabled={left !== undefined && item.quantity >= left}
                      onClick={() => setQuantity(item.slug, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button type="button" className="linkish" onClick={() => remove(item.slug)}>
                    Remover
                  </button>
                </div>
                {left !== undefined && item.quantity > left && (
                  <p className="alert" style={{ marginTop: 8 }}>
                    {left === 0 ? 'Esgotou. Remova para continuar.' : `Só restam ${left}. Ajuste a quantidade.`}
                  </p>
                )}
              </div>
              <span style={{ fontWeight: 600 }}>{formatBRL(product.price * item.quantity)}</span>
            </div>
          );
        })}
      </div>

      <form className="summary" onSubmit={onSubmit}>
        <div>
          <h2 className="form-title">Para onde vamos enviar</h2>
          <p className="buy__note" style={{ marginTop: 8 }}>
            Digite o CEP e preenchemos o endereço para você.
          </p>
        </div>
        <div className="form-grid">
          {FIELDS.map((f) => (
            <div key={f.name} className={`field${f.span ? ` field--${f.span}` : ''}${f.half ? ' field--half' : ''}`}>
              <label htmlFor={`f-${f.name}`}>{f.label}</label>
              <input
                id={`f-${f.name}`}
                name={f.name}
                type={f.type ?? 'text'}
                inputMode={f.inputMode}
                autoComplete={f.autoComplete}
                required={f.required}
                maxLength={f.name === 'state' ? 2 : undefined}
                onBlur={f.name === 'cep' ? (e) => fillFromCep(e.currentTarget.value, e.currentTarget.form!) : undefined}
              />
            </div>
          ))}
          <div className="field">
            <label htmlFor="f-note">Bilhete para presente (opcional)</label>
            <textarea id="f-note" name="note" rows={2} maxLength={400} />
          </div>
        </div>

        <div className="summary__row">
          <span>Subtotal</span>
          <span>{formatBRL(subtotal)}</span>
        </div>
        <div className="summary__row">
          <span>Frete</span>
          <span>{shipping > 0 ? formatBRL(shipping) : 'Grátis'}</span>
        </div>
        <div className="summary__total">
          <span>Total</span>
          <span>{formatBRL(total)}</span>
        </div>

        {error && (
          <p className="alert" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn--primary btn--block" disabled={sending || overStock}>
          {sending ? 'Abrindo o pagamento…' : 'Ir para o pagamento'}
        </button>
        <p className="buy__note">Pagamento seguro pelo Mercado Pago: Pix, cartão ou boleto.</p>
      </form>
    </div>
  );
}
