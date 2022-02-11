// Design Resources
import { Layout, Typography } from 'antd';
// Components
import { Icons, Translate } from '..';

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
