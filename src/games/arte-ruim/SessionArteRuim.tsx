// Constants
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session, PhaseSetup, PhaseRules, PageError, PhaseLobby } from 'components';
import PhaseDraw from './PhaseDraw';
import PhaseEvaluation from './PhaseEvaluation';
import PhaseGallery from './PhaseGallery';
import PhaseGameOver from './PhaseGameOver';

function SessionArteRuim({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.ARTE_RUIM.DRAW:
        return PhaseDraw;
      case PHASES.ARTE_RUIM.EVALUATION:
        return PhaseEvaluation;
      case PHASES.ARTE_RUIM.GALLERY:
        return PhaseGallery;
      case PHASES.DEFAULT.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.ARTE_RUIM}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionArteRuim;
