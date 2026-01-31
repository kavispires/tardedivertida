// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { SENSO_LITERARIO_PHASES } from './utils/constants';
import { PhasePatternCreation } from './PhasePatternCreation';
import { PhaseResult } from './PhaseResult';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case SENSO_LITERARIO_PHASES.PATTERN_CREATION:
      return PhasePatternCreation;
    case SENSO_LITERARIO_PHASES.RESULT:
      return PhaseResult;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionSensoLiterario() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.SENSO_LITERARIO}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionSensoLiterario;
