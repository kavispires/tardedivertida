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
import { PhaseJudgeSelection } from './PhaseJudgeSelection';
import { PhaseItemPlacement } from './PhaseItemPlacement';
import { PhaseEvaluation } from './PhaseEvaluation';
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
    case PHASES.TEORIA_DE_CONJUNTOS.JUDGE_SELECTION:
      return PhaseJudgeSelection;
    case PHASES.TEORIA_DE_CONJUNTOS.ITEM_PLACEMENT:
      return PhaseItemPlacement;
    case PHASES.TEORIA_DE_CONJUNTOS.EVALUATION:
      return PhaseEvaluation;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionTeoriaDeConjuntos() {
  return (
    <Session gameCollection={GAME_COLLECTION.TEORIA_DE_CONJUNTOS} getActiveComponent={getActiveComponent} />
  );
}

export default SessionTeoriaDeConjuntos;
