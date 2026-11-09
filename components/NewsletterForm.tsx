'use client';

import { useState, type FormEvent } from 'react';

export function NewsletterForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get('email');
    setState('sending');
    const res = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    setState(res?.ok ? 'done' : 'error');
  }

  if (state === 'done') {
    return <p className="label">Pronto. A próxima carta chega no seu e-mail.</p>;
  }

  return (
    <form className="news-form" onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="news-email">Seu e-mail</label>
        <input id="news-email" name="email" type="email" required placeholder="seu@email.com" autoComplete="email" />
        <span className="muted" style={{ fontSize: 13, lineHeight: '18px' }}>
          {state === 'error' ? 'Não deu certo. Confira o e-mail e tente de novo.' : 'Sem spam. Cancele quando quiser.'}
        </span>
      </div>
      <button type="submit" className="btn btn--primary" style={{ marginBottom: 26 }} disabled={state === 'sending'}>
        Assinar
      </button>
    </form>
  );
}
