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
import { NA_RUA_DO_MEDO_PHASES } from './utils/constants';
import { PhaseTrickOrTreat } from './PhaseTrickOrTreat';
import { PhaseResult } from './PhaseResult';
import { PhaseStreetEnd } from './PhaseStreetEnd';
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
    case NA_RUA_DO_MEDO_PHASES.TRICK_OR_TREAT:
      return PhaseTrickOrTreat;
    case NA_RUA_DO_MEDO_PHASES.RESULT:
      return PhaseResult;
    case NA_RUA_DO_MEDO_PHASES.STREET_END:
      return PhaseStreetEnd;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionNaRuaDoMedo() {
  return <Session gameCollection={GAME_COLLECTION.NA_RUA_DO_MEDO} getActiveComponent={getActiveComponent} />;
}

export default SessionNaRuaDoMedo;
