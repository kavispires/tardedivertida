import type { AliasToken } from 'antd/es/theme/internal';
import { type ReactNode, useEffect, useMemo } from 'react';
// Ant Design Resources
import { ConfigProvider } from 'antd';
// Hooks
import { useGameMeta } from 'hooks/useGameMeta';
import { useGameState } from 'hooks/useGameState';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
import { useGlobalState } from 'hooks/useGlobalState';
import { useIdleRedirect } from 'hooks/useIdleRedirect';
import { useLanguage } from 'hooks/useLanguage';
// Components
import { AdminMenuDrawer } from 'components/admin';
import { GameInfoDrawer } from 'components/drawers';
import { AutoNextPhase } from 'components/general/AutoNextPhase';
import { PageLayout } from 'components/general/PageLayout';
import { PhaseLobby } from 'components/phases';
// Internal
import { RedirectSession } from './RedirectSession';
import { GameInfoProvider, useGameAppearance } from './GameInfoContext';
// Utils

type SessionProps = {
  /**
   * The game collection name
   */
  gameCollection: GameName;
  /**
   * The active component to be rendered, usually a Phase... component
   */
  getActiveComponent: (args: any) => any;
};

export function Session({ gameCollection, getActiveComponent }: SessionProps) {
  const gameMeta = useGameMeta();
  const { language } = useLanguage();
  const state = useGameState(gameMeta.gameId, gameCollection);
  const [userId] = useGlobalState('userId');
  const [, setLanguage] = useGlobalLocalStorage('language');

  const players = state.players ?? {};

  useIdleRedirect();

  // Update session language to match the game
  // biome-ignore lint/correctness/useExhaustiveDependencies: only update then receiving the game language
  useEffect(() => {
    if (language !== gameMeta.language) {
      setLanguage(gameMeta.language);
    }
  }, [gameMeta.language]);

  if (!userId || !players[userId]) {
    return (
      <GameInfoProvider gameCollection={gameCollection}>
        <SessionConfigWrapper>
          <RedirectSession state={state} />
          <PhaseLobby players={players} meta={gameMeta} />
        </SessionConfigWrapper>
      </GameInfoProvider>
    );
  }

  const ActiveComponent: any = getActiveComponent(state);

  return (
    <PageLayout>
      <GameInfoProvider gameCollection={gameCollection}>
        <SessionConfigWrapper>
          <GameInfoDrawer players={players} state={state} userId={userId} />
          <RedirectSession state={state} />
          <ActiveComponent players={players} state={state} meta={gameMeta} />
          <AutoNextPhase players={players} />
          <AdminMenuDrawer state={state} players={players} />
        </SessionConfigWrapper>
      </GameInfoProvider>
    </PageLayout>
  );
}

type SessionConfigWrapperProps = {
  children: ReactNode;
};

export function SessionConfigWrapper({ children }: SessionConfigWrapperProps) {
  const customTokens = useGetCustomTokens();

  return (
    <ConfigProvider
      theme={{
        token: customTokens,
      }}
    >
      {children}
    </ConfigProvider>
  );
}

function useGetCustomTokens() {
  const gameAppearance = useGameAppearance();

  return useMemo(() => {
    const customTokens: Partial<AliasToken> = {};
    if (gameAppearance.primaryColor) {
      customTokens.colorPrimary = gameAppearance.primaryColor;
      customTokens.colorLink = gameAppearance.primaryColor;
    }
    if (gameAppearance.surfaceColor) {
      customTokens.colorBgContainer = gameAppearance.surfaceColor;
    }
    return customTokens;
  }, [gameAppearance]);
}
