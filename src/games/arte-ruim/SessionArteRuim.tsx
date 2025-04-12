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
import { ARTE_RUIM_PHASES } from './utils/constants';
import PhaseDraw from './PhaseDraw';
import PhaseEvaluation from './PhaseEvaluation';
import PhaseGallery from './PhaseGallery';
import PhaseGameOver from './PhaseGameOver';
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
    case ARTE_RUIM_PHASES.DRAW:
      return PhaseDraw;
    case ARTE_RUIM_PHASES.EVALUATION:
      return PhaseEvaluation;
    case ARTE_RUIM_PHASES.GALLERY:
      return PhaseGallery;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionArteRuim() {
  return <Session gameCollection={GAME_COLLECTION.ARTE_RUIM} getActiveComponent={getActiveComponent} />;
}

export default SessionArteRuim;
