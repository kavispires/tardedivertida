// Ant Design Resources
import { Divider, Layout, PageHeader } from 'antd';
import { Avatar } from 'components/avatars';
// Components
import { AVAILABLE_AVATAR_IDS, AVATARS } from 'utils/constants';

function AvatarsPage() {
  const styles: React.CSSProperties = {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
  };

  const stylesLi: React.CSSProperties = {
    margin: '0',
    display: 'grid',
    gridTemplateRows: '72px auto',
    alignItems: 'center',
    justifyItems: 'center',
    padding: '0.5rem',
    color: 'white',
  };

  const AI_AVATARS = Object.keys(AVATARS).filter((id) => !AVAILABLE_AVATAR_IDS.includes(id));

  return (
    <Layout.Content style={{ padding: '1rem', width: '100%' }}>
      <PageHeader title={`Avatars (${AVAILABLE_AVATAR_IDS.length})`} style={{ backgroundColor: 'white' }} />
      <ul style={styles}>
        {AVAILABLE_AVATAR_IDS.map((avatarId) => {
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
  );
}

export default AvatarsPage;
