// Constants
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components';
import PhaseClueWriting from './PhaseClueWriting';
import PhaseGuessing from './PhaseGuessing';
import PhaseReveal from './PhaseReveal';
import PhaseGameOver from './PhaseGameOver';

function SessionCruzaPalavras({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.CRUZA_PALAVRAS.CLUE_WRITING:
        return PhaseClueWriting;
      case PHASES.CRUZA_PALAVRAS.GUESSING:
        return PhaseGuessing;
      case PHASES.CRUZA_PALAVRAS.REVEAL:
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
      gameCollection={GAME_COLLECTION.CRUZA_PALAVRAS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionCruzaPalavras;
