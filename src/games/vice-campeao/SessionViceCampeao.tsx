// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { VICE_CAMPEAO_PHASES } from './utils/constants';
import { PhaseCardSelection } from './PhaseCardSelection';
import { PhaseRun } from './PhaseRun';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case VICE_CAMPEAO_PHASES.CARD_SELECTION:
      return PhaseCardSelection;
    case VICE_CAMPEAO_PHASES.RUN:
      return PhaseRun;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionViceCampeao() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.VICE_CAMPEAO}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionViceCampeao;
