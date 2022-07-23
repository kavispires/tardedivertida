// Constants
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhasePlaceholder, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';

function SessionQuemNaoMata({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.QUEM_NAO_MATA.TARGETING:
        return PhasePlaceholder;
      case PHASES.QUEM_NAO_MATA.STANDOFF:
        return PhasePlaceholder;
      case PHASES.QUEM_NAO_MATA.DUEL:
        return PhasePlaceholder;
      case PHASES.QUEM_NAO_MATA.RESOLUTION:
        return PhasePlaceholder;
      case PHASES.DEFAULT.GAME_OVER:
        return PhasePlaceholder;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.QUEM_NAO_MATA}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionQuemNaoMata;
