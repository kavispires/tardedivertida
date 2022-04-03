// Constants
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseGameOver from './PhaseGameOver';
import PhaseDreamTelling from './PhaseDreamTelling';
import PhaseMatching from './PhaseMatching';
import PhaseResolution from './PhaseResolution';

function SessionSonhosPesadelos({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.SONHOS_PESADELOS.DREAM_TELLING:
        return PhaseDreamTelling;
      case PHASES.SONHOS_PESADELOS.MATCHING:
        return PhaseMatching;
      case PHASES.SONHOS_PESADELOS.RESOLUTION:
        return PhaseResolution;
      case PHASES.DEFAULT.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.SONHOS_PESADELOS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionSonhosPesadelos;
