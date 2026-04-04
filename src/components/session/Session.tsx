import type { AliasToken } from 'antd/es/theme/internal';
import { type ReactNode, useEffect, useMemo, type ComponentType, type CSSProperties } from 'react';
// Ant Design Resources
import { ConfigProvider } from 'antd';
// Types
import type { GameState, PhaseProps, PhaseProviderProps } from 'types/game';
// Hooks
import { useGameMeta } from 'hooks/useGameMeta';
import { useGameState } from 'hooks/useGameState';
import { useGlobalLocalStorage } from 'hooks/useGlobalLocalStorage';
import { useGlobalState } from 'hooks/useGlobalState';
import { useIdleRedirect } from 'hooks/useIdleRedirect';
import { useLanguage } from 'hooks/useLanguage';
import { useTDBaseUrl } from 'hooks/useTDBaseUrl';
import { useUser } from 'hooks/useUser';
// Utils
import { PHASES } from 'utils/phases';
// Components
import { AdminMenuDrawer } from 'components/admin/AdminMenuDrawer';
import { GameInfoDrawer } from 'components/drawers/GameInfoDrawer';
import { AutoNextPhase } from 'components/general/AutoNextPhase';
import { PageLayout } from 'components/layout/PageLayout';
import { PhaseError } from 'components/phases/PhaseError';
import { PhaseLoading } from 'components/phases/PhaseLoading';
import { PhaseLobby } from 'components/phases/PhaseLobby';
import { PhaseSetup } from 'components/phases/PhaseSetup';
// Internal
import { RedirectSession } from './RedirectSession';
import { GameInfoProvider, useGameAppearance, useGameInfoContext } from './GameInfoContext';

type UnknownWorkaround = any;

type SessionProps = {
  /**
   * The game collection name
   */
  gameCollection: string;
  /**
   * The active component to be rendered, usually a Phase... component
   */
  getActiveComponent: (args: GameState) => ComponentType<PhaseProps<UnknownWorkaround>>;
  /**
   * Optional provider component to wrap ActiveComponent with game data
   */
  provider?: ComponentType<PhaseProviderProps<UnknownWorkaround>>;
};

export function Session({ gameCollection, getActiveComponent, provider }: SessionProps) {
  const { meta, dataUpdatedAt } = useGameMeta();
  const { language } = useLanguage();
  const state = useGameState(meta.gameId, gameCollection);
  const [userId] = useGlobalState('userId');
  const [, setLanguage] = useGlobalLocalStorage('language');
  const user = useUser(state?.players, state);

  const players = state.players ?? {};

  const defaultProps = {
    state,
    players,
    meta,
    user,
  };

  useIdleRedirect();

  // Update session language to match the game
  // biome-ignore lint/correctness/useExhaustiveDependencies: only update then receiving the game language
  useEffect(() => {
    if (language !== meta.language) {
      setLanguage(meta.language);
    }
  }, [meta.language]);

  if (!userId || !players[userId]) {
    return (
      <PageLayout>
        <GameInfoProvider gameCollection={gameCollection}>
          <SessionConfigWrapper>
            <RedirectSession state={state} />
            <PhaseLobby {...defaultProps} />
          </SessionConfigWrapper>
        </GameInfoProvider>
      </PageLayout>
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
  const Provider = provider;

  const activeComponentElement = <ActiveComponent {...defaultProps} />;

  return (
    <PageLayout>
      <GameInfoProvider gameCollection={gameCollection}>
        <SessionConfigWrapper
          key={
            ![PHASES.DEFAULT.LOBBY, PHASES.DEFAULT.SETUP].includes(state.phase) ? dataUpdatedAt : undefined
          }
        >
          <GameInfoDrawer
            players={players}
            state={state}
            userId={userId}
          />
          <RedirectSession state={state} />
          {Provider ? (
            <Provider {...defaultProps}>{activeComponentElement}</Provider>
          ) : (
            activeComponentElement
          )}
          <AutoNextPhase players={players} />
          <AdminMenuDrawer
            state={state}
            players={players}
          />
          <SessionBackgroundImage phase={state.phase} />
        </SessionConfigWrapper>
      </GameInfoProvider>
    </PageLayout>
  );
}

type SessionConfigWrapperProps = {
  /**
   * The child components to render
   */
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

type SessionBackgroundImageProps = {
  /**
   * The current game phase
   */
  phase: string;
};

/**
 * Background cover image that displays during game phases (excludes lobby, setup, and game_over)
 */
/**
 * Background cover image that displays during game phases (excludes lobby, setup, and game_over)
 */
function SessionBackgroundImage({ phase }: SessionBackgroundImageProps) {
  const info = useGameInfoContext();
  const gameAppearance = useGameAppearance();
  const baseUrl = useTDBaseUrl('assets');

  // 🧪 TEST IMAGE - Set to test image URL (e.g., `${import.meta.env.BASE_URL}images/test.jpg`) or empty string to use real images
  const TEST_IMAGE_URL = '';

  // Don't show background in these phases
  const excludedPhases = [PHASES.DEFAULT.LOBBY, PHASES.DEFAULT.SETUP, PHASES.DEFAULT.GAME_OVER];

  // Temporarily disable imageBackground check for testing
  const isTestMode = Boolean(TEST_IMAGE_URL);

  if (excludedPhases.includes(phase) || (!isTestMode && !gameAppearance.imageBackground)) {
    return null;
  }

  const imageUrl = TEST_IMAGE_URL || `${baseUrl}/backgrounds/${info.gameName}.jpg`;

  const backgroundStyle: CSSProperties = {
    position: 'fixed',
    top: '-5%',
    left: '-5%',
    width: '110%',
    height: '110%',
    backgroundImage: `url('${imageUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(6px)',
    opacity: 0.55,
    zIndex: -1,
    pointerEvents: 'none',
  };

  return <div style={backgroundStyle} />;
}
