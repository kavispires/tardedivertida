// Hooks
import { GAME_COLLECTION, PHASES } from '../../utils/constants';
// Components
import { Session, PhaseSetup, PhaseRules, PageError, PhaseLobby } from '../../components';
import PhaseStory from './PhaseStory';
import PhaseCardPlay from './PhaseCardPlay';
import PhaseVoting from './PhaseVoting';
import PhaseResolution from './PhaseResolution';
import PhaseGameOver from './PhaseGameOver';

function SessionDetetivesImaginativos({ gameId }) {
  function getActiveComponent(phase) {
    switch (phase) {
      case PHASES.CONTADORES_HISTORIAS.LOBBY:
        return PhaseLobby;
      case PHASES.CONTADORES_HISTORIAS.RULES:
        return PhaseRules;
      case PHASES.CONTADORES_HISTORIAS.SETUP:
        return PhaseSetup;
      case PHASES.CONTADORES_HISTORIAS.STORY:
        return PhaseStory;
      case PHASES.CONTADORES_HISTORIAS.CARD_PLAY:
        return PhaseCardPlay;
      case PHASES.CONTADORES_HISTORIAS.VOTING:
        return PhaseVoting;
      case PHASES.CONTADORES_HISTORIAS.RESOLUTION:
        return PhaseResolution;
      case PHASES.CONTADORES_HISTORIAS.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.CONTADORES_HISTORIAS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionDetetivesImaginativos;
