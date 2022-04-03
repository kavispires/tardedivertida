// Constants
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components';
import PhasePromptSelection from './PhasePromptSelection';
import PhaseDrawing from './PhaseDrawing';
import PhaseNaming from './PhaseNaming';
import PhasePresentation from './PhasePresentation';
import PhaseGameOver from './PhaseGameOver';

function SessionInstrumentosCodificados({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.LINHAS_CRUZADAS.PROMPT_SELECTION:
        return PhasePromptSelection;
      case PHASES.LINHAS_CRUZADAS.DRAWING:
        return PhaseDrawing;
      case PHASES.LINHAS_CRUZADAS.NAMING:
        return PhaseNaming;
      case PHASES.LINHAS_CRUZADAS.PRESENTATION:
        return PhasePresentation;
      case PHASES.DEFAULT.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.LINHAS_CRUZADAS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionInstrumentosCodificados;
