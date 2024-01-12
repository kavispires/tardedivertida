import { ConfigProvider } from 'antd';
// Types
import type { GameState } from 'types/game';
// Constants
import { GAME_COLLECTION, THEME_COLORS } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseMapBuilding } from './PhaseMapBuilding';
import { PhasePathFollowing } from './PhasePathFollowing';
import { PhaseWait } from 'components/phases/PhaseWait';
import { PhaseResults } from './PhaseResults';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  // If phase is not defined, it is likely that the game is still loading
  if (state && !state.phase) return LoadingPage;

  switch (state.phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.DEFAULT.WAIT:
      return PhaseWait;
    case PHASES.LABIRINTO_SECRETO.MAP_BUILDING:
      return PhaseMapBuilding;
    case PHASES.LABIRINTO_SECRETO.PATH_FOLLOWING:
      return PhasePathFollowing;
    case PHASES.LABIRINTO_SECRETO.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionLabirintoSecreto() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: THEME_COLORS.FOREST,
          colorLink: THEME_COLORS.FOREST,
        },
      }}
    >
      <Session gameCollection={GAME_COLLECTION.LABIRINTO_SECRETO} getActiveComponent={getActiveComponent} />
    </ConfigProvider>
  );
}

export default SessionLabirintoSecreto;
