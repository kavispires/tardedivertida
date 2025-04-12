// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseLobby, PhaseSetup } from 'components/phases';
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
  // If phase is not defined, it is likely that the game is still loading
  if (state && !state.phase) return LoadingPage;

  switch (state.phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case SINAIS_DE_ALERTA_PHASES.DRAWING:
      return PhaseDrawing;
    case SINAIS_DE_ALERTA_PHASES.EVALUATION:
      return PhaseEvaluation;
    case SINAIS_DE_ALERTA_PHASES.GALLERY:
      return PhaseGallery;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionSinaisDeAlerta() {
  return (
    <Session gameCollection={GAME_COLLECTION.SINAIS_DE_ALERTA} getActiveComponent={getActiveComponent} />
  );
}

export default SessionSinaisDeAlerta;
