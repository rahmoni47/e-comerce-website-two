import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);
const KEY = 'stall-cart-v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } });
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* ignore */ } }, [items]);
  const value = useMemo(() => ({
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    subtotal: items.reduce((n, i) => n + i.price * i.qty, 0),
    add: (it) => setItems((cur) => {
      const key = [it.productId, it.color || '', it.size || ''].join('|');
      const ex = cur.find((c) => c.key === key);
      return ex ? cur.map((c) => c.key === key ? { ...c, qty: c.qty + it.qty } : c) : [...cur, { ...it, key }];
    }),
    setQty: (key, qty) => setItems((cur) => cur.map((c) => c.key === key ? { ...c, qty: Math.max(1, qty) } : c)),
    remove: (key) => setItems((cur) => cur.filter((c) => c.key !== key)),
    clear: () => setItems([]),
  }), [items]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
