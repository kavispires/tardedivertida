import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// Ant Design Resources
import { App, Button, ButtonProps, Popconfirm } from 'antd';
// Services
import { signOut } from 'services/firebase';
// Components
import { Translate } from 'components/language';

export function LogoutButton(props: ButtonProps) {
  const navigate = useNavigate();
  const { message } = App.useApp();

  const { isLoading, refetch } = useQuery({
    queryKey: ['sign-out'],
    queryFn: async () => await signOut(),
    enabled: false,
    onSuccess: () => {
      navigate('/');
    },
    onError: (error: any) => {
      message.error(`Something went wrong: ${JSON.stringify(error, null, 2)}`);
    },
  });

  return (
    <Popconfirm
      title={<Translate pt="Tem certeza que quer deslogar?" en="Are you sure you want to log out?" />}
      onConfirm={() => refetch()}
      key="logout-button"
    >
      <Button danger ghost {...props} loading={isLoading}>
        Logout
      </Button>
    </Popconfirm>
  );
}
