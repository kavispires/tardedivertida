// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { GameOverWrapper, Session, PhaseSetup, PhaseRules, PageError } from '../../components';
import PhaseDialClue from './PhaseDialClue';
import PhaseGuess from './PhaseGuess';
import PhaseReveal from './PhaseReveal';
import { PhaseLobby } from '../../components';

function SessionOndaTelepatica({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.ONDA_TELEPATICA.LOBBY:
        return PhaseLobby;
      case PHASES.ONDA_TELEPATICA.RULES:
        return PhaseRules;
      case PHASES.ONDA_TELEPATICA.SETUP:
        return PhaseSetup;
      case PHASES.ONDA_TELEPATICA.DIAL_CLUE:
        return PhaseDialClue;
      case PHASES.ONDA_TELEPATICA.GUESS:
        return PhaseGuess;
      case PHASES.ONDA_TELEPATICA.REVEAL:
        return PhaseReveal;
      case PHASES.ONDA_TELEPATICA.GAME_OVER:
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
