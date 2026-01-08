// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError, PhasePlaceholder } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { COLEGAS_DE_QUARTO_PHASES } from './utils/constants';
import { PhaseWordsSelection } from './PhaseWordsSelection';
import { PhaseClueWriting } from './PhaseClueWriting';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case COLEGAS_DE_QUARTO_PHASES.WORDS_SELECTION:
      return PhaseWordsSelection;
    case COLEGAS_DE_QUARTO_PHASES.CLUE_WRITING:
      return PhaseClueWriting;
    case PHASES.TEMPLATE.UNKNOWN:
      return PhasePlaceholder;
    case PHASES.DEFAULT.GAME_OVER:
      return PhasePlaceholder;
    default:
      return PhaseError;
  }
}

function SessionColegasDeQuarto() {
  return (
    <Session gameCollection={GAME_COLLECTION.COLEGAS_DE_QUARTO} getActiveComponent={getActiveComponent} />
  );
}

export default SessionColegasDeQuarto;
