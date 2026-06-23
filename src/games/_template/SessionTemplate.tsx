// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from '@utils/constants';
import { PHASES } from '@utils/phases';
// Components
import { PhaseError } from '@components/phases/PhaseError';
import { PhasePlaceholder } from '@components/phases/PhasePlaceholder';
import { Session } from '@components/session/Session';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case PHASES.TEMPLATE.UNKNOWN:
      return PhasePlaceholder;
    case PHASES.DEFAULT.GAME_OVER:
      return PhasePlaceholder;
    default:
      return PhaseError;
  }
}

function SessionTemplate() {
  return (
    <Session
      gameCollection={GAME_COLLECTION._TEMPLATE}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionTemplate;
