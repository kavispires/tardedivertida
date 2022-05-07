// Constants
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseDialClue from './PhaseDialClue';
import PhaseGuess from './PhaseGuess';
import PhaseReveal from './PhaseReveal';
import PhaseGameOver from './PhaseGameOver';

function SessionOndaTelepatica({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.ONDA_TELEPATICA.DIAL_CLUE:
        return PhaseDialClue;
      case PHASES.ONDA_TELEPATICA.GUESS:
        return PhaseGuess;
      case PHASES.ONDA_TELEPATICA.REVEAL:
        return PhaseReveal;
      case PHASES.DEFAULT.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.ONDA_TELEPATICA}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionOndaTelepatica;
