// Consulta paginada de usuarios; conserva los datos previos mientras carga la siguiente página.
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { listUsers } from '../../../api/tilUsers.api.js';
import { toParams } from '../filters.js';

export const USERS_KEY = ['til-users'];

export function useUsers(filters, page, limit) {
  const params = toParams(filters, page, limit);
  return useQuery({
    queryKey: [...USERS_KEY, params],
    queryFn: () => listUsers(params),
    placeholderData: keepPreviousData,
  });
}
