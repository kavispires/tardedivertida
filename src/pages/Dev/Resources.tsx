import { useTitle } from 'react-use';
// Ant Design Resources
import { Divider, Layout } from 'antd';
// Components
import { DevHeader } from './DevHeader';
import { RestructureUI } from './RestructureUI';
import { TransferGlobal } from './TransferGlobal';

function ResourcesPage() {
  useTitle('Resources | Dev | Tarde Divertida');

  return (
    <Layout className="dev-layout">
      <DevHeader title="Resources" />
      <Layout.Content className="dev-content">
        <h2>TBD</h2>

        <RestructureUI />

        <Divider />

        <TransferGlobal />
      </Layout.Content>
    </Layout>
  );
}

export default ResourcesPage;
