// Mutaciones sobre usuarios. Cada una invalida la lista al terminar.
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { errorMessage } from '../../../api/http.js';
import * as api from '../../../api/tilUsers.api.js';
import { USERS_KEY } from './useUsers.js';

// Alta y edición: sin mensaje de error global; el formulario muestra los errores por campo
export function useSaveUser() {
  const qc = useQueryClient();
  const { message } = App.useApp();
  return useMutation({
    mutationFn: ({ id, values }) => (id ? api.updateUser(id, values) : api.createUser(values)),
    onSuccess: (_u, { id }) => message.success(id ? 'Usuario actualizado' : 'Usuario registrado'),
    onSettled: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export function useSetAccess() {
  const qc = useQueryClient();
  const { message } = App.useApp();
  return useMutation({
    mutationFn: ({ id, enabled }) => api.setUserAccess(id, enabled),
    // Actualización optimista: el switch cambia al instante y se revierte si falla
    onMutate: async ({ id, enabled }) => {
      await qc.cancelQueries({ queryKey: USERS_KEY });
      const snapshot = qc.getQueriesData({ queryKey: USERS_KEY });
      qc.setQueriesData({ queryKey: USERS_KEY }, (old) =>
        old && { ...old, data: old.data.map((u) => (u.id === id ? { ...u, access: { ...u.access, enabled } } : u)) },
      );
      return { snapshot };
    },
    onError: (err, _vars, ctx) => {
      ctx?.snapshot.forEach(([key, data]) => qc.setQueryData(key, data));
      message.error(errorMessage(err, 'No se pudo cambiar el acceso'));
    },
    onSuccess: (_u, { enabled }) => message.success(enabled ? 'Acceso permitido' : 'Acceso restringido'),
    onSettled: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export function useGenerateCredentials() {
  const qc = useQueryClient();
  const { message } = App.useApp();
  return useMutation({
    mutationFn: (id) => api.generateCredentials(id),
    onError: (err) => message.error(errorMessage(err, 'No se pudieron generar las claves')),
    onSettled: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  const { message } = App.useApp();
  return useMutation({
    mutationFn: (id) => api.deleteUser(id),
    onSuccess: () => message.success('Usuario eliminado'),
    onError: (err) => message.error(errorMessage(err, 'No se pudo eliminar')),
    onSettled: () => qc.invalidateQueries({ queryKey: USERS_KEY }),
  });
}
