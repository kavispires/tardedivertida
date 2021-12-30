// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { Session, PhaseSetup, PhaseRules, PageError, PhaseLobby } from '../../components';
import PhaseSecretClue from './PhaseSecretClue';
import PhaseCardPlay from './PhaseCardPlay';
import PhaseDefense from './PhaseDefense';
import PhaseVoting from './PhaseVoting';
import PhaseReveal from './PhaseReveal';
import PhaseGameOver from './PhaseGameOver';

function SessionDetetivesImaginativos({ gameId }: GameSession) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DETETIVES_IMAGINATIVOS.LOBBY:
        return PhaseLobby;
      case PHASES.DETETIVES_IMAGINATIVOS.RULES:
        return PhaseRules;
      case PHASES.DETETIVES_IMAGINATIVOS.SETUP:
        return PhaseSetup;
      case PHASES.DETETIVES_IMAGINATIVOS.SECRET_CLUE:
        return PhaseSecretClue;
      case PHASES.DETETIVES_IMAGINATIVOS.CARD_PLAY:
        return PhaseCardPlay;
      case PHASES.DETETIVES_IMAGINATIVOS.DEFENSE:
        return PhaseDefense;
      case PHASES.DETETIVES_IMAGINATIVOS.VOTING:
        return PhaseVoting;
      case PHASES.DETETIVES_IMAGINATIVOS.REVEAL:
        return PhaseReveal;
      case PHASES.DETETIVES_IMAGINATIVOS.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.DETETIVES_IMAGINATIVOS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionDetetivesImaginativos;
