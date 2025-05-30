// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { UE_SO_ISSO_PHASES } from './utils/constants';
import { PhaseWordSelection } from './PhaseWordSelection';
import { PhaseSuggest } from './PhaseSuggest';
import { PhaseCompare } from './PhaseCompare';
import { PhaseGuess } from './PhaseGuess';
import { PhaseResult } from './PhaseResult';
import { PhaseGameOver } from './PhaseGameOver';
import { PhaseVerifyGuess } from './PhaseVerifyGuess';
// Sass
import 'assets/fonts/architects-daughter.scss';
import './utils/styles.scss';
// Fonts
// Session

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case UE_SO_ISSO_PHASES.WORD_SELECTION:
      return PhaseWordSelection;
    case UE_SO_ISSO_PHASES.SUGGEST:
      return PhaseSuggest;
    case UE_SO_ISSO_PHASES.COMPARE:
      return PhaseCompare;
    case UE_SO_ISSO_PHASES.GUESS:
      return PhaseGuess;
    case UE_SO_ISSO_PHASES.VERIFY_GUESS:
      return PhaseVerifyGuess;
    case UE_SO_ISSO_PHASES.RESULT:
      return PhaseResult;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionUeSoIsso() {
  return <Session gameCollection={GAME_COLLECTION.UE_SO_ISSO} getActiveComponent={getActiveComponent} />;
}

export default SessionUeSoIsso;
