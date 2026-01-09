// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { TEORIA_DE_CONJUNTOS_PHASES } from './utils/constants';
import { PhaseJudgeSelection } from './PhaseJudgeSelection';
import { PhaseItemPlacement } from './PhaseItemPlacement';
import { PhaseEvaluation } from './PhaseEvaluation';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case TEORIA_DE_CONJUNTOS_PHASES.JUDGE_SELECTION:
      return PhaseJudgeSelection;
    case TEORIA_DE_CONJUNTOS_PHASES.ITEM_PLACEMENT:
      return PhaseItemPlacement;
    case TEORIA_DE_CONJUNTOS_PHASES.EVALUATION:
      return PhaseEvaluation;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionTeoriaDeConjuntos() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.TEORIA_DE_CONJUNTOS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionTeoriaDeConjuntos;
