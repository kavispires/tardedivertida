// Constants
import { GAME_COLLECTION } from '../../utils/constants';
import { PHASES } from '../../utils/phases';
// Components
import { Session, PhaseSetup, PhaseRules, PageError, PhaseLobby } from '../../components';
import PhaseTellDream from './PhaseTellDream';
import PhaseMatch from './PhaseMatch';
import PhaseResolution from './PhaseResolution';
import PhaseGameOver from './PhaseGameOver';
import PhaseLastChance from './PhaseLastChance';

function SessionSonhosPesadelos({ gameId }: GameSession) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.SONHOS_PESADELOS.TELL_DREAM:
        return PhaseTellDream;
      case PHASES.SONHOS_PESADELOS.MATCH:
        return PhaseMatch;
      case PHASES.SONHOS_PESADELOS.RESOLUTION:
        return PhaseResolution;
      case PHASES.SONHOS_PESADELOS.LAST_CHANCE:
        return PhaseLastChance;
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
