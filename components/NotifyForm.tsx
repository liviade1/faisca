'use client';

import Link from 'next/link';
import { useId, useState, type FormEvent } from 'react';

type Props = {
  /** Lista onde o e-mail fica guardado (ver LISTAS_AVISO em lib/store.ts). */
  lista: 'gio-soifer';
  /** id do título da seção, para o leitor de tela anunciar do que é o aviso. */
  labelledBy?: string;
};

/** "Avise-me quando estiver disponível": campo de e-mail + botão, sobre fundo escuro. */
export function NotifyForm({ lista, labelledBy }: Props) {
  const id = useId();
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setState('sending');
    const res = await fetch('/api/avise-me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: data.get('email'), site: data.get('site') ?? '', lista }),
    }).catch(() => null);
    setState(res?.ok ? 'done' : 'error');
  }

  if (state === 'done') {
    return (
      <p className="avise__done" role="status">
        Anotado. Você recebe um e-mail assim que estiver disponível.
      </p>
    );
  }

  return (
    <form className="avise" onSubmit={onSubmit} aria-labelledby={labelledBy}>
      <label htmlFor={`${id}-email`} className="label">
        Seu e-mail
      </label>
      <div className="avise__row">
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="seu@email.com"
          aria-describedby={`${id}-help`}
          aria-invalid={state === 'error' || undefined}
        />
        {/* Armadilha para robôs: fica fora da tela e fora da ordem de tabulação. */}
        <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" className="avise__trap" />
        <button type="submit" className="avise__btn" disabled={state === 'sending'}>
          {state === 'sending' ? 'Enviando…' : 'Avise-me quando estiver disponível'}
        </button>
      </div>
      <p id={`${id}-help`} className="avise__help" role={state === 'error' ? 'alert' : undefined}>
        {state === 'error' ? (
          'Não deu certo. Confira o e-mail e tente de novo.'
        ) : (
          <>
            Só usamos seu e-mail para esse aviso. <Link href="/privacidade">Política de privacidade</Link>
          </>
        )}
      </p>
    </form>
  );
}
