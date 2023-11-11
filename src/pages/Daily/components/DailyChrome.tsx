import { Layout, Typography } from 'antd';
import { IconAvatar } from 'components/avatars';
import { CalendarIcon } from 'icons/CalendarIcon';
import { ReactNode } from 'react';

const { Header, Content } = Layout;

type DailyChromeProps = {
  challenge?: ReactNode;
  children: ReactNode;
};

export function DailyChrome({ challenge, children }: DailyChromeProps) {
  return (
    <Layout className="app">
      <Header className="daily-header">
        <IconAvatar icon={<CalendarIcon />} />
        <Typography.Title level={1} className="daily-heading">
          TD Diário {challenge}
        </Typography.Title>
      </Header>
      <Content>{children}</Content>
    </Layout>
  );
}
