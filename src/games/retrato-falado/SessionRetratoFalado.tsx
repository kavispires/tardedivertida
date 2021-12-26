// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { Session, SetupScreen } from '../../components/shared';
import Lobby from '../../components/lobby/Lobby';
import { Rules } from '../../components/rules';
import { PageError } from '../../components/errors/PageError';
import PhaseCompositeSketch from './PhaseCompositeSketch';
import PhaseEvaluation from './PhaseEvaluation';
import PhaseReveal from './PhaseReveal';
import PhaseGameOver from './PhaseGameOver';

function SessionRetratoFalado({ gameId }: GameSession) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.RETRATO_FALADO.LOBBY:
        return Lobby;
      case PHASES.RETRATO_FALADO.RULES:
        return Rules;
      case PHASES.RETRATO_FALADO.SETUP:
        return SetupScreen;
      case PHASES.RETRATO_FALADO.COMPOSITE_SKETCH:
        return PhaseCompositeSketch;
      case PHASES.RETRATO_FALADO.EVALUATION:
        return PhaseEvaluation;
      case PHASES.RETRATO_FALADO.REVEAL:
        return PhaseReveal;
      case PHASES.RETRATO_FALADO.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.RETRATO_FALADO}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionRetratoFalado;
