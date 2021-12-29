// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { Session, SetupScreen, PhaseRules, PageError, PhaseLobby } from '../../components';
import PhaseQuestionSelection from './PhaseQuestionSelection';
import PhaseEverybodyWrites from './PhaseEverybodyWrites';
import PhaseCompare from './PhaseCompare';
import PhaseResolution from './PhaseResolution';
import PhaseGameOver from './PhaseGameOver';

function SessionMenteColetiva({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.MENTE_COLETIVA.LOBBY:
        return PhaseLobby;
      case PHASES.MENTE_COLETIVA.RULES:
        return PhaseRules;
      case PHASES.MENTE_COLETIVA.SETUP:
        return SetupScreen;
      case PHASES.MENTE_COLETIVA.QUESTION_SELECTION:
        return PhaseQuestionSelection;
      case PHASES.MENTE_COLETIVA.EVERYBODY_WRITES:
        return PhaseEverybodyWrites;
      case PHASES.MENTE_COLETIVA.COMPARE:
        return PhaseCompare;
      case PHASES.MENTE_COLETIVA.RESOLUTION:
        return PhaseResolution;
      case PHASES.MENTE_COLETIVA.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.MENTE_COLETIVA}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionMenteColetiva;
