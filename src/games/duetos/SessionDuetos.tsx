// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { DUETOS_PHASES } from './utils/constants';
import { PhasePairing } from './PhasePairing';
import { PhaseResults } from './PhaseResults';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case DUETOS_PHASES.PAIRING:
      return PhasePairing;
    case DUETOS_PHASES.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionDuetos() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.DUETOS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionDuetos;
