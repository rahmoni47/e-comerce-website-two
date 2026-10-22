import { useEffect, useState } from 'react';
export const money = (n) => `${new Intl.NumberFormat('fr-FR').format(Number(n) || 0)} DA`;

export function useAsync(fn, deps) {
  const [s, set] = useState({ loading: true, data: null, error: null });
  useEffect(() => {
    let live = true;
    set((p) => ({ ...p, loading: true, error: null }));
    fn().then((data) => live && set({ loading: false, data, error: null }))
        .catch((error) => live && set({ loading: false, data: null, error }));
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return s;
}
export const Status = ({ loading, error, empty, children }) =>
  loading ? <p className="note" role="status">Loading…</p>
  : error ? <p className="note err" role="alert">{error.message}. The server may be waking up, so try again in a few seconds.</p>
  : empty ? <p className="note">Nothing here yet.</p> : children;
