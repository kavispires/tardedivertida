import { Layout } from 'antd';
import { Translate } from 'components/language';
import { CalendarIcon } from 'icons/CalendarIcon';
import { ReactNode } from 'react';
import { Header } from './Header';

const { Content } = Layout;

type DailyChromeProps = {
  children: ReactNode;
};

export function DailyChrome({ children }: DailyChromeProps) {
  return (
    <Layout className="app">
      <Header icon={<CalendarIcon />}>
        <Translate pt="TD Diário" en="TD Daily" />
      </Header>

      <Content>{children}</Content>
    </Layout>
  );
}
