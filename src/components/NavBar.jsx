// Barra superior fija: título a la izquierda y cierre de sesión a la derecha.
import { Button, Typography } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext.jsx';

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <header className="til-navbar">
      <div className="til-navbar__inner">
        <Typography.Title level={2} className="til-navbar__title" style={{ margin: 0 }}>
          TIL Administrator
        </Typography.Title>
        <Button icon={<LogoutOutlined />} onClick={logout} aria-label="Cerrar sesión">
          Cerrar sesión<span className="til-navbar__user"> ({user.username})</span>
        </Button>
      </div>
    </header>
  );
}
