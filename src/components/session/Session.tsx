import type { AliasToken } from 'antd/es/theme/internal';
import { type ReactNode, useEffect, useMemo, type ComponentType } from 'react';
// Ant Design Resources
import { ConfigProvider } from 'antd';
// Types
import type { GameState, PhaseProps } from 'types/game';
// Hooks
import { useGameMeta } from 'hooks/useGameMeta';
import { useGameState } from 'hooks/useGameState';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
import { useGlobalState } from 'hooks/useGlobalState';
import { useIdleRedirect } from 'hooks/useIdleRedirect';
import { useLanguage } from 'hooks/useLanguage';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Components
import { AdminMenuDrawer } from 'components/admin';
import { GameInfoDrawer } from 'components/drawers';
import { AutoNextPhase } from 'components/general/AutoNextPhase';
import { PageLayout } from 'components/layout/PageLayout';
import { PhaseError, PhaseLoading, PhaseLobby, PhaseSetup } from 'components/phases';
// Internal
import { RedirectSession } from './RedirectSession';
import { GameInfoProvider, useGameAppearance } from './GameInfoContext';

type SessionProps = {
  /**
   * The game collection name
   */
  gameCollection: GameName;
  /**
   * The active component to be rendered, usually a Phase... component
   */
  getActiveComponent: (args: GameState) => ComponentType<PhaseProps<any>>;
};

export function Session({ gameCollection, getActiveComponent }: SessionProps) {
  const { meta: gameMeta, dataUpdatedAt } = useGameMeta();
  const { language } = useLanguage();
  const state = useGameState(gameMeta.gameId, gameCollection);
  const [userId] = useGlobalState('userId');
  const [, setLanguage] = useGlobalLocalStorage('language');
  const user = useUser(state?.players, state);

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
          <PhaseLobby
            state={state}
            players={players}
            meta={gameMeta}
            user={user}
          />
        </SessionConfigWrapper>
      </GameInfoProvider>
    );
  }

  const getContentComponent = () => {
    // If phase is not defined, it is likely that the game is still loading
    if (state && !state.phase) {
      return PhaseLoading;
    }

    if (state.phase === PHASES.DEFAULT.LOBBY) {
      return PhaseLobby;
    }

    if (state.phase === PHASES.DEFAULT.SETUP) {
      return PhaseSetup;
    }

    return getActiveComponent(state);
  };

  const ActiveComponent = getContentComponent() || PhaseError;

  return (
    <PageLayout>
      <GameInfoProvider gameCollection={gameCollection}>
        <SessionConfigWrapper key={state.phase !== PHASES.DEFAULT.SETUP ? dataUpdatedAt : undefined}>
          <GameInfoDrawer
            players={players}
            state={state}
            userId={userId}
          />
          <RedirectSession state={state} />
          <ActiveComponent
            players={players}
            state={state}
            meta={gameMeta}
            user={user}
          />
          <AutoNextPhase players={players} />
          <AdminMenuDrawer
            state={state}
            players={players}
          />
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
