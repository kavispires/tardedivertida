// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { Session, PhaseSetup, PhaseRules, PageError, PhasePlaceholder, PhaseLobby } from '../../components';

function SessionInstrumentosCodificados({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.INSTRUMENTOS_CODIFICADOS.LOBBY:
        return PhaseLobby;
      case PHASES.INSTRUMENTOS_CODIFICADOS.RULES:
        return PhaseRules;
      case PHASES.INSTRUMENTOS_CODIFICADOS.SETUP:
        return PhaseSetup;
      case PHASES.INSTRUMENTOS_CODIFICADOS.HINT_GIVING:
        return PhasePlaceholder;
      case PHASES.INSTRUMENTOS_CODIFICADOS.HINT_RECEIVING:
        return PhasePlaceholder;
      case PHASES.INSTRUMENTOS_CODIFICADOS.GUESS_THE_CODE:
        return PhasePlaceholder;
      case PHASES.INSTRUMENTOS_CODIFICADOS.SOLUTION:
        return PhasePlaceholder;
      case PHASES.INSTRUMENTOS_CODIFICADOS.GAME_OVER:
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
