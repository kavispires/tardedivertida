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
import { VICE_CAMPEAO_PHASES } from './utils/constants';
import { PhaseCardSelection } from './PhaseCardSelection';
import { PhaseRun } from './PhaseRun';
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
    case VICE_CAMPEAO_PHASES.CARD_SELECTION:
      return PhaseCardSelection;
    case VICE_CAMPEAO_PHASES.RUN:
      return PhaseRun;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionViceCampeao() {
  return <Session gameCollection={GAME_COLLECTION.VICE_CAMPEAO} getActiveComponent={getActiveComponent} />;
}

export default SessionViceCampeao;
