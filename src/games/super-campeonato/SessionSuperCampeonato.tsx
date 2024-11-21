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
  // If phase is not defined, it is likely that the game is still loading
  if (state && !state.phase) return LoadingPage;

  switch (state.phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.SUPER_CAMPEONATO.CHALLENGE_SELECTION:
      return PhaseChallengeSelection;
    case PHASES.SUPER_CAMPEONATO.CONTENDER_SELECTION:
      return PhaseContenderSelection;
    case PHASES.SUPER_CAMPEONATO.BETS:
      return PhaseBets;
    case PHASES.SUPER_CAMPEONATO.BATTLE:
      return PhaseBattle;
    case PHASES.SUPER_CAMPEONATO.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionSuperCampeonato() {
  return (
    <Session gameCollection={GAME_COLLECTION.SUPER_CAMPEONATO} getActiveComponent={getActiveComponent} />
  );
}

export default SessionSuperCampeonato;
