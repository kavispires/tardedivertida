import { useMutation } from '@tanstack/react-query';
// Ant Design Resources
import { Button, Form, Input, Alert, Image, type FormInstance } from 'antd';
// Hooks
import { useLanguage } from '@hooks/useLanguage';
// Services
import { signUp } from '@services/firebase';
// Components
import { Translate } from '@components/language/Translate';
// Images
import logo from '@assets/images/tarde-divertida-logo.svg?url';
// Sass
import styles from './auth.module.scss';

type SignUpProps = {
  /**
   * Function to be called on successful sign-up
   */
  onSuccess: () => void;
};

/**
 * Sign-up form component for creating new user accounts with email and password
 */
export function SignUp({ onSuccess }: SignUpProps) {
  const [form] = Form.useForm();

  const { isPending, mutate, isError } = useMutation({
    mutationKey: ['sign-up'],
    mutationFn: async () => await signUp(form.getFieldValue('username'), form.getFieldValue('password')),
    onSuccess: () => {
      onSuccess();
    },
  });

  const onFinish = () => {
    mutate();
  };

  return (
    <div className={styles.signUp}>
      <div className={styles.signUp__logo}>
        <Image
          src={logo}
          preview={false}
        />
      </div>

      <SignUpForm
        form={form}
        onFinish={onFinish}
        isError={isError}
        isLoading={isPending}
      />
    </div>
  );
}

type SignUpFormProps = {
  form: FormInstance<any>;
  onFinish: () => void;
  isError: boolean;
  isLoading: boolean;
};

/**
 * Reusable sign-up form component with username/password fields and validation
 */
export function SignUpForm({ form, onFinish, isError, isLoading }: SignUpFormProps) {
  const { translate } = useLanguage();
  return (
    <Form
      name="sign-up"
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label={
          <Translate
            pt="E-mail"
            en="E-mail"
          />
        }
        name="username"
        rules={[
          {
            required: true,
            message: translate({ pt: 'e-mail é um campo obrigatório', en: 'e-mail is required' }),
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={
          <Translate
            pt="Senha"
            en="Password"
          />
        }
        name="password"
        rules={[
          {
            required: true,
            message: translate({ pt: 'e-mail é um campo obrigatório', en: 'e-mail is required' }),
          },
        ]}
        help={translate({ pt: 'Mínimo 6 caracteres', en: 'Minimum of 6 characters' })}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        label={
          <Translate
            pt="Confirmar Senha"
            en="Confirm Password"
          />
        }
        name="password-confirm"
        rules={[
          {
            required: true,
            message: translate({ pt: 'e-mail é um campo obrigatório', en: 'e-mail is required' }),
          },
        ]}
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
          />
        </Form.Item>
      )}

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button
          type="primary"
          htmlType="submit"
          disabled={isLoading}
        >
          <Translate
            pt="Enviar"
            en="Submit"
          />
        </Button>
      </Form.Item>
    </Form>
  );
}
