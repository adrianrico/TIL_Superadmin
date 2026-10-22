// Controles de filtro y orden. Mantiene un borrador local:
//  - modo "live" (escritorio): una fila compacta que aplica tras 400 ms sin cambios
//  - modo drawer: columna con botones, aplica al pulsar "Aplicar"
import { useEffect, useRef, useState } from 'react';
import { Button, DatePicker, Input, Segmented, Select, Space, Typography } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { DEFAULT_FILTERS } from '../filters.js';

const SORT_OPTIONS = [
  { value: 'registeredAt', label: 'Fecha de registro' },
  { value: 'fullName', label: 'Nombre' },
  { value: 'access', label: 'Acceso / restringido' },
];

export default function FiltersPanel({ value, onApply, live = false, onDone }) {
  const [draft, setDraft] = useState(value);
  const first = useRef(true);

  const patch = (changes) => setDraft((d) => ({ ...d, ...changes }));

  // Modo live: debounce del borrador (se omite el primer render)
  useEffect(() => {
    if (!live) return undefined;
    if (first.current) {
      first.current = false;
      return undefined;
    }
    const t = setTimeout(() => onApply(draft), 400);
    return () => clearTimeout(t);
  }, [draft, live]); // eslint-disable-line react-hooks/exhaustive-deps

  const clear = () => {
    setDraft(DEFAULT_FILTERS);
    if (!live) {
      onApply(DEFAULT_FILTERS);
      onDone?.();
    }
  };
  const apply = () => {
    onApply(draft);
    onDone?.();
  };

  const size = live ? 'small' : 'middle';
  // En modo compacto el texto de apoyo va como etiqueta pequeña sobre el control
  const field = (label, control, cls = '') => (
    <div className={`til-filter ${cls}`}>
      <Typography.Text type="secondary" className="til-filter__label">
        {label}
      </Typography.Text>
      {control}
    </div>
  );

  const search = (
    <Input allowClear size={size} value={draft.search} maxLength={120} placeholder="Buscar por nombre" onChange={(e) => patch({ search: e.target.value })} />
  );
  const phone = (
    <Input
      allowClear
      size={size}
      value={draft.phone}
      maxLength={16}
      inputMode="tel"
      placeholder="Solo dígitos o +"
      onChange={(e) => patch({ phone: e.target.value.replace(/[^\d+]/g, '') })}
    />
  );
  const dateMode = (
    <Segmented
      block={!live}
      size={size}
      value={draft.dateMode}
      options={[
        { value: 'single', label: 'Fecha única' },
        { value: 'range', label: 'Rango' },
      ]}
      onChange={(mode) => patch({ dateMode: mode })}
    />
  );
  const datePicker =
    draft.dateMode === 'single' ? (
      <DatePicker size={size} style={{ width: '100%' }} format="DD/MM/YYYY" value={draft.date} onChange={(date) => patch({ date })} />
    ) : (
      <DatePicker.RangePicker size={size} style={{ width: '100%' }} format="DD/MM/YYYY" value={draft.range} onChange={(range) => patch({ range })} />
    );
  // Toggle de tres estados: Todos / Con acceso / Restringidos
  const accessToggle = (
    <Segmented
      block={!live}
      size={size}
      value={draft.access}
      options={[
        { value: 'all', label: 'Todos' },
        { value: 'allowed', label: 'Con acceso' },
        { value: 'restricted', label: 'Restringidos' },
      ]}
      onChange={(access) => patch({ access })}
    />
  );
  const sort = (
    <Space.Compact block>
      <Select size={size} style={{ flex: 1, minWidth: 150 }} value={draft.sortBy} options={SORT_OPTIONS} onChange={(sortBy) => patch({ sortBy })} />
      <Segmented
        size={size}
        value={draft.order}
        options={[
          { value: 'asc', icon: <ArrowUpOutlined aria-label="Ascendente" /> },
          { value: 'desc', icon: <ArrowDownOutlined aria-label="Descendente" /> },
        ]}
        onChange={(order) => patch({ order })}
      />
    </Space.Compact>
  );

  // Escritorio: todo en una fila que se ajusta al ancho disponible
  if (live) {
    return (
      <div className="til-filters-row">
        {field('Nombre', search, 'til-filter--grow')}
        {field('Teléfono', phone, 'til-filter--phone')}
        {field('Fecha de registro', <Space size={6}>{dateMode}<div style={{ width: draft.dateMode === 'range' ? 230 : 140 }}>{datePicker}</div></Space>)}
        {field('Acceso', accessToggle)}
        {field('Ordenar por', sort)}
        <Button size="small" onClick={clear}>
          Limpiar
        </Button>
      </div>
    );
  }

  // Drawer: columna
  return (
    <Space orientation="vertical" size="middle" className="til-filters-panel" style={{ width: "100%" }}>
      {field('Nombre', search)}
      {field('Teléfono', phone)}
      <div>
        <Typography.Text type="secondary">Fecha de registro</Typography.Text>
        <div style={{ marginBottom: 8 }}>{dateMode}</div>
        {datePicker}
      </div>
      {field('Acceso', accessToggle)}
      {field('Ordenar por', sort)}
      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={clear}>Limpiar filtros</Button>
        <Button type="primary" onClick={apply}>
          Aplicar
        </Button>
      </Space>
    </Space>
  );
}
