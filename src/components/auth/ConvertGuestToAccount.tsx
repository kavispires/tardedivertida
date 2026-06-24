import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
// Ant Design Resources
import { Button, Form, Image, Modal } from 'antd';
// Hooks
import { useCurrentUserContext } from '@hooks/useCurrentUserContext';
// Services
import { convertGuestoToUser } from '@services/firebase';
// Icons
import { UserStatsIcon } from '@icons/UserStatsIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { Surface } from '@components/layout/Surface';
import { Title } from '@components/text/Title';
// Internal
import { SignUpForm } from './SignUp';
// Images
import logo from '@assets/images/tarde-divertida-logo.svg?url';
// Sass
import styles from './auth.module.scss';

type ConvertGuestToAccountProps = {
  /**
   * Function to be called on successful conversion
   */
  onSuccess: () => void;
};

/**
 * Form component that allows guest users to convert their temporary account to a permanent account
 */
export function ConvertGuestToAccount({ onSuccess }: ConvertGuestToAccountProps) {
  const [form] = Form.useForm();

  const { isPending, mutate, isError } = useMutation({
    mutationKey: ['convert-guest'],
    mutationFn: async () =>
      await convertGuestoToUser(form.getFieldValue('username'), form.getFieldValue('password')),
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

export function ConvertGuestToAccountModal() {
  const [open, setOpen] = useState(false);
  const { isGuest } = useCurrentUserContext();
  const queryClient = useQueryClient();

  if (!isGuest) return null;

  const invalidateUser = () => queryClient.invalidateQueries({ queryKey: ['user'] });

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
          disabled: true,
        }}
      >
        <ConvertGuestToAccount onSuccess={invalidateUser} />
      </Modal>

      <Surface
        contained
        className={styles.convertGuestInstruction}
      >
        <Title
          size="xx-small"
          level={3}
        >
          <Icon
            size="large"
            icon={<UserStatsIcon />}
          />
          <Translate
            pt="Você jogou como visitante. Converta para um Perfil de Usuário!"
            en="You played as a guest, do you want to convert to an User Account?"
          />
        </Title>
        <p>
          <Translate
            pt="Com uma conta você poderá ver estatísticas de jogos anteriores, avatars favorites, e muito mais (em breve). Não coletamos nenhum dado não relacionado com os jogos"
            en="With a user account, you can see stats of previous games, favorite avatars, and more (coming soon). We don't collect any data not directly created in the games."
          />
        </p>

        <SpaceContainer>
          <Button
            type="primary"
            onClick={() => setOpen(true)}
          >
            <Translate
              pt="Converter Perfil"
              en="Convert to Account"
            />
          </Button>
        </SpaceContainer>
      </Surface>
    </div>
  );
}
