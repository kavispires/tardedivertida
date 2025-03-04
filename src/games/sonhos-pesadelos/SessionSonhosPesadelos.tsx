// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { PhaseGameOver } from './PhaseGameOver';
import { PhaseDreamTelling } from './PhaseDreamTelling';
import { PhaseMatching } from './PhaseMatching';
import { PhaseResolution } from './PhaseResolution';
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
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.SONHOS_PESADELOS.DREAM_TELLING:
      return PhaseDreamTelling;
    case PHASES.SONHOS_PESADELOS.MATCHING:
      return PhaseMatching;
    case PHASES.SONHOS_PESADELOS.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionSonhosPesadelos() {
  return (
    <Session gameCollection={GAME_COLLECTION.SONHOS_PESADELOS} getActiveComponent={getActiveComponent} />
  );
}

export default SessionSonhosPesadelos;
