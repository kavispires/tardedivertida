// Constants
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseSetup, PhaseRules, PageError, PhasePlaceholder, PhaseLobby } from 'components';

function SessionInstrumentosCodificados({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.INSTRUMENTOS_CODIFICADOS.HINT_GIVING:
        return PhasePlaceholder;
      case PHASES.INSTRUMENTOS_CODIFICADOS.HINT_RECEIVING:
        return PhasePlaceholder;
      case PHASES.INSTRUMENTOS_CODIFICADOS.GUESS_THE_CODE:
        return PhasePlaceholder;
      case PHASES.INSTRUMENTOS_CODIFICADOS.SOLUTION:
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
      gameCollection={GAME_COLLECTION.INSTRUMENTOS_CODIFICADOS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionInstrumentosCodificados;
