import { DailyError } from 'pages/Daily/components/DailyError';
import { DailyLoading } from 'pages/Daily/components/DailyLoading';
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

  if (challengeQuery.isError || !dailyData) {
    return <DailyError />;
  }

  return <GameComponent key={dailyData.id} data={dailyData} currentUser={currentUser} />;
}

type DemoGameProps = {
  GameComponent: React.ComponentType<{ data: any; currentUser: Me }>;
  useDailyHook: () => any;
};

export function DemoGame({ GameComponent, useDailyHook }: DemoGameProps) {
  const { currentUser } = useCurrentUserContext();

  // Load challenge
  const demo = useDailyHook();

  if (demo.isLoading) {
    return <DailyLoading />;
  }

  const demoData = demo?.data;

  if (demo.isError || !demoData) {
    return <DailyError />;
  }

  return <GameComponent key={demoData.id} data={demoData} currentUser={currentUser} />;
}
