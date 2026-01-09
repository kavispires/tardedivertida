// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { ADEDANHX_PHASES } from './utils/constants';
import { PhaseAnswering } from './PhaseAnswering';
import { PhaseEvaluation } from './PhaseEvaluation';
import { PhaseResults } from './PhaseResults';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case ADEDANHX_PHASES.ANSWERING:
      return PhaseAnswering;
    case ADEDANHX_PHASES.EVALUATION:
      return PhaseEvaluation;
    case ADEDANHX_PHASES.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionAdedanhx() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.ADEDANHX}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionAdedanhx;
