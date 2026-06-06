import type { ReactNode } from 'react';
// Icons
import { CalendarIcon } from 'icons/CalendarIcon';
// Components
import { Translate } from 'components/language/Translate';
import { PageLayout } from 'components/layout/PageLayout';
// Internal
import { useDailyChallengeContext } from '../hooks/useDailyChallengeContext';
import { Header } from './Header';
import { DailyContent } from './DailyContent';

type DailyChromeProps = {
  children: ReactNode;
};

export function DailyChrome({ children }: DailyChromeProps) {
  const challengeQuery = useDailyChallengeContext();

  return (
    <PageLayout className="app">
      <Header
        icon={<CalendarIcon />}
        localStorageKey=""
      >
        <Translate
          pt="TD Diário"
          en="TD Daily"
        />
      </Header>
      {challengeQuery.isLoading && <div className="daily-loading-bar"></div>}
      <DailyContent>{children}</DailyContent>
    </PageLayout>
  );
}
