import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from 'antd';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as api from '../../../api/tilUsers.api.js';
import UserFormModal from './UserFormModal.jsx';

vi.mock('../../../api/tilUsers.api.js');

const renderModal = (props = {}) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <App>
        <UserFormModal open user={null} onClose={vi.fn()} {...props} />
      </App>
    </QueryClientProvider>,
  );

describe('UserFormModal', () => {
  beforeEach(() => vi.clearAllMocks());

  it('rechaza un teléfono inválido sin llamar a la API', async () => {
    renderModal();
    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez');
    await userEvent.type(screen.getByLabelText('Teléfono'), 'abc');
    await userEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    expect(await screen.findByText('Teléfono inválido (7 a 15 dígitos)')).toBeInTheDocument();
    expect(api.createUser).not.toHaveBeenCalled();
  });

  it('envía nombre y teléfono válidos (sin fecha ni ID)', async () => {
    api.createUser.mockResolvedValue({ id: '1' });
    renderModal();
    await userEvent.type(screen.getByLabelText('Nombre completo'), '  Ana Pérez ');
    await userEvent.type(screen.getByLabelText('Teléfono'), '(55) 1234-5678');
    await userEvent.click(screen.getByRole('button', { name: 'Registrar' }));

    await waitFor(() => expect(api.createUser).toHaveBeenCalledWith({ fullName: 'Ana Pérez', phone: '(55) 1234-5678' }));
  });
});
