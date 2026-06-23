// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from '@utils/constants';
import { PHASES } from '@utils/phases';
// Components
import { PhaseError } from '@components/phases/PhaseError';
import { PhasePlaceholder } from '@components/phases/PhasePlaceholder';
import { Session } from '@components/session/Session';
// Internal
import { FOFOCA_QUENTE_PHASES } from './utils/constants';
import { FofocaQuenteProvider } from './utils/FofocaQuenteContext';
import { PhaseRolesSelection } from './PhaseRolesSelection';
import { PhaseBoardSetup } from './PhaseBoardSetup';
import { PhaseIntimidation } from './PhaseIntimidation';
import { PhaseRumor } from './PhaseRumor';
import { PhaseResponse } from './PhaseResponse';
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
    case FOFOCA_QUENTE_PHASES.RUMOR:
      return PhaseRumor;
    case FOFOCA_QUENTE_PHASES.RESPONSE:
      return PhaseResponse;
    case PHASES.DEFAULT.GAME_OVER:
      return PhasePlaceholder;
    default:
      return PhaseError;
  }
}

function SessionFofocaQuente() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.FOFOCA_QUENTE}
      getActiveComponent={getActiveComponent}
      provider={FofocaQuenteProvider}
    />
  );
}

export default SessionFofocaQuente;
