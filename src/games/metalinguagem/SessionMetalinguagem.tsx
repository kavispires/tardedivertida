// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { METALINGUAGEM_PHASES } from './utils/constants';
import { PhaseWordCreation } from './PhaseWordCreation';
import { PhaseGuessing } from './PhaseGuessing';
import { PhaseResults } from './PhaseResults';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case METALINGUAGEM_PHASES.WORD_CREATION:
      return PhaseWordCreation;
    case METALINGUAGEM_PHASES.GUESSING:
      return PhaseGuessing;
    case METALINGUAGEM_PHASES.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionMetalinguagem() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.METALINGUAGEM}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionMetalinguagem;
