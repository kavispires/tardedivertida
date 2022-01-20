// Constants
import { GAME_COLLECTION } from '../../utils/constants';
import { PHASES } from '../../utils/phases';
// Components
import { Session, PhaseSetup, PhaseRules, PageError, PhaseLobby } from '../../components';
import PhaseSecretClue from './PhaseSecretClue';
import PhaseCardPlay from './PhaseCardPlay';
import PhaseDefense from './PhaseDefense';
import PhaseVoting from './PhaseVoting';
import PhaseReveal from './PhaseReveal';
import PhaseGameOver from './PhaseGameOver';

function SessionDetetivesImaginativos({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
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
      case PHASES.DEFAULT.GAME_OVER:
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
