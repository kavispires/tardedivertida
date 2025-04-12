// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseLobby, PhaseSetup } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { LINHAS_CRUZADAS_PHASES } from './utils/constants';
import { PhasePromptSelection } from './PhasePromptSelection';
import { PhaseDrawing } from './PhaseDrawing';
import { PhaseNaming } from './PhaseNaming';
import { PhasePresentation } from './PhasePresentation';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import 'assets/fonts/architects-daughter.scss';
import './utils/styles.scss';
// Fonts

function getActiveComponent(state: GameState) {
  // If phase is not defined, it is likely that the game is still loading
  if (state && !state.phase) return LoadingPage;

  switch (state.phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case LINHAS_CRUZADAS_PHASES.PROMPT_SELECTION:
      return PhasePromptSelection;
    case LINHAS_CRUZADAS_PHASES.DRAWING:
      return PhaseDrawing;
    case LINHAS_CRUZADAS_PHASES.NAMING:
      return PhaseNaming;
    case LINHAS_CRUZADAS_PHASES.PRESENTATION:
      return PhasePresentation;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionInstrumentosCodificados() {
  return <Session gameCollection={GAME_COLLECTION.LINHAS_CRUZADAS} getActiveComponent={getActiveComponent} />;
}

export default SessionInstrumentosCodificados;
