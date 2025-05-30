// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { TREVO_DA_SORTE_PHASES } from './utils/constants';
import { PhaseWordSelection } from './PhaseWordSelection';
import { PhaseCloverWriting } from './PhaseCloverWriting';
import { PhaseCloverGuessing } from './PhaseCloverGuessing';
import { PhaseResults } from './PhaseResults';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import 'assets/fonts/architects-daughter.scss';
import './utils/styles.scss';
// Fonts

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case TREVO_DA_SORTE_PHASES.WORD_SELECTION:
      return PhaseWordSelection;
    case TREVO_DA_SORTE_PHASES.CLOVER_WRITING:
      return PhaseCloverWriting;
    case TREVO_DA_SORTE_PHASES.CLOVER_GUESSING:
      return PhaseCloverGuessing;
    case TREVO_DA_SORTE_PHASES.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionTrevoDaSorte() {
  return <Session gameCollection={GAME_COLLECTION.TREVO_DA_SORTE} getActiveComponent={getActiveComponent} />;
}

export default SessionTrevoDaSorte;
