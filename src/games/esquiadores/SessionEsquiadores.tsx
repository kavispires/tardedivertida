// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { ESQUIADORES_PHASES } from './utils/constants';
import { PhaseBets } from './PhaseBets';
import { PhaseStartingResults } from './PhaseStartingResults';
import { PhaseBoost } from './PhaseBoost';
import { PhasePreliminaryResults } from './PhasePreliminaryResults';
import { PhaseLastChance } from './PhaseLastChance';
import { PhaseFinalResults } from './PhaseFinalResults';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case ESQUIADORES_PHASES.BETS:
      return PhaseBets;
    case ESQUIADORES_PHASES.STARTING_RESULTS:
      return PhaseStartingResults;
    case ESQUIADORES_PHASES.BOOSTS:
      return PhaseBoost;
    case ESQUIADORES_PHASES.PRELIMINARY_RESULTS:
      return PhasePreliminaryResults;
    case ESQUIADORES_PHASES.LAST_CHANGE:
      return PhaseLastChance;
    case ESQUIADORES_PHASES.FINAL_RESULTS:
      return PhaseFinalResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionEsquiadores() {
  return <Session gameCollection={GAME_COLLECTION.ESQUIADORES} getActiveComponent={getActiveComponent} />;
}

export default SessionEsquiadores;
