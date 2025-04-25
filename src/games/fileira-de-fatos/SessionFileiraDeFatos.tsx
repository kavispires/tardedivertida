// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { FILEIRA_DE_FATOS_PHASES } from './utils/constants';
import { PhaseOrdering } from './PhaseOrdering';
import { PhaseResults } from './PhaseResults';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case FILEIRA_DE_FATOS_PHASES.ORDERING:
      return PhaseOrdering;
    case FILEIRA_DE_FATOS_PHASES.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionFileiraDeFatos() {
  return (
    <Session gameCollection={GAME_COLLECTION.FILEIRA_DE_FATOS} getActiveComponent={getActiveComponent} />
  );
}

export default SessionFileiraDeFatos;
