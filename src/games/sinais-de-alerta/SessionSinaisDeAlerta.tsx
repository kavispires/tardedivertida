// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { SINAIS_DE_ALERTA_PHASES } from './utils/constants';
import { PhaseDrawing } from './PhaseDrawing';
import { PhaseEvaluation } from './PhaseEvaluation';
import { PhaseGallery } from './PhaseGallery';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case SINAIS_DE_ALERTA_PHASES.DRAWING:
      return PhaseDrawing;
    case SINAIS_DE_ALERTA_PHASES.EVALUATION:
      return PhaseEvaluation;
    case SINAIS_DE_ALERTA_PHASES.GALLERY:
      return PhaseGallery;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionSinaisDeAlerta() {
  return (
    <Session gameCollection={GAME_COLLECTION.SINAIS_DE_ALERTA} getActiveComponent={getActiveComponent} />
  );
}

export default SessionSinaisDeAlerta;
