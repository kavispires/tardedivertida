import { useTitle } from 'react-use';
// Ant Design Resources
import { Layout, Space } from 'antd';
// Components
import { DevHeader } from './DevHeader';
// import { RestructureUI } from './Resources/RestructureUI';
// import { TransferGlobal } from './Resources/TransferGlobal';
// import { useQuery } from 'react-query';
// import { RestructureJson } from './Resources/RestructureJson';
// import { SaveGames } from './Resources/SaveGames';
// import { SaveResources } from './Resources/SaveResources';
import { Link } from 'react-router-dom';

function ResourcesPage() {
  useTitle('Resources | Dev | Tarde Divertida');

  return (
    <Layout className="dev-layout">
      <DevHeader title="Resources" />
      <Layout.Content className="dev-content">
        {/* <RestructureJson /> */}
        {/* <SaveGames /> */}
        {/* <SaveResources /> */}
        <Space className="space-container" direction="vertical">
          <Link to="/dev/imagecardscategorizer">Image Cards Categorizer</Link>
          <Link to="/dev/imagecardsrelationships">Image Cards Relationsips</Link>
        </Space>
      </Layout.Content>
    </Layout>
  );
}

export default ResourcesPage;
