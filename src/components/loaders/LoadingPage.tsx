// Design Resources
import { Layout, Spin, Typography } from 'antd';
// Components
import { Translate } from '..';

type LoadingPageProps = {
  message?: string;
};

export function LoadingPage({ message }: LoadingPageProps) {
  return (
    <Layout.Content className="loading-page">
      <Spin size="large" />
      <Typography.Text>
        <Translate pt="Carregando..." en="Loading..." custom={message} />
      </Typography.Text>
    </Layout.Content>
  );
}
