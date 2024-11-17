import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
// Ant Design Resources
import { Alert, Button, Divider, Modal } from 'antd';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
import { UseStep } from 'hooks/useStep';
// Services
import { signInAsGuest } from 'services/firebase';
// Components
import { SignIn, SignInWithGoogle } from 'components/auth/SignIn';
import { SignUp } from 'components/auth/SignUp';
import { DualTranslate, Translate } from 'components/language';
import { useGameInfoContext } from 'components/session/GameInfoContext';

type StepJoinProps = {
  setStep: UseStep['setStep'];
};

export function StepJoin({ setStep }: StepJoinProps) {
  const { isAuthenticated } = useCurrentUserContext();
  const info = useGameInfoContext();

  const { isPending, mutate, isError, error } = useMutation({
    mutationKey: ['sign-in-anon'],
    mutationFn: async () => signInAsGuest(),
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

      <SignInWithGoogle onSuccess={() => setStep(1)} block size="middle" />

      {isError && <Alert message="Error" description={JSON.stringify(error)} type="error" showIcon />}

      <Divider>
        <Translate pt="ou" en="or" />
      </Divider>

      <Button type="primary" block disabled={isAuthenticated} onClick={() => mutate()} loading={isPending}>
        <Translate pt="Entrar como visitante" en="Join as a Guest" />
      </Button>
    </>
  );
}

type LoginButtonProps = {
  disabled: boolean;
  setStep: UseStep['setStep'];
};

export function LoginButton({ disabled, setStep }: LoginButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Modal
        open={open}
        title={<Translate pt="Logar" en="LogIn" />}
        cancelText={<Translate pt="Cancelar" en="Cancel" />}
        onCancel={() => setOpen(false)}
        okButtonProps={{
          style: { display: 'none' },
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

type SignUpButtonProps = {
  disabled: boolean;
  setStep: UseStep['setStep'];
};

export function SignUpButton({ disabled, setStep }: SignUpButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Modal
        open={open}
        title={<Translate pt="Cadastro" en="Sign Up Form" />}
        cancelText={<Translate pt="Cancelar" en="Cancel" />}
        onCancel={() => setOpen(false)}
        okButtonProps={{
          style: { display: 'none' },
        }}
      >
        <SignUp onSuccess={() => setStep(1)} />
      </Modal>
      <Button type="link" block disabled={disabled} onClick={() => setOpen(true)}>
        <Translate pt="Cadastrar" en="Sign up" />
      </Button>
    </div>
  );
}
