import { useQuery } from 'react-query';
import { useEffect } from 'react';
// Ant Design Resources
import { Alert, Button, Divider, Space } from 'antd';
// API & Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Services
import { signInAsGuest } from 'services/firebase';
// Components
import { DualTranslate, Translate } from 'components/language';

type StepJoinProps = {
  info: GameInfo;
  setStep: GenericFunction;
};

export function StepJoin({ info, setStep }: StepJoinProps) {
  const { isAuthenticated } = useCurrentUserContext();

  const { isLoading, refetch, isError, error } = useQuery({
    queryKey: 'sign-in',
    queryFn: async () => signInAsGuest,
    enabled: false,
    onSuccess: () => setStep(1),
  });

  useEffect(() => {
    if (isAuthenticated) {
      setStep(1);
    }
  }, [isAuthenticated, setStep]);

  return (
    <>
      <h1 className="lobby-step__title">
        <Translate pt="Bem-vindo!" en="Welcome" />
      </h1>

      {Boolean(info?.summary) && (
        <p className="lobby-step__summary">
          <DualTranslate>{info.summary}</DualTranslate>
        </p>
      )}

      <Button
        type="primary"
        block
        disabled={isAuthenticated || isLoading}
        onClick={() => refetch()}
        loading={isLoading}
      >
        <Translate pt="Entrar como convidado" en="Join as a Guest" />
      </Button>

      {isError && <Alert message="Error" description={JSON.stringify(error)} type="error" showIcon />}

      <Divider>
        <Translate pt="ou" en="or" />
      </Divider>
      <Space split={<Divider type="vertical" />} className="lobby-step__space-buttons" size="small">
        <Button type="link" block disabled>
          <Translate pt="Fazer Login" en="Login" />
        </Button>

        <Button type="link" block disabled>
          <Translate pt="Cadastrar" en="Sign up" />
        </Button>
      </Space>
    </>
  );
}
