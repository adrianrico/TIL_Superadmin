// Vista de tabla (≥ 576px). Orden y paginación controlados desde el servidor.
import { Table } from 'antd';
import { formatDate } from '../../../utils/format.js';
import AccessSwitch from './AccessSwitch.jsx';
import UserActions from './UserActions.jsx';

const sortOrder = (filters, key) => (filters.sortBy === key ? (filters.order === 'asc' ? 'ascend' : 'descend') : null);

export default function UsersTable({ users, loading, filters, onSort, pagination, onPageChange, onEdit, onCredentials }) {
  const columns = [
    { title: 'ID', dataIndex: 'publicId', key: 'publicId', width: 150 },
    { title: 'Nombre', dataIndex: 'fullName', key: 'fullName', sorter: true, sortOrder: sortOrder(filters, 'fullName') },
    { title: 'Teléfono', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Fecha de registro',
      dataIndex: 'registeredAt',
      key: 'registeredAt',
      sorter: true,
      sortOrder: sortOrder(filters, 'registeredAt'),
      render: formatDate,
    },
    {
      title: 'Acceso',
      key: 'access',
      sorter: true,
      sortOrder: sortOrder(filters, 'access'),
      render: (_, user) => <AccessSwitch user={user} />,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, user) => <UserActions user={user} onEdit={onEdit} onCredentials={onCredentials} />,
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={users}
      loading={loading}
      scroll={{ x: 'max-content' }}
      pagination={{ ...pagination, showSizeChanger: false, onChange: onPageChange }}
      onChange={(_p, _f, sorter) => {
        // Tercer clic en la cabecera (sin orden) vuelve al orden por defecto
        if (!sorter.order) return onSort('registeredAt', 'desc');
        onSort(sorter.columnKey, sorter.order === 'ascend' ? 'asc' : 'desc');
      }}
    />
  );
}
