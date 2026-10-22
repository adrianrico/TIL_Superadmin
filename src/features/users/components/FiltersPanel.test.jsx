import { fireEvent, render, screen } from '@testing-library/react';
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

  it('el filtro de acceso tiene tres estados: Todos, Con acceso y Restringidos', async () => {
    const onApply = vi.fn();
    render(<FiltersPanel value={DEFAULT_FILTERS} onApply={onApply} />);

    // Por defecto: Todos
    expect(screen.getByRole('radio', { name: 'Todos' })).toBeChecked();

    // Los inputs de Segmented no admiten puntero real en jsdom: se dispara el evento directamente
    fireEvent.click(screen.getByRole('radio', { name: 'Con acceso' }));
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }));
    expect(onApply).toHaveBeenLastCalledWith(expect.objectContaining({ access: 'allowed' }));

    fireEvent.click(screen.getByRole('radio', { name: 'Restringidos' }));
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }));
    expect(onApply).toHaveBeenLastCalledWith(expect.objectContaining({ access: 'restricted' }));

    fireEvent.click(screen.getByRole('radio', { name: 'Todos' }));
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar' }));
    expect(onApply).toHaveBeenLastCalledWith(expect.objectContaining({ access: 'all' }));
  });

  it('"Limpiar filtros" aplica los valores por defecto', async () => {
    const onApply = vi.fn();
    render(<FiltersPanel value={{ ...DEFAULT_FILTERS, search: 'x' }} onApply={onApply} />);
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
    expect(onApply).toHaveBeenCalledWith(DEFAULT_FILTERS);
  });
});
