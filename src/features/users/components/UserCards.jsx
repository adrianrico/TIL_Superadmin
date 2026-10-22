// Vista móvil (< 576px): data cards colapsables.
// Cabecera = nombre + switch de acceso; al expandir = detalle y acciones.
import { Collapse, Descriptions, Pagination } from 'antd';
import { formatDate } from '../../../utils/format.js';
import AccessSwitch from './AccessSwitch.jsx';
import UserActions from './UserActions.jsx';

export default function UserCards({ users, pagination, onPageChange, onEdit, onCredentials }) {
  const items = users.map((user) => ({
    key: user.id,
    label: user.fullName,
    // stopPropagation: tocar el switch no debe expandir/colapsar la tarjeta
    extra: (
      <span onClick={(e) => e.stopPropagation()}>
        <AccessSwitch user={user} />
      </span>
    ),
    children: (
      <>
        <Descriptions column={1} size="small" style={{ marginBottom: 12 }}>
          <Descriptions.Item label="Teléfono">{user.phone}</Descriptions.Item>
          <Descriptions.Item label="ID">{user.publicId}</Descriptions.Item>
          <Descriptions.Item label="Registro">{formatDate(user.registeredAt)}</Descriptions.Item>
        </Descriptions>
        <UserActions user={user} onEdit={onEdit} onCredentials={onCredentials} block />
      </>
    ),
  }));

  return (
    <>
      <Collapse items={items} style={{ display: 'flex', flexDirection: 'column', gap: 8, background: 'transparent' }} />
      <Pagination
        simple
        style={{ marginTop: 16, textAlign: 'center' }}
        current={pagination.current}
        pageSize={pagination.pageSize}
        total={pagination.total}
        showSizeChanger={false}
        onChange={onPageChange}
      />
    </>
  );
}
