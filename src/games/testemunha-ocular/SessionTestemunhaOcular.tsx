// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from '@utils/constants';
import { PHASES } from '@utils/phases';
// Components
import { PhaseError } from '@components/phases/PhaseError';
import { Session } from '@components/session/Session';
// Internal
import { TESTEMUNHA_OCULAR_PHASES } from './utils/constants';
import { PhaseWitnessSelection } from './PhaseWitnessSelection';
import { PhaseQuestionSelection } from './PhaseQuestionSelection';
import { PhaseQuestioning } from './PhaseQuestioning';
import { PhaseTrial } from './PhaseTrial';
import { PhaseGameOver } from './PhaseGameOver';
import { PhaseFinalTrial } from './PhaseFinalTrial';
// Sass
import 'assets/fonts/architects-daughter.scss';
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case TESTEMUNHA_OCULAR_PHASES.WITNESS_SELECTION:
      return PhaseWitnessSelection;
    case TESTEMUNHA_OCULAR_PHASES.QUESTION_SELECTION:
      return PhaseQuestionSelection;
    case TESTEMUNHA_OCULAR_PHASES.QUESTIONING:
      return PhaseQuestioning;
    case TESTEMUNHA_OCULAR_PHASES.TRIAL:
      return PhaseTrial;
    case TESTEMUNHA_OCULAR_PHASES.FINAL_TRIAL:
      return PhaseFinalTrial;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionTestemunhaOcular() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.TESTEMUNHA_OCULAR}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionTestemunhaOcular;
