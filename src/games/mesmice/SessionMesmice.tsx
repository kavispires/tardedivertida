// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { PhaseClueWriting } from './PhaseClueWriting';
import { PhaseObjectFeatureElimination } from './PhaseObjectFeatureElimination';
import { PhaseResult } from './PhaseResult';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  // If phase is not defined, it is likely that the game is still loading
  if (state && !state.phase) return LoadingPage;

  switch (state.phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.MESMICE.CLUE_WRITING:
      return PhaseClueWriting;
    case PHASES.MESMICE.OBJECT_FEATURE_ELIMINATION:
      return PhaseObjectFeatureElimination;
    case PHASES.MESMICE.RESULT:
      return PhaseResult;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionMesmice() {
  return <Session gameCollection={GAME_COLLECTION.MESMICE} getActiveComponent={getActiveComponent} />;
}

export default SessionMesmice;
