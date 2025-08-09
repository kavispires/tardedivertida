import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
import { useEffectOnce } from 'react-use';
// Types
import type { Me } from 'types/user';
// Hooks
import { useCurrentUserContext } from 'hooks/useCurrentUserContext';
// Internal
import type { DailyResponse } from '../utils/types';
import { useDailyChallenge } from '../hooks/useDailyChallenge';

type DailyGameProps = {
  gameName: keyof DailyResponse;
  GameComponent: React.ComponentType<{ data: any; currentUser: Me }>;
};

export function DailyGame({ gameName, GameComponent }: DailyGameProps) {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const challengeQuery = useDailyChallenge();

  if (challengeQuery.isLoading) {
    return <DailyLoading />;
  }

  const dailyData = challengeQuery?.data?.[gameName];

  if (challengeQuery.isError || !dailyData || typeof dailyData !== 'object') {
    return <DailyError />;
  }

  return <GameComponent key={dailyData.id} data={dailyData} currentUser={currentUser} />;
}

type DemoGameProps = {
  GameComponent: React.ComponentType<{ data: any; currentUser: Me }>;
  useDemoHook: () => any;
  lsKey: string;
};

export function DemoGame({ GameComponent, useDemoHook, lsKey }: DemoGameProps) {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const demo = useDemoHook();

  // Reset local storage
  useEffectOnce(() => {
    lsKey && localStorage.removeItem(`TD_DAILY_${lsKey}_LOCAL_TODAY`);
  });

  if (demo.isLoading) {
    return <DailyLoading />;
  }

  const demoData = demo?.data;

  if (demo.isError || !demoData || typeof demoData !== 'object') {
    return <DailyError />;
  }

  return <GameComponent key={demoData.id} data={demoData} currentUser={currentUser} />;
}

/**
 * For temporary use during beta release of a game
 */
export function DailyGameBetaRelease({
  gameName,
  GameComponent,
  useDemoHook,
  lsKey,
}: DailyGameProps & DemoGameProps) {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const challengeQuery = useDailyChallenge();

  if (challengeQuery.isLoading) {
    return <DailyLoading />;
  }

  const dailyData = challengeQuery?.data?.[gameName];

  if (challengeQuery.isError || typeof dailyData !== 'object') {
    return <DailyError />;
  }

  if (!dailyData) {
    return <DemoGame GameComponent={GameComponent} useDemoHook={useDemoHook} lsKey={lsKey} />;
  }

  return <GameComponent key={dailyData.id} data={dailyData} currentUser={currentUser} />;
}
