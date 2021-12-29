// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { Session, SetupScreen, Rules, PageError, PhasePlaceholder, PhaseLobby } from '../../components';

function SessionInstrumentosCodificados({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.INSTRUMENTOS_CODIFICADOS.LOBBY:
        return PhaseLobby;
      case PHASES.INSTRUMENTOS_CODIFICADOS.RULES:
        return Rules;
      case PHASES.INSTRUMENTOS_CODIFICADOS.SETUP:
        return SetupScreen;
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
