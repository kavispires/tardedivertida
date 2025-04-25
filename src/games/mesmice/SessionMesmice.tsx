// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { MESMICE_PHASES } from './utils/constants';
import { PhaseClueWriting } from './PhaseClueWriting';
import { PhaseObjectFeatureElimination } from './PhaseObjectFeatureElimination';
import { PhaseResult } from './PhaseResult';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case MESMICE_PHASES.CLUE_WRITING:
      return PhaseClueWriting;
    case MESMICE_PHASES.OBJECT_FEATURE_ELIMINATION:
      return PhaseObjectFeatureElimination;
    case MESMICE_PHASES.RESULT:
      return PhaseResult;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionMesmice() {
  return <Session gameCollection={GAME_COLLECTION.MESMICE} getActiveComponent={getActiveComponent} />;
}

export default SessionMesmice;
