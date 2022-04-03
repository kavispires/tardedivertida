// Ant Design Resources
import { Layout, Typography } from 'antd';
import { Icons } from 'components/icons';
import { Translate } from 'components/language';
// Components

type LoadingPageProps = {
  message?: string;
};

export function LoadingPage({ message }: LoadingPageProps) {
  return (
    <Layout.Content className="loading-page">
      <Icons.AnimatedVideoConference style={{ width: '120px' }} />
      <Typography.Text>
        <Translate pt="Carregando..." en="Loading..." custom={message} />
      </Typography.Text>
    </Layout.Content>
  );
}
