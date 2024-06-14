import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// Ant Design Resources
import { Button, Form, Image, Modal, Space } from 'antd';
// API
import { convertGuestoToUser } from 'services/firebase';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Image
import logo from 'assets/images/tarde-divertida-logo.svg';
// Components
import { Translate } from 'components/language';
import { Instruction, Title } from 'components/text';
import { IconAvatar } from 'components/avatars';
import { UserStatsIcon } from 'icons/UserStatsIcon';
import { SignUpForm } from './SignUp';

type ConvertGuestToAccountProps = {
  onSuccess: GenericFunction;
};

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
    <div className="sign-up">
      <div className="sign-up__logo">
        <Image src={logo} preview={false} />
      </div>

      <SignUpForm form={form} onFinish={onFinish} isError={isError} isLoading={isPending} />
    </div>
  );
}

export function ConvertGuestToAccountModal() {
  const [open, setOpen] = useState(false);
  const { isGuest } = useCurrentUserContext();
  const queryClient = useQueryClient();

  if (!isGuest) return <></>;

  const invalidateUser = () => queryClient.invalidateQueries({ queryKey: ['user'] });

  return (
    <div>
      <Modal
        open={open}
        title={<Translate pt="Cadastro" en="Sign Up Form" />}
        cancelText={<Translate pt="Cancelar" en="Cancel" />}
        onCancel={() => setOpen(false)}
        okButtonProps={{
          disabled: true,
        }}
      >
        <ConvertGuestToAccount onSuccess={invalidateUser} />
      </Modal>

      <Instruction contained className="convert-guest-instruction">
        <Title size="xx-small" level={3}>
          <IconAvatar size="large" icon={<UserStatsIcon />} />
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

        <Space className="space-container">
          <Button type="primary" onClick={() => setOpen(true)}>
            <Translate pt="Converter Perfil" en="Convert to Account" />
          </Button>
        </Space>
      </Instruction>
    </div>
  );
}
