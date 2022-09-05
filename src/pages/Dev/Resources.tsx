import { useTitle } from 'react-use';
// Ant Design Resources
import { Layout } from 'antd';
// Components
import { DevHeader } from './DevHeader';

function ResourcesPage() {
  useTitle('Resources | Dev | Tarde Divertida');

  return (
    <Layout className="dev-layout">
      <DevHeader title="Resources" />
      <Layout.Content className="dev-content">TBD</Layout.Content>
    </Layout>
  );
}

export default ResourcesPage;
