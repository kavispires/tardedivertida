// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { Session, SetupScreen, Rules, PageError } from '../../components';
import Lobby from '../../components/lobby/Lobby';
import PhaseClueWriting from './PhaseClueWriting';
import PhaseGuessing from './PhaseGuessing';
import PhaseReveal from './PhaseReveal';
import PhaseGameOver from './PhaseGameOver';

function SessionCruzaPalavras({ gameId }: GameSession) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.CRUZA_PALAVRAS.LOBBY:
        return Lobby;
      case PHASES.CRUZA_PALAVRAS.RULES:
        return Rules;
      case PHASES.CRUZA_PALAVRAS.SETUP:
        return SetupScreen;
      case PHASES.CRUZA_PALAVRAS.CLUE_WRITING:
        return PhaseClueWriting;
      case PHASES.CRUZA_PALAVRAS.GUESSING:
        return PhaseGuessing;
      case PHASES.CRUZA_PALAVRAS.REVEAL:
        return PhaseReveal;
      case PHASES.CRUZA_PALAVRAS.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.CRUZA_PALAVRAS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionCruzaPalavras;
