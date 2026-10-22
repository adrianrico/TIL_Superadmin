// Toggle permitir/restringir acceso de un usuario.
import { Switch } from 'antd';
import { useSetAccess } from '../hooks/useUserMutations.js';

export default function AccessSwitch({ user }) {
  const { mutate, isPending } = useSetAccess();

  return (
    <Switch
      checked={user.access.enabled}
      loading={isPending}
      checkedChildren="Acceso"
      unCheckedChildren="Restringido"
      aria-label={`Acceso de ${user.fullName}`}
      onChange={(enabled) => mutate({ id: user.id, enabled })}
    />
  );
}
