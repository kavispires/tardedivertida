// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { PLANEJAMENTO_URBANO_PHASES } from './utils/constants';
import { PhasePlanning } from './PhasePlanning';
import { PhasePlacing } from './PhasePlacing';
import { PhaseResolution } from './PhaseResolution';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case PLANEJAMENTO_URBANO_PHASES.PLANNING:
      return PhasePlanning;
    case PLANEJAMENTO_URBANO_PHASES.PLACING:
      return PhasePlacing;
    case PLANEJAMENTO_URBANO_PHASES.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionPlanejamentoUrbano() {
  return (
    <Session gameCollection={GAME_COLLECTION.PLANEJAMENTO_URBANO} getActiveComponent={getActiveComponent} />
  );
}

export default SessionPlanejamentoUrbano;
