import { type ReactNode, useState } from 'react';
// Ant Design Resources
import { Layout } from 'antd';
// Icons
import { CalendarIcon } from 'icons/CalendarIcon';
// Components
import { Translate } from 'components/language';
import { PageLayout } from 'components/layout/PageLayout';
// Internal
import { useDailyChallenge } from '../hooks/useDailyChallenge';
import { DevResetLocalStorageButton } from './DevResetLocalStorageButton';
import { Header } from './Header';

const { Content, Footer } = Layout;

type DailyChromeProps = {
  children: ReactNode;
};

export function DailyChrome({ children }: DailyChromeProps) {
  const challengeQuery = useDailyChallenge();
  const [count, setCount] = useState(0);

  return (
    <PageLayout className="app">
      <Header icon={<CalendarIcon />} localStorageKey="">
        <button
          type="button"
          onClick={() => setCount((prev) => prev + 1)}
          className="invisible-secret-button"
        >
          <Translate pt="TD Diário" en="TD Daily" />
        </button>
      </Header>
      {challengeQuery.isLoading && <div className="loading-bar"></div>}
      <Content>{children}</Content>
      {count >= 5 && (
        <Footer>
          <DevResetLocalStorageButton />
        </Footer>
      )}
    </PageLayout>
  );
}
