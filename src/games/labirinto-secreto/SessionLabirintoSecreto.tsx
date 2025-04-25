// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
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
  switch (state.phase) {
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
      return PhaseError;
  }
}

function SessionLabirintoSecreto() {
  return (
    <Session gameCollection={GAME_COLLECTION.LABIRINTO_SECRETO} getActiveComponent={getActiveComponent} />
  );
}

export default SessionLabirintoSecreto;
