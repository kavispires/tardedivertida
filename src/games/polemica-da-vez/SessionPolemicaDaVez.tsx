// Constants
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseTopicSelection from './PhaseTopicSelection';
import PhaseReact from './PhaseReact';
import PhaseResolution from './PhaseResolution';
import PhaseGameOver from './PhaseGameOver';

function SessionPolemicaDaVez({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.POLEMICA_DA_VEZ.TOPIC_SELECTION:
        return PhaseTopicSelection;
      case PHASES.POLEMICA_DA_VEZ.REACT:
        return PhaseReact;
      case PHASES.POLEMICA_DA_VEZ.RESOLUTION:
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
      gameCollection={GAME_COLLECTION.POLEMICA_DA_VEZ}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionPolemicaDaVez;
