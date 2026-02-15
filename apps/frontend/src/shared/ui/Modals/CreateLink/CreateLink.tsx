import { type FC } from "react";
import { Button, Form, Input, Modal, notification } from "antd";
import { useLinksStore, useModalsStore } from "../../../../core";

export const CreateLink: FC = () => {
  const [form] = Form.useForm();

  const { showCreateLinkModal, setCreateLinkModal } = useModalsStore();
  const { createLink } = useLinksStore();

  return (
    <Modal
      title="Создание ссылки"
      open={showCreateLinkModal}
      width={"90vmax"}
      onCancel={() => setCreateLinkModal(false)}
      footer={[
        <Button key="cancel" onClick={() => setCreateLinkModal(false)}>
          Отмена
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={async () => {
            try {
              const values = await form.validateFields(); // Ждём валидации
              createLink(values.linkName, values.linkOrigin);
              form.resetFields(); // Очищаем форму после успешного создания
              setCreateLinkModal(false);
            } catch (error) {
              notification.error({ message: "Ошибка модалка" });
            }
          }}
        >
          Создать
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Имя ссылки"
          name="linkName"
          rules={[{ required: true, message: "Введите название ссылки" }]}
        >
          <Input placeholder="Введите название для ссылки" />
        </Form.Item>
        <Form.Item
          label="Ссылка"
          name="linkOrigin"
          validateFirst
          rules={[
            { required: true, message: "Введите ссылку" },
            { type: "url", message: "Введите корректный URL" },
          ]}
        >
          <Input placeholder="Вставьте ссылку" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
