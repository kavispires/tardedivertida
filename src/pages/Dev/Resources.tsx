import { useTitle } from 'react-use';
// Ant Design Resources
import { Divider, Layout } from 'antd';
// Components
import { DevHeader } from './DevHeader';
import { RestructureUI } from './Resources/RestructureUI';
import { TransferGlobal } from './Resources/TransferGlobal';
import { useQuery } from 'react-query';
import { RestructureJson } from './Resources/RestructureJson';
import { SaveGames } from './Resources/SaveGames';

function ResourcesPage() {
  useTitle('Resources | Dev | Tarde Divertida');

  return (
    <Layout className="dev-layout">
      <DevHeader title="Resources" />
      <Layout.Content className="dev-content">
        {/* <RestructureJson /> */}
        <SaveGames />
      </Layout.Content>
    </Layout>
  );
}

export default ResourcesPage;
