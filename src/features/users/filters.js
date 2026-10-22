// Estado de filtros y su conversión a parámetros de la API.
export const DEFAULT_FILTERS = {
  search: '',
  phone: '',
  dateMode: 'single', // 'single' | 'range'
  date: null, // dayjs
  range: null, // [dayjs, dayjs]
  access: 'all', // 'all' | 'allowed' | 'restricted'
  sortBy: 'registeredAt',
  order: 'desc',
};

const DAY = 'YYYY-MM-DD';

// Parámetros de consulta: solo se envían los que tienen valor
export function toParams(f, page, limit) {
  const p = { page, limit, sortBy: f.sortBy, order: f.order, access: f.access };
  if (f.search.trim()) p.search = f.search.trim();
  if (f.phone) p.phone = f.phone;
  if (f.dateMode === 'single' && f.date) p.date = f.date.format(DAY);
  if (f.dateMode === 'range' && f.range?.[0]) p.dateFrom = f.range[0].format(DAY);
  if (f.dateMode === 'range' && f.range?.[1]) p.dateTo = f.range[1].format(DAY);
  return p;
}

// ¿Hay algún filtro de búsqueda activo? (el orden no cuenta)
export const hasActiveFilters = (f) =>
  Boolean(f.search.trim() || f.phone || f.date || f.range?.[0] || f.range?.[1] || f.access !== 'all');
