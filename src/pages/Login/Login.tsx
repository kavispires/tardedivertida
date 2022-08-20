import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Ant Design Resources
import { Layout, Button, Form, Input, Alert, Image } from 'antd';
// API
import { signIn } from 'services/firebase';
// State
import { useGlobalState } from 'hooks/useGlobalState';
// Image
import logo from 'assets/images/tarde-divertida-logo.svg';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 0, span: 8 },
};

function Login() {
  const navigate = useNavigate();
  const [, setIsAuthenticated] = useGlobalState('isAuthenticated');

  const [error, setError] = useState<string | object | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onValuesChange = (data: PlainObject) => {
    if (data.email) {
      setEmail(data.email.trim());
    }
    if (data.password) {
      setPassword(data.password.trim());
    }
  };

  const onHandleSubmit = async () => {
    setError('');
    try {
      const response = await signIn(email, password);
      if (response?.user?.uid) {
        setIsAuthenticated(true);
        navigate('/hub');
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Layout.Content className="login">
      <div className="login__content">
        <div className="login__logo">
          <Image src={logo} preview={false} />
        </div>

        {Boolean(error) && (
          <Alert
            message="Error"
            description={JSON.stringify(error)}
            type="error"
            showIcon
            className="login__error-alert"
          />
        )}
        <Form
          {...layout}
          layout="horizontal"
          name="sign-in"
          onValuesChange={onValuesChange}
          className="login__form"
          autoComplete="off"
        >
          <Form.Item {...tailLayout} label="E-mail" name="email" className="login__form-item">
            <Input type="email" />
          </Form.Item>
          <Form.Item {...tailLayout} label="Password" name="password" className="login__form-item">
            <Input type="password" />
          </Form.Item>
          <div className="login__form-action">
            <Button type="primary" onClick={onHandleSubmit}>
              Login
            </Button>
          </div>
        </Form>
      </div>
    </Layout.Content>
  );
}

export default Login;
