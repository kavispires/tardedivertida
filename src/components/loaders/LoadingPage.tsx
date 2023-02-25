// Ant Design Resources
import { Layout, Typography } from 'antd';
// Icons
import { AnimatedVideoConferenceIcon } from 'icons/AnimatedVideoConferenceIcon';
// Components
import { Translate } from 'components/language';

type LoadingPageProps = {
  message?: string;
};

export function LoadingPage({ message }: LoadingPageProps) {
  return (
    <Layout.Content className="loading-page">
      <AnimatedVideoConferenceIcon style={{ width: '120px' }} />
      <Typography.Text>
        <Translate pt="Carregando..." en="Loading..." custom={message} />
      </Typography.Text>
    </Layout.Content>
  );
}
