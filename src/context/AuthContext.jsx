// Sesión del administrador. Al cargar la página intenta recuperarla con el
// refresh (cookie httpOnly); el token de acceso nunca se guarda en storage.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth.api.js';
import { logoutRequest, refreshSession, setAccessToken, setSessionExpiredHandler } from '../api/http.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // true mientras se intenta recuperar la sesión

  useEffect(() => {
    let active = true;
    // refreshSession comparte la petición en curso (seguro con StrictMode)
    refreshSession()
      .then((admin) => active && setUser(admin))
      .catch(() => active && setUser(null))
      .finally(() => active && setIsLoading(false));

    setSessionExpiredHandler(() => setUser(null));
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (username, password) => {
    setUser(await authApi.login(username, password));
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      /* aunque falle, se cierra la sesión local */
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), isLoading, login, logout }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
