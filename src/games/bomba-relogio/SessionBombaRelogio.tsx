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
// Ant Design Resources

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
    case PHASES.BOMBA_RELOGIO.ROLE_ASSIGNMENT:
      return PhasePlaceholder;
    case PHASES.BOMBA_RELOGIO.DECLARATION:
      return PhasePlaceholder;
    case PHASES.BOMBA_RELOGIO.EXAMINATION:
      return PhasePlaceholder;
    case PHASES.BOMBA_RELOGIO.RESULT:
      return PhasePlaceholder;
    case PHASES.DEFAULT.GAME_OVER:
      return PhasePlaceholder;
    default:
      return PageError;
  }
}

function SessionBombaRelogio() {
  return <Session gameCollection={GAME_COLLECTION.BOMBA_RELOGIO} getActiveComponent={getActiveComponent} />;
}

export default SessionBombaRelogio;
