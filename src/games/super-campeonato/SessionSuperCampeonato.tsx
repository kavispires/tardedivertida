// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { SUPER_CAMPEONATO_PHASES } from './utils/constants';
import { PhaseChallengeSelection } from './PhaseChallengeSelection';
import { PhaseContenderSelection } from './PhaseContendersSelection';
import { PhaseBets } from './PhaseBets';
import { PhaseBattle } from './PhaseBattle';
import { PhaseResults } from './PhaseResults';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import 'assets/fonts/bangers.scss';
import './utils/styles.scss';
// Fonts

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case SUPER_CAMPEONATO_PHASES.CHALLENGE_SELECTION:
      return PhaseChallengeSelection;
    case SUPER_CAMPEONATO_PHASES.CONTENDER_SELECTION:
      return PhaseContenderSelection;
    case SUPER_CAMPEONATO_PHASES.BETS:
      return PhaseBets;
    case SUPER_CAMPEONATO_PHASES.BATTLE:
      return PhaseBattle;
    case SUPER_CAMPEONATO_PHASES.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionSuperCampeonato() {
  return (
    <Session gameCollection={GAME_COLLECTION.SUPER_CAMPEONATO} getActiveComponent={getActiveComponent} />
  );
}

export default SessionSuperCampeonato;
