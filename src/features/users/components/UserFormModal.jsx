// Alta y edición de usuario. El ID y la fecha de registro los asigna el servidor.
import { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import { errorMessage } from '../../../api/http.js';
import { useSaveUser } from '../hooks/useUserMutations.js';

export default function UserFormModal({ open, user, onClose }) {
  const [form] = Form.useForm();
  const { mutate, isPending } = useSaveUser();
  const isEdit = Boolean(user);

  // Al abrir: formulario limpio (alta) o con los datos del usuario (edición)
  useEffect(() => {
    if (open) form.setFieldsValue({ fullName: user?.fullName ?? '', phone: user?.phone ?? '' });
  }, [open, user, form]);

  const onFinish = (values) => {
    mutate(
      { id: user?.id, values: { fullName: values.fullName.trim(), phone: values.phone } },
      {
        onSuccess: onClose,
        onError: (err) => {
          // Errores de validación del backend -> campo correspondiente
          const details = err.response?.data?.error?.details;
          if (Array.isArray(details) && details.length) {
            form.setFields(details.map((d) => ({ name: d.path.split('.').pop(), errors: [d.message] })));
          } else {
            form.setFields([{ name: 'fullName', errors: [errorMessage(err, 'No se pudo guardar')] }]);
          }
        },
      },
    );
  };

  return (
    <Modal
      title={isEdit ? 'Editar usuario' : 'Registrar usuario'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={isEdit ? 'Guardar' : 'Registrar'}
      cancelText="Cancelar"
      confirmLoading={isPending}
      destroyOnHidden
      maskClosable={false}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off" requiredMark={false}>
        <Form.Item
          name="fullName"
          label="Nombre completo"
          rules={[
            { required: true, whitespace: true, message: 'Ingresa el nombre completo' },
            { min: 2, message: 'Mínimo 2 caracteres' },
            { max: 120, message: 'Máximo 120 caracteres' },
          ]}
        >
          <Input maxLength={120} />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Teléfono"
          extra="Entre 7 y 15 dígitos; puede iniciar con +"
          rules={[
            { required: true, message: 'Ingresa el teléfono' },
            // Misma regla que el backend, tras quitar espacios, guiones y paréntesis
            {
              validator: (_, v) =>
                !v || /^\+?\d{7,15}$/.test(String(v).replace(/[\s\-().]/g, ''))
                  ? Promise.resolve()
                  : Promise.reject(new Error('Teléfono inválido (7 a 15 dígitos)')),
            },
          ]}
        >
          <Input inputMode="tel" maxLength={24} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
