// Types
import type { GameState } from 'types/game';
// Utils
import { GAME_COLLECTION } from 'utils/constants';
import { PHASES } from 'utils/phases';
// Components
import { PhaseError } from 'components/phases';
import { Session } from 'components/session';
// Internal
import { CRUZA_PALAVRAS_PHASES } from './utils/constants';
import { PhaseClueWriting } from './PhaseClueWriting';
import { PhaseGuessing } from './PhaseGuessing';
import { PhaseReveal } from './PhaseReveal';
import { PhaseWordsSelection } from './PhaseWordsSelection';
import { PhaseGameOver } from './PhaseGameOver';
// Sass
import './utils/styles.scss';

function getActiveComponent(state: GameState) {
  switch (state.phase) {
    case CRUZA_PALAVRAS_PHASES.WORDS_SELECTION:
      return PhaseWordsSelection;
    case CRUZA_PALAVRAS_PHASES.CLUE_WRITING:
      return PhaseClueWriting;
    case CRUZA_PALAVRAS_PHASES.GUESSING:
      return PhaseGuessing;
    case CRUZA_PALAVRAS_PHASES.REVEAL:
      return PhaseReveal;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PhaseError;
  }
}

function SessionCruzaPalavras() {
  return (
    <Session
      gameCollection={GAME_COLLECTION.CRUZA_PALAVRAS}
      getActiveComponent={getActiveComponent}
    />
  );
}

export default SessionCruzaPalavras;
