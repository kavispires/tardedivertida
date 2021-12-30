// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { Session, PhaseSetup, PhaseRules, PageError, PhaseLobby } from '../../components';
import PhaseWitnessSelection from './PhaseWitnessSelection';
import PhaseQuestionSelection from './PhaseQuestionSelection';
import PhaseQuestioning from './PhaseQuestioning';
import PhaseTrial from './PhaseTrial';
import PhaseGameOver from './PhaseGameOver';

function SessionTestemunhaOcular({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.TESTEMUNHA_OCULAR.LOBBY:
        return PhaseLobby;
      case PHASES.TESTEMUNHA_OCULAR.RULES:
        return PhaseRules;
      case PHASES.TESTEMUNHA_OCULAR.SETUP:
        return PhaseSetup;
      case PHASES.TESTEMUNHA_OCULAR.WITNESS_SELECTION:
        return PhaseWitnessSelection;
      case PHASES.TESTEMUNHA_OCULAR.QUESTION_SELECTION:
        return PhaseQuestionSelection;
      case PHASES.TESTEMUNHA_OCULAR.QUESTIONING:
        return PhaseQuestioning;
      case PHASES.TESTEMUNHA_OCULAR.TRIAL:
        return PhaseTrial;
      case PHASES.TESTEMUNHA_OCULAR.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.TESTEMUNHA_OCULAR}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionTestemunhaOcular;
