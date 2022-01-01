// Constants
import { GAME_COLLECTION } from '../../utils/constants';
import { PHASES } from '../../utils/phases';
// Components
import { Session, PhaseSetup, PhaseRules, PageError, PhasePlaceholder, PhaseLobby } from '../../components';
import PhaseCrimeSelection from './PhaseCrimeSelection';

function SessionCrimesHediondos({ gameId }: GameSession) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.CRIMES_HEDIONDOS.CRIME_SELECTION:
        return PhaseCrimeSelection;
      case PHASES.CRIMES_HEDIONDOS.SCENE_MARKING:
        return PhasePlaceholder;
      case PHASES.CRIMES_HEDIONDOS.GUESSING:
        return PhasePlaceholder;
      case PHASES.CRIMES_HEDIONDOS.REVEAL:
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
      gameCollection={GAME_COLLECTION.CRIMES_HEDIONDOS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionCrimesHediondos;
