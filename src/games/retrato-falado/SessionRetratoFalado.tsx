// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { PhaseCompositeSketch } from './PhaseCompositeSketch';
import { PhaseEvaluation } from './PhaseEvaluation';
import { PhaseReveal } from './PhaseReveal';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  // If phase is not defined, it is likely that the game is still loading
  if (state && !state.phase) return LoadingPage;

  switch (state.phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.RETRATO_FALADO.COMPOSITE_SKETCH:
      return PhaseCompositeSketch;
    case PHASES.RETRATO_FALADO.EVALUATION:
      return PhaseEvaluation;
    case PHASES.RETRATO_FALADO.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionRetratoFalado() {
  return <Session gameCollection={GAME_COLLECTION.RETRATO_FALADO} getActiveComponent={getActiveComponent} />;
}

export default SessionRetratoFalado;
