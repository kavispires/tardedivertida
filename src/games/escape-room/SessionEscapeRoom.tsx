// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError, PhasePlaceholder } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { ESCAPE_ROOM_PHASES } from './utils/constants';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case ESCAPE_ROOM_PHASES.MISSION:
      return PhasePlaceholder;
    case ESCAPE_ROOM_PHASES.MISSION_EVALUATION:
      return PhasePlaceholder;
    case ESCAPE_ROOM_PHASES.RESULTS:
      return PhasePlaceholder;
    case PHASES.DEFAULT.GAME_OVER:
      return PhasePlaceholder;
    default:
      return PhaseError;
  }
}

function SessionEscapeRoom() {
  return <Session gameCollection={GAME_COLLECTION.ESCAPE_ROOM} getActiveComponent={getActiveComponent} />;
}

export default SessionEscapeRoom;
