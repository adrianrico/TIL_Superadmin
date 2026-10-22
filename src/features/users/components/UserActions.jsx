// Acciones por usuario: editar, generar claves y eliminar definitivamente.
// Se reutiliza en la tabla y en las data cards.
import { App, Button, Popconfirm, Space } from 'antd';
import { DeleteOutlined, EditOutlined, KeyOutlined } from '@ant-design/icons';
import { useDeleteUser, useGenerateCredentials } from '../hooks/useUserMutations.js';

export default function UserActions({ user, onEdit, onCredentials, block = false }) {
  const { modal } = App.useApp();
  const generate = useGenerateCredentials();
  const remove = useDeleteUser();

  const confirmDelete = () =>
    modal.confirm({
      title: 'Eliminar definitivamente',
      content: `Se eliminará a "${user.fullName}" y perderá el acceso. Esta acción no se puede deshacer.`,
      okText: 'Eliminar definitivamente',
      cancelText: 'Cancelar',
      okButtonProps: { danger: true },
      onOk: () => remove.mutateAsync(user.id).catch(() => {}), // el error ya se notifica en el hook
    });

  const confirmGenerate = () =>
    generate
      .mutateAsync(user.id)
      .then((res) => onCredentials(res.credentials))
      .catch(() => {});

  return (
    <Space wrap style={block ? { width: '100%' } : undefined}>
      <Button icon={<EditOutlined />} onClick={() => onEdit(user)}>
        Editar
      </Button>
      <Popconfirm
        title="Generar claves de acceso"
        description={
          user.access.hasCredentials
            ? 'Se generará una nueva clave; la anterior dejará de funcionar.'
            : 'Se generará un usuario y una clave.'
        }
        okText="Generar"
        cancelText="Cancelar"
        onConfirm={confirmGenerate}
      >
        <Button icon={<KeyOutlined />} loading={generate.isPending}>
          {user.access.hasCredentials ? 'Regenerar claves' : 'Generar claves'}
        </Button>
      </Popconfirm>
      <Button danger icon={<DeleteOutlined />} onClick={confirmDelete}>
        Eliminar
      </Button>
    </Space>
  );
}
