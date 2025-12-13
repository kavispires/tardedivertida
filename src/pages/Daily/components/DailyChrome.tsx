import type { ReactNode } from 'react';
// Ant Design Resources
import { Layout } from 'antd';
// Icons
import { CalendarIcon } from 'icons/CalendarIcon';
// Components
import { DebugOnly } from 'components/debug';
import { Translate } from 'components/language';
import { PageLayout } from 'components/layout/PageLayout';
// Internal
import { useDailyChallenge } from '../hooks/useDailyChallenge';
import { DevResetLocalStorageButton } from './DevResetLocalStorageButton';
import { Header } from './Header';
import { DailyContent } from './DailyContent';

const { Footer } = Layout;

type DailyChromeProps = {
  children: ReactNode;
};

export function DailyChrome({ children }: DailyChromeProps) {
  const challengeQuery = useDailyChallenge();

  return (
    <PageLayout className="app">
      <Header icon={<CalendarIcon />} localStorageKey="">
        <Translate pt="TD Diário" en="TD Daily" />
      </Header>
      {challengeQuery.isLoading && <div className="loading-bar"></div>}
      <DailyContent>{children}</DailyContent>
      <DebugOnly devOnly>
        <Footer>
          <DevResetLocalStorageButton />
        </Footer>
      </DebugOnly>
    </PageLayout>
  );
}
