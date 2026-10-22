// Muestra la clave generada UNA sola vez. El valor vive solo en el estado del
// padre y se descarta al cerrar; no se guarda en storage ni se registra en logs.
import { Alert, App, Button, Input, Modal, Space, Typography } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

function CopyRow({ label, value, onCopy }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <Typography.Text type="secondary">{label}</Typography.Text>
      <Space.Compact block>
        <Input readOnly value={value} style={{ fontFamily: 'monospace' }} />
        <Button icon={<CopyOutlined />} aria-label={`Copiar ${label}`} onClick={() => onCopy(value)} />
      </Space.Compact>
    </div>
  );
}

export default function CredentialsModal({ credentials, onClose }) {
  const { message } = App.useApp();

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('Copiado');
    } catch {
      message.error('No se pudo copiar, selecciona el texto manualmente');
    }
  };

  return (
    <Modal
      title="Claves de acceso"
      open={Boolean(credentials)}
      onCancel={onClose}
      footer={
        <Button type="primary" onClick={onClose}>
          Listo, ya las copié
        </Button>
      }
      maskClosable={false}
      destroyOnHidden
    >
      <Alert
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
        message="Se muestran una sola vez. Al cerrar no podrás verlas de nuevo."
      />
      {credentials && (
        <>
          <CopyRow label="Usuario" value={credentials.username} onCopy={copy} />
          <CopyRow label="Contraseña" value={credentials.password} onCopy={copy} />
        </>
      )}
    </Modal>
  );
}
