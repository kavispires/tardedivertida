// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { BOMBA_RELOGIO_PHASES } from './utils/constants';
import { PhaseDeclaration } from './PhaseDeclaration';
import { PhaseExamination } from './PhaseExamination';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case BOMBA_RELOGIO_PHASES.DECLARATION:
      return PhaseDeclaration;
    case BOMBA_RELOGIO_PHASES.EXAMINATION:
      return PhaseExamination;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionBombaRelogio() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.BOMBA_RELOGIO}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionBombaRelogio;
