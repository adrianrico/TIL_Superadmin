// Loader global con contador: varias peticiones simultáneas mantienen el overlay
// visible hasta que termina la última.
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import GlobalLoader from '../components/GlobalLoader.jsx';

const LoaderContext = createContext(null);

export function LoaderProvider({ children }) {
  const [pending, setPending] = useState(0);

  const show = useCallback(() => setPending((n) => n + 1), []);
  const hide = useCallback(() => setPending((n) => Math.max(0, n - 1)), []);

  const value = useMemo(() => ({ show, hide, isLoading: pending > 0 }), [show, hide, pending]);

  return (
    <LoaderContext.Provider value={value}>
      {children}
      <GlobalLoader visible={pending > 0} />
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error('useLoader debe usarse dentro de <LoaderProvider>');
  return ctx;
}
