'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getProduct } from '@/lib/products';

export type CartItem = { slug: string; quantity: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'faisca:sacola';

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItem[]) : [];
    // Descarta produtos que saíram do catálogo.
    return parsed.filter((i) => getProduct(i.slug) && i.quantity > 0);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* navegação privada: a sacola vale só nesta aba */
    }
  }, [items, ready]);

  const add = useCallback((slug: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug);
      if (existing) return prev.map((i) => (i.slug === slug ? { ...i, quantity: i.quantity + quantity } : i));
      return [...prev, { slug, quantity }];
    });
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0 ? prev.filter((i) => i.slug !== slug) : prev.map((i) => (i.slug === slug ? { ...i, quantity } : i)),
    );
  }, []);

  const remove = useCallback((slug: string) => setItems((prev) => prev.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + (getProduct(i.slug)?.price ?? 0) * i.quantity, 0);
    return { items, count, subtotal, ready, add, setQuantity, remove, clear };
  }, [items, ready, add, setQuantity, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart precisa estar dentro de <CartProvider>');
  return ctx;
}
