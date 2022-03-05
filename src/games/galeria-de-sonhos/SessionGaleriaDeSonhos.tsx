// Constants
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session, PhaseSetup, PhaseRules, PageError, PhaseLobby } from 'components';
import PhaseWordSelection from './PhaseWordSelection';
import PhaseDreamsSelection from './PhaseDreamsSelections';
import PhaseCardPlay from './PhaseCardPlay';
import PhaseResolution from './PhaseResolution';
import PhaseGameOver from './PhaseGameOver';

function SessionGaleriaDeSonhos({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.GALERIA_DE_SONHOS.WORD_SELECTION:
        return PhaseWordSelection;
      case PHASES.GALERIA_DE_SONHOS.DREAMS_SELECTION:
        return PhaseDreamsSelection;
      case PHASES.GALERIA_DE_SONHOS.CARD_PLAY:
        return PhaseCardPlay;
      case PHASES.GALERIA_DE_SONHOS.RESOLUTION:
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
      gameCollection={GAME_COLLECTION.GALERIA_DE_SONHOS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionGaleriaDeSonhos;
