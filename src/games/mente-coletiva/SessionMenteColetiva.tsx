// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { MENTE_COLETIVA_PHASES } from './utils/constants';
import { PhaseQuestionSelection } from './PhaseQuestionSelection';
import { PhaseEverybodyWrites } from './PhaseEverybodyWrites';
import { PhaseCompare } from './PhaseCompare';
import { PhaseResolution } from './PhaseResolution';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import 'assets/fonts/architects-daughter.scss';
import './utils/styles.scss';
// Fonts

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case MENTE_COLETIVA_PHASES.QUESTION_SELECTION:
      return PhaseQuestionSelection;
    case MENTE_COLETIVA_PHASES.EVERYBODY_WRITES:
      return PhaseEverybodyWrites;
    case MENTE_COLETIVA_PHASES.COMPARE:
      return PhaseCompare;
    case MENTE_COLETIVA_PHASES.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionMenteColetiva() {
  return <Session gameCollection={GAME_COLLECTION.MENTE_COLETIVA} getActiveComponent={getActiveComponent} />;
}

export default SessionMenteColetiva;
