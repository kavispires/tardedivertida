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
import { PhasePlanning } from './PhasePlanning';
import { PhasePlacing } from './PhasePlacing';
import { PhaseResolution } from './PhaseResolution';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

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
    case PHASES.PLANEJAMENTO_URBANO.PLANNING:
      return PhasePlanning;
    case PHASES.PLANEJAMENTO_URBANO.PLACING:
      return PhasePlacing;
    case PHASES.PLANEJAMENTO_URBANO.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionPlanejamentoUrbano() {
  return (
    <Session gameCollection={GAME_COLLECTION.PLANEJAMENTO_URBANO} getActiveComponent={getActiveComponent} />
  );
}

export default SessionPlanejamentoUrbano;