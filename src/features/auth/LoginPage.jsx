// Pantalla de acceso del administrador. Sin credenciales precargadas.
import { useState } from 'react';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Navigate } from 'react-router-dom';
import { errorMessage } from '../../api/http.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isLoading && isAuthenticated) return <Navigate to="/" replace />;

  const onFinish = async ({ username, password }) => {
    setSubmitting(true);
    setError(null);
    try {
      await login(username.trim(), password);
    } catch (err) {
      // Mensaje genérico: no revela si falló el usuario o la contraseña
      setError(err.response?.status === 401 ? 'Usuario o contraseña incorrectos' : errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 16 }}>
      <Card style={{ width: '100%', maxWidth: 400 }}>
        <Typography.Title level={3} style={{ textAlign: 'center', marginTop: 0 }}>
          TIL Administrator
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ textAlign: 'center' }}>
          Inicia sesión para continuar
        </Typography.Paragraph>

        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={onFinish} autoComplete="off" requiredMark={false}>
          <Form.Item name="username" label="Usuario" rules={[{ required: true, message: 'Ingresa tu usuario' }]}>
            <Input prefix={<UserOutlined />} autoComplete="username" maxLength={40} />
          </Form.Item>
          <Form.Item name="password" label="Contraseña" rules={[{ required: true, message: 'Ingresa tu contraseña' }]}>
            <Input.Password prefix={<LockOutlined />} autoComplete="current-password" maxLength={128} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={submitting} disabled={submitting}>
            Entrar
          </Button>
        </Form>
      </Card>
    </main>
  );
}
