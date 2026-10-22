// Filtros en un Drawer que se desliza desde la derecha (pantallas < 992px).
import { Drawer, Grid } from 'antd';
import FiltersPanel from './FiltersPanel.jsx';

export default function FiltersDrawer({ open, onClose, value, onApply }) {
  const screens = Grid.useBreakpoint();
  const isMobile = screens.sm === false;

  return (
    <Drawer
      title="Filtros"
      placement="right"
      width={isMobile ? '100%' : 360}
      open={open}
      onClose={onClose}
      destroyOnHidden // al reabrir, el borrador parte de los filtros aplicados
    >
      <FiltersPanel value={value} onApply={onApply} onDone={onClose} />
    </Drawer>
  );
}
