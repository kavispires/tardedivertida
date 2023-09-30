import { useState } from 'react';
import { useQuery } from 'react-query';
// Ant Design Resources
import { Button, Form, Input, Alert, Image, App } from 'antd';
// API
import { resetPassword, signIn } from 'services/firebase';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Image
import logo from 'assets/images/tarde-divertida-logo.svg';
import { Translate } from 'components/language';
import { Title } from 'components/text';

type SignInProps = {
  onSuccess: GenericFunction;
};

export function SignIn({ onSuccess }: SignInProps) {
  const [form] = Form.useForm();
  const { translate } = useLanguage();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { isLoading, refetch, isError } = useQuery({
    queryKey: 'sign-in',
    queryFn: async () => await signIn(form.getFieldValue('username'), form.getFieldValue('password')),
    enabled: false,
    onSuccess: () => {
      onSuccess();
    },
  });

  const onFinish = () => {
    refetch();
  };

  return (
    <div className="sign-in">
      <div className="sign-in__logo">
        <Image src={logo} preview={false} />
      </div>

      <Form
        name="login"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={<Translate pt="E-mail" en="E-mail" />}
          name="username"
          rules={[
            { required: true, message: translate('e-mail é um campo obrigatório', 'e-mail is required') },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<Translate pt="Senha" en="Password" />}
          name="password"
          rules={[
            { required: true, message: translate('e-mail é um campo obrigatório', 'e-mail is required') },
          ]}
          help={translate('Mínimo 6 caracteres', 'Minimum of 6 characters')}
        >
          <Input.Password />
        </Form.Item>

        {isError && (
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Alert
              description={
                <Translate
                  pt="Algo deu errado, tente novamente"
                  en="Something went wrong. Please try again"
                />
              }
              type="error"
              showIcon
              className="sign-in__error-alert"
            />
          </Form.Item>
        )}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" disabled={isLoading}>
            <Translate pt="Entrar" en="Submit" />
          </Button>

          <Button type="link" onClick={() => setShowForgotPassword((v) => !v)}>
            <Translate pt="Esqueci minha senha" en="Forgot my password" />
          </Button>
        </Form.Item>
      </Form>
      {showForgotPassword && (
        <Alert
          type="info"
          message={
            <ResetPasswordForm
              email={form.getFieldValue('username')}
              onSuccess={() => setShowForgotPassword(false)}
            />
          }
        />
      )}
    </div>
  );
}

type ResetPasswordFormProps = {
  email?: string;
  onSuccess: GenericFunction;
};

function ResetPasswordForm({ email, onSuccess }: ResetPasswordFormProps) {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const { translate } = useLanguage();

  const { isLoading, refetch, isError } = useQuery({
    queryKey: 'forgot-password',
    queryFn: async () => await resetPassword(form.getFieldValue('username')),
    enabled: false,
    onSuccess: () => {
      onSuccess();
      message.success(
        translate(
          'Verifique seu e-mail enviado para redefinir a sua senha',
          'Verify your email to reset your password'
        )
      );
    },
  });

  const onFinish = () => {
    refetch();
  };

  return (
    <Form
      name="forgot-password"
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ username: email, remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item>
        <Title level={4} size="xx-small">
          <Translate pt="Redefinir a senha" en="Password Reset" />
        </Title>
      </Form.Item>
      <Form.Item
        label={<Translate pt="E-mail" en="E-mail" />}
        name="username"
        rules={[
          { required: true, message: translate('e-mail é um campo obrigatório', 'e-mail is required') },
        ]}
      >
        <Input />
      </Form.Item>

      {isError && (
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Alert
            description={
              <Translate
                pt="Algo deu errado, provavelmente este e-mail não existe no banco de dados da Tarde Divertida"
                en="Something went wrong. Please try again"
              />
            }
            type="error"
            showIcon
            className="sign-in__error-alert"
          />
        </Form.Item>
      )}

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit" disabled={isLoading}>
          <Translate pt="Enviar" en="Submit" />
        </Button>
      </Form.Item>
    </Form>
  );
}
