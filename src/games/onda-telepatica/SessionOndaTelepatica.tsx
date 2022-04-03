// Constants
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { GameOverWrapper, PhaseSetup, PhaseRules, PageError, PhaseLobby } from 'components';
import PhaseDialClue from './PhaseDialClue';
import PhaseGuess from './PhaseGuess';
import PhaseReveal from './PhaseReveal';

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
        return GameOverWrapper;
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
