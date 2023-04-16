import { useQuery } from 'react-query';
// Ant Design Resources
import { Button, Form, Input, Alert, Image } from 'antd';
// API
import { signIn } from 'services/firebase';
// Image
import logo from 'assets/images/tarde-divertida-logo.svg';
import { Translate } from 'components/language';
// Sass
import './SignIn.scss';
import { useLanguage } from 'hooks/useLanguage';

type SignInProps = {
  onSuccess: GenericFunction;
};

export function SignIn({ onSuccess }: SignInProps) {
  const [form] = Form.useForm();
  const { translate } = useLanguage();

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
        name="basic"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={<Translate pt="Email" en="Email" />}
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
            <Translate pt="Enviar" en="Submit" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
