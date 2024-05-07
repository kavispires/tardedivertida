import { Layout } from 'antd';
import { Translate } from 'components/language';
import { CalendarIcon } from 'icons/CalendarIcon';
import { ReactNode } from 'react';

import { useDailyChallenge } from '../hooks/useDailyChallenge';
import { getToday } from '../utils';
import { Header } from './Header';
import { isDevEnv } from 'utils/helpers';
import { DevResetLocalStorageButton } from './DevResetLocalStorageButton';

const { Content, Footer } = Layout;

type DailyChromeProps = {
  children: ReactNode;
};

export function DailyChrome({ children }: DailyChromeProps) {
  const challengeQuery = useDailyChallenge(getToday());
  return (
    <Layout className="app">
      <Header icon={<CalendarIcon />}>
        <Translate pt="TD Diário" en="TD Daily" />
      </Header>
      {challengeQuery.isLoading ? <div className="loading-bar"></div> : <></>}
      <Content>{children}</Content>
      {isDevEnv && (
        <Footer>
          <DevResetLocalStorageButton />
        </Footer>
      )}
    </Layout>
  );
}
