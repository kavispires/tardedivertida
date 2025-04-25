// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
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
  switch (state.phase) {
    case COMUNICACAO_DUO_PHASES.ASKING_FOR_SOMETHING:
      return PhaseAskingForSomething;
    case COMUNICACAO_DUO_PHASES.DELIVER_SOMETHING:
      return PhaseDeliveringSomething;
    case COMUNICACAO_DUO_PHASES.VERIFICATION:
      return PhaseVerification;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionComunicacaoDuo() {
  return <Session gameCollection={GAME_COLLECTION.COMUNICACAO_DUO} getActiveComponent={getActiveComponent} />;
}

export default SessionComunicacaoDuo;
