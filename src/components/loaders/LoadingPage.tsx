// Ant Design Resources
import { Layout } from 'antd';
// Icons
import { AnimatedVideoConferenceIcon } from 'icons/AnimatedVideoConferenceIcon';

export function LoadingPage() {
  return (
    <Layout.Content className="loading-page">
      <AnimatedVideoConferenceIcon style={{ width: '120px' }} />
    </Layout.Content>
  );
}
