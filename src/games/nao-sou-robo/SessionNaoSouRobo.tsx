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
import { NAO_SOU_ROBO_PHASES } from './utils/constants';
import { PhaseCardSelection } from './PhaseCardSelection';
import { PhaseAreYouARobot } from './PhaseAreYouARobot';
import { PhaseResults } from './PhaseResults';
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
    case NAO_SOU_ROBO_PHASES.CARD_SELECTION:
      return PhaseCardSelection;
    case NAO_SOU_ROBO_PHASES.ARE_YOU_A_ROBOT:
      return PhaseAreYouARobot;
    case NAO_SOU_ROBO_PHASES.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionNaoSouRobo() {
  return <Session gameCollection={GAME_COLLECTION.NAO_SOU_ROBO} getActiveComponent={getActiveComponent} />;
}

export default SessionNaoSouRobo;
