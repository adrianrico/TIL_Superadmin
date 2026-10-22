// Controles de filtro y orden. Mantiene un borrador local:
//  - modo "live" (escritorio, panel en línea): aplica solo tras 400 ms sin cambios
//  - modo drawer: aplica al pulsar "Aplicar"
import { useEffect, useRef, useState } from 'react';
import { Button, DatePicker, Input, Segmented, Select, Space, Switch, Typography } from 'antd';
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

  // Los dos switches son mutuamente excluyentes
  const toggleAccess = (kind) => (checked) => patch({ access: checked ? kind : 'all' });

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <div>
        <Typography.Text type="secondary">Nombre</Typography.Text>
        <Input allowClear value={draft.search} maxLength={120} placeholder="Buscar por nombre" onChange={(e) => patch({ search: e.target.value })} />
      </div>

      <div>
        <Typography.Text type="secondary">Teléfono</Typography.Text>
        <Input
          allowClear
          value={draft.phone}
          maxLength={16}
          inputMode="tel"
          placeholder="Solo dígitos o +"
          onChange={(e) => patch({ phone: e.target.value.replace(/[^\d+]/g, '') })}
        />
      </div>

      <div>
        <Typography.Text type="secondary">Fecha de registro</Typography.Text>
        <Segmented
          block
          value={draft.dateMode}
          options={[
            { value: 'single', label: 'Fecha única' },
            { value: 'range', label: 'Rango' },
          ]}
          onChange={(dateMode) => patch({ dateMode })}
          style={{ marginBottom: 8 }}
        />
        {draft.dateMode === 'single' ? (
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" value={draft.date} onChange={(date) => patch({ date })} />
        ) : (
          <DatePicker.RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" value={draft.range} onChange={(range) => patch({ range })} />
        )}
      </div>

      <div>
        <Typography.Text type="secondary">Acceso</Typography.Text>
        <Space direction="vertical" style={{ width: '100%' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            Solo con acceso
            <Switch checked={draft.access === 'allowed'} onChange={toggleAccess('allowed')} />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
            Solo restringidos
            <Switch checked={draft.access === 'restricted'} onChange={toggleAccess('restricted')} />
          </label>
        </Space>
      </div>

      <div>
        <Typography.Text type="secondary">Ordenar por</Typography.Text>
        <Space.Compact block>
          <Select style={{ flex: 1 }} value={draft.sortBy} options={SORT_OPTIONS} onChange={(sortBy) => patch({ sortBy })} />
          <Segmented
            value={draft.order}
            options={[
              { value: 'asc', icon: <ArrowUpOutlined aria-label="Ascendente" /> },
              { value: 'desc', icon: <ArrowDownOutlined aria-label="Descendente" /> },
            ]}
            onChange={(order) => patch({ order })}
          />
        </Space.Compact>
      </div>

      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={clear}>Limpiar filtros</Button>
        {!live && (
          <Button type="primary" onClick={apply}>
            Aplicar
          </Button>
        )}
      </Space>
    </Space>
  );
}
