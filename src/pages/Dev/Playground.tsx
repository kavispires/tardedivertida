/** biome-ignore-all lint/correctness/noUnusedVariables: Playground */
import { type CSSProperties, useState } from 'react';
import { useTitle } from 'react-use';
// Ant Design Resources
import { Layout } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Components
import { Avatar, AvatarCard, AvatarName, AvatarStrip } from 'components/avatars';
import { PageLayout } from 'components/layout/PageLayout';
// Internal
import { DevHeader } from './DevHeader';
// import { Image, Layout } from 'antd';
// Resources

function Playground() {
  useTitle('Playground | Dev | Tarde Divertida');

  const styles: CSSProperties = {
    // display: 'grid',
    // gridTemplateColumns: 'repeat(5, 1fr)',

    // gap: '1rem',
    display: 'flex',
    flexWrap: 'wrap',
  };
  const stylesLi: CSSProperties = {
    border: '1px solid black',
    margin: '4px',
    padding: '8px',
    // width: '132px',
    // display: 'flex',
    // flexDirection: 'column',
    background: 'white',
    // alignItems: 'center',
    // justifyContent: 'space-between',
  };

  const [lines, setLines] = useState<any>([]);

  const player: GamePlayer = {
    id: '_player1',
    name: 'Robert',
    avatarId: '1',
    ready: true,
    updatedAt: Date.now(),
  };

  return (
    <PageLayout>
      <DevHeader title="Playground" />
      <Layout.Content className="dev-content">
        <div>
          <Avatar id="1" />
          <AvatarCard player={player} size="small" withName />
          <AvatarName player={player} />
          <AvatarStrip player={player} withName />
        </div>
      </Layout.Content>
    </PageLayout>
  );
}

export default Playground;
