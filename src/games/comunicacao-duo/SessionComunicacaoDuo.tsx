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
import { COMUNICACAO_DUO_PHASES } from './utils/constants';
import { PhaseAskingForSomething } from './PhaseAskingForSomething';
import { PhaseVerification } from './PhaseVerification';
import { PhaseDeliveringSomething } from './PhaseDeliveringSomething';
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
    case COMUNICACAO_DUO_PHASES.ASKING_FOR_SOMETHING:
      return PhaseAskingForSomething;
    case COMUNICACAO_DUO_PHASES.DELIVER_SOMETHING:
      return PhaseDeliveringSomething;
    case COMUNICACAO_DUO_PHASES.VERIFICATION:
      return PhaseVerification;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionComunicacaoDuo() {
  return <Session gameCollection={GAME_COLLECTION.COMUNICACAO_DUO} getActiveComponent={getActiveComponent} />;
}

export default SessionComunicacaoDuo;
