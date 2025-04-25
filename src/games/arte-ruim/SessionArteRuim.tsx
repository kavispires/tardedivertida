// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { ARTE_RUIM_PHASES } from './utils/constants';
import PhaseDraw from './PhaseDraw';
import PhaseEvaluation from './PhaseEvaluation';
import PhaseGallery from './PhaseGallery';
import PhaseGameOver from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case ARTE_RUIM_PHASES.DRAW:
      return PhaseDraw;
    case ARTE_RUIM_PHASES.EVALUATION:
      return PhaseEvaluation;
    case ARTE_RUIM_PHASES.GALLERY:
      return PhaseGallery;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionArteRuim() {
  return <Session gameCollection={GAME_COLLECTION.ARTE_RUIM} getActiveComponent={getActiveComponent} />;
}

export default SessionArteRuim;
