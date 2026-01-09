// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { TA_NA_CARA_PHASES } from './utils/constants';
import { PhasePrompt } from './PhasePrompt';
import { PhaseAnswer } from './PhaseAnswering';
import { PhaseGuessing } from './PhaseGuessing';
import { PhaseReveal } from './PhaseReveal';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case TA_NA_CARA_PHASES.PROMPT:
      return PhasePrompt;
    case TA_NA_CARA_PHASES.ANSWERING:
      return PhaseAnswer;
    case TA_NA_CARA_PHASES.GUESSING:
      return PhaseGuessing;
    case TA_NA_CARA_PHASES.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionTaNaCara() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.TA_NA_CARA}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionTaNaCara;
