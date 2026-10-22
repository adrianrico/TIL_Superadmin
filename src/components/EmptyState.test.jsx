import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import EmptyState from './EmptyState.jsx';

describe('EmptyState', () => {
  it('muestra el texto por defecto', () => {
    render(<EmptyState />);
    expect(screen.getByText('sin registros todavía')).toBeInTheDocument();
  });

  it('acepta un texto personalizado', () => {
    render(<EmptyState text="sin resultados para los filtros" />);
    expect(screen.getByText('sin resultados para los filtros')).toBeInTheDocument();
  });
});
