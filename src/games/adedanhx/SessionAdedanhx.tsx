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
import { ADEDANHX_PHASES } from './utils/constants';
import { PhaseAnswering } from './PhaseAnswering';
import { PhaseEvaluation } from './PhaseEvaluation';
import { PhaseResults } from './PhaseResults';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './adedanhx.scss';
// Ant Design Resources

function getActiveComponent(state: GameState) {
  // If phase is not defined, it is likely that the game is still loading
  if (state && !state.phase) return LoadingPage;

  switch (state.phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case ADEDANHX_PHASES.ANSWERING:
      return PhaseAnswering;
    case ADEDANHX_PHASES.EVALUATION:
      return PhaseEvaluation;
    case ADEDANHX_PHASES.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionAdedanhx() {
  return <Session gameCollection={GAME_COLLECTION.ADEDANHX} getActiveComponent={getActiveComponent} />;
}

export default SessionAdedanhx;
