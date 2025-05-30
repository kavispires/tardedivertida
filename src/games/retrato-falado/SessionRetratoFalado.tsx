// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { RETRATO_FALADO_PHASES } from './utils/constants';
import { PhaseCompositeSketch } from './PhaseCompositeSketch';
import { PhaseEvaluation } from './PhaseEvaluation';
import { PhaseReveal } from './PhaseReveal';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case RETRATO_FALADO_PHASES.COMPOSITE_SKETCH:
      return PhaseCompositeSketch;
    case RETRATO_FALADO_PHASES.EVALUATION:
      return PhaseEvaluation;
    case RETRATO_FALADO_PHASES.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionRetratoFalado() {
  return <Session gameCollection={GAME_COLLECTION.RETRATO_FALADO} getActiveComponent={getActiveComponent} />;
}

export default SessionRetratoFalado;
