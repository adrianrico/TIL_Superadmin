import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { DEFAULT_FILTERS, hasActiveFilters, toParams } from './filters.js';

describe('toParams', () => {
  it('solo envía los filtros con valor', () => {
    expect(toParams(DEFAULT_FILTERS, 1, 10)).toEqual({ page: 1, limit: 10, sortBy: 'registeredAt', order: 'desc', access: 'all' });
  });

  it('convierte fecha única y rango a YYYY-MM-DD', () => {
    const single = toParams({ ...DEFAULT_FILTERS, date: dayjs('2026-03-05') }, 1, 10);
    expect(single.date).toBe('2026-03-05');

    const range = toParams({ ...DEFAULT_FILTERS, dateMode: 'range', range: [dayjs('2026-03-01'), dayjs('2026-03-31')] }, 1, 10);
    expect(range).toMatchObject({ dateFrom: '2026-03-01', dateTo: '2026-03-31' });
    expect(range.date).toBeUndefined();
  });

  it('ignora la fecha única cuando el modo es rango', () => {
    const p = toParams({ ...DEFAULT_FILTERS, dateMode: 'range', date: dayjs('2026-03-05') }, 1, 10);
    expect(p.date).toBeUndefined();
  });
});

describe('hasActiveFilters', () => {
  it('el orden no cuenta como filtro', () => {
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, sortBy: 'fullName', order: 'asc' })).toBe(false);
  });
  it('detecta búsqueda y acceso', () => {
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, search: 'ana' })).toBe(true);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, access: 'allowed' })).toBe(true);
  });
});
