// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from '@utils/constants';
import { PHASES } from '@utils/phases';
// Components
import { PhaseError } from '@components/phases/PhaseError';
import { Session } from '@components/session/Session';
// Internal
import { COLEGAS_DE_QUARTO_PHASES } from './utils/constants';
import { PhaseWordsSelection } from './PhaseWordsSelection';
import { PhaseClueWriting } from './PhaseClueWriting';
import { PhaseGuessing } from './PhaseGuessing';
import { PhaseReveal } from './PhaseReveal';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case COLEGAS_DE_QUARTO_PHASES.WORDS_SELECTION:
      return PhaseWordsSelection;
    case COLEGAS_DE_QUARTO_PHASES.CLUE_WRITING:
      return PhaseClueWriting;
    case COLEGAS_DE_QUARTO_PHASES.GUESSING:
      return PhaseGuessing;
    case COLEGAS_DE_QUARTO_PHASES.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionColegasDeQuarto() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.COLEGAS_DE_QUARTO}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionColegasDeQuarto;
