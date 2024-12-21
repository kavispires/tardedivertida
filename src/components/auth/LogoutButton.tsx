import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { App, Button, type ButtonProps, Popconfirm } from 'antd';
import { signOut } from 'services/firebase';
import { Translate } from 'components/language';
// Services

export function LogoutButton(props: ButtonProps) {
  const navigate = useNavigate();
  const { message } = App.useApp();

  const { isPending, mutate } = useMutation({
    mutationKey: ['sign-out'],
    mutationFn: async () => await signOut(),
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
      onConfirm={() => mutate()}
      key="logout-button"
    >
      <Button danger ghost {...props} loading={isPending}>
        Logout
      </Button>
    </Popconfirm>
  );
}
