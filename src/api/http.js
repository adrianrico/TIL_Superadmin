// Instancia axios única. El access token vive SOLO en memoria (variable de módulo):
// nunca en localStorage/sessionStorage. El refresh viaja en cookie httpOnly.
import axios from 'axios';

let accessToken = null;
let onSessionExpired = () => {};

export const setAccessToken = (token) => {
  accessToken = token;
};
// AuthContext registra aquí qué hacer cuando la sesión no se puede renovar
export const setSessionExpiredHandler = (fn) => {
  onSessionExpired = fn;
};

// Cabecera exigida por el backend en refresh/logout (defensa CSRF)
const CLIENT_HEADER = { 'X-Til-Client': 'admin-panel' };

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // necesario para enviar la cookie de refresh
  timeout: 15000,
});

http.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

// Una sola renovación a la vez: el backend rota el refresh token, así que dos
// peticiones simultáneas con la misma cookie se interpretarían como robo.
let refreshing = null;

export function refreshSession() {
  if (!refreshing) {
    refreshing = http
      .post('/auth/refresh', null, { headers: CLIENT_HEADER, _skipRefresh: true })
      .then(({ data }) => {
        setAccessToken(data.data.accessToken);
        return data.data.admin;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

export const logoutRequest = () => http.post('/auth/logout', null, { headers: CLIENT_HEADER, _skipRefresh: true });

// 401 en una petición normal: renovar sesión una vez y reintentar
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthCall = original?.url?.startsWith('/auth/');

    if (error.response?.status === 401 && original && !original._retry && !original._skipRefresh && !isAuthCall) {
      original._retry = true;
      try {
        await refreshSession();
        return http(original);
      } catch {
        setAccessToken(null);
        onSessionExpired();
      }
    }
    return Promise.reject(error);
  },
);

// Mensaje seguro para mostrar al usuario a partir de un error de la API
export function errorMessage(error, fallback = 'Ocurrió un error, intenta de nuevo') {
  const status = error.response?.status;
  if (!error.response) return 'No se pudo conectar con el servidor';
  if (status === 429) return 'Demasiados intentos, espera unos minutos';
  if (status === 423) return 'Cuenta bloqueada temporalmente, intenta más tarde';
  return error.response.data?.error?.message || fallback;
}
