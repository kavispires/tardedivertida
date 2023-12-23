import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
// Ant Design Resources
import { Button, Form, Input, Alert, Image, App, Switch, Space, ButtonProps } from 'antd';
// API
import { resetPassword, signIn, signInWithGoogle } from 'services/firebase';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Image
import logo from 'assets/images/tarde-divertida-logo.svg';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { UserCredential } from 'firebase/auth';
import { IconAvatar } from 'components/avatars';
import { GoogleIcon } from 'icons/GoogleIcon';

type SignInProps = {
  onSuccess: GenericFunction;
};

export function SignIn({ onSuccess }: SignInProps) {
  const [view, setView] = useState('google');

  return (
    <div className="sign-in">
      <div className="sign-in__logo">
        <Image src={logo} preview={false} />
      </div>

      <Space className="space-container">
        <Switch
          checkedChildren={<Translate pt="E-mail e senha" en="Email and Password" />}
          unCheckedChildren="Google"
          onChange={(checked) => setView(checked ? 'email' : 'google')}
        />
      </Space>

      {view === 'google' ? (
        <SignInWithGoogle onSuccess={onSuccess} />
      ) : (
        <SignInWithEmail onSuccess={onSuccess} />
      )}
    </div>
  );
}

export function SignInWithGoogle({ onSuccess, ...buttonProps }: SignInProps & ButtonProps) {
  const { isLoading, mutate, isError } = useMutation<UserCredential, Error, void, unknown>(
    async () => await signInWithGoogle(),
    {
      onSuccess: () => onSuccess(),
    }
  );

  const onFinish = () => {
    mutate();
  };

  return (
    <Space
      className="space-container"
      direction="vertical"
      align="center"
      classNames={{ item: 'full-width' }}
    >
      <>
        {isError && (
          <Alert
            description={
              <Translate pt="Algo deu errado, tente novamente" en="Something went wrong. Please try again" />
            }
            type="error"
            showIcon
            className="sign-in__error-alert"
          />
        )}
        <Button
          type="primary"
          size="large"
          onClick={onFinish}
          loading={isLoading}
          block
          icon={<IconAvatar icon={<GoogleIcon />} size="small" />}
          {...buttonProps}
        >
          <Translate pt="Entrar com Google" en="Sign in with Google" />
        </Button>
      </>
    </Space>
  );
}

function SignInWithEmail({ onSuccess }: SignInProps) {
  const [form] = Form.useForm();
  const { translate } = useLanguage();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { isLoading, mutate, isError } = useMutation<UserCredential, Error, void, unknown>(
    async () => await signIn(form.getFieldValue('username'), form.getFieldValue('password')),
    {
      onSuccess: () => {
        onSuccess();
      },
    }
  );

  const onFinish = () => {
    mutate();
  };

  return (
    <>
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
          <Button type="primary" htmlType="submit" loading={isLoading}>
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
    </>
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

  const { isLoading, mutate, isError } = useMutation(
    async () => await resetPassword(form.getFieldValue('username')),
    {
      onSuccess: () => {
        onSuccess();
        message.success(
          translate(
            'Verifique seu e-mail enviado para redefinir a sua senha',
            'Verify your email to reset your password'
          )
        );
      },
    }
  );

  const onFinish = () => {
    mutate();
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
