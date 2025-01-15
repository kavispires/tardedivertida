// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PageError } from 'components/errors';
import { LoadingPage } from 'components/loaders';
import { PhaseLobby, PhasePlaceholder, PhaseRules, PhaseSetup } from 'components/phases';
import { Session } from 'components/session';
import { PhaseBets } from './PhaseBets';
import './utils/styles.scss';
import { PhaseStartingResults } from './PhaseStartingResults';
import { PhaseBoost } from './PhaseBoost';
import { PhasePreliminaryResults } from './PhasePreliminaryResults';
import { PhaseLastChance } from './PhaseLastChance';
import { PhaseFinalResults } from './PhaseFinalResults';

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
    case PHASES.ESQUIADORES.BETS:
      return PhaseBets;
    case PHASES.ESQUIADORES.STARTING_RESULTS:
      return PhaseStartingResults;
    case PHASES.ESQUIADORES.BOOSTS:
      return PhaseBoost;
    case PHASES.ESQUIADORES.PRELIMINARY_RESULTS:
      return PhasePreliminaryResults;
    case PHASES.ESQUIADORES.LAST_CHANGE:
      return PhaseLastChance;
    case PHASES.ESQUIADORES.FINAL_RESULTS:
      return PhaseFinalResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhasePlaceholder;
    default:
      return PageError;
  }
}

function SessionEsquiadores() {
  return <Session gameCollection={GAME_COLLECTION.ESQUIADORES} getActiveComponent={getActiveComponent} />;
}

export default SessionEsquiadores;
