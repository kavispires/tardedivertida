// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { Session, PhaseSetup, PhaseRules, PageError, PhaseLobby } from '../../components';
import PhaseWordSelection from './PhaseWordSelection';
import PhaseSuggest from './PhaseSuggest';
import PhaseCompare from './PhaseCompare';
import PhaseGuess from './PhaseGuess';
import PhaseGameOver from './PhaseGameOver';

function SessionUeSoIsso({ gameId }: GameSession) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.UE_SO_ISSO.LOBBY:
        return PhaseLobby;
      case PHASES.UE_SO_ISSO.RULES:
        return PhaseRules;
      case PHASES.UE_SO_ISSO.SETUP:
        return PhaseSetup;
      case PHASES.UE_SO_ISSO.WORD_SELECTION:
        return PhaseWordSelection;
      case PHASES.UE_SO_ISSO.SUGGEST:
        return PhaseSuggest;
      case PHASES.UE_SO_ISSO.COMPARE:
        return PhaseCompare;
      case PHASES.UE_SO_ISSO.GUESS:
        return PhaseGuess;
      case PHASES.UE_SO_ISSO.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.UE_SO_ISSO}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionUeSoIsso;
