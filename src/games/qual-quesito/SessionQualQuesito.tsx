// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { QUAL_QUESITO_PHASES } from './utils/constants';
import { PhaseCategoryCreation } from './PhaseCategoryCreation';
import { PhaseCardPlay } from './PhaseCardPlay';
import { PhaseVerification } from './PhaseVerification';
import { PhaseResults } from './PhaseResults';
import { PhaseSkipAnnouncement } from './PhaseSkipAnnouncement';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case QUAL_QUESITO_PHASES.CATEGORY_CREATION:
      return PhaseCategoryCreation;
    case QUAL_QUESITO_PHASES.CARD_PLAY:
      return PhaseCardPlay;
    case QUAL_QUESITO_PHASES.SKIP_ANNOUNCEMENT:
      return PhaseSkipAnnouncement;
    case QUAL_QUESITO_PHASES.VERIFICATION:
      return PhaseVerification;
    case QUAL_QUESITO_PHASES.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionQualQuesito() {
  return <Session gameCollection={GAME_COLLECTION.QUAL_QUESITO} getActiveComponent={getActiveComponent} />;
}

export default SessionQualQuesito;
