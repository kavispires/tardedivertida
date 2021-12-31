// Constants
import { GAME_COLLECTION } from '../../utils/constants';
import { PHASES } from '../../utils/phases';
// Components
import { Session, PhaseSetup, PhaseRules, PageError, PhaseLobby } from '../../components';
import PhaseCompositeSketch from './PhaseCompositeSketch';
import PhaseEvaluation from './PhaseEvaluation';
import PhaseReveal from './PhaseReveal';
import PhaseGameOver from './PhaseGameOver';

function SessionRetratoFalado({ gameId }: GameSession) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.RETRATO_FALADO.COMPOSITE_SKETCH:
        return PhaseCompositeSketch;
      case PHASES.RETRATO_FALADO.EVALUATION:
        return PhaseEvaluation;
      case PHASES.RETRATO_FALADO.REVEAL:
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
      gameCollection={GAME_COLLECTION.RETRATO_FALADO}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionRetratoFalado;
