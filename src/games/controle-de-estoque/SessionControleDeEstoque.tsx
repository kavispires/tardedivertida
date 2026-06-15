// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases/PhaseError';
import { Session } from 'components/session/Session';
// Internal
import { CONTROLE_DE_ESTOQUE_PHASES } from './utils/constants';
import { PhaseTheWarehouse } from './PhaseTheWarehouse';
import { PhaseGoodPlacement } from './PhaseGoodPlacement';
import { PhaseFulfillment } from './PhaseFulfillment';
import { PhaseResults } from './PhaseResults';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case CONTROLE_DE_ESTOQUE_PHASES.THE_WAREHOUSE:
      return PhaseTheWarehouse;
    case CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT:
      return PhaseGoodPlacement;
    case CONTROLE_DE_ESTOQUE_PHASES.FULFILLMENT:
      return PhaseFulfillment;
    case CONTROLE_DE_ESTOQUE_PHASES.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionControleDeEstoque() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.CONTROLE_DE_ESTOQUE}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionControleDeEstoque;
