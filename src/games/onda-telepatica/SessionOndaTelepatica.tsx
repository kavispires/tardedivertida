// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseLobby, PhaseSetup } from 'components/phases';
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
  // If phase is not defined, it is likely that the game is still loading
  if (state && !state.phase) return LoadingPage;

  switch (state.phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case ONDA_TELEPATICA_PHASES.DIAL_CLUE:
      return PhaseDialClue;
    case ONDA_TELEPATICA_PHASES.GUESS:
      return PhaseGuess;
    case ONDA_TELEPATICA_PHASES.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionOndaTelepatica() {
  return <Session gameCollection={GAME_COLLECTION.ONDA_TELEPATICA} getActiveComponent={getActiveComponent} />;
}

export default SessionOndaTelepatica;
