// Llamadas al recurso /til-users.
import { http } from './http.js';

export async function listUsers(params) {
  const { data } = await http.get('/til-users', { params });
  return data; // { data: [...], meta: {...} }
}

export async function createUser(values) {
  const { data } = await http.post('/til-users', values);
  return data.data;
}

export async function updateUser(id, values) {
  const { data } = await http.patch(`/til-users/${id}`, values);
  return data.data;
}

export async function setUserAccess(id, enabled) {
  const { data } = await http.patch(`/til-users/${id}/access`, { enabled });
  return data.data;
}

// Devuelve { data: usuario, credentials: { username, password } }; la clave solo llega aquí
export async function generateCredentials(id) {
  const { data } = await http.post(`/til-users/${id}/credentials`);
  return data;
}

export async function deleteUser(id) {
  await http.delete(`/til-users/${id}`);
}
