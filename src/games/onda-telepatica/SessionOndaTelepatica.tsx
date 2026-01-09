// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { ONDA_TELEPATICA_PHASES } from './utils/constants';
import { PhaseDialClue } from './PhaseDialClue';
import { PhaseGuess } from './PhaseGuess';
import { PhaseReveal } from './PhaseReveal';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case ONDA_TELEPATICA_PHASES.DIAL_CLUE:
      return PhaseDialClue;
    case ONDA_TELEPATICA_PHASES.GUESS:
      return PhaseGuess;
    case ONDA_TELEPATICA_PHASES.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionOndaTelepatica() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.ONDA_TELEPATICA}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionOndaTelepatica;
