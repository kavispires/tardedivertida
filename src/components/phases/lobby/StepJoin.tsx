import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
// Ant Design Resources
import { Alert, Button, Divider, Modal, Space } from 'antd';
// API & Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Services
import { signInAsGuest } from 'services/firebase';
// Components
import { DualTranslate, Translate } from 'components/language';
import { SignIn } from 'components/auth/SignIn';

type StepJoinProps = {
  info: GameInfo;
  setStep: GenericFunction;
};

export function StepJoin({ info, setStep }: StepJoinProps) {
  const { isAuthenticated } = useCurrentUserContext();

  const { isLoading, refetch, isError, error } = useQuery({
    queryKey: 'sign-in-anon',
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
        <LoginButton disabled={isAuthenticated || isLoading} setStep={setStep} />

        <Button type="link" block disabled>
          <Translate pt="Cadastrar" en="Sign up" />
        </Button>
      </Space>
    </>
  );
}

type LoginButtonProps = {
  disabled: boolean;
  setStep: GenericFunction;
};
function LoginButton({ disabled, setStep }: LoginButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Modal
        open={open}
        title={<Translate pt="Logar" en="LogIn" />}
        // okText="Create"
        cancelText="Cancel"
        onCancel={() => setOpen(false)}
        okButtonProps={{
          disabled: true,
        }}
      >
        <SignIn onSuccess={() => setStep(1)} />
      </Modal>
      <Button type="link" block disabled={disabled} onClick={() => setOpen(true)}>
        <Translate pt="Fazer Login" en="Login" />
      </Button>
    </div>
  );
}
