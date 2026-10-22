// Llamadas de autenticación del administrador.
import { http, setAccessToken } from './http.js';

export async function login(username, password) {
  const { data } = await http.post('/auth/login', { username, password });
  setAccessToken(data.data.accessToken);
  return data.data.admin;
}
