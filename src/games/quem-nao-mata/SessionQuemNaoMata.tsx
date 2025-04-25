// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError, PhasePlaceholder } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { QUEM_NAO_MATA_PHASES } from './utils/constants';
import { PhaseTargeting } from './PhaseTargeting';
import { PhaseStandoff } from './PhaseStandoff';
import { PhaseDuel } from './PhaseDuel';
import { PhaseResolution } from './PhaseResolution';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case QUEM_NAO_MATA_PHASES.TARGETING:
      return PhaseTargeting;
    case QUEM_NAO_MATA_PHASES.STANDOFF:
      return PhaseStandoff;
    case QUEM_NAO_MATA_PHASES.DUEL:
      return PhaseDuel;
    case QUEM_NAO_MATA_PHASES.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhasePlaceholder;
    default:
      return PhaseError;
  }
}

function SessionQuemNaoMata() {
  return <Session gameCollection={GAME_COLLECTION.QUEM_NAO_MATA} getActiveComponent={getActiveComponent} />;
}

export default SessionQuemNaoMata;
