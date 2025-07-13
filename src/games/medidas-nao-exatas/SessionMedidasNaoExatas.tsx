// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { MEDIDAS_NAO_EXATAS_PHASES } from './utils/constants';
import { PhaseMetricsBuilding } from './PhaseMetricsBuilding';
import { PhaseGuessing } from './PhaseGuessing';
import { PhaseResults } from './PhaseResults';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case MEDIDAS_NAO_EXATAS_PHASES.METRICS_BUILDING:
      return PhaseMetricsBuilding;
    case MEDIDAS_NAO_EXATAS_PHASES.GUESSING:
      return PhaseGuessing;
    case MEDIDAS_NAO_EXATAS_PHASES.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionMedidasNaoExatas() {
  return (
    <Session gameCollection={GAME_COLLECTION.MEDIDAS_NAO_EXATAS} getActiveComponent={getActiveComponent} />
  );
}

export default SessionMedidasNaoExatas;
