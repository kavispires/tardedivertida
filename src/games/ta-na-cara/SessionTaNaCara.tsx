// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from '@utils/constants';
import { PHASES } from '@utils/phases';
// Components
import { PhaseError } from '@components/phases/PhaseError';
import { Session } from '@components/session/Session';
// Internal
import { TA_NA_CARA_PHASES } from './utils/constants';
import { PhasePrompt } from './PhasePrompt';
import { PhaseAnswer } from './PhaseAnswering';
import { PhaseGuessing } from './PhaseGuessing';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';
import 'assets/fonts/architects-daughter.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case TA_NA_CARA_PHASES.PROMPT:
      return PhasePrompt;
    case TA_NA_CARA_PHASES.ANSWERING:
      return PhaseAnswer;
    case TA_NA_CARA_PHASES.GUESSING:
      return PhaseGuessing;
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
