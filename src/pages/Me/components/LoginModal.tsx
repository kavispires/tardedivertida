// Ant Design Resources
import { Modal } from 'antd';
// Utils
import { NOOP } from 'utils/constants';
// Components
import { SignIn } from 'components/auth/SignIn';
import { Translate } from 'components/language';

type LoginModalProps = {
  isAuthenticated: boolean;
};

export function LoginModal({ isAuthenticated }: LoginModalProps) {
  return (
    <Modal
      open={!isAuthenticated}
      title={<Translate pt="Logar" en="LogIn" />}
      cancelText={<Translate pt="Cancelar" en="Cancel" />}
      onCancel={NOOP}
      okButtonProps={{
        style: { display: 'none' },
      }}
      cancelButtonProps={{
        style: { display: 'none' },
      }}
      closable={false}
    >
      <SignIn onSuccess={NOOP} />
    </Modal>
  );
}
