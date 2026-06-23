import { useMutation } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
// Ant Design Resources
import { Alert, Button, Divider, Modal, Typography } from 'antd';
// Hooks
import { useCurrentUserContext } from '@hooks/useCurrentUserContext';
import type { UseStep } from '@hooks/useStep';
// Services
import { signInAsGuest } from '@services/firebase';
// Components
import { SignIn, SignInWithGoogle } from '@components/auth/SignIn';
import { SignUp } from '@components/auth/SignUp';
import { Translate } from '@components/language/Translate';
// Sass
import styles from '../PhaseLobby.module.scss';

const Title = motion.create(Typography.Title);

type StepJoinProps = {
  /**
   * Function to navigate to a different lobby step
   */
  setStep: UseStep['setStep'];
};

/**
 * Lobby step component that handles guest sign-in and navigation to account creation
 */
export function StepJoin({ setStep }: StepJoinProps) {
  const { isAuthenticated } = useCurrentUserContext();

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
      <Title
        level={2}
        className={styles.lobbyStepTitle}
        layoutId="lobby-step-title"
      >
        <Translate
          pt="Bem-vindo!"
          en="Welcome"
        />
      </Title>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SignInWithGoogle
          onSuccess={() => setStep(1)}
          block
          size="large"
        />

        {isError && (
          <Alert
            title="Error"
            description={JSON.stringify(error)}
            type="error"
            showIcon
          />
        )}

        <Divider>
          <Translate
            pt="ou"
            en="or"
          />
        </Divider>

        <Button
          type="primary"
          block
          disabled={isAuthenticated}
          onClick={() => mutate()}
          loading={isPending}
        >
          <Translate
            pt="Entrar como visitante"
            en="Join as a Guest"
          />
        </Button>
      </motion.div>
    </>
  );
}

type LoginButtonProps = {
  disabled: boolean;
  setStep: UseStep['setStep'];
};

/**
 * Button component that opens a modal for existing users to sign in
 */
export function LoginButton({ disabled, setStep }: LoginButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Modal
        open={open}
        title={
          <Translate
            pt="Logar"
            en="LogIn"
          />
        }
        cancelText={
          <Translate
            pt="Cancelar"
            en="Cancel"
          />
        }
        onCancel={() => setOpen(false)}
        okButtonProps={{
          style: { display: 'none' },
        }}
      >
        <SignIn onSuccess={() => setStep(1)} />
      </Modal>
      <Button
        type="link"
        block
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <Translate
          pt="Fazer Login"
          en="Login"
        />
      </Button>
    </div>
  );
}

type SignUpButtonProps = {
  disabled: boolean;
  setStep: UseStep['setStep'];
};

/**
 * Button component that opens a modal for new users to create an account
 */
export function SignUpButton({ disabled, setStep }: SignUpButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Modal
        open={open}
        title={
          <Translate
            pt="Cadastro"
            en="Sign Up Form"
          />
        }
        cancelText={
          <Translate
            pt="Cancelar"
            en="Cancel"
          />
        }
        onCancel={() => setOpen(false)}
        okButtonProps={{
          style: { display: 'none' },
        }}
      >
        <SignUp onSuccess={() => setStep(1)} />
      </Modal>
      <Button
        type="link"
        block
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <Translate
          pt="Cadastrar"
          en="Sign up"
        />
      </Button>
    </div>
  );
}
