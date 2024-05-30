import { Layout } from 'antd';
import { Translate } from 'components/language';
import { CalendarIcon } from 'icons/CalendarIcon';
import { ReactNode, useState } from 'react';

import { useDailyChallenge } from '../hooks/useDailyChallenge';
import { getToday } from '../utils';
import { DevResetLocalStorageButton } from './DevResetLocalStorageButton';
import { Header } from './Header';

const { Content, Footer } = Layout;

type DailyChromeProps = {
  children: ReactNode;
};

export function DailyChrome({ children }: DailyChromeProps) {
  const challengeQuery = useDailyChallenge(getToday());
  const [count, setCount] = useState(0);

  return (
    <Layout className="app">
      <Header icon={<CalendarIcon />}>
        <button onClick={() => setCount((prev) => prev + 1)} className="invisible-secret-button">
          <Translate pt="TD Diário" en="TD Daily" />
        </button>
      </Header>
      {challengeQuery.isLoading ? <div className="loading-bar"></div> : <></>}
      <Content>{children}</Content>
      {count >= 5 && (
        <Footer>
          <DevResetLocalStorageButton />
        </Footer>
      )}
    </Layout>
  );
}
