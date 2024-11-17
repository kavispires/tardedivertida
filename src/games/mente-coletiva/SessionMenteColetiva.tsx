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
import { PhaseQuestionSelection } from './PhaseQuestionSelection';
import { PhaseEverybodyWrites } from './PhaseEverybodyWrites';
import { PhaseCompare } from './PhaseCompare';
import { PhaseResolution } from './PhaseResolution';
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
    case PHASES.MENTE_COLETIVA.QUESTION_SELECTION:
      return PhaseQuestionSelection;
    case PHASES.MENTE_COLETIVA.EVERYBODY_WRITES:
      return PhaseEverybodyWrites;
    case PHASES.MENTE_COLETIVA.COMPARE:
      return PhaseCompare;
    case PHASES.MENTE_COLETIVA.RESOLUTION:
      return PhaseResolution;
    case PHASES.DEFAULT.GAME_OVER:
      return PhaseGameOver;
    default:
      return PageError;
  }
}

function SessionMenteColetiva() {
  return <Session gameCollection={GAME_COLLECTION.MENTE_COLETIVA} getActiveComponent={getActiveComponent} />;
}

export default SessionMenteColetiva;
