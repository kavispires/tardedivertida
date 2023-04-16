import { useTitle } from 'react-use';
// Ant Design Resources
import { Layout, Input, Modal } from 'antd';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Utils
// import GAME_LIST from 'utils/info';
import { NOOP } from 'utils/constants';
// Components
import { Translate } from 'components/language';
import { SignIn } from 'components/auth/SignIn';
import { Title } from 'components/text';
import { UserName } from './components/UserName';

function Me() {
  useTitle('Me - Tarde Divertida');
  const { isAuthenticated, currentUser } = useCurrentUserContext();

  const notAuthenticated = (
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
  return (
    <Layout className="dev-layout">
      <Layout.Content className="container" id="main-container">
        {notAuthenticated}

        <Title size="x-small" level={1} align="left">
          <Translate pt="Página do Usuário" en="User Page" /> <UserName names={currentUser.names} />
        </Title>

        <Input.TextArea
          name="output"
          id=""
          cols={5}
          rows={25}
          readOnly
          value={JSON.stringify(currentUser, null, 4)}
        />
      </Layout.Content>
    </Layout>
  );
}

export default Me;
