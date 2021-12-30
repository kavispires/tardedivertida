// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { GameOver, Session, PhaseSetup, PhaseRules, PageError, PhaseLobby } from '../../components';
import AssignmentPhase from './AssignmentPhase';
import InvestigationPhase from './InvestigationPhase';
import AssessmentPhase from './AssessmentPhase';
import ResolutionPhase from './ResolutionPhase';
import FinalAssessmentPhase from './FinalAssessmentPhase';

function SessionEspiaoEntreNos({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.ESPIAO_ENTRE_NOS.LOBBY:
        return PhaseLobby;
      case PHASES.ESPIAO_ENTRE_NOS.RULES:
        return PhaseRules;
      case PHASES.ESPIAO_ENTRE_NOS.SETUP:
        return PhaseSetup;
      case PHASES.ESPIAO_ENTRE_NOS.ASSIGNMENT:
        return AssignmentPhase;
      case PHASES.ESPIAO_ENTRE_NOS.INVESTIGATION:
        return InvestigationPhase;
      case PHASES.ESPIAO_ENTRE_NOS.ASSESSMENT:
        return AssessmentPhase;
      case PHASES.ESPIAO_ENTRE_NOS.FINAL_ASSESSMENT:
        return FinalAssessmentPhase;
      case PHASES.ESPIAO_ENTRE_NOS.RESOLUTION:
        return ResolutionPhase;
      case PHASES.ESPIAO_ENTRE_NOS.GAME_OVER:
        return GameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.ESPIAO_ENTRE_NOS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionEspiaoEntreNos;
