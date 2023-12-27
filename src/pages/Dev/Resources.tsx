import { useTitle } from 'react-use';
// Ant Design Resources
import { Layout, Space } from 'antd';
// Components
import { DevHeader } from './DevHeader';
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
        <Space className="space-container contained" direction="vertical">
          <Link to="/dev/classifier">Items Classifier</Link>
          <Link to="/dev/imagecardscategorizer">Image Cards Categorizer</Link>
          <Link to="/dev/imagecardsrelationships">Image Cards Relationships</Link>
        </Space>
      </Layout.Content>
    </Layout>
  );
}

export default ResourcesPage;
