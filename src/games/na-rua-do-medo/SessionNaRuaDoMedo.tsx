// Constants
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { Session } from 'components/session';
import { PhaseLobby, PhaseRules, PhaseSetup } from 'components/phases';
import { PageError } from 'components/errors';
import PhaseTrickOrTreat from './PhaseTrickOrTreat';
import PhaseResult from './PhaseResult';
import PhaseStreetEnd from './PhaseStreetEnd';
import PhaseGameOver from './PhaseGameOver';

function SessionNaRuaDoMedo({ gameId }: SessionProps) {
  function getActiveComponent(phase: string) {
    switch (phase) {
      case PHASES.DEFAULT.LOBBY:
        return PhaseLobby;
      case PHASES.DEFAULT.RULES:
        return PhaseRules;
      case PHASES.DEFAULT.SETUP:
        return PhaseSetup;
      case PHASES.NA_RUA_DO_MEDO.TRICK_OR_TREAT:
        return PhaseTrickOrTreat;
      case PHASES.NA_RUA_DO_MEDO.RESULT:
        return PhaseResult;
      case PHASES.NA_RUA_DO_MEDO.STREET_END:
        return PhaseStreetEnd;
      case PHASES.DEFAULT.GAME_OVER:
        return PhaseGameOver;
      default:
        return PageError;
    }
  }

  return (
    <Session
      gameId={gameId}
      gameCollection={GAME_COLLECTION.NA_RUA_DO_MEDO}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionNaRuaDoMedo;
