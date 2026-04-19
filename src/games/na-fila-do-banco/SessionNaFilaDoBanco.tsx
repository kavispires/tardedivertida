// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
// Components
import { PhaseError } from 'components/phases/PhaseError';
import { Session } from 'components/session/Session';
// Internal
import { NA_FILA_DO_BANCO_PHASES } from './utils/constants';
import { PhaseCardPlay } from './PhaseCardPlay';
import { PhaseRoundResolution } from './PhaseRoundResolution';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case NA_FILA_DO_BANCO_PHASES.CARD_PLAY:
      return PhaseCardPlay;
    case NA_FILA_DO_BANCO_PHASES.ROUND_RESOLUTION:
      return PhaseRoundResolution;
    case NA_FILA_DO_BANCO_PHASES.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionNaFilaDoBanco() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.NA_FILA_DO_BANCO}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionNaFilaDoBanco;
