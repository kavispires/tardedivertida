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
  // If phase is not defined, it is likely that the game is still loading
  if (state && !state.phase) return LoadingPage;

  switch (state.phase) {
    case PHASES.DEFAULT.LOBBY:
      return PhaseLobby;
    case PHASES.DEFAULT.RULES:
      return PhaseRules;
    case PHASES.DEFAULT.SETUP:
      return PhaseSetup;
    case PHASES.TREVO_DA_SORTE.WORD_SELECTION:
      return PhaseWordSelection;
    case PHASES.TREVO_DA_SORTE.CLOVER_WRITING:
      return PhaseCloverWriting;
    case PHASES.TREVO_DA_SORTE.CLOVER_GUESSING:
      return PhaseCloverGuessing;
    case PHASES.TREVO_DA_SORTE.RESULTS:
      return PhaseResults;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionTrevoDaSorte() {
  return <Session gameCollection={GAME_COLLECTION.TREVO_DA_SORTE} getActiveComponent={getActiveComponent} />;
}

export default SessionTrevoDaSorte;
