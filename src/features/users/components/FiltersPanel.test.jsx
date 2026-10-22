import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_FILTERS } from '../filters.js';
import FiltersPanel from './FiltersPanel.jsx';

describe('FiltersPanel', () => {
  it('aplica el borrador al pulsar "Aplicar"', async () => {
    const onApply = vi.fn();
    render(<FiltersPanel value={DEFAULT_FILTERS} onApply={onApply} />);

    await userEvent.type(screen.getByPlaceholderText('Buscar por nombre'), 'ana');
    expect(onApply).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }));

    expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ search: 'ana' }));
  });

  it('el teléfono solo admite dígitos y +', async () => {
    render(<FiltersPanel value={DEFAULT_FILTERS} onApply={vi.fn()} />);
    const phone = screen.getByPlaceholderText('Solo dígitos o +');
    await userEvent.type(phone, '+52 (55)-ab12');
    expect(phone).toHaveValue('+525512');
  });

  it('los switches de acceso son mutuamente excluyentes', async () => {
    render(<FiltersPanel value={DEFAULT_FILTERS} onApply={vi.fn()} />);
    const [allowed, restricted] = screen.getAllByRole('switch');

    await userEvent.click(allowed);
    expect(allowed).toBeChecked();
    await userEvent.click(restricted);
    expect(restricted).toBeChecked();
    expect(allowed).not.toBeChecked();
  });

  it('"Limpiar filtros" aplica los valores por defecto', async () => {
    const onApply = vi.fn();
    render(<FiltersPanel value={{ ...DEFAULT_FILTERS, search: 'x' }} onApply={onApply} />);
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(onApply).toHaveBeenCalledWith(DEFAULT_FILTERS);
  });
});
