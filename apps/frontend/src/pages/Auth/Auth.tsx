import { Button, Flex, Form, Input, Typography } from "antd";
import { useAuthStore } from "../../core";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export const Auth = () => {
  const [form] = Form.useForm();
  const { selectLogin, toggleAuthMode, signIn, signUp, isAuthenticated } =
    useAuthStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <Flex vertical justify="center" align="center" flex={1}>
      <Button onClick={() => toggleAuthMode(selectLogin)}>
        {selectLogin ? "Регистрация" : "Авторизация"}
      </Button>

      {selectLogin && (
        <>
          <Typography.Title>Вход</Typography.Title>

          <Form form={form} layout="vertical">
            <Form.Item
              label="Ваш email"
              name="login"
              rules={[
                { required: true, message: "Введите корректную почту" },
                { type: "email", message: "Введите корректную почту" },
              ]}
            >
              <Input placeholder="example@some.com" />
            </Form.Item>

            <Form.Item label="Ваш пароль" name="password">
              <Input type="password" placeholder="Ваш пароль" />
            </Form.Item>
          </Form>

          <Button
            onClick={async () => {
              const values = await form.validateFields(["login", "password"]);
              try {
                signIn(values);
                form.resetFields();
              } catch {}
            }}
            type="primary"
          >
            Войти
          </Button>
        </>
      )}

      {!selectLogin && (
        <>
          <Typography.Title>Регистрация</Typography.Title>

          <Form form={form} layout="vertical">
            <Form.Item
              label="Ваш email"
              name="login"
              rules={[
                { required: true, message: "Введите корректную почту" },
                { type: "email", message: "Введите корректную почту" },
              ]}
            >
              <Input placeholder="example@some.com" />
            </Form.Item>

            <Form.Item label="Ваш пароль" name="password">
              <Input type="password" placeholder="Ваш пароль" />
            </Form.Item>

            <Form.Item
              name="again_password"
              dependencies={["password"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Пароли не совпадают"));
                  },
                }),
              ]}
            >
              <Input type="password" placeholder="Подтвердите ваш пароль" />
            </Form.Item>
          </Form>

          <Button
            onClick={async () => {
              const values = await form.validateFields(["login", "password"]);
              if (
                form.getFieldValue("password") ==
                form.getFieldValue("again_password")
              ) {
                try {
                  await signUp(values);
                  form.resetFields();
                } catch {}
              } else {
                console.error("Ошибка паролей");
              }
            }}
            type="primary"
          >
            Зарегистрироваться
          </Button>
        </>
      )}
    </Flex>
  );
};
