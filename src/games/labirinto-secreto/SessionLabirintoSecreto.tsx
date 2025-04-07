// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PhaseWait } from 'components/phases/PhaseWait';
import { Session } from 'components/session';
// Internal
import { LABIRINTO_SECRETO_PHASES } from './utils/constants';
import { PhaseMapBuilding } from './PhaseMapBuilding';
import { PhasePathFollowing } from './PhasePathFollowing';
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
    case LABIRINTO_SECRETO_PHASES.MAP_BUILDING:
      return PhaseMapBuilding;
    case LABIRINTO_SECRETO_PHASES.PATH_FOLLOWING:
      return PhasePathFollowing;
    case LABIRINTO_SECRETO_PHASES.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionLabirintoSecreto() {
  return (
    <Session gameCollection={GAME_COLLECTION.LABIRINTO_SECRETO} getActiveComponent={getActiveComponent} />
  );
}

export default SessionLabirintoSecreto;
