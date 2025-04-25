// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { VENDAVAL_DE_PALPITE_PHASES } from './utils/constants';
import { PhaseBossPlayerSelection } from './PhaseBossPlayerSelection';
import { PhaseSecretWordSelection } from './PhaseSecretWordSelection';
import { PhasePlayersClues } from './PhasePlayersClues';
import { PhaseClueEvaluations } from './PhaseClueEvaluations';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import 'assets/fonts/architects-daughter.scss';
import './utils/styles.scss';
// Fonts

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case VENDAVAL_DE_PALPITE_PHASES.BOSS_SELECTION:
      return PhaseBossPlayerSelection;
    case VENDAVAL_DE_PALPITE_PHASES.SECRET_WORD_SELECTION:
      return PhaseSecretWordSelection;
    case VENDAVAL_DE_PALPITE_PHASES.PLAYERS_CLUES:
      return PhasePlayersClues;
    case VENDAVAL_DE_PALPITE_PHASES.CLUE_EVALUATIONS:
      return PhaseClueEvaluations;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionVendavalDePalpite() {
  return (
    <Session gameCollection={GAME_COLLECTION.VENDAVAL_DE_PALPITE} getActiveComponent={getActiveComponent} />
  );
}

export default SessionVendavalDePalpite;
