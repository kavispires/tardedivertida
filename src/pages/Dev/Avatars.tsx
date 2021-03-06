// Ant Design Resources
import { Divider, Layout } from 'antd';
import { Avatar } from 'components/avatars';
import { useTitle } from 'react-use';
// Components
import { AVAILABLE_AVATAR_IDS, AVATARS } from 'utils/avatars';
import { DevHeader } from './DevHeader';

function AvatarsPage() {
  useTitle('Avatars | Dev | Tarde Divertida');

  const styles: React.CSSProperties = {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
  };

  const stylesLi: React.CSSProperties = {
    margin: '0',
    display: 'grid',
    gridTemplateRows: ' auto 72px auto',
    alignItems: 'center',
    justifyItems: 'center',
    padding: '0.5rem',
    color: 'white',
  };

  const AI_AVATARS = Object.keys(AVATARS).filter((id) => !AVAILABLE_AVATAR_IDS.includes(id));

  return (
    <Layout style={{ background: 'none' }}>
      <DevHeader title="Avatars" subTitle={`(${AVAILABLE_AVATAR_IDS.length})`} />
      <Layout.Content style={{ padding: '1rem', width: '100%' }}>
        <ul style={styles}>
          {AVAILABLE_AVATAR_IDS.map((avatarId) => {
            const avatar = AVATARS[avatarId];
            return (
              <li key={avatar.id} style={{ ...stylesLi, backgroundColor: avatar.color }}>
                <div style={{ overflow: 'hidden', textAlign: 'center' }}>[{avatar.id}]</div>
                <Avatar id={avatar.id} size={64} />
                <div style={{ overflow: 'hidden', textAlign: 'center' }}>
                  <p>
                    {avatar.description.en}
                    <br />
                    {avatar.description.pt}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <Divider />
        <ul style={styles}>
          {AI_AVATARS.map((avatarId) => {
            const avatar = AVATARS[avatarId];
            return (
              <li key={avatar.id} style={{ ...stylesLi, backgroundColor: avatar.color }}>
                <Avatar id={avatar.id} size={64} />
                <div style={{ overflow: 'hidden', textAlign: 'center' }}>
                  <p>
                    {avatar.description.en}
                    <br />
                    {avatar.description.pt}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Layout.Content>
    </Layout>
  );
}

export default AvatarsPage;
