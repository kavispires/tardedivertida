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
// Internal
import { CONTROLE_DE_ESTOQUE_PHASES } from './utils/constants';
import { PhaseGoodPlacement } from './PhaseGoodPlacement';
import { PhasePlacementConfirmation } from './PhasePlacementConfirmation';
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
    case CONTROLE_DE_ESTOQUE_PHASES.GOOD_PLACEMENT:
      return PhaseGoodPlacement;
    case CONTROLE_DE_ESTOQUE_PHASES.PLACEMENT_CONFIRMATION:
      return PhasePlacementConfirmation;
    case CONTROLE_DE_ESTOQUE_PHASES.FULFILLMENT:
      return PhasePlaceholder;
    case CONTROLE_DE_ESTOQUE_PHASES.RESULTS:
      return PhasePlaceholder;
    case PHASES.DEFAULT.GAME_OVER:
      return PhasePlaceholder;
    default:
      return PageError;
  }
}

function SessionControleDeEstoque() {
  return (
    <Session gameCollection={GAME_COLLECTION.CONTROLE_DE_ESTOQUE} getActiveComponent={getActiveComponent} />
  );
}

export default SessionControleDeEstoque;
