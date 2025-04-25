// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError, PhasePlaceholder } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { FOFOCA_QUENTE_PHASES } from './utils/constants';
import { PhaseRolesSelection } from './PhaseRolesSelection';
import { PhaseBoardSetup } from './PhaseBoardSetup';
import { PhaseIntimidation } from './PhaseIntimidation';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case FOFOCA_QUENTE_PHASES.ROLES_SELECTION:
      return PhaseRolesSelection;
    case FOFOCA_QUENTE_PHASES.BOARD_SETUP:
      return PhaseBoardSetup;
    case FOFOCA_QUENTE_PHASES.INTIMIDATION:
      return PhaseIntimidation;
    case PHASES.DEFAULT.GAME_OVER:
      return PhasePlaceholder;
    default:
      return PhaseError;
  }
}

function SessionFofocaQuente() {
  return <Session gameCollection={GAME_COLLECTION.FOFOCA_QUENTE} getActiveComponent={getActiveComponent} />;
}

export default SessionFofocaQuente;
