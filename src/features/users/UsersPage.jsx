// Página principal: cabecera, acciones, filtros y lista (tabla en escritorio, cards en móvil).
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Grid, Space, Typography } from 'antd';
import { FilterOutlined, LogoutOutlined, PlusOutlined } from '@ant-design/icons';
import { errorMessage } from '../../api/http.js';
import EmptyState from '../../components/EmptyState.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLoader } from '../../context/LoaderContext.jsx';
import CredentialsModal from './components/CredentialsModal.jsx';
import FiltersDrawer from './components/FiltersDrawer.jsx';
import FiltersPanel from './components/FiltersPanel.jsx';
import UserFormModal from './components/UserFormModal.jsx';
import UserCards from './components/UserCards.jsx';
import UsersTable from './components/UsersTable.jsx';
import { DEFAULT_FILTERS, hasActiveFilters } from './filters.js';
import { useUsers } from './hooks/useUsers.js';

const PAGE_SIZE = 10;

export default function UsersPage() {
  const { user, logout } = useAuth();
  const screens = Grid.useBreakpoint();
  const isMobile = screens.sm === false; // < 576px: data cards
  const inlineFilters = screens.lg === true; // ≥ 992px: panel en línea; si no, Drawer

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Formulario: null = cerrado, {} = alta, usuario = edición
  const [formUser, setFormUser] = useState(null);
  const [credentials, setCredentials] = useState(null); // clave en claro: solo en memoria, se descarta al cerrar

  const { data, isError, error, isFetching, isPlaceholderData, refetch } = useUsers(filters, page, PAGE_SIZE);
  const users = data?.data ?? [];
  const total = data?.meta.total ?? 0;

  // Loader global solo en la primera carga; los cambios posteriores usan el loading de la tabla
  const loader = useLoader();
  const firstLoad = isFetching && !data;
  useEffect(() => {
    if (!firstLoad) return undefined;
    loader.show();
    return loader.hide;
  }, [firstLoad]); // eslint-disable-line react-hooks/exhaustive-deps

  // Si se borra el último registro de una página, retroceder a la anterior
  useEffect(() => {
    if (data && users.length === 0 && page > 1) setPage(page - 1);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilters = (next) => {
    setFilters(next);
    setPage(1); // un filtro nuevo vuelve a la primera página
  };
  const onSort = (sortBy, order) => applyFilters({ ...filters, sortBy, order });

  const pagination = { current: page, pageSize: PAGE_SIZE, total };
  const filtered = hasActiveFilters(filters);

  return (
    <main className="til-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Typography.Title level={2} style={{ margin: 0 }}>
          TIL Administrator
        </Typography.Title>
        <Button icon={<LogoutOutlined />} onClick={logout}>
          Cerrar sesión ({user.username})
        </Button>
      </div>

      {/* Botón de alta SIEMPRE visible */}
      <Space className="til-actions" style={{ margin: '24px 0 16px', width: isMobile ? '100%' : undefined }} wrap>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setFormUser({})}>
          Registrar usuario
        </Button>
        {!inlineFilters && (
          <Button icon={<FilterOutlined />} onClick={() => setDrawerOpen(true)}>
            Filtros{filtered ? ' •' : ''}
          </Button>
        )}
      </Space>

      {inlineFilters && (
        <Card style={{ marginBottom: 16 }}>
          <FiltersPanel live value={filters} onApply={applyFilters} />
        </Card>
      )}

      {isError ? (
        <Alert
          type="error"
          showIcon
          message={errorMessage(error, 'No se pudo cargar la lista')}
          action={<Button onClick={() => refetch()}>Reintentar</Button>}
        />
      ) : users.length === 0 && !isFetching ? (
        <Card>
          <EmptyState text={filtered ? 'sin resultados para los filtros' : 'sin registros todavía'} />
        </Card>
      ) : isMobile ? (
        <UserCards users={users} pagination={pagination} onPageChange={setPage} onEdit={setFormUser} onCredentials={setCredentials} />
      ) : (
        <UsersTable
          users={users}
          loading={isFetching && isPlaceholderData}
          filters={filters}
          onSort={onSort}
          pagination={pagination}
          onPageChange={setPage}
          onEdit={setFormUser}
          onCredentials={setCredentials}
        />
      )}

      <UserFormModal open={formUser !== null} user={formUser?.id ? formUser : null} onClose={() => setFormUser(null)} />
      <CredentialsModal credentials={credentials} onClose={() => setCredentials(null)} />
      <FiltersDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} value={filters} onApply={applyFilters} />
    </main>
  );
}
