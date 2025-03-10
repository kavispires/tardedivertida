import { useMutation } from '@tanstack/react-query';
import type { UserCredential } from 'firebase/auth';
import { useState } from 'react';
// Ant Design Resources
import { Button, Form, Input, Alert, Image, App, Switch, Space, type ButtonProps } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Services
import { resetPassword, signIn, signInWithGoogle } from 'services/firebase';
// Icons
import { GoogleIcon } from 'icons/GoogleIcon';
// Components
import { IconAvatar } from 'components/avatars';
import { Translate } from 'components/language';
import { SpaceContainer } from 'components/layout/SpaceContainer';
import { Title } from 'components/text';
// Images
import logo from 'assets/images/tarde-divertida-logo.svg?url';

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

      <SpaceContainer>
        <Switch
          checkedChildren={<Translate pt="E-mail e senha" en="Email and Password" />}
          unCheckedChildren="Google"
          onChange={(checked) => setView(checked ? 'email' : 'google')}
        />
      </SpaceContainer>

      {view === 'google' ? (
        <SignInWithGoogle onSuccess={onSuccess} />
      ) : (
        <SignInWithEmail onSuccess={onSuccess} />
      )}
    </div>
  );
}

export function SignInWithGoogle({ onSuccess, ...buttonProps }: SignInProps & ButtonProps) {
  const { isPending, mutate, isError } = useMutation<UserCredential, Error, void, unknown>({
    mutationFn: async () => await signInWithGoogle(),
    onSuccess,
  });

  const onFinish = () => {
    mutate();
  };

  return (
    <Space className="div-container" direction="vertical" align="center" classNames={{ item: 'full-width' }}>
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
          loading={isPending}
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

  const { isPending, mutate, isError } = useMutation<UserCredential, Error, void, unknown>({
    mutationFn: async () => await signIn(form.getFieldValue('username'), form.getFieldValue('password')),
    onSuccess,
  });

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
            {
              required: true,
              message: translate('e-mail é um campo obrigatório', 'e-mail is required'),
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<Translate pt="Senha" en="Password" />}
          name="password"
          rules={[
            {
              required: true,
              message: translate('e-mail é um campo obrigatório', 'e-mail is required'),
            },
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
          <Button type="primary" htmlType="submit" loading={isPending}>
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

  const { isPending, mutate, isError } = useMutation({
    mutationFn: async () => await resetPassword(form.getFieldValue('username')),
    onSuccess: () => {
      onSuccess();
      message.success(
        translate(
          'Verifique seu e-mail enviado para redefinir a sua senha',
          'Verify your email to reset your password',
        ),
      );
    },
  });

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
          {
            required: true,
            message: translate('e-mail é um campo obrigatório', 'e-mail is required'),
          },
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
        <Button type="primary" htmlType="submit" loading={isPending}>
          <Translate pt="Enviar" en="Submit" />
        </Button>
      </Form.Item>
    </Form>
  );
}
