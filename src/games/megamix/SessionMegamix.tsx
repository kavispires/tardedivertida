// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { MEGAMIX_PHASES } from './utils/constants';
import { PhaseTrack } from './PhaseTrack';
import { PhaseSeeding } from './PhaseSeeding';
import { PhaseResult } from './PhaseResult';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case MEGAMIX_PHASES.SEEDING:
      return PhaseSeeding;
    case MEGAMIX_PHASES.TRACK:
      return PhaseTrack;
    case MEGAMIX_PHASES.RESULT:
      return PhaseResult;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionMegamix() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.MEGAMIX}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionMegamix;
